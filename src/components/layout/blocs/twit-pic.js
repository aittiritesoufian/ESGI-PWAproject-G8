import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

class TwitPic extends LitElement {

    constructor() {
        super();
        this.ref = "";
        this.file = "";
        this.class = "";
    }

    static get properties() {
        return {
            ref: String,
            file: String,
            class: String
        };
    }

    static get styles() {
        return css`
            :host {
                display: block;
                position:relative;
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
            <img class="${this.class ? this.class : ''}" src="${this.file}" />
		`;
    }
}

customElements.define('twit-pic', TwitPic);