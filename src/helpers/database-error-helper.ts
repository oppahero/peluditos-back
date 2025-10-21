import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export async function handleDatabaseError<T>(
  operation: () => Promise<T>,
  options?: { conflictMessage?: string },
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (error.code === '23505') {
      throw new ConflictException(
        options?.conflictMessage || 'Conflicto de datos',
      );
    }
    throw new InternalServerErrorException(
      'Error inesperado en la base de datos',
    );
  }
}
