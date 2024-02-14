import { runAppleScript } from "@raycast/utils";

export function launchTerminal(path: string) {
  const script = `tell application "Terminal" to do script "cd ${path}"`;
  return runAppleScript(script);
}
