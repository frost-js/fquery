import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

/**
 * Gets the integrity hash for a test script asset.
 * @param {string} name The script filename.
 * @returns {Promise<string>} The script's integrity hash.
 */
export async function getScriptIntegrity(name) {
    const source = await readFile(new URL(`./assets/${name}`, import.meta.url));

    return `sha384-${createHash('sha384').update(source).digest('base64')}`;
}
