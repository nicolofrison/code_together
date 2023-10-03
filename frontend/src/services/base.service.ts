export default class BaseService {
  protected readonly baseUrl = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/`;
}
