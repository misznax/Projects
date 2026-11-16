// Pozwala testom w Node importować pliki .json bez atrybutu (Worker jest budowany przez esbuild, który tego nie wymaga).
import { readFile } from 'node:fs/promises';
export async function load(url, context, next) {
  if (url.endsWith('.json')) return { format: 'module', shortCircuit: true, source: 'export default ' + (await readFile(new URL(url), 'utf8')) };
  return next(url, context);
}
