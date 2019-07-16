import { openDB } from '/node_modules/idb/build/esm/index.js';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default async function twitSync() {
    console.log("sync start");

    var connectionStatus = true;
    document.addEventListener('connection-changed', ({ detail }) => {
        connectionStatus = detail;
        console.log("Sync status : " + connectionStatus);
    });

    if (connectionStatus === true) {
        const localbase = await openDB('twitbook', 1, {
            upgrade(db) {
                db.createObjectStore('tweets');
            }
        });

        const keys = await localbase.getAllKeys('tweets');
        // console.log(keys);
        let tweets = [];
        for (var i = keys.length - 1; i >= 0; i--) {
            tweets.push(await localbase.get('tweets', keys[i]));
        }
        // console.log(tweets);

        for (var j = tweets.length - 1; j >= 0; j--) {
            // console.log('loop starting');
            // console.log(tweets[j]);
            let idTweet = tweets[j]['id'];
            //delete
            if (tweets[j]['status'] == -2) {
                //delete on remote

                // TODO: HERE IMPLEMENT DELETE WITH FIREBASE

                //
                // const myHeaders = new Headers({
                //     "Content-Type": "application/json",
                // });

                // const params = {
                //     method: 'DELETE',
                //     headers: myHeaders,
                //     mode: 'cors',
                //     cache: 'default'
                // };

                // const result = fetch('http://localhost:3000/tweets/' + tweets[j]['id'], params).then(async (response) => {
                //     if (response.ok) {
                //         console.log("deleted");
                //         //remove en localbase if removed on JSON server
                //         await localbase.delete('tweets', idTodo);
                //         const event = new CustomEvent('todo-deleted', {
                //             detail: idTodo
                //         });
                //         document.dispatchEvent(event);
                //     } else {
                //         console.log("Server refused the deletion");
                //         console.log(response);
                //         resolve(false);
                //     }
                // }).catch(function (error) {
                //     console.log('General error on delete: ' + error.message);
                // });

            }
            //add on remote
            else if (tweets[j]['status'] == 1) {
                console.log(idTweet);
                //delete unnecessary field
                delete tweets[j]['status'];
                delete tweets[j]['id'];
                console.log(tweets[j]);
                const database = firebase.firestore();
                //send to remote
                database.collection('tweets').add(tweets[j]);
                console.log("added a new tweet on remote");
                //remove local temporary version
                await localbase.delete("tweets",idTweet);
                console.log("delete local temporary tweet");

            } else if (tweets[j]['status'] == 2){
                firebase.firestore().collection("tweets").doc(idTweet).get().then(async doc => {
                    if (doc.exists) {
                        let tweet = doc.data();
                        let author = await firebase.firestore().collection("users").doc(doc.data().author).get().then(doc2 => {
                            if (doc2.exists) {
                                return doc2.data();
                            }
                        }).catch(function (error) {
                            console.log("Error getting Author:", error);
                        });
                        tweet.author = await author;
                        tweet.author.id = doc.data().author;
                        tweet.status = 0;
                        tweet.id = idTweet;
                        console.log(tweet);
                        await localbase.put('tweets', tweet, tweet.id);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function (error) {
                    console.log("Error getting Tweet:", error);
                });
            }
        }
    }
}