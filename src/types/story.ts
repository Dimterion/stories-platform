export type Story = {
  title: string;
  author: string;
  description?: string;
  start: string;
  nodes: NodesMap;
};

export type StoryOption = {
  text: string;
  next: string | null;
};

export type StoryNode = {
  text: string;
  options: StoryOption[];
  createdAt: number;
};

export type NodesMap = Record<string, StoryNode>;
