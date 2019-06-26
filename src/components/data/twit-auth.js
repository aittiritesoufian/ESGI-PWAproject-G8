import { LitElement, html, css } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

class TwitAuth extends LitElement {
    constructor() {
        super();
        this.name = "";
        this.email = "";
        this.password = "";
        this.slug = "";
        this.description = "";
    }

    static get properties(){
        return {
            email:String,
            password:String,
        };
    }

    static get styles(){
        return css`
            :host{
                display:block;
            }
        `;
    }

    handleForm(e) {
        e.preventDefault();
        if(!this.email || !this.password) return console.error('Email or password are empty !');
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(user => {
                const database = firebase.firestore();
                database.collection('users').doc(user.user.uid).set({
                    email: this.email,
                    name: this.name,
                    slug: this.slug,
                    description: this.description
                });
                console.log('Registration successful');
                this.email = "";
                this.password = "";
            }).catch(console.log);
    }

    render(){
        return html`
            <h1>Registrer</h1>
            <form @submit="${this.handleForm}">
                <p>
                    <label for="email">Email</label>
                    <input type="email" id="Email" .value="${this.email}" @input="${e => this.email = e.target.value}">
                </p>
                <p>
                    <label for="password">Password</label>
                    <input type="password" id="Password" .value="${this.password}" @input="${e => this.password = e.target.value}">
                </p>
                <p>
                    <label for="name">Name</label>
                    <input type="text" id="Name" .value="${this.name}" @input="${e => this.name = e.target.value}">
                </p>
                <p>
                    <label for="description">Description</label>
                    <input type="text" id="Description" .value="${this.description}" @input="${e => this.description = e.target.value}">
                </p>
                <p>
                    <label for="slug">Slug</label>
                    <input type="text" id="slug" .value="${this.slug}" @input="${e => this.slug = e.target.value}">
                </p>
                <button type="submit">Register</button>
            </form>
        `;
    }
}

customElements.define('twit-auth', TwitAuth);