import style from './backgroundInput.css' assert {type: 'css'}

export default class BackgroundInput extends HTMLElement {

    template = document.createElement("template")

    html = `
        <div class="parent">
            <div id="tabs">
                <span id="tab-1">URL</span>
                <span id="tab-2">File</span>
                <span id="tab-3">Color</span>
            </div>
            <div id="tabs-content">
                <div id="tab-content-1">
                    Background URL 
                    <br>
                    <input type="text" id="url-input" />
                </div>
                <div id="tab-content-2">
                    Upload Background File 
                    <br>
                    <input type="file" accept="image/jpg, image/jpeg, image/png, image/gif" id="file-input" />
                </div>
                <div id="tab-content-3">
                    Choose a color for your background 
                    <br>
                    <input type="color" id="color-input" />
                </div>
            </div>
        </div>
    `
    
    connectedCallback(){
        this.template.innerHTML = `${this.html}`
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.shadowRoot.adoptedStyleSheets = [style]
        this.last_selected = this.shadowRoot.querySelector('#tab-1')
        this.last_content_selected = this.shadowRoot.querySelector("#tab-content-1")
        this.last_content_selected.classList.toggle("tab-selected")
        this.last_selected.classList.toggle("tab-selected")
        this.addListeners()
    }

    _emit_event(background_css){
        let event = new CustomEvent('background::change', {
            detail: background_css
        })
        this.dispatchEvent(event)
    }

    async _css_generator(method_type){
        if(method_type == 'file'){
            let file = this.shadowRoot.querySelector("#file-input").files[0]
            let data = await new Promise((resolve, reject)=>{
                let reader = new FileReader()
                reader.onload = (e)=>resolve(reader.result)
                reader.readAsDataURL(file)
            })
            return {'backgroundImage': `url(${data})`}
        }
        else if(method_type == "url"){
            return { 'backgroundImage': `url(${this.shadowRoot.querySelector('#url-input').value})`}
        }
        else if(method_type == 'color'){
            return {'backgroundColor': this.shadowRoot.querySelector("#color-input").value}
        }
        else{
            console.error(`_css_generator doesn't know the type ${method_type}`)
            return null
        }
    }

    addListeners(){
        for(let i=1;i<=this.nb_tab;i++){
            this.shadowRoot.querySelector(`#tab-${i}`).addEventListener('click', (event)=>{
                this.last_selected.classList.toggle("tab-selected")
                this.last_content_selected.classList.toggle("tab-selected")
                event.target.classList.toggle("tab-selected")
                this.last_selected = this.shadowRoot.querySelector(`#tab-${i}`)
                this.last_content_selected = this.shadowRoot.querySelector(`#tab-content-${i}`)
                this.last_content_selected.classList.toggle("tab-selected")
            })
        }

        this.shadowRoot.querySelector('#url-input').addEventListener('input', async (event)=>{
            // console.log(await this._css_generator('url'))
            this._emit_event(await this._css_generator('url'))
        })

        this.shadowRoot.querySelector('#file-input').addEventListener('input', async (event)=>{
            this._emit_event(await this._css_generator('file'))
        })

        this.shadowRoot.querySelector('#color-input').addEventListener('input', async (event)=>{
            this._emit_event(await this._css_generator('color'))
        })
    }
    
    constructor(){
        super()
        this.attachShadow({ mode: "open" })
        this.nb_tab = 3
    }   
}