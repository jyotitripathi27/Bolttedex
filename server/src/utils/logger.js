/**
 * Logs error messages in a consistent format.
 * @param {string} context - A brief description of where the error occurred
 * @param {Error|any} error - The error object or message to log
 */
export function logError(context, error) {
    const timestamp = new Date().toISOString();
    if (error instanceof Error) {
      console.error(`[${timestamp}] ERROR: ${context}`, {
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error(`[${timestamp}] ERROR: ${context}`, error);
    }
}