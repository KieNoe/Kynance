//wasm-loader.ts
import { SandboxMessage } from '../types';

export class WASMLoader {
  private worker: Worker;
  private callbacks: Record<string, (result: any) => void> = {};
  private errorHandlers: Record<string, (error: string) => void> = {};

  constructor(workerScript: string) {
    this.worker = new Worker(workerScript);
    this.worker.onmessage = this.handleMessage.bind(this);
  }

  private handleMessage(e: MessageEvent<SandboxMessage>) {
    const { type, id, payload } = e.data;

    if (type === 'result' && id && this.callbacks[id]) {
      this.callbacks[id](payload);
      delete this.callbacks[id];
      delete this.errorHandlers[id];
    } else if (type === 'error' && id && this.errorHandlers[id]) {
      this.errorHandlers[id](payload);
      delete this.callbacks[id];
      delete this.errorHandlers[id];
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  async initialize(wasmBinary: ArrayBuffer): Promise<void> {
    const id = this.generateId();

    return new Promise((resolve, reject) => {
      this.callbacks[id] = () => resolve();
      this.errorHandlers[id] = reject;

      this.worker.postMessage({
        type: 'init',
        id,
        payload: { wasmBinary },
      });
    });
  }

  async execute(functionName: string, ...args: any[]): Promise<any> {
    const id = this.generateId();

    return new Promise((resolve, reject) => {
      this.callbacks[id] = resolve;
      this.errorHandlers[id] = reject;

      this.worker.postMessage({
        type: 'execute',
        id,
        payload: { functionName, args },
      });
    });
  }

  terminate() {
    this.worker.terminate();
  }
}
