import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

class TwitPic extends LitElement {

    constructor() {
        super();
        this.ref = "";
        this.file = "";
    }

    static get properties() {
        return {
            ref: String,
            file: String
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            * {  box-sizing: border-box }
            img {
                width:100%;
            }
        `;
    }

    render() {
        if (this.ref) {
            const firestorage = firebase.storage();
            firestorage.ref(this.ref).getDownloadURL().then((url) => {
                this.file = url;
            }).catch((error) => {
                console.log("Error on getting image", error)
            });
        }
        return html`
            <a href="${this.file}">
                <img src="${this.file}" />
            </a>
		`;
    }
}

customElements.define('twit-pic', TwitPic);