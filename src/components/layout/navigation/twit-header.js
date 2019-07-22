import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'fa-icons';

class TwitHeader extends LitElement {

	constructor(){
        super();
        this.user = {};
    }

    static get properties(){
        return {
            user:Object
        }
    }

    static get styles(){
        return css`
            :host {
                display: block;
                background-color: #fff;
                border-bottom:solid 1px #eeeeee;
            }
            header {
                justify-content: space-between;
                flex-direction: row;
                align-items: center;
                display: flex;
                padding: 5px 25px;
            }
            img{
                display: block;
                height: 48px;
                width: 48px;
            }
            fa-icon {
                cursor: pointer;
            }
        `;
    }

    firstUpdated(){
        if (firebase.auth().currentUser){
            this.user = firebase.auth().currentUser;
        }
    }

    handleLogout(e) {
        firebase.auth().signOut().then((res) => {
            console.log('Logout successful');
            localStorage.setItem('logged', false);
            window.location.replace('/');
        }).catch(function (error) {
            console.log('error on logout');
            console.log(error);
        });
    }

    handleSearch(e) {
        console.log('search');
    }

	render(){
		return html`
			<header slot="header">
                ${this.user.uid ? html`<fa-icon id="icon-logout" @click="${this.handleLogout}" class="fas fa-power-off" color="#00BFFF" size="30px"></fa-icon>` : html`<span></span>`}
                <img src="/src/assets/images/1f680.png" alt="">
                ${this.user.uid ? html`<fa-icon id="icon-search" @click="${this.handleSearch}" class="fas fa-search" color="#00BFFF" size="30px"></fa-icon>` : html`<span></span>`}
            </header>
		`;
	}
}

customElements.define('twit-header', TwitHeader);