import fs from "fs/promises";

function isUrl(input: string): boolean {
  return input.startsWith("http://") || input.startsWith("https://");
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf-8");
}

export async function loadJson(source?: string): Promise<unknown> {
  if (!source) {
    const content = await readStdin();
    return JSON.parse(content);
  }

  if (isUrl(source)) {
    const response = await fetch(source);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  const content = await fs.readFile(source, "utf-8");

  return JSON.parse(content);
}
