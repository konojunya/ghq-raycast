import { useEffect, useState } from "react";
import { List, getPreferenceValues } from "@raycast/api";
import { fetchGHQList } from "./ghq";

export default function Command() {
  const preferences = getPreferenceValues<{ GHQ_ROOT_PATH: string }>();
  const [paths, setPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGHQList(preferences.GHQ_ROOT_PATH.trim()).then((ghqList) => {
      setPaths(ghqList);
      setIsLoading(false);
    });
  }, []);

  return (
    <List isLoading={isLoading}>
      {paths.map((path) => (
        <List.Item key={path} title={path} />
      ))}
    </List>
  );
}
