import BaseAuthService from './baseAuth.service';
import CodeHistory from '../models/interfaces/codeHistory.interface';
import CodeHistoryPost from '../models/http/requests/codeHistoryPost';

export default class CodeHistoryService extends BaseAuthService {
  private static instance: CodeHistoryService;

  public static getInstance(): CodeHistoryService {
    if (!CodeHistoryService.instance) {
      CodeHistoryService.instance = new CodeHistoryService();
    }

    return CodeHistoryService.instance;
  }

  public async createCodeHistory(
    codeHistoryPost: CodeHistoryPost
  ): Promise<CodeHistory> {
    const response = await this.apiRequest().post(
      'codeHistories',
      codeHistoryPost
    );

    return response.data;
  }
}
