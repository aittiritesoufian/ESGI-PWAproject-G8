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

    static get styles() {
        return css`
            :root > .leaving {
                animation: 1s fadeOut ease-in-out;
            }
            :root > .entering {
                animation: 1s fadeIn linear;
            }
        `;
    }
    
    initRouter() {
        const outlet = document.getElementById('outlet');
        const router = new Router(outlet);
        router.setRoutes([
            {
                path: '/',
                component: 'twit-home'
            },
            {
                path: '/profil',
                children: [
                    { path: '/', component: 'twit-profile' },
                    { path: '/:slug', component: 'twit-profile' }
                ]
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
        this.initRouter();
        document.addEventListener('connection-changed', ({ detail }) => {
            this.connection = detail;
        });
        document.addEventListener('user-logged', (event) => {
            this.user = event.detail.user;
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
                    if (window.location.pathname != "/"){
                        window.location.replace('/');
                    }
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
        return html`
        `;
    }
}

customElements.define('twit-app', TwitApp);