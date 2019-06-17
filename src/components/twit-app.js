import { LitElement, html, css } from 'lit-element';
import "./layout/navigation/twit-header.js";
import "./layout/navigation/twit-footer.js";
import "./data/twit-store.js";
import "./data/twit-auth.js";
import "./data/twit-login.js";

import firebase from "firebase/app";

class TwitApp extends LitElement {

	constructor(){
        super();
        this.user = {};
        this.logged = false;
        this.tweet = {
            content: ""
        };
        this.tweets = [];
        this.tab = "home";
    }

    static get styles() {
        return css `
        :host {
            display: block;
        }
        * {  box-sizing: border-box }
        footer {
            position: fixed;
            bottom: 0;
            width: 100%;
        }
        footer form {
            display: flex;
            justify-content: space-between;
            background-color: #ffffff;
            padding: 0.5rem 1rem;
            width: 100%;
        }
        footer form input {
            width: 100%;
        }
        .own {
            text-align:right;
        }
        ul {
            position: relative;
            display: flex;
            flex-direction: column;
            list-style: none;
            padding: 0;
            margin: 0;
            margin-bottom: 3em;
        }

        ul li {
            display: block;
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
            background-color: #cecece;
            border-radius: 0 30px 30px 0;
            width: 70%;
        }
        ul li.own {
            align-self: flex-end;
            text-align: right;
            background-color: #16a7f1;
            color: #ffffff;
            border-radius: 30px 0 0 30px;
        }
        `;
    }

    static get properties(){
        return {
            unresolved: {
                type:Boolean,
                reflect: true,
            },
            user: Object,
            logged: Boolean,
            tweet: Object,
            tweets: {
                type: Array
            },
            tab: String
        };
    }

    firstUpdated(){
        this.unresolved = false;
        this.logged = localStorage.getItem('logged') == "true" ? true : false;
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    addUser(e){
        this.users = e.detail;
    }

    addTweet(e){
        this.tweets = e.detail;
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0);
    }

    handleLogin(e){
        this.user = e.detail.user;
        this.logged = true;
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0);

        // if (Notification.permission === 'granted') {
        //     navigator.serviceWorker.ready
        //     .then(registration => {
        //         registration.pushManager.subscribe({
        //             userVisibleOnly: true,
        //             applicationServerKey: this.urlBase64ToUint8Array(document.config.publicKey)
        //         }).then(async subscribtion => {
        //             subscribtion.id = this.user.uid;
        //             await fetch('http://localhost:8085/subscribe', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                 },
        //                 body: JSON.stringify(subscribtion)
        //             })
        //         });
        //     });
        // }
    }

    handleTweet(e){
        e.preventDefault();
        if(this.tweet == {}) return;
        const database  = firebase.firestore();
        database.collection('tweets').add({
            content: this.tweet,
            date: new Date().getTime(),
            user: this.user.uid,
            email: this.user.email
        });
        this.tweet = {};
    }

    getDate(timestamp) {
        const date = new Date(timestamp);
       // Hours part from the timestamp
       const hours = date.getHours();
       // Minutes part from the timestamp
       const minutes = "0" + date.getMinutes();
       // Seconds part from the timestamp
       const seconds = "0" + date.getSeconds();

       // Will display time in 10:30:23 format
       return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
   }

   subscribe() {
        if (('serviceWorker' in navigator) || ('PushManager' in window)) {
           Notification.requestPermission()
           .then(function(result) {
               if (result === 'denied') {
                   console.log('Permission wasn\'t granted. Allow a retry.');
                   return;
               }
               if (result === 'default') {
                   console.log('The permission request was dismissed.');
                   return;
               }
               console.log('Notification granted', result);
         // Do something with the granted permission.
        });
       }
   }

   render(){
       return html`
       <twit-store
       collection="tweets"
       @child-changed="${this.addTweet}"></twit-store>
       <section>
       <slot name="header"></slot>
       ${
            !this.logged ? html`
                <twit-auth></twit-auth>
                <twit-login
                @user-logged="${this.handleLogin}">
                </twit-login>
            ` : (this.tab == "home") ? html `
                <h1>Hi, ${this.user.email}</h1>
                <button @click="${this.subscribe}">Subscribe</button>
                <h1>Tweets: </h1>
                <ul>
                ${this.tweets.map(tweet => html`
                    <li class="${tweet.user == this.user.uid ? 'own' : ''}"><strong>${tweet.email} Said :</strong>
                    ${tweet.content} - ${this.getDate(tweet.date)}
                    </li>`)}
                </ul>
                <footer>
                <form @submit='${this.handleTweet}'>
                <input type="text" placeholder="Post a new tweet..."
                .value="${this.tweet.content}"
                @input="${e => this.tweet = e.target.value}">
                <button type="submit">Send</button>
                </form>
                </footer>
            ` : html ``
       }
       <slot name="footer" tab="${this.tab}"></slot>
       </section>
       `;
   }
}

customElements.define('twit-app', TwitApp);