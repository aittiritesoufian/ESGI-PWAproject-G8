import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import firebase from 'firebase/app';
import "./views/twit-home.js";
import "./views/twit-profile.js";
import "./views/twit-post.js";
import checkConnectivity from './system/connectivity.js';
import sync from './data/twit-sync.js';

class TwitApp extends LitElement {

    constructor() {
        super();
        this.connection = false;
    }

    static get properties() {
        return {
            connection: Boolean
        };
    }
    
    initRouter() {
        const router = new Router(this.shadowRoot);
        router.setRoutes([
            {
                path: '/',
                component: 'twit-home',
                action: () => import("./views/twit-home.js")
            },
            {
                path: '/profil',
                component: 'twit-profile',
                action: () => import("./views/twit-profile.js")
            },
            {
                path: '/post',
                component: 'twit-post',
                action: () => import("./views/twit-post.js")
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
        sync();
        checkConnectivity();
        if (this.connection) {
            console.log('online');
            firebase.initializeApp(document.config);
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