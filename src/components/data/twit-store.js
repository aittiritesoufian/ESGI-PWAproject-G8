import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';

class TwitStore extends LitElement {
    constructor(){
        super();
        this.tweet = "";
        this.data = [];
        this.collection = '';
    }

    static get properties(){
        return {
            tweet_id: String,
            data: {
                type: Array
            },
            collection: String
        };
    }

    firstUpdated(){
        firebase.initializeApp(document.config);
        this.firestore = firebase.firestore().collection(this.collection).orderBy('date','asc').onSnapshot(ref => {
            ref.docChanges().forEach( change => {
                const { newIndex, oldIndex, doc, type } = change;

                if(type == "added") {
                    this.tweet_id = doc.id ? doc.id : "";
                    this.data = [...this.data, { id: this.tweet_id } ];
                    this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
                } else if( type == 'removed') {
                    this.data.splice(oldIndex, 1);
                    this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
                }
            })
        });
    }
}

customElements.define('twit-store', TwitStore);