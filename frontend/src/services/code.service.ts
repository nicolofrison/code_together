import CodeWithText from '../models/http/responses/codeWithText.interface';
import Code from '../models/interfaces/code.interface';

import BaseAuthService from './baseAuth.service';

export default class CodeService extends BaseAuthService {
  private static instance: CodeService;

  public static getInstance(): CodeService {
    if (!CodeService.instance) {
      CodeService.instance = new CodeService();
    }

    return CodeService.instance;
  }

  public async getCodes(): Promise<Code[]> {
    const response = await this.apiRequest().get(`codes`);

    return response.data;
  }

  public async getCode(codeId: number): Promise<CodeWithText> {
    const response = await this.apiRequest().get(`codes/${codeId}`);

    return response.data;
  }
}
