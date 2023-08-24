import { DomainError } from "@domain/error";

export function throwInvalidJwtToken(): boolean {
  throw new DomainError({ error: "invalid token" }, 401);
}

export function isJwtToken(e: unknown): e is string {
  // Check if the value is a string.
  if (!(typeof e === "string")) {
    return throwInvalidJwtToken()
  }

  // Split the string into three parts.
  const parts = e.split(".");
  if (parts.length !== 3) {
    return throwInvalidJwtToken()
  }

  return true;
  // Base64 decode the header part.
  // const header = Buffer.from(parts[0], "base64").toString();

  // Check if the header contains the "typ" claim with the value "JWT".
  // const typ = JSON.parse(header)["typ"];
  // if (typ !== "JWT") {
  //   return throwInvalidJwtToken()
  // }

} 
