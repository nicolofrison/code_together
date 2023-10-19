export default class GitNothingToCommitError extends Error {
  constructor() {
    super(`There is nothing to commit`);
  }
}
