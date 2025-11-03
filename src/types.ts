// ./src/types.ts

export interface CommitMessage {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: boolean;
}

export interface GitAnalysis {
  filesChanged: string[];
  additions: number;
  deletions: number;
  hasStaged: boolean;
  hasUnstaged: boolean;
  diff: string;
}

export interface AIProvider {
  name: string;
  generateCommitMessage(analysis: GitAnalysis): Promise<CommitMessage[]>;
}

export interface ProviderConfig {
  provider:
    | "vercel-google"
    | "vercel-openai"
    | "groq"
    | "openai"
    | "google"
    | "local";
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}
