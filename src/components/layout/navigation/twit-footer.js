import { LitElement, html, css } from 'lit-element';
import 'fa-icons';

class TwitFooter extends LitElement {

	constructor(){
        super();
        this.tab = "";
        this.color = "#eeeeee";
        this.size = "1.5em";
    }

   /* firstUpdated() {

        document.addEventListener('connection-changed', ({detail}) => {
            this.color = "#00BFFF";
        });

    }
*/
    static get properties(){
        return {
            tab: String,
            color: String,
            size: String
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
                border-top:solid 1px #eeeeee;
                background-color: #fff;
                box-shadow: 0px -1px 3px -2px black;
                justify-content: center;
            }
            
            footer > ul {
                display: flex;
                justify-content: center;
                align-items: unsafe center;
                flex-wrap: wrap;
            }
            
            #icon-home{
                size:2em;
            }
            footer > ul > li {
                float: left;
                padding : 0px 8%;
                flex-grow:1;
                display: inline-block;
                
            }
            @media screen and (min-width: 900px){
                footer {
                    height:5%;
                }
                footer > ul > li {
                
                padding : 0px 10%;
                
                
            }
            }
        `;
    }

	render(){
		return html`
			<footer>
                <ul>
                    <li><a href="/"><fa-icon id="icon-home" class="fas fa-home" color=${this.color} size=${this.size}></fa-icon></a></li>
                    <li><a href="/profil"><fa-icon id="icon-user" class="fas fa-user" color=${this.color} size=${this.size}></fa-icon></a></li>
                    <li><a href="/post"><fa-icon id="icon-add" class="fas fa-plus-circle" color=${this.color} size=${this.size}></fa-icon></a></li>
                </ul>
            </footer>
		`;
	}
}

customElements.define('twit-footer', TwitFooter);