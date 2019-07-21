import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import "./twit-pic.js";
import "./twit-element";
import "./twit-new.js";
import 'fa-icons';

class TwitComments extends LitElement {

	constructor(){
        super();
        this.tweet_id = "";
        this.tweets = [];
        this.tweet = {};
        this.style = {
            color: "#2d2d2d",
            size: "1.5em"
        };
        this.modal = false;
    }

    static get styles() {
        return css`
            :root {
                background-color:#ccc;
                display: flex;
                flex-wrap: wrap;
                align-items: stretch;
            }
            div.modal {
                width: 90%;
                margin-left: 5%;
                margin-top:10%;
                padding:10px;
                z-index:99;
            }
            div.replies {
                width: 80%;
                margin-left: 10%;
            }
            h2 {
                font-style: italic;
                color:#4E4E4E;
                font-size: 12px;
                display: inline-block;
            }
            button {
                border-radius: 5px;
                border: 0px;
                padding:5px 10px;
                background-color: blue;
                color:#fff;
            }
            button:hover {
                background-color: lightblue;
            }
            button:focus {
                background-color: lightblue;
            }
            .close {
                text-align:center;
            }
        `;
    }
    
    static get properties(){
        return {
            tweet_id: String,
            style: Object,
            tweet: Object,
            tweets: {
                type: Array
            },
            modal: Boolean
        };
    }

    firstUpdated(){
        if(this.tweet_id){
            firebase.firestore().collection('tweets').where('reply_to', '==', this.tweet_id).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.exists){
                        console.log(doc);
                        this.tweet = doc.data();
                        this.tweet.id = doc.id ? doc.id : null;
                        this.tweets = [...this.tweets, this.tweet];
                    } else {
                        // console.log('no doc !!!');
                    }
                })
            }).catch((error) => {
                console.log('error on comments');
                console.log(error);
            });
        }
    }

    showModal(e){
        this.modal = true;
    }

    closeModal(e){
        this.modal = false;
    }

	render(){
        return html`
        <div class="replies">
            ${this.modal ? html`
                <div class="modal">
                    <fa-icon id="icon-home" class="far fa-times-circle close" color="#4E4E4E" size="1.5em" @click="${this.closeModal}">X</fa-icon>
                    <twit-new .reply_to="${this.tweet_id}"></twit-new>
                </div>
            ` : html`
                <button @click="${this.showModal}">+ Commenter</button>
            `
            }
            <h2>Réponses au tweet</h2>
            ${this.tweets.map(tweet => html`
                <twit-element .tweet="${tweet}"></twit-element>
            `)}
        </div>
        `;
	}
}

customElements.define('twit-comments', TwitComments);