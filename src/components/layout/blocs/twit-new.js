import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

class TwitNew extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.author = "";
        this.content = "";
        this.attachment = "";
        this.file = {};
        this.uploader = 0;
    }
    
    static get properties(){
        return {
            id: String,
            author: String,
            content: String,
            file:Object,
            attachment: String,
            uploader: Number
        };
    }

    handleTweet(e) {
        e.preventDefault();
        // firebase.initializeApp(document.config);
        // if (this.tweet == {}) return;
        // file is in this.file
        //create storage ref
        const firestorage = firebase.storage();
        let storageRef = firestorage.ref('tweets_pic/' + this.author + "/" + this.file.name);

        // //upload file
        let task = storageRef.put(this.file);

        //task during upload
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                // this.uploader = percentage;
            },

            function error(err) {
                console.log("error occured on upload", err);
            },

            function complete() {
                console.log("upload complete");
            }
        );

        // const database = firebase.firestore();
        // database.collection('tweets').add({
        //     content: this.content,
        //     date: new Date().getTime(),
        //     author: this.author.uid,
        //     email: this.author.email,
        //     attachment: 1
        // });
        // this.tweet = {};
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
            <form @submit='${this.handleTweet}'>
                <textarea placeholder="Post a new tweet..." @change="${e => this.content = e.target.value}">${this.content}</textarea>
                <section class="actions">
                    <button type="submit">Send</button>
                    <input type="file" class="btn" @input="${e => this.file = e.target.files[0]}">
                </section>
            </form>
		`;
	}
}

customElements.define('twit-new', TwitNew);