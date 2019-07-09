import { LitElement, html, css } from 'lit-element';
import "../layout/navigation/twit-header.js";
import "../layout/navigation/twit-footer.js";

class TwitProfile extends LitElement {
    
    render() {
        return html`
            <twit-header></twit-header>
            <twit-footer></twit-footer>
       `;
    }
}

customElements.define('twit-profile', TwitProfile);