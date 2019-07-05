import { LitElement, html, css } from 'lit-element';
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
            <twit-new author="${this.user.uid}"></twit-new>
       `;
    }
}

customElements.define('twit-post', TwitPost);