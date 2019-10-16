//import {FlowerData} from '/local/lovelace-flower-card/data/data.js';
customElements.whenDefined('card-tools').then(() => {
class FlowerCard extends cardTools.LitElement {

  async setConfig(config) {

    this.config = config;

  }

  static get styles() {
    return cardTools.LitCSS`
    .centered-and-cropped { 
      object-fit: cover 
    }

    ha-card {
      margin-top: 32px;
    }
    .attributes {
      white-space: nowrap;
      padding: 8px;
    }
    .attribute ha-icon {
      float: left;
      margin-right: 4px;
    }
    .attribute {
      display: inline-block;
      width: 50%;
      white-space: normal;
    }

    .header {
      padding-top: 8px;
      height: 72px;
    }
    .header > img {
      width: 88px;
      border-radius: var(--ha-card-border-radius, 2px);
      margin-left: 16px;
      margin-right: 16px;
      margin-top: -32px;
      float: left;
      box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
    }
    .header > #name {
      font-weight: bold;
      width: 100%;
      margin-top: 16px;
      text-transform: capitalize;
      display: block;
    }
    .header > #species {
      text-transform: capitalize;
      color: #8c96a5;
      display: block;
    }
    .meter {
      height: 8px;
      background-color: #f1f1f1;
      border-radius: 2px;
      display: inline-grid;
      overflow: hidden;
    }
    .meter.red {
      width: 10%;
    }
    .meter.green {
      width: 50%;
    }
    .meter > span {
      grid-row: 1;
      grid-column: 1;
      height: 100%;
    }
    .meter > .good {
      background-color: rgba(43,194,83,1);
    }
    .meter > .bad {
      background-color: rgba(240,163,163);
    }
    .divider {
      height: 1px;
      background-color: #727272;
      opacity: 0.25;
      margin-left: 8px;
      margin-right: 8px;
    }
    `;
  }

  render() {
    const species = this.config.species;
//    const Flower = FlowerData[species];
    if(!this.stateObj)
      return cardTools.LitHtml``;

    const attribute = (icon, val, min, max) => {
      const pct = 100*Math.max(0, Math.min(1, (val-min)/(max-min)));
      return cardTools.LitHtml`
        <div class="attribute">
          <ha-icon .icon="${icon}"></ha-icon>
          <div class="meter red">
            <span
            class="${val < min || val > max ? 'bad' : 'good'}"
            style="width: 100%;"
            ></span>
          </div>
          <div class="meter green">
            <span
            class="${val > max ? 'bad' : 'good'}"
            style="width:${pct}%;"
            ></span>
          </div>
          <div class="meter red">
            <span
            class="bad"
            style="width:${val > max ? 100 : 0}%;"
            ></span>
          </div>
        </div>
      `;
          // ${val} (${min}-${max})
    }

    return cardTools.LitHtml`
    <ha-card>
    <div class="header"
    @click="${() => cardTools.moreInfo(this.stateObj.entity_id)}"
    >
    <img src="https://www.openplantdatabase.io/images/plants/${this.stateObj.attributes.plantid}.jpg" style="border-radius:50%" class="centered-and-cropped">
    <span id="name"> ${this.stateObj.attributes.friendly_name} - ${this.stateObj.attributes.plantid}</span>
    <span id="species"> ${this.stateObj.attributes.category}</span>
    </div>
    <div class="divider"></div>

    <div class="attributes">
    ${attribute('mdi:thermometer', this.stateObj.attributes.temperature, this.stateObj.attributes.min_temperature, this.stateObj.attributes.max_temperature)}
    ${attribute('mdi:white-balance-sunny', this.stateObj.attributes.max_brightness, this.stateObj.attributes.min_brightness_total, this.stateObj.attributes.max_brightness_total)}
    </div>
    <div class="attributes">
    ${attribute('mdi:water-percent', this.stateObj.attributes.moisture, this.stateObj.attributes.min_moisture, this.stateObj.attributes.max_moisture)}
    ${attribute('mdi:leaf', this.stateObj.attributes.conductivity, this.stateObj.attributes.min_conductivity, this.stateObj.attributes.max_conductivity)}
    </div>

    </ha-card>
    `;
  }

  set hass(hass) {
    this._hass = hass;
    this.stateObj = hass.states[this.config.entity];
    this.requestUpdate();
  }

}

customElements.define('flower-card', FlowerCard);
});

window.setTimeout(() => {
  if(customElements.get('card-tools')) return;
  customElements.define('flower-card', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
