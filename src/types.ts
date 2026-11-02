export interface Command {
  id?: string;
  label: string;
  command: string;
  notes?: string;
  verify?: boolean;
  custom?: boolean;
  tool?: string;
  checkId?: string;
}
export interface Tool {
  tool: string;
  description: string;
  commands: Command[];
  id?: string;
  custom?: boolean;
  sources?: string[];
  reviewedOn?: string;
}
export interface Check {
  id: string;
  domain: string;
  category: string;
  check: string;
  tool?: string;
  custom?: boolean;
}
export interface Category {
  id: string;
  domain: string;
  name: string;
}
export interface CustomData {
  version: 1;
  checks: Check[];
  commands: Command[];
  categories: Category[];
  tools: Tool[];
  notes: Record<string, string>;
}
