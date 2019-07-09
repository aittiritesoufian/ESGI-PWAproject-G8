import { LitElement, html, css } from 'lit-element';
import "../layout/navigation/twit-header.js";
import "../layout/navigation/twit-footer.js";
import "../layout/blocs/twit-new.js";

class TwitPost extends LitElement {
    
    render() {
        return html`
            <twit-header></twit-header>
            <twit-new></twit-new>
            <twit-footer></twit-footer>
       `;
    }
}

customElements.define('twit-post', TwitPost);