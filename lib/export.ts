/**
 * Export helpers for user data.
 */

/**
 * Triggers the browser's native print dialog to download/save the page as PDF.
 */
export function exportToPDF(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
