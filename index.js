
const availableMicrofrontends = {
  weather: "weather.js",
  news: "news.js",
  sights: "http://microservice-example-sights.s3-website.eu-central-1.amazonaws.com/sights-elements.js"
};

let selectedCity = null;
let visibleMicrofrontendElement = null;

document.addEventListener('DOMContentLoaded', () => addCitySelection());
document.addEventListener('DOMContentLoaded', () => addTabElements());

function addCitySelection() {
  const citySelection = document.getElementById('citySelection');

  citySelection.addEventListener("change", () => {
    selectedCity = citySelection.value;
    updateCityForMicrofrontend(selectedCity);
  });
}

function updateCityForMicrofrontend(newCity) {
  if (visibleMicrofrontendElement) {
    visibleMicrofrontendElement.setAttribute("city", newCity);
  }
}

function addTabElements() {
  Object.keys(availableMicrofrontends)
    .map(tabName => createTabElement(tabName))
    .forEach(tabElement => document.getElementById("tabContainer").appendChild(tabElement));
}

function createTabElement(tabName) {
  const tabElement = document.createElement("button");
  tabElement.textContent = tabName;
  tabElement.classList.add("tablink");
  tabElement.classList.add(tabName);
  tabElement.addEventListener("click", () => selectNewTab(tabName));
  return tabElement;
}

function selectNewTab(selectedMicrofrontend) {
  deactivateAllTabs();
  activateTab(selectedMicrofrontend);

  replaceMicrofrontend(selectedMicrofrontend);
}

function deactivateAllTabs() {
  document
    .querySelectorAll("#tabContainer .tablink")
    .forEach(tablink => tablink.classList.remove("active"));
}

function activateTab(selectedTab) {
  document
    .querySelector(`#tabContainer .tablink.${selectedTab}`)
    .classList
    .add("active");
}

function replaceMicrofrontend(selectedMicrofrontend) {
  loadMicrofrontend(availableMicrofrontends[selectedMicrofrontend]);
  visibleMicrofrontendElement = createMicrofrontendMainElement(selectedMicrofrontend);
  document.querySelector("main").replaceChildren(visibleMicrofrontendElement);
}

function loadMicrofrontend(microfrontendUrl) {
  if (!isMicrofrontendAlreadyLoaded(microfrontendUrl)) {
    const scriptElement = createMicrofrontendScriptElement(microfrontendUrl);
    document.head.appendChild(scriptElement);
  }
}

function isMicrofrontendAlreadyLoaded(microfrontendUrl) {
  return document.querySelectorAll(`script[src="${microfrontendUrl}"]`).length > 0
}

function createMicrofrontendScriptElement(microfrontendUrl) {
  const element = document.createElement("script");
  element.setAttribute("src", microfrontendUrl);
  element.setAttribute("type", "text/javascript");
  return element;
}

function createMicrofrontendMainElement(microfrontendName) {
  const element = document.createElement(`ntt-${microfrontendName}`);
  element.setAttribute("city", selectedCity ?? "");
  return element;
}


