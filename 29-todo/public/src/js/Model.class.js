((window, _) => {
    "use strict";

    class Model {
        constructor (store) {
            this.store = store;
            this.listTasks = {};
        }

        findAll () {
            this.store.find().then(
                listNames => {
                    return Promise.all(listNames.map(listName => {
                        return this.store.find(listName).then(res => {
                            return _.merge(res, {id: listName});
                        });
                    }));
                }
            ).then(listTasks => {
                this.listTasks = listTasks;
                Mediator.publish(this.listTasks, 'list');
            });
        }

        findOne (listName) {
            this.store.find(listName).then(
                res => Mediator.publish(res, 'task'),
                err => console.error(err)
            );
        }

        /**
         * example: {
         *      title: '',
         *      created: new Date().toString(),
         *      tasks: []
         * }
         */
        create (form) {
            let listName = Date.now();
            let data = {
                todo: JSON.stringify({
                    title: form.elements[0].value,
                    created: new Date().toString(),
                    tasks: []
                })
            };

            this.store.create(listName, data).then(
                res => res.created ? this.find() : console.log('not created'),
                err => console.log(err)
            );
        }

        remove (listName) {
            this.store.remove(listName).then(
                res => res.deleted ? this.find() : console.log('error:', res.error),
                err => console.log(err)
            );
        }
    }

    window.todo = window.todo || {};
    window.todo.Model = Model;
})(window, _);
