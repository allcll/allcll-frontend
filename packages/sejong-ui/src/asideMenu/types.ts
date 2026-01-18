interface IMenu {
  name: string;
  path?: string;
  children?: IMenu[];
}

export type { IMenu };
