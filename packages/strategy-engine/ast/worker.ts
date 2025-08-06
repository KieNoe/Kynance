/* eslint-disable no-case-declarations */
/// <reference lib="webworker" />

import { SandboxMessage } from '@kynance/types';

const ctx: Worker = self as any;

// 存储加载的 WASM 模块
let wasmModule: any = null;

// 处理来自主线程的消息
ctx.onmessage = async (e: MessageEvent<SandboxMessage>) => {
  const { type, payload, id } = e.data;

  try {
    switch (type) {
      case 'init':
        // 初始化 WASM 模块
        const { wasmBinary } = payload;
        const module = await WebAssembly.compile(wasmBinary);
        const instance = await WebAssembly.instantiate(module);
        wasmModule = instance.exports;
        ctx.postMessage({ type: 'result', id, payload: { success: true } });
        break;

      case 'execute':
        if (!wasmModule) {
          throw new Error('WASM module not initialized');
        }

        // 执行 WASM 函数
        const { functionName, args } = payload;
        if (!wasmModule[functionName]) {
          throw new Error(`Function ${functionName} not found in WASM module`);
        }

        const result = wasmModule[functionName](...args);
        ctx.postMessage({ type: 'result', id, payload: result });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    ctx.postMessage({
      type: 'error',
      id,
      payload: error instanceof Error ? error.message : String(error),
    });
  }
};
