import CodeHistory from '../models/interfaces/codeHistory.interface';
import CodeHistoryPost from '../models/http/requests/codeHistoryPost';

import BaseAuthService from './baseAuth.service';

export default class CodeHistoryService extends BaseAuthService {
  private static instance: CodeHistoryService;

  public static getInstance(): CodeHistoryService {
    if (!CodeHistoryService.instance) {
      CodeHistoryService.instance = new CodeHistoryService();
    }

    return CodeHistoryService.instance;
  }

  public async deleteById(id: number): Promise<CodeHistory[]> {
    const response = await this.apiRequest().delete(`codeHistories/${id}`);

    return response.data;
  }

  public async getAllByCodeId(codeId: number): Promise<CodeHistory[]> {
    const response = await this.apiRequest().get(
      `codeHistories?codeId=${codeId}`
    );

    return response.data;
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
