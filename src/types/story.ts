// Temporary examples to replace later on
export type StoryOption = {
  text: string;
  next: string;
  nextLabel?: string;
};

export type StoryNode = {
  label: string;
  text: string;
  options: StoryOption[];
  createdAt: number;
};

export type Story = {
  title?: string;
  author?: string;
  description?: string;
  start: string;
  nodes: Record<string, StoryNode>;
  showProgress?: boolean;
  allowBackNavigation?: boolean;
};
