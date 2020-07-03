const storageKey = "hubook-configs";

type ConfigType = {
  github: {
    apiBase: string;
    apiToken: string;
  };
  layout: "H" | "V";
};

let config = ((): ConfigType => {
  const raw = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (!raw) {
    return {
      github: {
        apiBase: "",
        apiToken: "",
      },
      layout: "H",
    };
  }

  return {
    github: {
      apiBase: raw.github?.apiBase || "https://api.github.com",
      apiToken: raw.github?.apiToken || "",
    },
    layout: raw.layout || "H",
  };
})();

export function value() {
  // simple deep copy
  return JSON.parse(JSON.stringify(config)) as ConfigType;
}

export function set(v: ConfigType) {
  config = v;
  // TODO: validate
  localStorage.setItem(storageKey, JSON.stringify(config));
}
