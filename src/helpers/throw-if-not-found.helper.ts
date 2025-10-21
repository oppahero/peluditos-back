import { NotFoundException } from '@nestjs/common';

export function throwIfNotFound<T>(
  entity: T | null | undefined,
  resourceName: string,
  identifier?: string | number,
): T {
  if (!entity) {
    const suffix = identifier !== undefined ? ` con ID ${identifier}` : '';
    throw new NotFoundException(`${resourceName}${suffix} no encontrado`);
  }
  return entity;
}

import { DeleteResult, UpdateResult } from 'typeorm';

export function throwIfNoEffect(
  result: DeleteResult | UpdateResult,
  resourceName: string,
  identifier?: string | number,
): void {
  const suffix = identifier !== undefined ? ` con ID ${identifier}` : '';

  if (result.affected === 0) {
    throw new NotFoundException(`${resourceName}${suffix} no encontrado`);
  }
}
