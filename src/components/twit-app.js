import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import firebase from 'firebase/app';
import "./views/twit-home.js";
import "./views/twit-profile.js";
import "./views/twit-post.js";

class TwitApp extends LitElement {
    
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