// 沙箱消息类型
export type SandboxMessage = {
  type: 'init' | 'execute' | 'result' | 'error';
  payload?: any;
  id?: string;
};

// DSL 函数类型
export type DSLFunction = (input: any) => Promise<any>;
