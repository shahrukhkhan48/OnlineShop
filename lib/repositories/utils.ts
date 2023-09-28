// utils.ts

/**
 * Generates a unique ID based on the current timestamp.
 * @returns {string} The unique ID.
 */
export function generateUniqueId(): string {
    return Date.now().toString();
}