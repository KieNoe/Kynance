import { DSLFunction } from '../types';
import { WASMLoader } from './wasm-loader';

export class DSLCompiler {
  // 简单的 DSL 到 WASM 文本格式的转换
  static compileToWAT(dslCode: string): string {
    // 这里实现你的 DSL 到 WebAssembly 文本格式的转换逻辑
    // 这是一个简化示例，实际实现会更复杂

    // 验证 DSL 代码安全性
    if (dslCode.includes('import') || dslCode.includes('memory')) {
      throw new Error('Unsafe DSL code detected');
    }

    return `(module
      (func (export "execute") (param $input i32) (result i32)
        ;; 这里将 DSL 转换为实际的 WASM 指令
        local.get $input
        i32.const 1
        i32.add
      )
    )`;
  }

  // 将 WAT 转换为 WASM 二进制
  static async compile(dslCode: string): Promise<ArrayBuffer> {
    const wat = this.compileToWAT(dslCode);
    const response = await fetch('data:application/wat,' + encodeURIComponent(wat));
    const text = await response.text();
    const binary = new Uint8Array(text.length);

    for (let i = 0; i < text.length; i++) {
      binary[i] = text.charCodeAt(i);
    }

    return binary.buffer;
  }

  // 创建可执行的 DSL 函数
  static async createFunction(dslCode: string): Promise<DSLFunction> {
    const wasmBinary = await this.compile(dslCode);
    const loader = new WASMLoader('./worker.ts');

    await loader.initialize(wasmBinary);

    return async (input: any) => {
      return loader.execute('execute', input);
    };
  }
}
