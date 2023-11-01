import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        ...validationOptions,
        message: 'Username must contain only letters, numbers.',
      },
      validator: {
        validate(value: any) {
          // Define your username validation logic here
          // This function should return true if 'value' is a valid username
          // Example: You can use regular expressions to check for valid usernames
          const isValid = /^[a-zA-Z0-9]+$/.test(value);
          return isValid;
        },
      },
    });
  };
}
