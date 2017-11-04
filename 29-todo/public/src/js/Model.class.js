((window, _) => {
    "use strict";

    class Model {
        constructor (store) {
            this.store = store;
            this.listTasks = {};
        }

        findAll () {
            this.store.find().then(
                listIds => {
                    return Promise.all(listIds.map(listId => {
                        return this.store.find(listId).then(res => {
                            return _.merge(res, {id: listId});
                        });
                    }));
                }
            ).then(listTasks => {
                this.listTasks = listTasks;
                Mediator.publish(this.listTasks, 'list');
            });
        }

        findOne (listId) {
            this.store.find(listId).then(
                res => Mediator.publish(res, 'task'),
                err => console.error(err)
            );
        }

        create (form) {
            let listId = Date.now();
            let data = {
                todo: JSON.stringify({
                    title: form.elements[0].value,
                    created: new Date().toString(),
                    tasks: []
                })
            };

            this.store.create(listId, data).then(
                res => res.created ? this.findAll() : console.log('not created'),
                err => console.log(err)
            );
        }

        remove (listId) {
            this.store.remove(listId).then(
                res => res.deleted ? this.findAll() : console.log('error:', res.error),
                err => console.log(err)
            );
        }

        getTasks (listId = 0) {
            return this.listTasks.reduce((tasks, list) => {
                if (list.id == parseInt(listId)) {
                    return list.tasks;
                }
                return tasks;
            }, []);
        }
    }

    window.todo = window.todo || {};
    window.todo.Model = Model;
})(window, _);
