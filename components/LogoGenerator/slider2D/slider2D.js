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
            0 <input type="range" val="100" max="200" min="0" id="size-height"/> 200
        </div>
    `
    static get observedAttributes() {
        return ["rate-x", "rate-y", 'height', 'width'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        if (name == "rate-x") this.rateXHandler(newValue)
        else if (name == "rate-y") this.rateYHandler(newValue)
        else if (name == "height") this.heightHandler(newValue)
        else if (name == "width") this.widthHandler(newValue)
    }

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [slider2DStyle]
        this.template.innerHTML = `${this.html}`
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.circle = this.shadowRoot.querySelector("#circle")
        this.container = this.shadowRoot.querySelector("#container")
        this.width_input = this.shadowRoot.querySelector("#size-width")
        this.height_input = this.shadowRoot.querySelector("#size-height")

        let width = this.getAttribute('width')
        if(width) this.width_input.value = width
        let height = this.getAttribute('height')
        if(height) this.height_input.value = height

        this.addEventListener()
    }

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.adoptedStyleSheets = [slider2DStyle]
        this.circle = null
        this.width_input = null
        this.height_input = null
        this.event_listener = null
    }

    _pointer_move_handler(event) {
        let container_rect = this.container.getBoundingClientRect()

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

        this.setRateX(new_circle_posX / container_rect.width)
        this.setRateY(new_circle_posY / container_rect.height)
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
            this.container.addEventListener('pointermove', this.event_listener = (event)=>{this._pointer_move_handler(event)})
        })

        this.container.addEventListener('pointerup', (event) => {
            this.container.removeEventListener('pointermove', this.event_listener)
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
        let event = new CustomEvent('update::rate-x', {
            detail: rateX
        })
        this.dispatchEvent(event)
    }

    setRateY(rateY) {
        this.setAttribute('rate-y', rateY)
        let event = new CustomEvent('update::rate-y', {
            detail: rateY
        })
        this.dispatchEvent(event)
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
        if(this.height_input) this.height_input.value = val
        this.setAttribute('height', `${val}`)
        let event = new CustomEvent('update::height', {
            detail: val
        })
        this.dispatchEvent(event)
    }

    getHeight() {
        return this.getAttribute('height')
    }

    setWidth(val) {
        if(this.width_input) this.width_input.value = val
        this.setAttribute('width', `${val}`)
        let event = new CustomEvent('update::width', {
            detail: val
        })
        this.dispatchEvent(event)
    }

    getWidth() {
        return this.getAttribute('width')
    }

    heightHandler(value) {
        if (this.height_input) {
            this.height_input.value = value
        }
    }

    widthHandler(value) {
        if (this.width_input) {
            this.width_input.value = value
        }
    }

}