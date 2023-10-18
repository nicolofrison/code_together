import * as fs from 'fs';
import * as path from 'path';
import { SimpleGit, simpleGit, SimpleGitOptions } from 'simple-git';

export const gitReposDir = path.join(__dirname, '..', '..', '..', 'gitRepos');

const options: Partial<SimpleGitOptions> = {
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false
};

interface GitReply {
  git: SimpleGit;
  gitFolder: string;
}

export default async function getGit(folder: string) {
  const gitFolder = path.join(gitReposDir, folder);
  if (!fs.existsSync(path.join(gitFolder, '.git'))) {
    fs.mkdirSync(gitFolder, { recursive: true });
  }

  const git = simpleGit(gitFolder, options);
  await git.init();

  return { git, gitFolder };
}
