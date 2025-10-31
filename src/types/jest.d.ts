// Jest type definitions for tests
// This file makes Jest globals available in TypeScript test files

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const test: (name: string, fn: () => void | Promise<void>) => void;
interface Expect {
  <T = any>(actual: T): {
    toBe: (expected: any) => void;
    toEqual: (expected: any) => void;
    toBeDefined: () => void;
    toBeUndefined: () => void;
    toBeNull: () => void;
    toBeTruthy: () => void;
    toBeFalsy: () => void;
    toContain: (item: any) => void;
    toHaveBeenCalled: () => void;
    toHaveBeenCalledWith: (...args: any[]) => void;
    toHaveBeenCalledTimes: (times: number) => void;
    toBeGreaterThanOrEqual: (expected: number) => void;
    not: {
      toBe: (expected: any) => void;
      toEqual: (expected: any) => void;
      toHaveBeenCalled: () => void;
      toBeDefined: () => void;
    };
    rejects: {
      toBeDefined: () => Promise<void>;
      toEqual: (expected: any) => Promise<void>;
      toMatchObject: (expected: any) => Promise<void>;
      toThrow: (error?: any) => Promise<void>;
    };
  };
  objectContaining: <T = any>(object: Partial<T>) => T;
  anything: () => any;
  any: (constructor: any) => any;
  arrayContaining: <T = any>(array: T[]) => T[];
  stringContaining: (str: string) => string;
}

declare const expect: Expect;
declare const beforeEach: (fn: () => void | Promise<void>) => void;
declare const afterEach: (fn: () => void | Promise<void>) => void;
declare const beforeAll: (fn: () => void | Promise<void>) => void;
declare const afterAll: (fn: () => void | Promise<void>) => void;

declare namespace jest {
  interface Mock<T = any, Y extends any[] = any[]> {
    (...args: Y): T;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockResolvedValue: <R = any>(value: R) => Mock<Promise<R>, Y>;
    mockRejectedValue: (value: any) => Mock<Promise<any>, Y>;
    mockReturnValueOnce: (value: T) => Mock<T, Y>;
    mockResolvedValueOnce: <R = any>(value: R) => Mock<T, Y>;
    mockRejectedValueOnce: (value: any) => Mock<T, Y>;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockClear: () => Mock<T, Y>;
    mockReset: () => Mock<T, Y>;
    mockRestore: () => void;
    getMockName: () => string;
    mockName: (name: string) => Mock<T, Y>;
    calls: Y[];
    results: Array<{ type: "return" | "throw"; value: any }>;
    instances: T[];
  }

  interface MockFunction<T = any> {
    (...args: any[]): T;
  }

  interface Mockable {
    mock: jest.Mock;
  }

  function fn<T = any>(implementation?: (...args: any[]) => T): Mock<T>;
  function mock(moduleName: string, factory?: () => any): typeof jest;
  function clearAllMocks(): typeof jest;
  function clearAllTimers(): typeof jest;
  function resetAllMocks(): typeof jest;
  function restoreAllMocks(): typeof jest;
  function useFakeTimers(options?: { advanceTimers?: boolean }): typeof jest;
  function useRealTimers(): typeof jest;
  function advanceTimersByTime(msToRun: number): typeof jest;
  function runOnlyPendingTimersAsync(): Promise<void>;
  function runAllTimersAsync(): Promise<void>;
}

declare const jest: typeof jest;
