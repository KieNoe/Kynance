export type SandboxMessage = {
  type: 'init' | 'execute' | 'result' | 'error';
  payload?: any;
  id?: string;
};

export type DSLFunction = (input: any) => Promise<any>;
