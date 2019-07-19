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
            if(this.connection == true && this.previousConnection == false){
                this.firstUpdated();
            }
        });
        const database = await openDB('twitbook', 1, {
            upgrade(db) {
                db.createObjectStore('tweets');
                db.createObjectStore('users');
            }
        });
        
        // if (this.connection) {
            // console.log("connection to store");
            this.data = [];
        this.firestore = firebase.firestore().collection(this.collection).orderBy('date', 'asc').onSnapshot({ includeMetadataChanges: true },ref => {
                ref.docChanges().forEach(async change => {
                    const { newIndex, oldIndex, doc, type } = change;
                    if (type == "added" || type == "updated") {
                        this.tweet = doc.data();
                        this.tweet.id = doc.id ? doc.id : "";
                        this.tweet.status = 0;
                        if (this.tweet.author != undefined && typeof (this.tweet.author) != "object" && this.tweet.author != "") {
                            firebase.firestore().collection("users").doc(this.tweet.author).get().then(async doc2 => {
                                if (doc2.exists) {
                                    this.author = doc2.data();
                                    await database.put("users", this.author, doc2.id);
                                }
                            }).catch(function (error) {
                                console.log("Error getting Author:", error);
                            });
                        } else {
                            console.log('no author for tweet number : ' + this.id);
                        }
                        this.data = [...this.data, this.tweet];
                        // console.log(this.tweet);
                        this.data.map(async tweet => {
                            // console.log('tweet save '+tweet.id);
                            await database.put('tweets', tweet, tweet.id);
                        });
                        // sync();
                        // document.dispatchEvent(new CustomEvent('sync'));
                        this.dispatchEvent(new CustomEvent('newtweets', { detail: this.data }));
                    } else if (type == 'removed') {
                        console.log(doc.id);
                        console.log("deleted from IDB ");
                        // this.data.splice(oldIndex, 1);
                        await database.delete('tweets', doc.id);
                        // this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
                    }
                })
            });
            document.dispatchEvent(new CustomEvent('sync'));
        // } else {
        //     console.log("no connexion on store");
        //     const keys = await database.getAllKeys('tweets');
        //     // console.log(keys);
        //     for (var i = keys.length - 1; i >= 0; i--) {
        //         this.data = [...this.data, await database.get('tweets', keys[i])];
        //     }
        //     this.dispatchEvent(new CustomEvent('newtweets', { detail: this.data }));
        // }
        
    }
}

customElements.define('twit-store', TwitStore);