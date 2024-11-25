export interface AppInstance {
  id: number;
  name: string;
  position: { left: any; top: any };
  size: { width: any; height: any };
  transform?: any;
  isMinimized: boolean;
  isMaximized: boolean;
}
