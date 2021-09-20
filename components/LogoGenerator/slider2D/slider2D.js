class slider2D extends HTMLElement {

    template = document.createElement("template")
    html = `
        <canvas id="2dslider"></canvas>
    `

    _apply_canvas_style(){

    }

    connectedCallback(){
        this.template.innerHTML = `${this.html}`
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.canvas = this.shadowRoot.querySelector("#2dslider")
        this._apply_canvas_style()
    }

    constructor(){
        super()
        this.attachShadow({ mode: "open" })
        this.canvas = null
        this.size = 100
        this.pointer = {
            x: 0,
            y: 0
        }
    }

}