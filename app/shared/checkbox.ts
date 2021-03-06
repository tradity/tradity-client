import { html, render } from "lit-html";

class TradityCheckbox extends HTMLElement {
  root: ShadowRoot;
  #value: boolean;

  get value() {
    return this.#value;
  }

  set value(value: boolean) {
    this.#value = value;
    this.render();
  }

  get name() {
    return this.getAttribute("name");
  }
  
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    render(html`
      <style>
        input {
          position: absolute;
          left: -10000px;
        }
        
        input + label {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          line-height: 24px;
          margin-bottom: 15px;
        }
        
        input + label::before {
          content: "check_box_outline_blank";
          font-family: "Material Icons";
          font-size: 32px;
          color: #D8D8D8;
          margin: 0 6px 0 -3px;
        }
        
        input:focus + label::before,
        input:hover + label::before {
          color: #F1592A;
        }
        
        input:checked + label::before {
          content: "check_box";
          color: #F1592A;
        }
      </style>
      <input type="checkbox" id="checkbox" .checked=${this.#value} @input=${e => this.#value = e.target.checked} /><label for="checkbox"><slot></slot></label>
    `, this.root);
  }
}

customElements.define('tradity-checkbox', TradityCheckbox);