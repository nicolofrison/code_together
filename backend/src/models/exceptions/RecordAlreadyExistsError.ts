export default class RecordAlreadyExistsError extends Error {
  constructor(
    private entityName: string,
    private field: string
  ) {
    super(`The ${entityName} with the ${field} provided aready exists`);
  }
}
