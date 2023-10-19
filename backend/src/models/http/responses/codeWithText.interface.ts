import Code from '../../entities/Code';

export default interface CodeWithText extends Code {
  text?: string;
}
