import { LitElement, html, css } from 'lit-element';
import "../layout/navigation/twit-header.js";
import "../layout/navigation/twit-footer.js";
import "../layout/blocs/twit-new.js";

class TwitPost extends LitElement {

    constructor() {
        super();
        this.user = {};
    }

    static get properties() {
        return {
            user: Object
        };
    }
    
    render() {
        return html`
            <twit-header></twit-header>
            <twit-new author="${this.user.uid}"></twit-new>
            <twit-footer></twit-footer>
       `;
    }
}

customElements.define('twit-post', TwitPost);