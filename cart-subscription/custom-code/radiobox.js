const DEBUG_TEXT_MONTLY =
    "Loading the code for Custom Element 'radio-custom-montly'";

const DEBUG_TEXT_ONETIME =
    "Loading the code for Custom Element 'radio-custom-onetime'";

const STYLE_DIV = `display: flex; flex-direction: row; border: 1px solid #c9c9c9; padding: 16px; cursor: pointer; background-color: #fff; justify-content: flex-start; align-self: center; color: #444; gap: 10px;`
const STYLE_RADIO = `cursor: pointer;`
const STYLE_LABEL = `cursor: pointer;`
const INNER_DIV_1 = `font-size: 16px; line-height: 1.5;`
const INNER_DIV_2 = `font-size: 12px; line-height: 1.33; margin-bottom: 8px;`
const INNER_SPAN_1 = `font-size: 16px; line-height: 1.5;`
const INNER_SPAN_2 = `font-size: 12px; margin-left: 4px;`

// TEXT
const MONTLY_TEXT = `Monthly Subscription`;
const ONETIME_TEXT = `One Time Payment`;

// SUBTEXT
const TAGLINE_TEXT = `Convenience Delivered: On-Time to Your Doorstep!`
const DUMMY_PRICE = `$0.00`;
const PRICE_TAG = `every month until canceled`


const createBox = (checked = false, pricetag = true, headingText = MONTLY_TEXT) => {
    
    const div_id = Math.random().toString().slice(3, 8);
    const price_id = Math.random().toString().slice(2, 8);
    
    const div = document.createElement("div");
    div.classList.add("plan-box");
    div.style.cssText = STYLE_DIV;
    div.id = div_id;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.checked = checked;
    const radio_name = Math.random().toString().slice(2, 8);
    radio.name = radio_name;
    radio.id = radio_name;
    radio.style.cssText = STYLE_RADIO;

    const label = document.createElement("label");
    label.htmlFor = radio_name;
    label.style.cssText = STYLE_LABEL;
    
    let textElement = document.createElement("div");
    textElement.style.cssText = INNER_DIV_1;
    textElement.innerText = headingText;

    let tagLineElement = document.createElement("div");
    tagLineElement.style.cssText = INNER_DIV_2;
    tagLineElement.innerText = TAGLINE_TEXT;

    let labelDiv = document.createElement("div");
    
    let innerSpan1 = document.createElement("span");
    innerSpan1.style.cssText = INNER_SPAN_1;
    innerSpan1.innerText = DUMMY_PRICE;
    innerSpan1.id = price_id;

    let innerSpan2 = document.createElement("span");
    innerSpan2.style.cssText = INNER_SPAN_2;
    innerSpan2.innerText = PRICE_TAG;

    labelDiv.appendChild(innerSpan1);

    if(pricetag !== false) {
        labelDiv.appendChild(innerSpan2);
    }

    label.appendChild(textElement);
    label.appendChild(tagLineElement);
    label.appendChild(labelDiv);
    div.appendChild(radio);
    div.appendChild(label);

    return {
        node: div,
        id: {
            price: innerSpan1,
            div: div,
            radio: radio,
        },
    };
    
};

const createLink = () => {

   let style = document.createElement("style");
   style.innerHTML =   `
    @font-face {font-family: "Helvetica-W01-Roman"; src: url("//static.parastorage.com/services/santa-resources/dist/viewer/user-site-fonts/fonts/Helvetica/v3/HelveticaLTW04-Roman.woff2") format("woff2");}

    @font-face {font-family: "Helvetica-W02-Roman"; src: url("//static.parastorage.com/services/third-party/fonts/user-site-fonts/fonts/b56b944e-bbe0-4450-a241-de2125d3e682.woff") format("woff");}

    @font-face {font-family: "Helvetica-LT-W10-Roman"; src: url("//static.parastorage.com/services/third-party/fonts/user-site-fonts/fonts/6f8d1983-4d34-4fa4-9110-988f6c495757.woff") format("woff");}

    .plan-box {
        font-family: "Helvetica-W01-Roman", "Helvetica-W02-Roman", "Helvetica-LT-W10-Roman", sans-serif !important;
    }

    .plan-box > input[type="radio"]:checked {
        accent-color: black;
    }
   ` 
   
   return style;

}

class MontlySubscription extends HTMLElement {

    constructor() {
        super();
        console.log(DEBUG_TEXT_MONTLY);
    }

    connectedCallback() {
        this.appendChild(createLink())

        const { node, id: { price, div, radio } } = createBox();

        this.appendChild(node);

        this.price = price;
        this.div = div;
        this.radio = radio;

        // console.log(document.querySelector(this.id));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "checked") {
            // console.log(document.querySelector(`#${this.price}`));

            if(typeof newValue !== "boolean") {
                newValue = false;
            }

            this.radio.checked = newValue;

        }

        if(name === "price") {
            // console.log(document.querySelector(`#${this.price}`))
            this.price.innerText = newValue;
        }
    }
    
    static get observedAttributes() {
        return ["checked", "price"];
    }
}

customElements.define('monthly-payment', MontlySubscription);