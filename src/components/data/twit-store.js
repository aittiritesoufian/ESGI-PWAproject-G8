import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
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
            connection: Boolean
        };
    }

    firstUpdated() {
        document.addEventListener('connection-changed', ({ detail }) => {
            this.connection = detail;
            console.log("last connection for store : " + this.connection);
        });
        checkConnectivity();
        
        if (this.connection) {
            console.log("connection to store");
            this.firestore = firebase.firestore().collection(this.collection).orderBy('date', 'asc').onSnapshot(ref => {
                ref.docChanges().forEach(async change => {
                    const { newIndex, oldIndex, doc, type } = change;

                    if (type == "added") {
                        this.tweet = doc.data();
                        this.tweet.id = doc.id ? doc.id : "";
                        if (this.tweet.author != undefined && typeof (this.tweet.author) != "object") {
                            firebase.firestore().collection("users").doc(this.tweet.author).get().then(doc2 => {
                                if (doc2.exists) {
                                    this.author = doc2.data();
                                    this.author.id = doc2.id ? doc2.id : "";
                                }
                            }).catch(function (error) {
                                console.log("Error getting Author:", error);
                            });
                            this.tweet.author = this.author;
                        } else {
                            console.log('no author for tweet number : ' + this.tweet.id);
                        }
                        this.data = [...this.data, this.tweet];
                        const database = await openDB('twitbook', 1, {
                            upgrade(db) {
                                db.createObjectStore('tweets');
                            }
                        });
                        this.tweet.status = 0;
                        this.data.map(async tweet => {
                            await database.put('tweets', tweet, tweet.id);
                        });
                        // sync();
                        this.dispatchEvent(new CustomEvent('newtweets', { detail: this.data }));
                    } else if (type == 'removed') {
                        this.data.splice(oldIndex, 1);
                        this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
                    }
                })
            });
            document.dispatchEvent(new CustomEvent('sync'));
        } else {
            
            console.log("no connexion on store");
        }
        
    }
}

customElements.define('twit-store', TwitStore);