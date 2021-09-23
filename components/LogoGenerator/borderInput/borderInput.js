import style from './borderInput.css' assert { type: 'css' }

export default class BorderInput extends HTMLElement {
    
    template = document.createElement("template")

    html = `
        <div id="border-container">
        Border : <select id="border-type-input">
            <option value="solid">solid</option>
            <option value="dashed">dashed</option>
            <option value="double">double</option>
            <option value="ridge">ridge</option>
            <option value="dotted">dotted</option>
        </select>
        <input type="number" id="border-size-input"/>
        <input type="color" id="border-color-input"/>
        </div>
    `
    
    connectedCallback(){
        this.template.innerHTML = `${this.html}`
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.shadowRoot.adoptedStyleSheets = [style]
        this._add_listeners()
    }
    
    constructor(){
        super()
        this.attachShadow({ mode: "open" })
        self = this
    }

    _add_listeners(){
        this.shadowRoot.querySelector("#border-size-input").addEventListener('input', this._emit_event)
        this.shadowRoot.querySelector("#border-type-input").addEventListener('change', this._emit_event)
        this.shadowRoot.querySelector("#border-color-input").addEventListener('input', this._emit_event)
    }

    _gen_css_style(){
        let border_size = this.shadowRoot.querySelector("#border-size-input").value
        let border_type = this.shadowRoot.querySelector("#border-type-input").value
        let color_border = this.shadowRoot.querySelector("#border-color-input").value
        return `${border_size}px ${border_type} ${color_border}`
    }

    _emit_event(){
        let event = new CustomEvent('border::update', {
            detail : self._gen_css_style()
        })
        self.dispatchEvent(event)
    }

}