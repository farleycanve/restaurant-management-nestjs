export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveSameMembers(value: any[]): void;
    }
  }
}
