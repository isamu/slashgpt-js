export type ManifestData = {
  title: string;
  about: string;
  bot: string;
  temperature: number;
  prompt: string[];
  actions: any;
  sample: string;
  functions?: string | Record<string, string>;
};

export type ChatData = {
  role: string;
  content: string;
  name?: string;
  preset?: boolean;
  function_data?: any;
};
