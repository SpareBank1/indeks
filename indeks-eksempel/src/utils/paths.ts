/**
 * Utility functions for handling application paths
 */

const BASE_PATH = '';

/**
 * Adds the application base path to a given path
 * @param path - The path to prepend with base path
 * @returns The full path with base path included
 */
export const getPathWithBasePath = (path: string): string => {
  return `${BASE_PATH}${path}`;
};
