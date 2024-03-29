import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import "./twit-pic.js";
import 'fa-icons';
import { openDB } from '/node_modules/idb/build/esm/index.js';

class TwitElement extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.tweet = {};
        this.author = {};
        this.style = {
            color: "#eeeeee",
            size: "1.5em"
        };
        this.user = {};
    }

    static get styles() {
        return css`
            :root {
                margin-bottom: 9%; 
            }
            button {
                cursor: pointer;
                background: none;
                border:none;
            }
            button:hover {
                cursor: pointer;
                background: none;
                border:none;
                color:#2d2d2d;
            }
            h1 {
                display: inline-block;
                padding-left:10px;
            }
            footer > a {
                text-decoration:none;
                color:#000;
            }
            .element-img {
                width:90%;
                border: 1px solid gray;
                border-radius: 10px;
                padding: 16px;
                border: 1px solid #ededed;
                position:relative;
                display: block;
            }
            header a {
                flex-direction: row;
                align-items: center;
                display: flex;
            }
            .icon-zone {
                width: 50px;
                height: 50px;
                background-color: rgb(255, 255, 255);
                position: relative;
                border-radius: 50%;
                overflow: hidden;
                flex-direction: row;
                align-items: center;
                display: flex;
            }
            .icon-zone > img {
                width:100%;
                height:100%;
                position: relative;
                display: block;
            }
        `;
    }
    
    static get properties(){
        return {
            id: String,
            tweet: Object,
            author: Object,
            user: Object,
            style: Object
        };
    }

    async firstUpdated() {
        document.addEventListener('connection-changed', ({ detail }) => {
            if (detail) {
                this.style.color = "#00BFFF";
            } else {
                this.style.color = "#eeeeee";
            }
        });
        this.user = firebase.auth().currentUser;
        if(this.id){
            firebase.firestore().collection("tweets").doc(this.id).get().then(doc => {
                if (doc.exists) {
                    this.tweet = doc.data();
                    this.tweet.id = doc.id ? doc.id : null;
                    firebase.firestore().collection("users").doc(this.tweet.author).get().then(async doc2 => {
                        if (doc2.exists) {
                            this.author = doc2.data();
                        }
                    }).catch(function (error) {
                        console.log("Error getting tweet:", error);
                    });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    this.tweet = {
                        id: null
                    };
                }
            }).catch(function(error) {
                console.log("Error getting Tweet:", error);
            });
        } else {
            if (this.tweet.author != undefined && typeof (this.tweet.author) != "object" && this.tweet.author != ""){
                firebase.firestore().collection("users").doc(this.tweet.author).get().then(async doc2 => {
                    if (doc2.exists) {
                        this.author = doc2.data();
                    }
                }).catch(function (error) {
                    console.log("Error getting author :", error);
                });
            }
            console.log("not on Element by ID");
        }
    }

    like(){
        //add like to tweet
        firebase.firestore().collection('tweets').doc(this.tweet.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(this.user.uid)
        });
        console.log("like added on tweet " + this.tweet.id + " for user " + this.user.uid);
        //add tweet reference on likes of current user
        firebase.firestore().collection('users').doc(this.user.uid).update({
            likes: firebase.firestore.FieldValue.arrayUnion(this.tweet.id)
        }).then((ref) => {
            console.log('tweet references added to likes on user');
        }).catch((error) => {
            console.log('error on adding tweet reference to users\'s likes');
            console.log(error);
        });
        // document.dispatchEvent(new CustomEvent('sync'));
    }

    dislike(){
        firebase.firestore().collection('tweets').doc(this.tweet.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(this.user.uid)
        });
        console.log("like removed on tweet " + this.tweet.id + " for user " + this.user.uid);
        // document.dispatchEvent(new CustomEvent('sync'));
    }

    handleLike(e) {
        // TODO: add a like to the current tweet
        console.log("tweet like action");
        if (this.tweet.likes && this.tweet.likes.indexOf(this.user.uid) < 0){
            this.like();
        } else if (this.tweet.likes && this.tweet.likes.indexOf(this.user.uid) >= 0) {
            this.dislike();
        } else {
            this.like();
        }
        document.dispatchEvent(new CustomEvent('sync'));
    }

    async retweet(){
        //publish a new tweet with tweetReference in place of content
        let data = {
            tweetReference: this.tweet.id,
            date: new Date().getTime(),
            author: this.user.uid
        }
        const database = firebase.firestore();
        database.collection('tweets').add(data);
        console.log("Retweet sent");
        //add reference to current user who retweeted
        firebase.firestore().collection('tweets').doc(this.tweet.id).update({
            retweets: firebase.firestore.FieldValue.arrayUnion(this.user.uid)
        });
        console.log("retweet added on tweet " + this.tweet.id + " for user " + this.user.uid);
        document.dispatchEvent(new CustomEvent('sync'));
    }

    unretweet() {
        //delete tweet generated for retweet
        firebase.firestore().collection('tweets').doc(this.tweet.id).update({
            retweets: firebase.firestore.FieldValue.arrayRemove(this.user.uid)
        });
        //remove the reference to current user who unretweeted
        firebase.firestore().collection('tweets').where('tweetReference', '==', this.tweet.id).get().then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                console.log("removing tweet : " + doc.ref);
                doc.ref.delete();
            })
        });
        console.log("tweet reference to " + this.tweet.id + " for user " + this.user.uid+ " has been droped!");
        document.dispatchEvent(new CustomEvent('sync'));
    }

    async handleRetweet(e) {
        if (this.tweet.retweets && this.tweet.retweets.indexOf(this.user.uid) < 0) {
            await this.retweet();
        } else if (this.tweet.retweets && this.tweet.retweets.indexOf(this.user.uid) >= 0) {
            await this.unretweet();
        } else {
            await this.retweet();
        }
        document.dispatchEvent(new CustomEvent('sync'));
    }

    decrementComments(tweet_id) {
        firebase.firestore().collection('tweets').doc(tweet_id).update({
            replies: firebase.firestore.FieldValue.increment(-1)
        }).catch((error) => {
            console.log('Error on decrement replies number');
            console.log(error);
        })
    }

    handleDelete(e) {
        if(this.tweet.reply_to){
            this.decrementComments(this.tweet.reply_to);
        }
        // TODO: delete current tweet
        firebase.firestore().collection('tweets').doc(this.tweet.id).delete().then((e) => {
            console.log("tweet deletion succeed");
        });
        console.log("Tweet " + this.tweet.id + " deleted");
        document.dispatchEvent(new CustomEvent('sync'));
    }

	render(){
        return this.tweet.id == null ? html`
            <p>Le tweet d'origine à été supprimé !</p>
        ` : html`
                <div style="padding: 30px; border-top: 1px solid #f1f1f1; border-bottom: 1px solid #f1f1f1">
                    <header>
                        <a href="/profil/${this.author.slug}" style="text-decoration: none">
                            <div class="icon-zone">
                                ${
                                    this.author.avatar ? html`
                                        <twit-pic ref="${this.author.avatar}"></twit-pic>
                                    `
                                    : html `
                                        <img src="/1f680.png"/>
                                    `
                                }
                            </div>
                            <h1 style="color: #1e79d2; font-size: 1.2rem;">${this.author.name}</h1>
                        </a>
                    </header>
                    <main>
                        ${
                            this.tweet.tweetReference ? html`
                                à retweeter ceci :
                                <twit-element id="${this.tweet.tweetReference}"></twit-element>
                            ` : this.tweet.reply_to ? html`
                            en réponse à ce <a href="/tweet/${this.tweet.reply_to}">tweet</a>
                            <p style="color: #626262;">${this.tweet.content}</p>
                            ` : html`
                                <p style="color: #626262;">${this.tweet.content}</p>
                            `
                        }
                        ${
                            this.tweet.attachment ? html`
                                <twit-pic class="element-img" ref="${this.tweet.attachment}"></twit-pic>
                            ` : ""
                        }
                    </main>
                    <footer>
                        <button @click="${this.handleLike}" class="like">
                            <fa-icon id="icon-home" class="far fa-heart" color=${this.style.color} size=${this.style.size}></fa-icon>
                            <!-- <svg height="15px" width="15px" fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="heart"><rect width="24" height="24" opacity="0"/><path d="M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21zM7.22 6a3.2 3.2 0 0 0-2.28.94 3.24 3.24 0 0 0 0 4.57L12 18.58l7.06-7.07a3.24 3.24 0 0 0 0-4.57 3.32 3.32 0 0 0-4.56 0l-1.79 1.8a1 1 0 0 1-1.42 0L9.5 6.94A3.2 3.2 0 0 0 7.22 6z"/></g></g></svg> -->
                        </button>
                        ${!this.tweet.likes ? "0" : this.tweet.likes.length}
                        <button @click="${this.handleRetweet}" class="retweet">
                            <fa-icon id="icon-home" class="fas fa-sync" color=${this.style.color} size=${this.style.size}></fa-icon>
                            <!-- <svg height="15px" width="15px" fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="repeat"><rect width="24" height="24" opacity="0"/><path d="M17.91 5h-12l1.3-1.29a1 1 0 0 0-1.42-1.42l-3 3a1 1 0 0 0 0 1.42l3 3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42L5.91 7h12a1.56 1.56 0 0 1 1.59 1.53V11a1 1 0 0 0 2 0V8.53A3.56 3.56 0 0 0 17.91 5z"/><path d="M18.21 14.29a1 1 0 0 0-1.42 1.42l1.3 1.29h-12a1.56 1.56 0 0 1-1.59-1.53V13a1 1 0 0 0-2 0v2.47A3.56 3.56 0 0 0 6.09 19h12l-1.3 1.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42z"/></g></g></svg> -->
                        </button>
                        ${!this.tweet.retweets ? "0" : this.tweet.retweets.length}
                        <a href="/tweet/${this.tweet.id}" class="comment">
                            <fa-icon id="icon-home" class="far fa-comment-dots" color=${this.style.color} size=${this.style.size}></fa-icon>
                            <!-- <svg height="15px" width="15px" fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="message-square"><rect width="24" height="24" opacity="0"/><circle cx="12" cy="11" r="1"/><circle cx="16" cy="11" r="1"/><circle cx="8" cy="11" r="1"/><path d="M19 3H5a3 3 0 0 0-3 3v15a1 1 0 0 0 .51.87A1 1 0 0 0 3 22a1 1 0 0 0 .51-.14L8 19.14a1 1 0 0 1 .55-.14H19a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm1 13a1 1 0 0 1-1 1H8.55a3 3 0 0 0-1.55.43l-3 1.8V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z"/></g></g></svg> -->
                            ${!this.tweet.replies ? "0" : this.tweet.replies}
                        </a>
                        ${
                            this.tweet.author == this.user.uid ? html`
                                <button @click="${this.handleDelete}" class="delete">
                                    <fa-icon id="icon-home" class="far fa-trash-alt" color=${this.style.color} size=${this.style.size}></fa-icon>
                                    <!-- <svg height="15px" width="15px" fill="#2d2d2d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g data-name="Layer 2"><g data-name="message-square"><rect width="24" height="24" opacity="0"/><circle cx="12" cy="11" r="1"/><circle cx="16" cy="11" r="1"/><circle cx="8" cy="11" r="1"/><path d="M19 3H5a3 3 0 0 0-3 3v15a1 1 0 0 0 .51.87A1 1 0 0 0 3 22a1 1 0 0 0 .51-.14L8 19.14a1 1 0 0 1 .55-.14H19a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm1 13a1 1 0 0 1-1 1H8.55a3 3 0 0 0-1.55.43l-3 1.8V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z"/></g></g></svg> -->
                                </button>
                            ` : ""
                        }
                    </footer>
                </div>
		`;
	}
}

customElements.define('twit-element', TwitElement);