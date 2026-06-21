import { randomUUID } from "crypto";

export type LoggedError = {
  id: string;
  message: string;
};

export function logError(scope: string, error: unknown): LoggedError {
  const id = randomUUID();
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  if (process.env.NODE_ENV !== "production") {
    console.error(`[${scope}] (${id})`, message, stack);
  } else {
    console.error(JSON.stringify({ scope, id, message }));
  }

  return { id, message };
}

export function clientError(scope: string, error: unknown, status = 500) {
  const { id } = logError(scope, error);
  return {
    body: { error: "Internal server error", id },
    status,
  };
}
