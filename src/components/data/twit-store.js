import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';

class TwitStore extends LitElement {
    constructor(){
        super();
        this.tweet = {};
        this.data = [];
        this.collection = '';
    }

    static get properties(){
        return {
            tweet: Object,
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
                    this.tweet.id = doc.data().id ? doc.data().id : "";
                    this.tweet.content = doc.data().content ? doc.data().content : "";
                    this.tweet.tweetReference = doc.data().content ? doc.data().content : "";
                    this.tweet.date = doc.data().date ? doc.data().date : "";
                    this.tweet.author = doc.data().author ? doc.data().author : "";
                    this.tweet.attach = doc.data().attach ? doc.data().attach : "";
                    this.tweet.likes = doc.data().likes ? doc.data().likes : "";
                    this.tweet.comments = doc.data().comments ? doc.data().comments : "";
                    this.data = [...this.data, this.tweet ];
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