import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import "./twit-button.js";

class TwitElement extends LitElement {

	constructor(){
        super();
        this.id = "";
        // this.content = "";
        // this.tweetReference = "";
        // this.date = "";
        this.author = {};
        // this.attach = 0;
        // this.likes = [];
        // this.comments = 0;
        this.tweet = {};
    }
    
    static get properties(){
        return {
            id: String,
            // content: String,
            // tweetReference: String,
            // date: Date,
            author: Object,
            // attach: boolean,
            // likes: {
            //     type: Array
            // },
            // comments: Number,
            tweet: Object
        };
    }

    firstUpdated(){
        // console.log('init a tweet');
        if(this.id){
            firebase.firestore().collection("tweets").doc(this.id).get().then(doc => {
                if (doc.exists) {
                    this.tweet = doc.data();
                    firebase.firestore().collection("users").doc(this.tweet.author).get().then(doc2 => {
                        if (doc2.exists) {
                            this.author = doc2.data();
                        }
                    }).catch(function (error) {
                        console.log("Error getting Author:", error);
                    });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting Tweet:", error);
            });
        }
    }

    handleLike(e) {
        // TODO: add a like to the current tweet
    }

    handleRetweet(e) {
        // TODO: publish a new tweet with tweetReference in place of content
    }

    handleComment(e) {
        // TODO: print a component comment to let user add comment to this tweet
    }

    static get styles(){
        return css`
            :host {

            }
        `;
    }

	render(){
		return html`
                <header>
                    <a href="/profil/${this.author.slug}">
                        <img src="${this.author.avatar}" />
                        <h1>${this.author.name}</h1>
                    </a>
                </header>
                <main>
                    ${
                        this.tweet.content !== "" ? html`
                            <p>${this.tweet.content}</p>
                        `: html`
                            <twit-element id="${this.tweet.tweetReference}"></twit-element>
                        `
                    }
                </main>
                <footer>
                    <twit-button @click="${this.handleLike}" class="like"></twit-button>
                    <twit-button @click="${this.handleRetweet}" class="retweet"></twit-button>
                    <twit-button @click="${this.handleComment}" class="comment"></twit-button>
                </footer>
		`;
	}
}

customElements.define('twit-element', TwitElement);