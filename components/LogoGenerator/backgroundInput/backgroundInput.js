import style from './backgroundInput.css' assert {type: 'css'}

export default class BackgroundInput extends HTMLElement {

    template = document.createElement("template")

    html = `
        <div>

        </div>
    `
    
    connectedCallback(){
        this.template.innerHTML = `${this.html}`
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.shadowRoot.adoptedStylesheet = [style]
    }
    
    constructor(){
        super()
        this.attachShadow({ mode: "open" })
    }   
}