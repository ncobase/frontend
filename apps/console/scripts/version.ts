import { execSync } from 'child_process';
import fs from 'fs/promises';

interface IVersionInfo {
  version: string;
  commit: string;
  date: string;
}

const getVersion = (): string | null => {
  try {
    return execSync('git describe --tags --match "v*" --always | sed "s/-g[a-z0-9]{7}//"')
      .toString()
      .trim();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRevision = (): string | null => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getContent = (): IVersionInfo => {
  const version = getVersion() ?? new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const commit = getRevision() ?? 'No commit';
  const date = new Date().toISOString();

  return { version, commit, date };
};

export const generateVersionInfo = async (filePath: string = 'version.json'): Promise<void> => {
  try {
    const content = getContent();
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    console.log(`✅ Generate \`${filePath}\``);
  } catch (error) {
    console.error(error);
    throw new Error(`❌ Failed to generate \`${filePath}\``);
  }
};
