const DEBUG_TEXT =
  "Loading the code for Custom Element 'wix-default-custom-element'. To debug this code, open wixDefaultCustomElement.js in Developer Tools.";

const createH2 = (H2_TEXT) => {
  const h2Element = document.createElement("h2");
  h2Element.textContent = H2_TEXT;
  h2Element.id = "wdce-h2";
  h2Element.onclick = (evt) => {
    console.log("Clicked: ", evt);
  }
  return h2Element;
};

const createStyleSheet = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://storage.googleapis.com/anweshan-dev.appspot.com/shipthelip/index.css";

    return link;
}

class HelloWorld extends HTMLElement {
  constructor() {
    super();
    console.log(DEBUG_TEXT);
  }
  connectedCallback() {
    this.appendChild(createH2("Hello World"));
    this.appendChild(createStyleSheet());
  }
}
customElements.define('hello-world', HelloWorld);