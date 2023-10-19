import CodeHistory from '../../entities/CodeHistory';

export default interface CodeHistoryWithText extends CodeHistory {
  text: string;
}
