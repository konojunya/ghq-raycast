import { useCallback, useEffect, useState } from "react";
import {
  Action,
  ActionPanel,
  List,
  showToast,
  getPreferenceValues,
  Toast,
  closeMainWindow,
  clearSearchBar,
} from "@raycast/api";
import { fetchGHQList } from "./ghq";
import { launchVSCode } from "./vscode";
import { Fzf } from "fzf";
import { launchTerminal } from "./terminal";

async function cleanup() {
  await clearSearchBar();
  await closeMainWindow({ clearRootSearch: true });
}

export default function Command() {
  const preferences = getPreferenceValues<{ GHQ_ROOT_PATH: string }>();
  const [paths, setPaths] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fzf = new Fzf(result);

  const handleSearchTextChange = useCallback(
    (text: string) => {
      // fuzzy search
      const paths = fzf.find(text);
      setPaths(paths.map((p) => p.item));
    },
    [paths],
  );

  const handleOpenVSCode = useCallback(
    async (index: number) => {
      const projectPath = `${preferences.GHQ_ROOT_PATH}/${paths[index]}`;

      try {
        await launchVSCode(projectPath);
        await cleanup();
      } catch (e) {
        const toast = await showToast({ style: Toast.Style.Failure, title: "Can not open VSCode" });
        await toast.show();
      }
    },
    [paths],
  );

  const handleOpenTerminal = useCallback(
    async (index: number) => {
      const projectPath = `${preferences.GHQ_ROOT_PATH}/${paths[index]}`;

      try {
        await launchTerminal(projectPath);
        await cleanup();
      } catch (e) {
        const toast = await showToast({ style: Toast.Style.Failure, title: "Can not open Terminal" });
        await toast.show();
      }
    },
    [paths],
  );

  useEffect(() => {
    fetchGHQList(preferences.GHQ_ROOT_PATH.trim()).then((ghqList) => {
      setPaths(ghqList);
      setResult(ghqList);
      setIsLoading(false);
    });
  }, []);

  return (
    <List isLoading={isLoading} onSearchTextChange={handleSearchTextChange}>
      {paths.map((path, index) => (
        <List.Item
          key={path}
          title={path}
          actions={
            <ActionPanel>
              <Action icon="vscode.png" title="Open VSCode" onAction={() => handleOpenVSCode(index)} />
              <Action icon="terminal.png" title="Open Terminal" onAction={() => handleOpenTerminal(index)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
