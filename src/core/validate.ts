import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

type ClassConstructor<T> = new (...args: unknown[]) => T;

export function validateInput<T extends object>(
  cls: ClassConstructor<T>,
  plain: Record<string, unknown>
): T {
  const instance = plainToInstance(cls, plain);
  const errors = validateSync(instance);

  if (errors.length > 0) {
    const messages = formatValidationErrors(errors);
    throw new Error(`Validation failed: ${messages.join(', ')}`);
  }

  return instance;
}

function formatValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      messages.push(...formatValidationErrors(error.children));
    }
  }

  return messages;
}
