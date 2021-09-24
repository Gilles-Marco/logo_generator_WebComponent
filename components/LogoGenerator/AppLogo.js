import animation from './animation.css' assert { type: 'css' };
import appLogoStyle from './appLogoStyle.css' assert { type: 'css' }

export default class AppLogo extends HTMLElement {

    template = document.createElement("template")
    html = `
    <script type="module" src="slider2D/index.js"></script>
    <div id="logo-container" class="">
        <p id="logo">Mon logo</p>
    </div>
    <div class="logo-controler">
        <div class="card size-controler">
            <slider-2d id="slider-2d" width="100"></slider-2d>
        </div>
        <div class="card text-controler">
            Texte : <input id="logo-text" type="text" value="Mon logo" /><br>
            Taille du texte : <input id="logo-size" type="number" value="40"/><br>
            Couleur : <input id="logo-color" type="color" value="#FF0000"/><br>
            Animation : <select id="animation_input">
                <option value="">None</option>
                ${this._generate_animation_options()}
            </select>
            <border-input id="border-input"></border-input>
            <background-input id="background-input"></background-input>
        </div>
    </div>
    
    </div>
    `

    static get observedAttributes() {
        return ["animation-class"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        if (name == "animation-class") this.changeAnimation(newValue)
    }

    connectedCallback() {
        /*
        Is called when the component is instanciated
        */
        this.template.innerHTML = `${this.html}`
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.logo_container = this.shadowRoot.querySelector("#logo-container")
        this.logo_container.style.height = `${this.size * 2}px`
        this.logo = this.shadowRoot.querySelector("#logo")
        this.slider2d = this.shadowRoot.querySelector("#slider-2d")
        this._apply_style_on_logo()
        this.addListeners()
    }

    addListeners() {
        this.shadowRoot.querySelector("#animation_input")
            .addEventListener("change", (event) => {
                this.setAttribute("animation-class", event.target.value)
            })

        this.shadowRoot.querySelector("#logo-text").addEventListener("input", (event) => {
            this.logo.innerHTML = event.target.value
        })

        this.shadowRoot.querySelector("#logo-size").addEventListener("input", (event) => {
            this.logo.style.fontSize = `${event.target.value}px`
        })

        this.shadowRoot.querySelector("#logo-color").addEventListener("input", (event) => {
            this.logo.style.color = event.target.value
        })

        this.slider2d.addEventListener('update::rate-y', (event) => {
            let logo_container_rect = this.logo_container.getBoundingClientRect()
            this.logo.style.top = `${event.detail * logo_container_rect.height - this.size}px`
        })
        this.slider2d.addEventListener('update::rate-x', (event) => {
            let logo_conainer_rect = this.logo_container.getBoundingClientRect()
            this.logo.style.left = `${event.detail * logo_conainer_rect.width}px`
        })

        this.slider2d.addEventListener('update::width', (event) => {
            this.logo_container.style.width = `${event.detail}%`
        })
        this.slider2d.addEventListener('update::height', (event) => {
            this.logo_container.style.height = `${event.detail}px`
        })

        this.shadowRoot.querySelector('#border-input').addEventListener("border::update", (event) => {
            this.logo_container.style.border = event.detail
        })

        this.shadowRoot.querySelector("#background-input").addEventListener('background::change', (event)=>{
            if(event.detail.backgroundColor){
                this.logo_container.style.backgroundImage = 'none'
                this.logo_container.style.backgroundColor = event.detail.backgroundColor
            }
            else if(event.detail.backgroundImage){
                this.logo_container.style.backgroundColor = 'none'
                this.logo_container.style.backgroundImage = event.detail.backgroundImage
            }
            else{
                console.error(`Doesnt know the event detail type ${event.detail}`)
            }
        })
    }

    _generate_animation_options() {
        /**
         * Generate all options for the animation select from the css file
         */
        let animation_rules = Object.values(animation.rules).filter((rule) => {
            if (rule.style) {
                if (rule.style.animation) return rule
            }
        })

        return animation_rules.map((animation) => {
            return `<option value="${animation.selectorText.replace('.', '')}">${animation.selectorText.replaceAll('-', ' ').replace('.', '')}</option>`
        }).join("")
    }

    _apply_style_on_logo() {
        /**
        Apply style on div id="logo" after getting initialized
        */
        this.logo.style.fontSize = `${this.size}px`
        this.logo.style.color = this.color
    }


    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.adoptedStyleSheets = [appLogoStyle, animation]
        this.oldAnimationClass = ""
        this.animationClass = ""
        this.logo_container = null
        this.logo = null
        this.size = 40
        this.color = "#FF0000"
        this.slider2d = null
        self = this
    }

    changeAnimation(val) {
        if (this.oldAnimationClass) {
            this.logo.classList.toggle(`${this.oldAnimationClass}`)
        }
        if (val) {
            let return_value = this.logo.classList.toggle(`${val}`)
            if (return_value) this.animationClass = val
        }

        this.oldAnimationClass = val
    }

    startAnimation() {
        if (this.animationClass) {
            this.logo.classList.toggle(this.animationClass)
            setTimeout(() => {
                this.logo.classList.toggle(this.animationClass)
            }, 100)
        }
    }
}