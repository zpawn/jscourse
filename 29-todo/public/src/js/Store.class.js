((window) => {
    "use strict";

    class Store {

        constructor () {
            this.endpoint = '/todo';
        }

        find (listName = '') {
            return this.send('GET', listName);
        }

        create (listName = '', data = {}) {
            return this.send('POST', listName, data);
        }

        update (listName = '', data = {}) {
            return this.send('PUT', listName, data);
        }

        remove (listName = '') {
            return this.send('DELETE', listName);
        }

        send (method = 'GET', listName, data) {

            const url = `${this.endpoint}/${listName}`;

            return new Promise((resolve, reject) => {
                const req = new XMLHttpRequest();

                req.open(method, url);
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onload = () => {
                    if (req.status === 200) {
                        resolve(JSON.parse(req.response));
                    } else {
                        reject(Error(req.statusText));
                    }
                };
                req.onerror = () => reject(Error("Network error"));
                req.send(JSON.stringify(data));
            });
        }
    }

    window.todo = window.todo || {};
    window.todo.Store = Store;
})(window);
