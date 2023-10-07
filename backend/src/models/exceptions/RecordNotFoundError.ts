export default class RecordNotFoundError extends Error {
  constructor(
    private entityName: string,
    private field: string
  ) {
    super(`The ${entityName} with the ${field} provided does not exist`);
  }
}
