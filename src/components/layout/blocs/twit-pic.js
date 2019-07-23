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
        this.placeholder = "";
    }

    static get properties() {
        return {
            ref: String,
            file: String,
            class: String,
            placeholder: String
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
            .placeholder {
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }
            /**
                * Persist animation using : animation-fill-mode set to forward 
                * @see https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode
                */
            .fade {
                -webkit-animation: fadeout 2s forwards; /* Safari and Chrome */
                -moz-animation: fadeout 2s forwards; /* Firefox */
                -ms-animation: fadeout 2s forwards; /* Internet Explorer */
                -o-animation: fadeout 2s forwards; /* Opera */
                animation: fadeout 2s forwards;
            }
            /* Key frame animation */
            @keyframes fadeout {
                from { opacity: 1; }
                to   { opacity: 0; }
            }
            /* Firefox */
            @-moz-keyframes fadeout {
                from { opacity: 1; }
                to   { opacity: 0; }
            }
            /* Safari and Chrome */
            @-webkit-keyframes fadeout {
                from { opacity: 1; }
                to   { opacity: 0; }
            }
        `;
    }

    firstUpdated() {
        this.shadowRoot.querySelector('img')
            .addEventListener('load', () => {
                this.shadowRoot
                    .querySelector('.placeholder')
                    .classList.add('fade');
            });
    }

    render() {
        if (this.ref) {
            const firestorage = firebase.storage();
            firestorage.ref(this.ref).getDownloadURL().then((url) => {
                this.file = url;
                let img = this.shadowRoot.getElementById('myimg');
                img.src = url;
            }).catch((error) => {
                console.log("Error on getting image", error)
            });
            //metadata
            let newMetadata = {
                cacheControl: 'public,max-age=3153600'
            }
            firestorage.ref(this.ref).updateMetadata(newMetadata).then(function (metadata) {
                console.log("cache metadata updated");
            }).catch(function (error) {
                console.log("error on cache metadata update : ",error);
            });
        }
        return html`
        <style>
        .placeholder {
          background-image: url("${this.placeholder}");
        }
        </style>
            <div class="placeholder"></div>
            <img id="myimg" class="${this.class ? this.class : ''}" src="" />
		`;
    }
}

customElements.define('twit-pic', TwitPic);