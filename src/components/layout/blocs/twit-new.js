import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'fa-icons';

class TwitNew extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.author = {};
        this.content = "";
        this.attachment = "";
        this.file = {};
        this.uploader = 0;
    }
    
    static get properties(){
        return {
            id: String,
            author: Object,
            content: String,
            file:Object,
            attachment: String,
            uploader: Number
        };
    }

    firstUpdated() {
        document.addEventListener('user-logged', (event) => {
            this.author = event.detail.user.uid;
        });
    }

    handleTweet(e) {
        e.preventDefault();
        //init data for tweet
        let data = {
            content: this.content,
            author: this.author,
            date: new Date().getTime()
        }
        if (this.file.length > 0) {
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
            const database = firebase.firestore();
            database.collection('tweets').add(data);
            console.log("Tweet only sent");
        }
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
                border: 2px solid rgb(29, 161, 242);
                border-radius: 15px;
                opacity: 0.2;
                background-color: rgb(169, 169, 169);
                font-size: 20px;
            }
            
            button, btn {
                margin-top:5px;
                margin-left: 5%;
                background-color: rgb(29, 161, 242);
                border: 1px solid rgb(29, 161, 242);
                width: 90px ;
                border-radius: 20px;
                padding: 2px 4px;
                padding-top: 5px;
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

        `;
    }

	render(){
        return html`
            <form @submit="${this.handleTweet}">
                <textarea placeholder="Quoi de neuf ?" @change="${e => this.content = e.target.value}">${this.content}</textarea>
                <section class="actions">
                    <button type="submit">Tweeter</button>
                    <input type="file" class="btn"  @input="${e => this.file = e.target.files}">  
                </section>
            </form>
		`;
	}
}

customElements.define('twit-new', TwitNew);