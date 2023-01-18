class Weather extends HTMLElement {

  static get observedAttributes() {
    return ['city'];
  }

  connectedCallback() {
    console.log("connected weather");
    this.updateWeather();
  }

  disconnectedCallback() {
    console.log("disconnected weather");
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    console.log("attributeChanged", attributeName, oldValue, newValue);
    this.updateWeather();
  }

  updateWeather() {
    if (!this.getCity().length > 0) {
      this.textContent = "Please select a city";
      return;
    }

    this.writePageContent(this.getReadableCity());
    this.requestWeather(this.getCity()).then(weather => this.writePageContent(this.getReadableCity(), weather));
  }

  writePageContent(city, weather = "") {
    this.innerHTML = `
      <h1>Weather for ${city}</h1>
      <h2>${weather}</h2>
    `;
  }

  getCity() {
    return this.getAttribute('city');
  }

  getReadableCity() {
    const city = this.getCity()
    return city.charAt(0).toUpperCase() + city.slice(1)
  }

  async requestWeather(city) {
    const url = `https://qgzls2hw9f.execute-api.eu-central-1.amazonaws.com/${city}`;
    const response = await fetch(url);
    const weather = await response.json();

    const condition = weather.currently.summary
    const temperature = Math.round(weather.currently.temperature);
    return `${condition}, ${temperature}°`;
  }

}

window.customElements.define('ntt-weather', Weather);
