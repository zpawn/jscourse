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
                }
            ).then(lists => {
                this.lists = lists;
                Mediator.publish(this.lists, 'list');
            });
        }

        findOne (listId) {
            this.store.find(listId).then(
                res => Mediator.publish(res, 'task'),
                err => console.error(err)
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
                res => res.created ? this.findAll() : console.log('not created'),
                err => console.log(err)
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
                res => res.updated ? Mediator.publish(list.tasks, 'task') : console.log(res),
                err => console.log(err)
            );
        }

        remove (listId) {
            this.store.remove(listId).then(
                res => res.deleted ? this.findAll() : console.log('error:', res.error),
                err => console.log(err)
            );
        }

        getList (listId) {
            return this.lists.find(list => list.id == listId);
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
                res => res.updated ? Mediator.publish(list.tasks, 'task') : console.log(res),
                err => console.log(err)
            );
        }

        removeTask (listId, taskId) {
            let list = this.getList(listId);
            list.tasks.splice(taskId, 1);

            this.store.update(listId, list).then(
                res => res.updated ? Mediator.publish(list.tasks, 'task') : console.log(res),
                err => console.log(err)
            );
        }
    }

    window.todo = window.todo || {};
    window.todo.Model = Model;
})(window, _);
