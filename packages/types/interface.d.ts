export interface UserInfo {
  name: string;
  id: string;
  avatar: string;
  token: string;
  permission: number;
  email: string;
}
export type ModeType = 'dark' | 'light';

export interface RouteMeta {
  title?: string | Record<string, string>;
  icon?: string;
  expanded?: boolean;
  orderNo?: number;
  hidden?: boolean;
  hiddenBreadcrumb?: boolean;
  single?: boolean;
  keepAlive?: boolean;
  frameSrc?: string;
  frameBlank?: boolean;
}
