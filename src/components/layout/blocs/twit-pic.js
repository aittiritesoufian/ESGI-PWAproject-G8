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

    firstUpdated() {
        if (this.slug) {
            const firestorage = firebase.storage();
            firestorage.child(this.ref).getDownloadURL().then(function (url) {
                this.file = url;
            }).catch(function (error) {
                console.log("Error on getting image", error)
            });
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            * {  box-sizing: border-box }
        `;
    }

    render() {
        return html`
            <a href="${this.file}">
                <img src="${this.file}" />
            </a>
		`;
    }
}

customElements.define('twit-pic', TwitPic);