export interface HelpEntry {
  title: string;
  description: string;
}

export interface HelpCategory {
  title: string;
  entries: HelpEntry[];
}
