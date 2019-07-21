import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import firebase from 'firebase/app';
import "./views/twit-home.js";
import "./views/twit-profile.js";
import "./views/twit-post.js";
import "./views/twit-tweet.js";
import checkConnectivity from './system/connectivity.js';
import { openDB } from '/node_modules/idb/build/esm/index.js';
// import sync from './data/twit-sync.js';

class TwitApp extends LitElement {

    constructor() {
        super();
        this.connection = false;
        this.user = {};
    }

    static get properties() {
        return {
            connection: Boolean,
            user: Object
        };
    }

    async twitSync() {
        console.log("sync start");
        if (this.connection === true) {
            console.log('sync running');
            const localbase = await openDB('twitbook', 1, {
                upgrade(db) {
                    db.createObjectStore('tweets');
                }
            });

            const keys = await localbase.getAllKeys('tweets');
            // console.log(keys);
            let tweets = [];
            for (var i = keys.length - 1; i >= 0; i--) {
                tweets.push(await localbase.get('tweets', keys[i]));
            }
            // console.log(tweets);

            for (var j = tweets.length - 1; j >= 0; j--) {
                // console.log('loop starting');
                // console.log(tweets[j]);
                let idTweet = tweets[j]['id'];
                //delete
                if (tweets[j]['status'] == -2) {
                    //delete on remote

                }
                //add on remote
                else if (tweets[j]['status'] == 1) {
                    //delete unnecessary field
                    delete tweets[j]['status'];
                    delete tweets[j]['id'];
                    tweets[j]['author'] = this.user.uid;
                    const database = firebase.firestore();
                    //send to remote
                    database.collection('tweets').add(tweets[j]);
                    //remove local temporary version
                    await localbase.delete("tweets", idTweet);

                } else if (tweets[j]['status'] == 2) {
                    //sync from remote
                    firebase.firestore().collection("tweets").doc(idTweet).get().then(async doc => {
                        if (doc.exists) {
                            let tweet = doc.data();
                            if (tweet.author != undefined && typeof (tweet.author) != "object"){
                                let author = await firebase.firestore().collection("users").doc(doc.data().author).get().then(doc2 => {
                                    if (doc2.exists) {
                                        return doc2.data();
                                    }
                                }).catch(function (error) {
                                    console.log("Error getting Author:", error);
                                });
                                tweet.author = await author;
                                tweet.author.id = doc.data().author;
                            }
                            tweet.status = 0;
                            tweet.id = idTweet;
                            await localbase.put('tweets', tweet, tweet.id);
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch(function (error) {
                        console.log("Error getting Tweet:", error);
                    });
                }
            }
        }
    }
    
    initRouter() {
        const router = new Router(this.shadowRoot);
        router.setRoutes([
            {
                path: '/',
                component: 'twit-home'
            },
            {
                path: '/profil',
                component: 'twit-profile'
            },
            {
                path: '/post',
                component: 'twit-post'
            },
            {
                path: '/tweet/:id',
                component: 'twit-tweet'
            }
            // {
            //     path: '(.*)',
            //     component: 'not-found-view',
            //     action: () =>
            //         import(/* webpackChunkName: "not-found-view" */ './views/not-found-view')
            // }
        ]);
    }

    firstUpdated() {
        document.addEventListener('connection-changed', ({ detail }) => {
            this.connection = detail;
        });
        document.addEventListener('user-logged', (event) => {
            this.user = event.detail.user;
        });
        document.addEventListener('sync', () => {
            console.log('event listener sync called');
            this.twitSync();
        });
        checkConnectivity();
        if (this.connection) {
            console.log('online');
            firebase.initializeApp(document.config);
            firebase.firestore().settings({
                cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
            });
            firebase.firestore().enablePersistence();
            firebase.auth().onAuthStateChanged(user => {
                if (!user) {
                    localStorage.setItem('logged', false);
                    return console.log('logged out');
                };
                localStorage.setItem('logged', true);
                document.dispatchEvent(new CustomEvent("user-logged", { detail: { user } }));
                return console.log('logged');
            });
        } else {
            // TODO : Offline homepage !
            console.log('Offline');
        }
    }

    render() {
        window.addEventListener('load', () => {
            this.initRouter();
        });
        return html`
        `;
    }
}

customElements.define('twit-app', TwitApp);