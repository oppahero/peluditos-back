export class SuccessResponseDto<T> {
  success = true;
  message?: string;
  data?: T;

  constructor(init?: Partial<SuccessResponseDto<T>>) {
    Object.assign(this, init);
  }
}
