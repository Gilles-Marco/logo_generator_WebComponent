import sheet from './animation.css' assert { type: 'css' };

export default class AppLogo extends HTMLElement {

    template = document.createElement("template")
    style = ``
    html = `
    <div id="logo" class="">Mon logo 2</div>
    <br>
    Couleur : <input type="color" id="color_input"/>
    <br>
    Taille : <input type="range" id="size_input" val=40 min=0 max=100> 100
    <br>
    Animation : <select id="animation_input">
        <option value="">None</option>
        <option value="tracking-in-expand">tracking in expand</option>
        <option value="text-focus-in">text focus in</option>
    </select>
    `

    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.adoptedStyleSheets = [sheet]
        this.logo = null
        this.oldAnimationClass = ""
        this.animationClass = ""
        this.size = 40
        this.color = "#FF0000"
    }

    static get observedAttributes() {
        return ["size", "color", "animation-class"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        if(name == "animation-class") this.changeAnimation(newValue)
        if(name == "size") this.changeSize(newValue)
        if(name == "color") this.changeColor(newValue)
    }

    connectedCallback() {
        /*
        Is called when the component is instanciated
        */
       this.template.innerHTML = `<style>${this.style}</style>${this.html}`
       this.shadowRoot.appendChild(this.template.content.cloneNode(true))
       this.logo = this.shadowRoot.querySelector("#logo")
       this.addListeners()
    }

    addListeners(){
        this.shadowRoot.querySelector("#color_input")
        .addEventListener("input", (event)=>{
            this.setAttribute("color", event.target.value)
        })

        this.shadowRoot.querySelector("#size_input")
        .addEventListener("input", (event)=>{
            this.setAttribute("size", event.target.value)
        })

        this.shadowRoot.querySelector("#animation_input")
        .addEventListener("change", (event)=>{
            this.setAttribute("animation-class", event.target.value)
        })
    }

    changeColor(val) {
        this.logo.style.color = val
    }

    changeSize(val) {
        this.logo.style.fontSize = val + "px"
    }

    changeAnimation(val){
        if(this.oldAnimationClass){
            this.logo.classList.toggle(`${this.oldAnimationClass}`)
        }
        if(val){
            this.logo.classList.toggle(`${val}`)
        }
        
        this.oldAnimationClass = val
    }

    startAnimation(){
        console.log(("restart animation"))
        this.logo.classList.toggle(this.oldAnimationClass)
        setTimeout(()=>{
            this.logo.classList.toggle(this.oldAnimationClass)
        }, 100)
    }
}