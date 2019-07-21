import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
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

                function complete() {
                    console.log("upload complete");
                    data.attachment = ref;
                    const database = firebase.firestore();
                    database.collection('tweets').add(data);
                    console.log("Tweet with file sent");
                }
            );
        } else {
            const database = await openDB('twitbook', 1, {
                upgrade(db) {
                    db.createObjectStore('tweets');
                }
            });
            data.status = 1;
            data.id = "local" + Math.floor(Math.random() * 1000);
            try{
                await database.put('tweets', data, data.id);
                console.log("Tweet only sent");
            } catch(e) {
                console.log("error on insert on IDB : "+e);
            }
        }
        document.dispatchEvent(new CustomEvent('sync'));
        // sync();
    }

    static get styles(){
        return css`
            :host {
                display: block;
            }
            * {  box-sizing: border-box }
            textarea {
                position: relative;
                display: block;
                width: 90%;
                margin-left: 5%;
                height: 250px;
            }
            button, btn {
                margin-top:5px;
                margin-left: 5%;
                background-color: light-blue;
                border: 1px solid light-blue;
                border-radius: 5px;
                padding: 2px 4px;
            }
            button:hover {
                background-color: blue;
                border: 1px solid blue;
            }
        `;
    }

	render(){
        return html`
            <form @submit="${this.handleTweet}">
                <textarea placeholder="Post a new tweet..." @change="${e => this.content = e.target.value}">${this.content}</textarea>
                <section class="actions">
                    <button type="submit">Send</button>
                    ${this.connection ? html `<input type="file" class="btn" @input="${e => this.file = e.target.files}">`
                        : html`` }
                </section>
            </form>
		`;
	}
}

customElements.define('twit-new', TwitNew);