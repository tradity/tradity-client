import { html, render } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined";

class TradityInput extends HTMLElement {
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
        :host {
          width: 100%;
          display: inline-flex;
          margin-bottom: 15px;
          padding: 0 12px;
          border: 1px solid #D8D8D8;
          border-radius: 3px;
          outline: none;
        }
      
        :host:focus-within,
        :host:hover {
          border-color: #F1592A;
        }
      
        span.prefix,
        span.suffix,
        input {
          display: flex;
          align-items: center;
          height: 57px;
        }
      
        span.prefix {
          margin-right: 7px;
        }
      
        span.suffix {
          margin-left: 7px;
        }
      
        input {
          flex: 1 1 auto;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: 12px;
          line-height: 15px;
          letter-spacing: 2px;
          color: #170804;
          background-color: white;
          /*
            Hack needed to get rid of Chrome's ugly form autofill colour,
            which for some reason is an outstanding bug since 2008 -.-
            https://bugs.chromium.org/p/chromium/issues/detail?id=46543
          */
          -webkit-box-shadow: 0 0 0px 1000px white inset;
          -webkit-text-fill-color: #170804;
        }
      
        input:placeholder-shown { font-weight: 100; }
        input::placeholder { font-weight: 100; }
        input::-moz-placeholder { font-weight: 100; }
        input:-ms-input-placeholder { font-weight: 100; }
        input::-webkit-input-placeholder { font-weight: 100; }
      
        :host-context(tradity-trade) input[type=number] {
          font-size: 16px;
          font-weight: 100;
          text-align: center;
          line-height: 15px;
          letter-spacing: 2px;
          color: #170804;
        }
      </style>
      <span class="prefix">
        ${this.hasAttribute("prefix")
          ? html`<tradity-icon>${this.getAttribute("prefix")}</tradity-icon>`
          : ""
        }
      </span>
      <input
        type=${this.getAttribute("type")}
        .value=${this.#value}
        @input=${e => this.#value = e.target.value}
        placeholder=${ifDefined(this.getAttribute("placeholder"))}
        autofocus=${ifDefined(this.getAttribute("autofocus"))}
        min=${ifDefined(this.getAttribute("min"))}
        max=${ifDefined(this.getAttribute("max"))}
        step=${ifDefined(this.getAttribute("step"))}
      />
      <span class="suffix"></span>
    `, this.root);
  }
}

customElements.define("tradity-input", TradityInput);