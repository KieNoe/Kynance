export interface UserInfo {
  name: string;
  id: string;
  avatar: string;
  token: string;
  permission: number;
  email: string;
}

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
export interface MenuRoute {
  // TODO: menuitem 组件实际支持 string 类型但是类型错误，暂时使用 any 类型避免打包错误待组件类型修复
  path: any;
  title?: string | Record<string, string>;
  name?: string;
  icon?:
    | string
    | {
        render: () => void;
      };
  redirect?: string;
  children: MenuRoute[];
  meta: RouteMeta;
}
