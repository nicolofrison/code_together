import getGit from '../config/gitConfig';
import * as fs from 'fs';
import git from '../config/gitConfig';
import * as path from 'path';
import { ListLogLine } from 'simple-git';
import { time } from 'console';

class GitService {
  public async commit(
    gitFolderName: string,
    fileName: string,
    text: string,
    comment: string,
    subPath?: string
  ) {
    // get git for the folder
    const { git, gitFolder } = await getGit(gitFolderName);

    // edit local file replacing with text
    let filePath = fileName;
    if (subPath) {
      filePath = path.join(subPath, filePath);
    }
    filePath = path.join(gitFolder, filePath);
    fs.writeFileSync(filePath, text);

    // git commit
    await git.add(filePath).commit(comment);
    const commitInfo = (await git.log()).latest;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timestamp = new Date(commitInfo.date);

    // return commit_sha and timestamp
    return { ...commitInfo, timestamp };
  }
}

export default GitService;
export const gitService = new GitService();
