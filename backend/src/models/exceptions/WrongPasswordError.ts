export default class WrongPasswordError extends Error {
  constructor() {
    super('The inserted password does not match the user email');
  }
}
