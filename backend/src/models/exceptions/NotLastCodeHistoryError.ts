import CodeHistory from '../entities/CodeHistory';

export default class NotLastCodeHistoryError extends Error {
  constructor() {
    super(`The ${CodeHistory.name} with the id provided is not the last one`);
  }
}
