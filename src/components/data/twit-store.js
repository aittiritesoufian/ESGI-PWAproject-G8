import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import checkConnectivity from '../system/connectivity.js';
import { openDB } from '/node_modules/idb/build/esm/index.js';
// import sync from '../data/twit-sync.js';

class TwitStore extends LitElement {
    constructor(){
        super();
        this.tweet = {};
        this.data = [];
        this.collection = '';
        this.connection = false;
        this.previousConnection = false;
        this.author = {};
    }

    static get properties(){
        return {
            tweet: Object,
            tweet_id: String,
            author: Object,
            data: {
                type: Array
            },
            collection: String,
            connection: Boolean,
            previousConnection: Boolean
        };
    }

    async firstUpdated() {
        document.addEventListener('connection-changed', ({ detail }) => {
            this.previousConnection = this.connection;
            this.connection = detail;
            console.log("last connection for store : " + this.connection);
        });
        //get tweets
        this.data = [];
        let user = firebase.auth().currentUser;
        console.log("current user : ");
        console.log(user);
        firebase.firestore().collection(this.collection).orderBy('date', 'desc').onSnapshot({ includeMetadataChanges: true },ref => {
            ref.docChanges().forEach(async change => {
                const { newIndex, oldIndex, doc, type } = change;
                if (type == "added") {
                    console.log("update with added");
                    this.tweet = doc.data();
                    this.tweet.id = doc.id ? doc.id : "";
                    this.tweet.status = 0;
                    if (this.tweet.author != undefined && typeof (this.tweet.author) != "object" && this.tweet.author != "") {
                        firebase.firestore().collection("users").doc(this.tweet.author).get().then(async doc2 => {
                            if (doc2.exists) {
                                this.author = doc2.data();
                                // await database.put("users", this.author, doc2.id);
                            }
                        }).catch(function (error) {
                            console.log("Error getting Author:", error);
                        });
                    } else {
                        console.log('no author for tweet number : ' + this.tweet.id);
                    }
                    this.data = [...this.data, this.tweet];
                    this.dispatchEvent(new CustomEvent('listTweets', { detail: this.data }));
                } else if (type == "modified") {
                    console.log("update with modifications");
                    this.tweet = doc.data();
                    this.tweet.id = doc.id ? doc.id : "";
                    this.data.splice(oldIndex, 1, this.tweet);
                    this.dispatchEvent(new CustomEvent('listTweets', { detail: this.data }));
                } else if (type == 'removed') {
                    console.log(doc.id + " deleted!");
                    console.log("update with deletions");
                    this.data.splice(oldIndex, 1);
                    this.dispatchEvent(new CustomEvent('listTweets', { detail: this.data }));
                }
            })
        });
    }
}

customElements.define('twit-store', TwitStore);