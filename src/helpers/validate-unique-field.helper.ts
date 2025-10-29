import { ConflictException } from '@nestjs/common';

export async function validateUniqueField<T>(
  field: keyof T,
  newValue: any,
  currentValue: any,
  finder: (field: keyof T, value: any) => Promise<any>,
  conflictMessage: (value: any) => string,
) {
  if (newValue !== undefined && newValue !== currentValue) {
    const existing = await finder(field, newValue);
    if (existing) {
      throw new ConflictException(conflictMessage(newValue));
    }
  }
}
