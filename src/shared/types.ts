export interface GithubFile {
  name: string;
  path: string;
  sha: string;
  content: string;
  encoding: string;
  size: number;
}

export interface PageInfo {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  isMarkdown: boolean;
}

export interface CommitResult {
  commitSha: string;
  commitUrl: string;
  message: string;
}
