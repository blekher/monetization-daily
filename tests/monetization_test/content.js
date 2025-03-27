async function getOption() {
  const { moduleList } = await chrome.storage.local.get("moduleList");
  let result = "";

  for (const module of moduleList) {
    if (module === "none") {
      result += `<option value="${module}">Select a module</option>`;
      continue;
    }

    const moduleData = await chrome.storage.local.get(module);

    result += `<option value="${module}">${moduleData[module].name}</option>`;
  }

  return result;
}

async function addWidget() {
  const { activeWidget } = await chrome.storage.local.get("activeWidget");
  const widget = document.createElement("div");

  widget.id = "dev-mon-widget";
  widget.setAttribute(
    "style",
    "position: fixed; bottom: 20px; right: 20px; z-index: 99999999; background-color: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);",
  );
  widget.innerHTML = `
        <form class="form-inline">
            <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Active module</label>
            <select class="custom-select my-1 mr-sm-2" id="select-field">
                ${await getOption()}
            </select>
        </form>
    `;

  if (!activeWidget || window.top !== window.self) {
    widget.style.opacity = "0";
    widget.style.pointerEvents = "none";
  }

  const select = widget.querySelector("#select-field");

  select.addEventListener("change", async (event) => {
    const activeModule = event.target.value;
    await chrome.storage.local.set({ activeModule });
  });

  document.body.appendChild(widget);

  chrome.storage.local.get("activeModule", ({ activeModule }) => {
    if (!activeModule) {
      select.value = "none";
      return;
    }

    select.value = activeModule;
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.activeWidget) {
      const activeWidget = changes.activeWidget.newValue;

      if (window.top !== window.self) {
        return;
      }

      if (activeWidget) {
        widget.style.opacity = "1";
        widget.style.pointerEvents = "auto";
      } else {
        widget.style.opacity = "0";
        widget.style.pointerEvents = "none";
      }
    }
  });
}

async function start() {
  if (!document.body) {
    setTimeout(start, 100);
    return;
  }

  addWidget();

  const html = await chrome.storage.local.get("mon");

  if (html.mon) {
    document.body.insertAdjacentHTML("beforeend", html.mon);

    chrome.runtime.sendMessage({
      type: "UPDATE_CONFIG",
    });
  }
}

start();
