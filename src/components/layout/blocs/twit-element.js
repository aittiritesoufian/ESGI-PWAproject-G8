import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import "./twit-button.js";
import "./twit-pic.js";

class TwitElement extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.tweet = {};
        this.author = {};
    }
    
    static get properties(){
        return {
            id: String,
            tweet: Object,
            author: Object
        };
    }

    firstUpdated(){
        console.log("on Element");
        if(this.id){
            console.log("on Element by ID");
            firebase.firestore().collection("tweets").doc(this.id).get().then(doc => {
                if (doc.exists) {
                    this.tweet = doc.data();
                    if (this.tweet.author != undefined && typeof(this.tweet.author) != "object") {
                        firebase.firestore().collection("users").doc(this.tweet.author).get().then(doc2 => {
                            if (doc2.exists) {
                                this.author = doc2.data();
                            }
                        }).catch(function (error) {
                            console.log("Error getting Author:", error);
                        });
                    } else {
                        console.log('no author for tweet number : ' + this.id);
                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting Tweet:", error);
            });
        } else {
            console.log("not on Element by ID");
            console.log(this.tweet);
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

	render(){
		return html`
<<<<<<< HEAD
                <div style="padding: 30px; border-top: 1px solid #f1f1f1; border-bottom: 1px solid #f1f1f1">
                    <header>
                        <a href="/profil/${this.author.slug}" style="text-decoration: none">
                            <img src="${this.author.avatar}" />
                            <h1 style="color: #1e79d2; font-size: 1.2rem;">${this.author.name}</h1>
                        </a>
                    </header>
                    <main>
                        ${
                            this.tweet.content !== "" ? html`
                                <p style="color: #626262;">${this.tweet.content}</p>
                            `: html`
                                <twit-element id="${this.tweet.tweetReference}"></twit-element>
                            `
                        }
                        ${
                            this.tweet.attachment ? html`
                                <twit-pic ref="${this.tweet.attachment}"></twit-pic>
                            ` : ""
                        }
                    </main>
                    <footer>
                        <twit-button @click="${this.handleLike}" class="like">
                            <svg height="15px" width="15px" fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="heart"><rect width="24" height="24" opacity="0"/><path d="M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21zM7.22 6a3.2 3.2 0 0 0-2.28.94 3.24 3.24 0 0 0 0 4.57L12 18.58l7.06-7.07a3.24 3.24 0 0 0 0-4.57 3.32 3.32 0 0 0-4.56 0l-1.79 1.8a1 1 0 0 1-1.42 0L9.5 6.94A3.2 3.2 0 0 0 7.22 6z"/></g></g></svg>
                        </twit-button>
                        <twit-button @click="${this.handleRetweet}" class="retweet">
                            <svg height="15px" width="15px" fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="repeat"><rect width="24" height="24" opacity="0"/><path d="M17.91 5h-12l1.3-1.29a1 1 0 0 0-1.42-1.42l-3 3a1 1 0 0 0 0 1.42l3 3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42L5.91 7h12a1.56 1.56 0 0 1 1.59 1.53V11a1 1 0 0 0 2 0V8.53A3.56 3.56 0 0 0 17.91 5z"/><path d="M18.21 14.29a1 1 0 0 0-1.42 1.42l1.3 1.29h-12a1.56 1.56 0 0 1-1.59-1.53V13a1 1 0 0 0-2 0v2.47A3.56 3.56 0 0 0 6.09 19h12l-1.3 1.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42z"/></g></g></svg>
                        </twit-button>
                        <twit-button @click="${this.handleComment}" class="comment">
                            <svg height="15px" width="15px" fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="message-square"><rect width="24" height="24" opacity="0"/><circle cx="12" cy="11" r="1"/><circle cx="16" cy="11" r="1"/><circle cx="8" cy="11" r="1"/><path d="M19 3H5a3 3 0 0 0-3 3v15a1 1 0 0 0 .51.87A1 1 0 0 0 3 22a1 1 0 0 0 .51-.14L8 19.14a1 1 0 0 1 .55-.14H19a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm1 13a1 1 0 0 1-1 1H8.55a3 3 0 0 0-1.55.43l-3 1.8V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z"/></g></g></svg>
                        </twit-button>
                    </footer>
                </div>
=======
                <header>
                </header>
                <main>
                    ${
                        this.tweet.content !== "" ? html`
                            <p>${this.tweet.content}</p>
                        `: html`
                            <twit-element id="${this.tweet.tweetReference}"></twit-element>
                        `
                    }
                    ${
                        this.tweet.attachment ? html`
                            <twit-pic ref="${this.tweet.attachment}"></twit-pic>
                        ` : ""
                    }
                </main>
                <footer>
                    <twit-button @click="${this.handleLike}" class="like"></twit-button>
                    <twit-button @click="${this.handleRetweet}" class="retweet"></twit-button>
                    <twit-button @click="${this.handleComment}" class="comment"></twit-button>
                </footer>
>>>>>>> get tweets from local storage
		`;
	}
}

customElements.define('twit-element', TwitElement);