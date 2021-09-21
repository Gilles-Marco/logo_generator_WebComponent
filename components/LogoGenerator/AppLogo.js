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
            <slider-2d id="slider-2d" width="100%"></slider-2d>
        </div>
        <div class="card animation-controler">
            Animation : <select id="animation_input">
                <option value="">None</option>
                ${this._generate_animation_options()}
            </select>
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

        this.slider2d.addEventListener('update::rate-y', (event)=>{
            console.log(event.detail)
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
        this.logo.style.width = "100%"
        this.logo.style.height = `${this.size * 2}px`
    }


    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.adoptedStyleSheets = [appLogoStyle, animation]
        this.oldAnimationClass = ""
        this.animationClass = ""
        this.logo = null
        this.size = 40
        this.color = "#FF0000"
        this.slider2d = null
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