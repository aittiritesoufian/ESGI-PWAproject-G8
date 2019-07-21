import { LitElement, html, css } from 'lit-element';
import "../layout/navigation/twit-header.js";
import "../layout/navigation/twit-footer.js";
import "../layout/blocs/twit-element.js";
import firebase from 'firebase/app';
import 'firebase/auth';

class TwitProfile extends LitElement {

    constructor() {
        super();
        this.people = {};
        this.tab = "tweets";
        this.tweets = [];
        this.liked = [];
        this.attachments = [];
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
        `;
    }

    static get properties(){
        return {
            people: Object,
            tab: String,
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

    firstUpdated(){
        console.log("heer !!!!");
        if (this.location.params.slug){
            // get current user informations
            firebase.firestore().collection('users').doc(this.location.params.slug).get().then((doc) => {
                this.people = doc.data();
                this.people.id = doc.id;
            }).catch((error) => {
                console.log('No user profil information found!');
            });
            //get current user tweets
            firebase.firestore().collection('tweets').where("author", "==", this.location.params.slug).get().then((querySnapshot) => {
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
            firebase.firestore().collection('tweets').where("author", "==", this.location.params.slug).where("attachment", ">=", "tweets_pic").orderBy("attachment", "asc").get().then((querySnapshot) => {
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
            //get current user liked tweets_id

        } else {
            //current user
            document.addEventListener('user-logged', (event) => {
                let user = event.detail.user;
                // get current user informations
                firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
                    this.people = doc.data();
                    this.people.id = doc.id;
                }).catch((error) => {
                    console.log('No user profil information found!');
                });
                //get current user tweets
                firebase.firestore().collection('tweets').where("author", "==", user.uid).get().then((querySnapshot) => {
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
                firebase.firestore().collection('tweets').where("author", "==", user.uid).where("attachment", ">=", "tweets_pic").orderBy("attachment", "asc").get().then((querySnapshot) => {
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
                //get current user liked tweets_id

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
                                <div class="icon-zone"><img src="${this.people.avatar ? this.people.avatar : "/1f680.png"}"/></div>
                            </section>
                            <section class="profil-infos">
                                <h1>${this.people.name}</h1>
                                <p>${this.people.description}</p>
                                <span class="stats">${this.people.subscriptions ? this.people.subscriptions : "0"} Abonnements ${this.people.subscribers ? this.people.subscribers : "0"} Abonnées</span>
                            </section>
                        </header>
                        <main>
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
                                            <twit-element .tweet="${tweet}"></twit-element>
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