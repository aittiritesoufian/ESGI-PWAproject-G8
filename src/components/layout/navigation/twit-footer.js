import { LitElement, html, css } from 'lit-element';

class TwitFooter extends LitElement {

	constructor(){
        super();
    }

    static get styles(){
        return css`
            :host {
                display: block;
                background-color: #fff;
                border-bottom:solid 1px #eeeeee;
            }
            footer > ul {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
            }
            footer > ul > li {
                flex-grow: 1;
                display: inline-block;
            }
        `;
    }

	render(){
		return html`
			<footer slot="footer">
                <ul>
                    <li @click="${() => tab = 'home'}">Home</li>
                    <li @click="${() => tab = 'profil'}">Profil</li>
                    <li @click="${() => tab = 'new'}">New Tweet</li>
                </ul>
            </footer>
		`;
	}
}

customElements.define('twit-footer', TwitFooter);