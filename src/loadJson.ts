import fs from "fs/promises";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseJson(content: string, source: string): unknown {
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(
      `Could not parse JSON from ${source}: ${getErrorMessage(error)}`,
      {
        cause: error,
      },
    );
  }
}

function isUrl(input: string): boolean {
  return input.startsWith("http://") || input.startsWith("https://");
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  try {
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
  } catch (error) {
    throw new Error(
      `Could not read standard input: ${getErrorMessage(error)}`,
      {
        cause: error,
      },
    );
  }

  return Buffer.concat(chunks).toString("utf-8");
}

export async function loadJson(source?: string): Promise<unknown> {
  if (!source) {
    const content = await readStdin();
    return parseJson(content, "standard input");
  }

  if (isUrl(source)) {
    let response: Response;

    try {
      response = await fetch(source);
    } catch (error) {
      throw new Error(`Could not fetch ${source}: ${getErrorMessage(error)}`, {
        cause: error,
      });
    }

    if (!response.ok) {
      const status = [response.status, response.statusText]
        .filter(Boolean)
        .join(" ");

      throw new Error(`Could not fetch ${source}: HTTP ${status}`);
    }

    let content: string;

    try {
      content = await response.text();
    } catch (error) {
      throw new Error(
        `Could not read response from ${source}: ${getErrorMessage(error)}`,
        {
          cause: error,
        },
      );
    }

    return parseJson(content, source);
  }

  let content: string;

  try {
    content = await fs.readFile(source, "utf-8");
  } catch (error) {
    throw new Error(
      `Could not read file ${source}: ${getErrorMessage(error)}`,
      {
        cause: error,
      },
    );
  }

  return parseJson(content, source);
}
