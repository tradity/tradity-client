import { html, render } from "lit-html";

class TradityContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    render(html`
      <style>
        div {
          display: flex;
          justify-content: space-between;
          border: 1px solid #170804;
          border-radius: 40px;
          padding: 12px;
          font-size: 12px;
          font-weight: bold;
          line-height: 15px;
          color: #170804;
        }
        
        :host([open]) div,
        div:hover {
          border-color: #F1592A;
        }
        
        :host div::after {
          font-family: "Material Icons";
          font-size: 24px;
          content: "expand_more";
        }
        
        :host([open]) div::after {
          content: "expand_less";
        }
        
        :host([open]) div {
          margin-bottom: 10px;
        }
        
        slot {
          display: none;
        }
        
        :host([open]) slot {
          display: block;
        }
      </style>
      <div @click=${() => this.toggleAttribute("open")}>${this.getAttribute("name")}</div>
      <slot></slot>
    `, this.shadowRoot);
  }
}

customElements.define("tradity-container", TradityContainer);