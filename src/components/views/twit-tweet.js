import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import "../layout/navigation/twit-header.js";
import "../layout/navigation/twit-footer.js";
import "../layout/blocs/twit-element";
import "../layout/blocs/twit-comments";

class TwitTweet extends LitElement {

    constructor(){
        super();
        this.tweet = {};
        this.author = {};
    }

    static get properties() {
        return {
            tweet: Object,
            author: Object
        };
    }

    firstUpdated() {
        
        firebase.firestore().collection("tweets").doc(this.location.params.id).get().then(doc => {
            if (doc.exists) {
                this.tweet = doc.data();
                this.tweet.id = doc.id ? doc.id : null;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such tweet!");
                this.tweet = {
                    id: null
                };
            }
        }).catch(function (error) {
            console.log("Error getting Tweet:", error);
        });
    }

    render() {
        return html`
            <twit-header></twit-header>
            <twit-element .tweet="${this.tweet}"></twit-element>
            <twit-comments tweet_id="${this.tweet.id}"></twit-comments>
            <twit-footer></twit-footer>
       `;
    }
}

customElements.define('twit-tweet', TwitTweet);