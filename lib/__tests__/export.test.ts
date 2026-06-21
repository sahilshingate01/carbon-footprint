import { describe, test, expect, vi } from 'vitest';
import { exportToPDF } from '../export';

describe('export.ts unit tests', () => {
  test('calls window.print when in a browser environment', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    exportToPDF();
    expect(printSpy).toHaveBeenCalled();
    printSpy.mockRestore();
  });

  test('does not throw when window is undefined (server-side)', () => {
    const originalWindow = global.window;
    // @ts-expect-error - delete window is not natively allowed in the TS environment object types
    delete global.window;
    expect(() => exportToPDF()).not.toThrow();
    global.window = originalWindow;
  });
});
