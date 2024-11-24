export interface AppInstance {
  id: number;
  name: string;
  position: { left: any; top: any };
  size: { width: any; height: any };
  isMinimized: boolean;
  isMaximized: boolean;
}
