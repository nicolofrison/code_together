import { IsString, Validate } from 'class-validator';
import { IsNumberOrString } from '../../../utils/customClassValidators';

export default class CodeHistoryPost {
  @Validate(IsNumberOrString)
  codeId: number | string;

  @IsString()
  comment: string;

  @IsString()
  text: string;
}
