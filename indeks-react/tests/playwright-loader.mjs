// Custom ESM loader to prevent Vitest conflicts with Playwright
export async function resolve(specifier, context, nextResolve) {
  // Block Vitest-related modules from being loaded in Playwright environment
  if (
    specifier.includes('@vitest/expect') ||
    specifier.includes('vitest') ||
    specifier.includes('./testSetup.ts') ||
    specifier.includes('./vitest.config.ts')
  ) {
    throw new Error(`Module ${specifier} is not allowed in Playwright environment`);
  }

  return nextResolve(specifier, context);
}
