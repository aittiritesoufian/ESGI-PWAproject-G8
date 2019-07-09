import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import "./views/twit-home.js";
import "./views/twit-profile.js";
import "./views/twit-post.js";

class TwitApp extends LitElement {
    
    initRouter() {
        const router = new Router(document.querySelector(this));
        router.setRoutes([
            {
                path: '/',
                component: 'twit-home'
            },
            {
                path: '/profile',
                component: 'twit-profile'
            },
            {
                path: '/post',
                component: 'twit-post'
            }
            // {
            //     path: '(.*)',
            //     component: 'not-found-view',
            //     action: () =>
            //         import(/* webpackChunkName: "not-found-view" */ './views/not-found-view')
            // }
        ]);
    }

    render() {
        window.addEventListener('load', () => {
            this.initRouter();
        });
    }
}

customElements.define('twit-app', TwitApp);