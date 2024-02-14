import { useCallback, useEffect, useState } from "react";
import { List, getPreferenceValues } from "@raycast/api";
import { fetchGHQList } from "./ghq";

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

  useEffect(() => {
    fetchGHQList(preferences.GHQ_ROOT_PATH.trim()).then((ghqList) => {
      setPaths(ghqList);
      setResult(ghqList);
      setIsLoading(false);
    });
  }, []);

  return (
    <List isLoading={isLoading} onSearchTextChange={handleSearchTextChange}>
      {paths.map((path) => (
        <List.Item key={path} title={path} />
      ))}
    </List>
  );
}
