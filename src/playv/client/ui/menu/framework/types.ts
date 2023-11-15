type ContextImage = {
  type: 'image';
  src: string;
};

export type ContextText = {
  type?: 'text';
  text: string | (string | ContextText)[];
  size?: number;
  color?: string;
  font?: string;
};

export type ContextDivider = {
  type: 'divider';
  color?: string;
  width?: number;
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  title?: string;
  linePosition?: 'top' | 'bottom' | 'center';
};

type ContextComponents = (ContextImage | ContextText | ContextDivider)[];

export type ComponentContext = string | ContextComponents;
