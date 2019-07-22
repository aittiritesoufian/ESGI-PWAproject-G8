import { LitElement, html, css } from 'lit-element';
import "../layout/navigation/twit-header.js";
import "../layout/navigation/twit-footer.js";
import "../layout/blocs/twit-element.js";
import "../layout/blocs/twit-pic.js";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

class TwitProfile extends LitElement {

    constructor() {
        super();
        this.currentUser = {};
        this.people = {};
        this.tab = "tweets";
        this.tweets = [];
        this.liked = [];
        this.attachments = [];
        this.avatar = {};
    }

    static get styles(){
        return css`
            :root{
                display:block;
                margin-bottom: 9%;
            }
            .profil {
                margin-bottom: 9%;
            }
            .profil-infos {
                padding-left:10px;
                padding-right: 10px;
            }
            header {
                overflow: hidden;
            }
            .banner {
                background-color:#00BFFF;
                padding-top: 10px;
                padding-right: 0px;
                padding-bottom: 20px;
                padding-left: 0px;
            }
            .icon-zone {
                width:50px;
                height:50px;
                margin-top:10px;
                margin-left:25px;
                border-radius:50%;
                background-color:#fff;
                overflow: hidden;
                position: relative;
            }
            .icon-zone > img {
                width:100%;
                height:100%;
                position: relative;
                display: block;
            }
            ul {
                margin-top: 25px;
                display: flex;
                justify-content: center;
                align-items: unsafe center;
                flex-wrap: wrap;
            }
            li {
                list-style: none;
                flex-grow: 1;
                display: inline-block;
                padding: 0px 0px;
            }
            .active {
                color: #00BFFF;
            }
            #avatar {
                display:none;
            }
            #icon_camera {
                position:relative;
                margin:12.5px;
                opacity:1;
            }
            .current_user {
                position: absolute;
                width:50px;
                height:50px;
                margin-top: -60px;
                border-radius:50%;
                background-color:#efefef;
                opacity:0.7;
            }
            twit-pic {
                margin-top: inherit;
                width:50px;
                height:50px;
            }
        `;
    }

    static get properties(){
        return {
            currentUser: Object,
            people: Object,
            tab: String,
            avatar: Object,
            tweets: {
                type: Array
            },
            liked: {
                type: Array
            },
            attachments: {
                type: Array
            }
        };
    }

    handleAvatar(e) {
        this.shadowRoot.querySelector("#avatar").click();
    }

    handleFollow(e) {
        // follow
        firebase.firestore().collection('users').doc(this.currentUser.uid).update({
            subscriptions: firebase.firestore.FieldValue.arrayUnion(this.people.id)
        }).then((ref) => {
            console.log("Vous êtes abonné !");
        }).catch((error) => {
            console.log('erreur dans l\'ajout de l\'abonnement');
        });
        //add on the subscribed "subscribers" attribute
        firebase.firestore().collection('users').doc(this.people.id).update({
            subscribers: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
        }).then((ref) => {
            console.log("Référence ajoutée à l'abonné !");
        }).catch((error) => {
            console.log('erreur dans l\'ajout de l\'abonné');
        });
    }

    handleUnFollow(e){
        // unfollow
        firebase.firestore().collection('users').doc(this.currentUser.uid).update({
            subscriptions: firebase.firestore.FieldValue.arrayRemove(this.people.id)
        }).then((ref) => {
            console.log("Vous n'êtes plus abonné !");
        }).catch((error) => {
            console.log('erreur dans la suppression de l\'abonnement');
        });
        //remove from the subscribed "subscribers" attribute
        firebase.firestore().collection('users').doc(this.people.id).update({
            subscribers: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid)
        }).then((ref) => {
            console.log("Référence supprimée chez l'abonné !");
        }).catch((error) => {
            console.log('erreur dans la suppression de l\'abonné');
        });
    }

    submitAvatar(e){
        console.log("submitted");
        console.log(this.avatar);
        if (this.avatar.length > 0) {
            const firestorage = firebase.storage();
            let ref = 'profiles_pic/' + this.people.id + "/" + this.avatar[0].name;
            let storageRef = firestorage.ref(ref);
            //upload file
            let task = storageRef.put(this.avatar[0]);
            let user_id = this.people.id;
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
                    let img_ref = ref;
                    const database = firebase.firestore();
                    database.collection('users').doc(user_id).update({
                        avatar: img_ref
                    });
                    console.log("User avatar updated");
                }
            );
        }
    }

    firstUpdated(){
        if (firebase.auth().currentUser) {
            this.currentUser = firebase.auth().currentUser;
            firebase.firestore().collection('users').doc(this.currentUser.uid).get().then((doc) => {
                this.currentUser = doc.data();
                this.currentUser.uid = doc.id;
            }).catch((error) => {
                console.log('Current user hasn\'t profile information');
            });
        }
        document.addEventListener('user-logged', (event) => {
            this.currentUser = event.detail.user;
            // get current user informations
            firebase.firestore().collection('users').doc(this.currentUser.uid).get().then((doc) => {
                this.currentUser = doc.data();
                this.currentUser.uid = doc.id;
            }).catch((error) => {
                console.log('Current user hasn\'t profile information');
            });
        });
        if (this.location.params.slug){
            // get current user informations
            firebase.firestore().collection('users').where('slug', "==", this.location.params.slug).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.people = doc.data();
                    this.people.id = doc.id;
                    //get current user tweets
                    firebase.firestore().collection('tweets').where("author", "==", this.people.id).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (doc.exists) {
                                let tweet = doc.data();
                                tweet.id = doc.id ? doc.id : "";
                                this.tweets = [...this.tweets, tweet];
                            }
                        });
                    }).catch((error) => {
                        console.log('No tweets found!');
                        console.log(error);
                    });
                    //get current user tweets with attachments
                    firebase.firestore().collection('tweets').where("author", "==", this.people.id).where("attachment", ">=", "tweets_pic").orderBy("attachment", "asc").get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            if (doc.exists) {
                                let tweet = doc.data();
                                tweet.id = doc.id ? doc.id : "";
                                this.attachments = [...this.attachments, tweet];
                            }
                        });
                    }).catch((error) => {
                        console.log('No attachments found!');
                        console.log(error);
                    });
                });
            }).catch((error) => {
                console.log('No user profil information found!');
            });
            
        } else if (this.currentUser.uid) {
            //current user
            this.people = this.currentUser;
            this.people.id = this.currentUser.uid;
            //get current user tweets
            firebase.firestore().collection('tweets').where("author", "==", this.currentUser.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        let tweet = doc.data();
                        tweet.id = doc.id ? doc.id : "";
                        this.tweets = [...this.tweets, tweet];
                    }
                });
            }).catch((error) => {
                console.log('No tweets found!');
                console.log(error);
            });
            //get current user tweets with attachments
            firebase.firestore().collection('tweets').where("author", "==", this.currentUser.uid).where("attachment", ">=", "tweets_pic").orderBy("attachment", "asc").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.exists) {
                        let tweet = doc.data();
                        tweet.id = doc.id ? doc.id : "";
                        this.attachments = [...this.attachments, tweet];
                    }
                });
            }).catch((error) => {
                console.log('No attachments found!');
                console.log(error);
            });
        }
    }
    
    render() {
        return html`
            <twit-header></twit-header>
            ${
                this.people.id ? html`
                    <section class="profil">
                        <header>
                            <section class="banner">
                                <div class="icon-zone">
                                    
                                    ${this.people.avatar ? html`
                                        <twit-pic .ref="${this.people.avatar}"></twit-pic>
                                    `
                                    : html`<img src="/1f680.png"/>`}
                                    
                                    ${
                                        !this.location.params.slug ? html`
                                            <span @click="${this.handleAvatar}" class="current_user">
                                                <fa-icon id="icon_camera" class="fas fa-camera" color="#ccc" size="25px"></fa-icon>
                                                <input type="file" id="avatar" @input="${e => this.avatar = e.target.files}" @change="${this.submitAvatar}" />
                                            </span>
                                        ` : ""
                                    }
                                </div>
                            </section>
                            <section class="profil-infos">
                                <h1>${this.people.name}</h1>
                                <p>${this.people.description}</p>
                                <span class="stats">${this.people.subscriptions ? this.people.subscriptions.length : "0"} Abonnements ${this.people.subscribers ? this.people.subscribers.length : "0"} Abonnées</span>
                            </section>
                        </header>
                        <main>
                            <section class="subscription">
                            ${
                                this.location.params.slug ?
                                    (this.currentUser.subscriptions && this.currentUser.subscriptions.indexOf(this.people.id) >= 0) ? html`
                                        <button @click="${this.handleUnFollow}" class="unfollow">Ne plus suivre</button>
                                    `: html`
                                        <button @click="${this.handleFollow}" class="follow">Suivre</button>
                                        
                                    ` : ""
                            }
                            </section>
                            <section class="tabs">
                                <ul>
                                    <li class="${this.tab =='tweets' ? 'active':''}" @click="${(e)=> {this.tab = 'tweets'}}">Tweets</li>
                                    <li class="${this.tab =='medias' ? 'active':''}" @click="${(e)=> {this.tab = 'medias'}}">Medias</li>
                                    <li class="${this.tab =='likes' ? 'active':''}" @click="${(e)=> {this.tab = 'likes'}}">Likes</li>
                                </ul>
                            </section>
                            <section class="content">
                                ${
                                    this.tab == "tweets" ? html `
                                        ${this.tweets.map(tweet => html`
                                            <twit-element .tweet="${tweet}"></twit-element>
                                        `)}
                                    `
                                    : this.tab == "medias" ? html `
                                        ${this.attachments.map(tweet => html`
                                            <twit-element .tweet="${tweet}"></twit-element>
                                        `)}
                                    `
                                    : html `
                                        ${this.people.likes ? this.people.likes.map(tweet => html`
                                            <twit-element .id="${tweet}"></twit-element>
                                        `) : ""}
                                    `
                                }
                            </section>
                        </main>

                    </section>
                ` : html`

                `
            }
            <twit-footer></twit-footer>
       `;
    }
}

customElements.define('twit-profile', TwitProfile);