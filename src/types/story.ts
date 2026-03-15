export type Story = {
  title: string;
  author: string;
  description?: string;
  start: string;
  nodes: Record<string, Node>;
};

export type Option = {
  text: string;
  next: string | null;
};

export type Node = {
  text: string;
  options: Option[];
  createdAt: number;
};

export type NodesMap = Record<string, Node>;
