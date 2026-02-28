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
