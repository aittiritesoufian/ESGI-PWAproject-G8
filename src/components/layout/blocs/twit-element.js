import { LitElement, html, css } from 'lit-element';
import "./twit-button.js";

class TwitElement extends LitElement {

	constructor(){
        super();
        this.id = "";
        this.content = "";
        this.tweetReference = "";
        this.date = "";
        this.author = {};
        this.attach = 0;
        this.likes = [];
        this.comments = 0;
    }
    
    static get properties(){
        return {
            id: String,
            content: String,
            tweetReference: String,
            date: Date,
            author: Object,
            attach: boolean,
            likes: {
                type: Array
            },
            comments: Number
        };
    }

    firstUpdated(){
        if(this.id){
            firebase.initializeApp(document.config);
            const tweet = this.firestore = firebase.firestore().collection("tweets").doc(this.id);
            this = [...this, tweet.data() ];
            console.log(this);
        }
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
                        this.content ? html`
                            <p>${this.content}</p>
                        `: html`
                            <TwitElement id="${this.tweetReference}"></TwitElement>
                        `
                    }
                </main>
                <footer>
                    <TwitButton @click="${this.handleLike}" class="like"></TwitButton>
                    <TwitButton @click="${this.handleRetweet}" class="retweet"></TwitButton>
                    <TwitButton @click="${this.handleComment}" class="comment"></TwitButton>
                </footer>
		`;
	}
}

customElements.define('twit-element', TwitElement);