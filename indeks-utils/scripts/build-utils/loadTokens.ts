import path from 'path';
import fs from 'fs/promises';

// Read and merge all token JSON files
export async function loadTokens(tokenPath: string): Promise<Record<string, any>> {
    const tokensDir = path.resolve(tokenPath, 'tokens');
    const tokenFiles = await fs.readdir(tokensDir);

    let tokens = {};
    for (const file of tokenFiles) {
        if (file.endsWith('.json')) {
            const filePath = path.join(tokensDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const parsed = JSON.parse(fileContent);
            tokens = { ...tokens, ...parsed };
        }
    }

    return tokens;
}
