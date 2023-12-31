import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'simulationName', async: false })
class SimulationNameConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const nameIsOfValidLength = value.length >= 8 && value.length <= 30;
    if (!nameIsOfValidLength) return false;

    const allowedCharacters = /^[a-zA-Z0-9\s]+$/;
    const nameUsesOnlyValidCharacters = allowedCharacters.test(value);
    if (!nameUsesOnlyValidCharacters) return false;

    return true;
  }

  defaultMessage(): string {
    return 'Invalid simulation name. It should have a minimum of 8 characters, a maximum of 30 characters, and only contain digits, whitespaces, or alphabetic characters.';
  }
}

export function IsSimulationName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SimulationNameConstraint,
    });
  };
}
