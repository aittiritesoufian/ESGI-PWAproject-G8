import { LitElement, html, css } from 'lit-element';

class TwitFooter extends LitElement {

	constructor(){
        super();
        this.tab = "";
    }
    
    static get properties(){
        return {
            tab: String
        };
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

    handleTab(e) {
        // console.log(this.tab);
        this.dispatchEvent(new CustomEvent('change-tab', {
            detail: this.tab
        }));
    }

	render(){
		return html`
			<footer slot="footer">
                <ul>
                    <li @click="${e => {this.tab = ""; this.handleTab()}}">Home</li>
                    <li @click="${e => {this.tab = "profil"; this.handleTab()}}">Profil</li>
                    <li @click="${e => {this.tab = "new"; this.handleTab()}}">New Tweet</li>
                </ul>
            </footer>
		`;
	}
}

customElements.define('twit-footer', TwitFooter);