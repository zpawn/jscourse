((window) => {
    "use strict";

    class Store {

        constructor () {
            this.endpoint = '/todo';
            this.STATE_READY = 4;
        }

        find (listId = 0) {
            return this.send('GET', listId);
        }

        create (listId = 0, data = {}) {
            return this.send('POST', listId, {todo: JSON.stringify(data)});
        }

        update (listId = 0, data = {}) {
            return this.send('PUT', listId, {todo: JSON.stringify(data)});
        }

        remove (listId = 0) {
            return this.send('DELETE', listId);
        }

        send (method = 'GET', listId, data) {

            const url = `${this.endpoint}/${listId === 0 ? '' : listId}`;

            return new Promise((resolve, reject) => {
                const req = new XMLHttpRequest();

                Mediator.publish('show', 'spinner');

                req.open(method, url);
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onload = () => {
                    if (req.status === 200) {
                        resolve(JSON.parse(req.response));
                    } else {
                        reject(Error(req.statusText));
                    }
                };
                req.onreadystatechange = () => {
                    if (req.readyState === this.STATE_READY) {
                        Mediator.publish('hide', 'spinner');
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
