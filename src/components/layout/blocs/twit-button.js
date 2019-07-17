import { LitElement, html, css } from 'lit-element';

class TwitButton extends LitElement {

	constructor(){
        super();
        this.class = "";
        this.icon = "";
    }
    
    static get properties(){
        return {
            class: String,
            icon: String
        };
    }

    static get styles(){
        return css`
            :host {
                
            }
        `;
    }

	render(){
		return html`
			<button style="background: none; border:none; " class="${this.class}">
			  <slot></slot>
      </button>
		`;
	}
}

customElements.define('twit-button', TwitButton);