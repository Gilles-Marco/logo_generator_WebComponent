import slider2DStyle from './slider2D.css' assert { type: 'css' }

export default class Slider2D extends HTMLElement {

    template = document.createElement("template")
    html = `
        <div id="container">
            <div id="circle">
            </div>
        </div>
        <div id="div-width">
            width
            <br>
            0 <input type="range" val="100" max="100" min="0" id="size-width"/> 100
        </div>
        <div id="div-height">
            height
            <br>
            0 <input type="range" val="100" max="100" min="0" id="size-height"/> 100
        </div>
    `
    static get observedAttributes() {
        return ["rate-x", "rate-y"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        if (name == "rate-x") this.rateXHandler(newValue)
        if (name == "rate-y") this.rateYHandler(newValue)
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [slider2DStyle]
        this.template.innerHTML = `${this.html}`
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.circle = this.shadowRoot.querySelector("#circle")
        this.container = this.shadowRoot.querySelector("#container")
        this.width_input = this.shadowRoot.querySelector("#size-width")
        this.height_input = this.shadowRoot.querySelector("#size-height")
        this.addEventListener()
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.adoptedStyleSheets = [slider2DStyle]
        this.size = 100
        this.circle = null
        this.width_input = null
        this.height_input = null
        this.rateX = 0
        this.rateY = 0
        self = this
    }

    _pointer_move_handler(event) {
        let container_rect = self.container.getBoundingClientRect()

        let new_circle_posX, new_circle_posY = 0

        if (event.x <= container_rect.x) {
            new_circle_posX = container_rect.x
        }
        else if (event.x >= container_rect.right) {
            new_circle_posX = container_rect.right
        }
        else {
            new_circle_posX = event.x - container_rect.left
        }

        if (event.y <= container_rect.y) {
            new_circle_posY = container_rect.y
        }
        else if (event.y >= container_rect.bottom) {
            new_circle_posY = container_rect.y
        }
        else {
            new_circle_posY = event.y - container_rect.top
        }

        self.setRateX(new_circle_posX / container_rect.width)
        self.setRateY(new_circle_posY / container_rect.height)
    }

    addEventListener() {
        // this.container.addEventListener('dragstart', (event)=>{
        //     event.preventDefault()
        // })

        this.container.addEventListener('dragstart', (event) => {
            event.preventDefault()
        })
        this.container.addEventListener('drag', (event) => {
            event.preventDefault()
        })

        this.container.addEventListener('pointerdown', (event) => {
            this.container.addEventListener('pointermove', this._pointer_move_handler)
        })

        this.container.addEventListener('pointerup', (event) => {
            this.container.removeEventListener('pointermove', this._pointer_move_handler)
        })

        this.height_input.addEventListener('input', (event) => {
            this.setHeight(event.target.value)
        })

        this.width_input.addEventListener('input', (event) => {
            this.setWidth(event.target.value)
        })

    }

    setRateX(rateX) {
        this.setAttribute('rate-x', rateX)
    }

    setRateY(rateY) {
        this.setAttribute('rate-y', rateY)
    }

    getRateY() {
        return this.getAttribute('rate-y')
    }

    getRateX() {
        return this.getAttribute('rate-x')
    }

    rateXHandler(val) {
        let container_rect = this.container.getBoundingClientRect()
        let circle_rect = this.circle.getBoundingClientRect()
        let circle_half_width = circle_rect.width / 2
        this.circle.style.left = `${container_rect.width * val - circle_half_width}px`
    }

    rateYHandler(val) {
        let container_rect = this.container.getBoundingClientRect()
        let circle_rect = this.circle.getBoundingClientRect()
        let circle_half_width = circle_rect.width / 2
        this.circle.style.top = `${container_rect.width * val - circle_half_width}px`
    }

    setHeight(val) {
        this.setAttribute('height', `${val}%`)
    }

    getHeight() {
        return this.getAttribute('height')
    }

    setWidth(val) {
        this.setAttribute('width', `${val}%`)
    }

    getWidth() {
        return this.getAttribute('width')
    }

}