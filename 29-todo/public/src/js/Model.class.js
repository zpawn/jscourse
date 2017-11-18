((window, _) => {
    "use strict";

    class Model {
        constructor (store) {
            this.store = store;
            this.lists = {};
        }

        findAll () {
            this.store.find().then(
                listIds => {
                    return Promise.all(listIds.map(listId => {
                        return this.store.find(listId).then(res => {
                            return _.merge(res, {id: listId});
                        });
                    }));
                },
                err => Mediator.publish({message: err}, 'alert')
            ).then(lists => {
                this.lists = lists;
                Mediator.publish(this.lists, 'list');
            });
        }

        findOne (listId) {
            this.store.find(listId).then(
                res => Mediator.publish(res, 'task'),
                err => Mediator.publish({message: err}, 'alert')
            );
        }

        create (form) {
            let listId = Date.now(),
                data = {
                    title: form.elements[0].value,
                    created: new Date().toString(),
                    tasks: []
                };

            this.store.create(listId, data).then(
                res => res.created ? this.findAll() : Mediator.publish(res.error, 'alert'),
                err => Mediator.publish({message: err}, 'alert')
            );
        }

        update (form, listId = 0) {

            let list = this.getList(listId);

            list.tasks.push({
                description: form.elements[0].value,
                done: false,
                deadline: Date.now()
            });

            this.store.update(listId, list).then(
                res => res.updated ? Mediator.publish(list.tasks, 'task') : Mediator.publish(res.error, 'alert'),
                err => Mediator.publish({message: err}, 'alert')
            );
        }

        remove (listId) {
            this.store.remove(listId).then(
                res => res.deleted ? this.findAll() : Mediator.publish(res.error, 'alert'),
                err => Mediator.publish({message: err}, 'alert')
            );
        }

        getList (listId) {
            return this.lists.find(list => list.id == listId);
        }

        updateList (listId = 0, listTitle) {
            let list = this.getList(listId);
            list.title = listTitle;

            this.store.update(listId, list).then(
                res => res.updated ? this.findAll() : Mediator.publish(res.error, 'alert'),
                err => Mediator.publish({message: err}, 'alert')
            );
        }

        getTasks (listId = 0) {
            return this.lists.reduce((tasks, list) => {
                if (list.id == listId) {
                    return list.tasks;
                }
                return tasks;
            }, []);
        }

        updateTask (listId, taskId, taskData) {
            let list = this.lists.find( list => list.id == listId);
            list.tasks[taskId][taskData.field] = taskData.value;

            this.store.update(listId, list).then(
                res => res.updated ? Mediator.publish(list.tasks, 'task') : Mediator.publish(res.error, 'alert'),
                err => Mediator.publish({message: err}, 'alert')
            );
        }

        removeTask (listId, taskId) {
            let list = this.getList(listId);
            list.tasks.splice(taskId, 1);

            this.store.update(listId, list).then(
                res => res.updated ? Mediator.publish(list.tasks, 'task') : Mediator.publish(res.error, 'alert'),
                err => Mediator.publish({message: err}, 'alert')
            );
        }
    }

    window.todo = window.todo || {};
    window.todo.Model = Model;
})(window, _);
