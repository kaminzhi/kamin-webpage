interface IframeConfig {
  url: string;
  title: string;
}

export const iframeConfig: Record<string, IframeConfig> = {
  blog: {
    url: "https://blog.kaminzhi.com",
    title: "My Blog"
  }
}; 