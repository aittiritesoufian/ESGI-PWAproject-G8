((document, window) => {
    import { Router } from '@vaadin/router';
    import "./views/twit-home.js";
    import "./views/twit-profile.js";
    import "./views/twit-post.js";
    
    window.addEventListener('load', () => {
        initRouter();
    });

    function initRouter() {
        const router = new Router(document.querySelector("main"));
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
})(document, window);

