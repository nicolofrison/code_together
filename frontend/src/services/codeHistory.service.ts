import BaseAuthService from './baseAuth.service';
import CodeHistory from '../models/interfaces/codeHistory.interface';
import CodeHistoryPost from '../models/http/requests/codeHistoryPost';

export class CodeHistoryService extends BaseAuthService {
  private static instance: CodeHistoryService;

  public static getInstance() {
    if (!CodeHistoryService.instance) {
      CodeHistoryService.instance = new CodeHistoryService();
    }

    return CodeHistoryService.instance;
  }

  public async createCodeHistory(codeHistoryPost: CodeHistoryPost) {
    const response = await this.apiRequest().post(
      'codeHistories',
      codeHistoryPost
    );

    return response.data as CodeHistory;
  }
}

export default CodeHistoryService.getInstance();
