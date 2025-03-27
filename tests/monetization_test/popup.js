const select = document.getElementById("select-field");
const checkbox = document.getElementById("visibleWidget");

async function addOption() {
  const { moduleList, activeWidget } = await chrome.storage.local.get([
    "moduleList",
    "activeWidget",
  ]);

  for (const module of moduleList) {
    if (module === "none") {
      const option = document.createElement("option");
      option.value = module;
      option.text = "Select a module";
      select.appendChild(option);
      continue;
    }

    const moduleData = await chrome.storage.local.get(module);
    const option = document.createElement("option");
    option.value = module;
    option.text = moduleData[module].name;

    select.appendChild(option);
  }

  checkbox.checked = activeWidget;

  chrome.storage.local.get("activeModule", ({ activeModule }) => {
    if (!activeModule) {
      select.value = "none";
      return;
    }

    select.value = activeModule;
  });
}

select.addEventListener("change", async (event) => {
  const activeModule = event.target.value;
  await chrome.storage.local.set({ activeModule });
});

checkbox.addEventListener("change", async (event) => {
  const activeWidget = event.target.checked;
  await chrome.storage.local.set({ activeWidget });
});

addOption();
