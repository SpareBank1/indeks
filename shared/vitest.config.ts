import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['tokens/**/__tests__/**/*.test.ts', 'tokens/**/*.test.ts', '**/*.test.ts'],
    },
});
