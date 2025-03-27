const domain = "https://dev.astralink.click";

const setDefaultConfig = async () => {
  await chrome.storage.local.set({
    activeWidget: true,
    moduleList: [
      "none",
      "yahoo_dev",
      "yahoo_stable",
      "google_dev",
      "google_stable",
      "yt-pre-vid",
    ],
    yahoo_dev: {
      url: `${domain}/mon-d/conf/ya?q=oy9isnkr`,
      name: "Yahoo Dev",
    },
    yahoo_stable: {
      url: `${domain}/mon-d/conf/ya-prod?q=oy9isnkr`,
      name: "Yahoo Stable",
    },
    google_dev: {
      url: `${domain}/mon-d/conf/go?q=oy9isnkr`,
      name: "Google Dev",
    },
    google_stable: {
      url: `${domain}/mon-d/conf/go-prod?q=oy9isnkr`,
      name: "Google Stable",
    },
    "yt-pre-vid": {
      url: `${domain}/mon-d/conf/yt-pre-vid?q=oy9isnkr`,
      name: "YT preroll video",
    },
  });
};

const getConfig = async () => {
  const { activeModule, configUrl } = await chrome.storage.local.get([
    "activeModule",
    "configUrl",
  ]);

  if (!configUrl || !activeModule || activeModule === "none") {
    await chrome.storage.local.set({ mon: "" });
    return;
  }

  const response = await fetch(configUrl);
  const data = await response.text();

  await chrome.storage.local.set({ mon: data });
};

const updateConfigUrl = async (moduleName) => {
  const moduleData = await chrome.storage.local.get(moduleName);
  const url = moduleData[moduleName].url;

  await chrome.storage.local.set({ configUrl: url });

  if (url) {
    getConfig();
  }
};

setDefaultConfig();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "UPDATE_CONFIG") {
    await getConfig();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.activeModule) {
    const activeModule = changes.activeModule.newValue;

    updateConfigUrl(activeModule);
  }
});
