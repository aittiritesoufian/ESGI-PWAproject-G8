import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import "./twit-pic.js";
import 'firebase/storage';
import { openDB } from '/node_modules/idb/build/esm/index.js';
// import sync from '../../data/twit-sync.js';

class TwitNew extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.author = {};
        this.content = "";
        this.attachment = "";
        this.file = {};
        this.uploader = 0;
        this.connection = false;
        this.reply_to = "";
    }
    
    static get properties(){
        return {
            id: String,
            author: Object,
            content: String,
            file:Object,
            attachment: String,
            uploader: Number,
            connection: Boolean,
            reply_to: String
        };
    }

    firstUpdated() {
        this.author = firebase.auth().currentUser.uid;
        document.addEventListener('user-logged', (event) => {
            this.author = event.detail.user.uid;
            console.log('current user on twit-new : ');
            console.log(this.author);
        });
        document.addEventListener('connection-changed', (event) => {
            this.connection = event.detail;
        });
    }

    async handleTweet(e) {
        e.preventDefault();
        //init data for tweet
        let data = {
            content: this.content,
            date: new Date().getTime()
        }
        if(this.reply_to != ""){
            data.reply_to = this.reply_to;
        }
        if (this.file.length > 0 && this.connection) {
            //create storage ref
            const firestorage = firebase.storage();
            let ref = 'tweets_pic/' + this.author + "/" + this.file[0].name;
            let storageRef = firestorage.ref(ref);
            let content = this.content;
            let author = this.author;

            // //upload file
            let task = storageRef.put(this.file[0]);

            //task during upload
            task.on('state_changed',
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // this.uploader = percentage;
                },

                function error(err) {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            console.log("Error : Unauthorized");
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            console.log("Error : Canceled");
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            console.log("Error : Unknown", err);
                            break;
                    }
                },

                async function complete() {
                    console.log("upload complete");
                    data.attachment = ref;
                    data.author = author;
                    const database = firebase.firestore();
                    await database.collection('tweets').add(data)
                        .then(async (docRef) => {
                            console.log("Tweet written with ID: ", docRef.id);
                            await addTweetToFeed(docRef.id, data.date);
                        })
                        .catch((error) => {
                            console.error("Error adding tweet: ", error);
                        });
                    console.log("Tweet with file sent");
                    this.dispatchEvent(new CustomEvent('saved'));
                    let myCustomMetadata = {
                        customMetadata: {
                            cacheControl: 'public,max-age=3153600',
                        }
                    }
                    ref.updateMetadata(myCustomMetadata).then(() => {
                        console.log("metadata set")
                    })
                    window.location.replace('/');
                }
            );
        } else {
            const database = firebase.firestore();
            data.author = this.author;
            await database.collection('tweets').add(data)
                .then(async (docRef) => {
                    console.log("Tweet written with ID: ", docRef.id);
                    await this.addTweetToFeed(docRef.id, data.date);
                })
                .catch((error) => {
                    console.error("Error adding tweet: ", error);
                });;
            console.log("Tweet without file sent");
            this.dispatchEvent(new CustomEvent('saved'));
            window.location.replace('/');
        }
    }

    async addTweetToFeed(tweet_id, date){
        //add to followers feed
        // 1. get current user
        console.log('Adding tweet for followers feed');
        await firebase.firestore().collection('users').doc(this.author).get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                // 2. iter on followers
                doc.data().subscribers.forEach(follower => {
                    //for each follower, set in it doc in collection "feed", in collection tweets a doc with the current tweet reference and him date
                    firebase.firestore().collection('feed').doc(follower).collection('tweets').doc(tweet_id).set({
                        date: date
                    })
                });
                console.log('Tweet added to followers!');
            }
        });
    }

    static get styles(){
        return css`
            :host {
                display: block;
            }
            * {  box-sizing: border-box }

            form {
                padding-top: 10px;  
            }
            section {
                padding-top: 10px;  
            }
            textarea {
                padding: 10px;
                position: relative;
                display: block;
                width: 90%;
                margin-left: 5%;
                height: 250px;
                border: 3px solid rgb(29, 161, 242);
                border-radius: 15px;
                opacity: 0.2;
                background-color: rgb(169, 169, 169);
                font-size: 15px;
            }
            
            button, btn {
                margin-top:5px;
                margin-left: 5%;
                background-color: rgb(29, 161, 242);
                border: 1px solid rgb(29, 161, 242);
                width: 90px ;
                text-align: center;
                border-radius: 20px;
                padding: 2px 2px;
                padding-top: 2px;
                color:#fff;
            }
           
            button:hover {
                background-color: rgb(29, 161, 242);
                border: 1px solid rgb(29, 161, 242);
                opacity: 0.50;
            }

            textarea:hover {
                background-color: white;
                opacity: 0.50;
            }

            ::placeholder { 
                color: black;
                font-size: 20px;
                
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

	render(){
        return html`
            <form @submit="${this.handleTweet}">
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
                        </a>
                    </header>

                <textarea placeholder="Quoi de neuf ?" @change="${e => this.content = e.target.value}">${this.content}</textarea>
                <section class="actions">
                    <button type="submit">Tweeter</button>
                    ${this.connection ? html `<input type="file" class="btn" @input="${e => this.file = e.target.files}">`
                        : html`` }
                </section>
            </form>
		`;
	}
}

customElements.define('twit-new', TwitNew);