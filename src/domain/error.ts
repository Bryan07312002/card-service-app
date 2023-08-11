export class DomainError {
  _message: any;
  _code: number;
  _originalError: any;

  constructor(message: any, code: any, originalError?: any) {
    this._message = message;
    this._code = code;
    this._originalError = originalError;
  }

  get message(): any {
    return this._message;
  }

  get code(): number {
    return this._code;
  }

  toJson() {
    return { code: this.code, message: this.message };
  }
}
