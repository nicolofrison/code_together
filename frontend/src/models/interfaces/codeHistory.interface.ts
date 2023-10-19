import Code from './code.interface';

export default interface CodeHistory {
  id: number;
  code: Code;
  codeId: number;
  comment: string;
  commit_sha: string;
  timestamp: Date;
}
