import getGit from '../config/gitConfig';
import * as fs from 'fs';
import * as path from 'path';
import GitNothingToCommitError from '../models/exceptions/GitNothingToCommitError';

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

    // check status
    const status = await git.status();
    if (status.isClean()) {
      throw new GitNothingToCommitError();
    }

    // git commit
    await git.add(filePath).commit(comment);
    const commitInfo = (await git.log()).latest;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timestamp = new Date(commitInfo.date);

    // return commit_sha and timestamp
    return { ...commitInfo, timestamp };
  }

  public async resetToCommit(gitFolderName: string, commitSha: string) {
    // get git for the folder
    const { git } = await getGit(gitFolderName);

    await git.reset(['--hard', commitSha]);
  }
}

export default GitService;
export const gitService = new GitService();
