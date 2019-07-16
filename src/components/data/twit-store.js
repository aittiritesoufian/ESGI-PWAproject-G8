import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import checkConnectivity from '../system/connectivity.js';
import { openDB } from '/node_modules/idb/build/esm/index.js';

class TwitStore extends LitElement {
    constructor(){
        super();
        this.tweet = "";
        this.data = [];
        this.collection = '';
        this.connection = false;
    }

    static get properties(){
        return {
            tweet_id: String,
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
            console.log("last connection for sync status : " + this.connection);
        });
        checkConnectivity();
        
        if (this.connection) {
            console.log("connection to store");
            this.firestore = firebase.firestore().collection(this.collection).orderBy('date', 'asc').onSnapshot(ref => {
                ref.docChanges().forEach(async change => {
                    const { newIndex, oldIndex, doc, type } = change;

                    if (type == "added") {
                        this.tweet_id = doc.id ? doc.id : "";
                        this.data = [...this.data, { id: this.tweet_id }];
                        const database = await openDB('twitbook', 1, {
                            upgrade(db) {
                                db.createObjectStore('tweets');
                            }
                        });
                        this.data.map(async tweet => {
                            await database.put('tweets', {"status":2, "id":tweet.id}, tweet.id);
                        })
                        this.dispatchEvent(new CustomEvent('newtweets', { detail: this.data }));
                    } else if (type == 'removed') {
                        this.data.splice(oldIndex, 1);
                        this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
                    }
                })
            });
        } else {
            console.log("no connexion on store");
        }
        
    }
}

customElements.define('twit-store', TwitStore);