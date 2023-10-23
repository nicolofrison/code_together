import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
  validate(text: unknown, _: ValidationArguments) {
    return typeof text === 'number' || typeof text === 'string';
  }

  defaultMessage(_: ValidationArguments) {
    return '($value) must be number or string';
  }
}