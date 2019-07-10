import { openDB } from '/node_modules/idb/build/esm/index.js';
import checkConnectivity from '../system/connectivity.js';

export default async function twitSync() {
    console.log("sync start");

    var connectionStatus = true;
    checkConnectivity();
    document.addEventListener('connection-changed', ({ detail }) => {
        connectionStatus = detail;
        console.log("last connection for sync status : " + connectionStatus);
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
            var idTodo = tweets[j]['id'];
            //delete
            if (tweets[j]['status'] == -1) {
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
            //update
            else if (tweets[j]['status'] == 1) {
                //update on remote

                // TODO: HERE IMPLEMENT UPDATE/CREATE WITH FIREBASE

                //
                // const myHeaders = new Headers({
                //     "Content-Type": "application/json",
                // });

                // const params = {
                //     method: 'PATCH',
                //     headers: myHeaders,
                //     mode: 'cors',
                //     cache: 'default',
                //     body: JSON.stringify({ "id": tweets[j]["id"], "description": tweets[j]["description"], "solved": tweets[j]["solved"] })
                // };

                // //call to API to update
                // const result = fetch('http://localhost:3000/tweets/' + tweets[j]["id"], params).then(async (response) => {
                //     if (response.ok) {
                //         //update status en localbase if updated on JSON server
                //         const todo = await localbase.get('tweets', idTodo);
                //         await localbase.put('tweets', { "id": todo["id"], "description": todo["description"], "solved": todo["solved"], "status": 0 }, idTodo);
                //         console.log("updated");
                //     } else {
                //         console.log("Server refused the update");
                //         console.log(response);
                //         resolve(false);
                //     }
                // }).catch(function (error) {
                //     console.log('General error on update : ' + error);
                // });
            }
        }
    }
}