const storageKey = "hubook-configs";

export type Layout = "H" | "V";
export type GithubParams = {
  apiBase: string;
  apiToken: string;
};
export type ConfigType = {
  github: GithubParams;
  layout: Layout;
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

function save() {
  localStorage.setItem(storageKey, JSON.stringify(config));
}

export function value() {
  // simple deep copy
  return JSON.parse(JSON.stringify(config)) as ConfigType;
}

export function setLayout(l: Layout) {
  Object.assign(config, {
    layout: l,
  });
  save();
}

export function setGithub(v: GithubParams) {
  Object.assign(config, {
    github: v,
  });
  save();
}
