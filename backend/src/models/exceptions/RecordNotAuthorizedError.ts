/**
 * Error used when the access to a resource is not authorized to the entity is requesting it
 */
export default class RecordNotAuthorizedError extends Error {
  constructor(
    private entityName: string,
    private field: string
  ) {
    super(
      `The user is not authorized to access the ${entityName} with the ${field} provided`
    );
  }
}
