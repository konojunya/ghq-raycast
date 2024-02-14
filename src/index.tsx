import { useCallback, useEffect, useState } from "react";
import { Action, ActionPanel, List, getPreferenceValues } from "@raycast/api";
import { fetchGHQList } from "./ghq";
import { launchVSCode } from "./vscode";

export default function Command() {
  const preferences = getPreferenceValues<{ GHQ_ROOT_PATH: string }>();
  const [paths, setPaths] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchTextChange = useCallback(
    (text: string) => {
      // fuzzy search
      const paths = result.filter((path) => path.includes(text));
      setPaths(paths);
    },
    [paths],
  );

  const handleAction = useCallback(
    async (index: number) => {
      const projectPath = `${preferences.GHQ_ROOT_PATH}/${paths[index]}`;

      try {
        await launchVSCode(projectPath);
      } catch (e) {
        console.error(e);
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
              <Action title="Open VSCode" onAction={() => handleAction(index)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
