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
            footer {
                position: fixed;
                bottom: 0;
                width: 100%;
                height:9%;
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
			<footer>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/profil">Profil</a></li>
                    <li><a href="/post">New Tweet</a></li>
                </ul>
            </footer>
		`;
	}
}

customElements.define('twit-footer', TwitFooter);