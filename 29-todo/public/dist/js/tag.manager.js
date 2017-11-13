"use strict";

var Mediator = function () {
    "use strict";

    return {
        subscribers: {
            any: [] // event type: subscribers
        },

        subscribe: function subscribe(fn) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'any';

            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(fn);
        },
        unsubscribe: function unsubscribe(fn, type) {
            this.visitSubscribers('unsubscribe', fn, type);
        },
        publish: function publish(publication, type) {
            this.visitSubscribers('publish', publication, type);
        },
        visitSubscribers: function visitSubscribers(action, arg) {
            var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'any';

            var subscribers = this.subscribers[type];

            for (var i = 0; i < subscribers.length; i += 1) {
                if (action === 'publish') {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };
}();
"use strict";

(function (window, $) {
    "use strict";

    var Spinner = function Spinner(selector) {
        var $root = $(selector);
        var show = false;

        return {
            toggle: function toggle(type) {
                type === 'show' ? $root.show() : $root.hide();
            }
        };
    };

    window.todo = window.Spinner || {};
    window.todo.Spinner = Spinner;
})(window, jQuery);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, $) {
    "use strict";

    var Controller = function () {
        function Controller(model, listView, taskView) {
            _classCallCheck(this, Controller);

            this.model = model;
            this.listView = listView;
            this.taskView = taskView;
            this.listActive = '';
            this.spinner = new todo.Spinner('#spinner');

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');
            Mediator.subscribe(this.listView.listActive, 'listActive');
            Mediator.subscribe(this.spinner.toggle, 'spinner');

            ////

            this.model.findAll();
            this.bind();
        }

        _createClass(Controller, [{
            key: 'bind',
            value: function bind() {
                this.listView.$root.on('click', 'a', this._bindListItemClick.bind(this));
                $('#addNewListForm').on('submit', this._bindNewListSubmit.bind(this));
                $('#addNewTaskForm').on('submit', this._bindNewTaskSubmit.bind(this));
                $('#todoTasks').on('click', this._bindTaskItemClick.bind(this));
            }
        }, {
            key: '_bindListItemClick',
            value: function _bindListItemClick(e) {
                var $elm = $(e.currentTarget),
                    $parent = $elm.closest('.js-list-parent'),
                    listId = $parent.data('listId') || '';

                if ($elm.hasClass('js-set')) {
                    this.listActive = listId;
                    Mediator.publish(this.model.getTasks(parseInt(this.listActive)), 'task');
                    Mediator.publish(this.listActive, 'listActive');
                } else if ($elm.hasClass('js-edit')) {
                    console.log('edit');
                } else if ($elm.hasClass('js-remove')) {
                    this.model.remove(listId);
                }
            }
        }, {
            key: '_bindTaskItemClick',
            value: function _bindTaskItemClick(e) {
                var $elm = $(e.target),
                    $parent = $elm.closest('.js-task-parent'),
                    taskId = $parent.data('taskId');

                if ($elm.hasClass('js-datetime')) {
                    console.log('>>> datetime', taskId);
                } else if ($elm.hasClass('js-done')) {
                    this._doneTask(taskId);
                } else if ($(e.target).closest('.js-edit').length) {
                    this._editTask(taskId);
                } else if ($(e.target).closest('.js-remove').length) {
                    this.model.removeTask(this.listActive, taskId);
                }
            }
        }, {
            key: '_bindNewListSubmit',
            value: function _bindNewListSubmit(e) {
                e.preventDefault();
                this.model.create(e.target);
                $('#newToDoList').val("");
            }
        }, {
            key: '_bindNewTaskSubmit',
            value: function _bindNewTaskSubmit(e) {
                e.preventDefault();
                this.model.update(e.target, this.listActive);
                $('#newToDoTask').val("");
            }
        }, {
            key: '_editTask',
            value: function _editTask(taskId) {
                var _this = this;

                var editTask = $('#editTask' + taskId);

                editTask.addClass('openForm');
                this.taskView.toggleEditTask(editTask);

                editTask.on('submit', function (e) {
                    e.preventDefault();
                    editTask.off('submit');

                    editTask.removeClass('openForm');
                    _this.taskView.toggleEditTask(editTask);
                    _this.model.updateTask(_this.listActive, taskId, {
                        field: 'description',
                        value: e.target.elements[0].value
                    });
                });
            }
        }, {
            key: '_doneTask',
            value: function _doneTask(taskId) {
                console.log('>>> taskDone');
            }
        }]);

        return Controller;
    }();

    window.todo = window.todo || {};
    window.todo.Controller = Controller;
})(window, jQuery);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, $, _) {
    "use strict";

    var ListView = function () {
        _createClass(ListView, null, [{
            key: "getRoot",
            value: function getRoot() {
                return $("#todoList");
            }
        }]);

        function ListView() {
            _classCallCheck(this, ListView);

            this.$root = ListView.getRoot();
        }

        _createClass(ListView, [{
            key: "render",
            value: function render(listTasks) {

                var $root = ListView.getRoot();
                $root.html('');

                _.forEach(listTasks, function (listItem) {
                    $root.append("<li class=\"list-group-item js-list-parent\" href=\"javascript:void(0)\" data-list-id=\"" + listItem.id + "\">\n                    <div class=\"d-flex w-100 justify-content-between\">\n                        <span><a class=\"js-set\" href=\"javascript:void(0)\">" + listItem.title + "</a></span>\n                        <span>\n                            <a class=\"js-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                            <a class=\"js-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                        </span>\n                    </div>\n                </li>");
                });
            }
        }, {
            key: "listActive",
            value: function listActive(listId) {
                ListView.getRoot().find('[data-list-id]').each(function (i, item) {
                    var $listItem = $(item);
                    $listItem.removeClass('active');

                    if (parseInt($listItem.data('listId')) === listId) {
                        $listItem.addClass('active');
                    }
                });
            }
        }]);

        return ListView;
    }();

    window.todo = window.todo || {};
    window.todo.ListView = ListView;
})(window, jQuery, _);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, _) {
    "use strict";

    var Model = function () {
        function Model(store) {
            _classCallCheck(this, Model);

            this.store = store;
            this.lists = {};
        }

        _createClass(Model, [{
            key: 'findAll',
            value: function findAll() {
                var _this = this;

                this.store.find().then(function (listIds) {
                    return Promise.all(listIds.map(function (listId) {
                        return _this.store.find(listId).then(function (res) {
                            return _.merge(res, { id: listId });
                        });
                    }));
                }).then(function (lists) {
                    _this.lists = lists;
                    Mediator.publish(_this.lists, 'list');
                });
            }
        }, {
            key: 'findOne',
            value: function findOne(listId) {
                this.store.find(listId).then(function (res) {
                    return Mediator.publish(res, 'task');
                }, function (err) {
                    return console.error(err);
                });
            }
        }, {
            key: 'create',
            value: function create(form) {
                var _this2 = this;

                var listId = Date.now(),
                    data = {
                    title: form.elements[0].value,
                    created: new Date().toString(),
                    tasks: []
                };

                this.store.create(listId, data).then(function (res) {
                    return res.created ? _this2.findAll() : console.log('not created');
                }, function (err) {
                    return console.log(err);
                });
            }
        }, {
            key: 'update',
            value: function update(form) {
                var listId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


                var list = this.getList(listId);

                list.tasks.push({
                    description: form.elements[0].value,
                    done: false,
                    deadline: Date.now()
                });

                this.store.update(listId, list).then(function (res) {
                    return res.updated ? Mediator.publish(list.tasks, 'task') : console.log(res);
                }, function (err) {
                    return console.log(err);
                });
            }
        }, {
            key: 'remove',
            value: function remove(listId) {
                var _this3 = this;

                this.store.remove(listId).then(function (res) {
                    return res.deleted ? _this3.findAll() : console.log('error:', res.error);
                }, function (err) {
                    return console.log(err);
                });
            }
        }, {
            key: 'getList',
            value: function getList(listId) {
                return this.lists.find(function (list) {
                    return list.id == listId;
                });
            }
        }, {
            key: 'getTasks',
            value: function getTasks() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                return this.lists.reduce(function (tasks, list) {
                    if (list.id == listId) {
                        return list.tasks;
                    }
                    return tasks;
                }, []);
            }
        }, {
            key: 'updateTask',
            value: function updateTask(listId, taskId, taskData) {
                var list = this.lists.find(function (list) {
                    return list.id == listId;
                });
                list.tasks[taskId][taskData.field] = taskData.value;

                this.store.update(listId, list).then(function (res) {
                    return res.updated ? Mediator.publish(list.tasks, 'task') : console.log(res);
                }, function (err) {
                    return console.log(err);
                });
            }
        }, {
            key: 'removeTask',
            value: function removeTask(listId, taskId) {
                var list = this.getList(listId);
                list.tasks.splice(taskId, 1);

                this.store.update(listId, list).then(function (res) {
                    return res.updated ? Mediator.publish(list.tasks, 'task') : console.log(res);
                }, function (err) {
                    return console.log(err);
                });
            }
        }]);

        return Model;
    }();

    window.todo = window.todo || {};
    window.todo.Model = Model;
})(window, _);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    "use strict";

    var Store = function () {
        function Store() {
            _classCallCheck(this, Store);

            this.endpoint = '/todo';
            this.STATE_READY = 4;
        }

        _createClass(Store, [{
            key: 'find',
            value: function find() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                return this.send('GET', listId);
            }
        }, {
            key: 'create',
            value: function create() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return this.send('POST', listId, { todo: JSON.stringify(data) });
            }
        }, {
            key: 'update',
            value: function update() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return this.send('PUT', listId, { todo: JSON.stringify(data) });
            }
        }, {
            key: 'remove',
            value: function remove() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                return this.send('DELETE', listId);
            }
        }, {
            key: 'send',
            value: function send() {
                var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';

                var _this = this;

                var listId = arguments[1];
                var data = arguments[2];


                var url = this.endpoint + '/' + (listId === 0 ? '' : listId);

                return new Promise(function (resolve, reject) {
                    var req = new XMLHttpRequest();

                    Mediator.publish('show', 'spinner');

                    req.open(method, url);
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.onload = function () {
                        if (req.status === 200) {
                            resolve(JSON.parse(req.response));
                        } else {
                            reject(Error(req.statusText));
                        }
                    };
                    req.onreadystatechange = function () {
                        if (req.readyState === _this.STATE_READY) {
                            Mediator.publish('hide', 'spinner');
                        }
                    };
                    req.onerror = function () {
                        return reject(Error("Network error"));
                    };
                    req.send(JSON.stringify(data));
                });
            }
        }]);

        return Store;
    }();

    window.todo = window.todo || {};
    window.todo.Store = Store;
})(window);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, $) {
    "use strict";

    var TaskView = function () {
        _createClass(TaskView, null, [{
            key: "getRoot",
            value: function getRoot() {
                return $("#todoTasks");
            }
        }]);

        function TaskView() {
            _classCallCheck(this, TaskView);

            this.$root = TaskView.getRoot();
            this.$dateTimeModal = $('#dateTimePicker');
            this.$dateTimeModal.find('select.date').drum();
        }

        _createClass(TaskView, [{
            key: "toggleEditTask",
            value: function toggleEditTask(task) {
                if (task.hasClass('openForm')) {
                    task.find('input').prop('type', 'text').focus();
                    task.find('span').hide();
                } else {
                    task.find('input').prop('type', 'hidden');
                    task.find('span').show();
                }
            }
        }, {
            key: "render",
            value: function render(tasks) {
                var $root = TaskView.getRoot();

                $root.html('');

                if (tasks.length === 0) {
                    $root.append("<tr>\n                    <td class=\"text-center\" colspan=\"3\">No Tasks!</td>\n                </tr>");
                } else {
                    for (var i = 0; i < tasks.length; i += 1) {
                        $root.append("<tr class=\"js-task-parent\" data-task-id=\"" + i + "\">\n                        <td>\n                            <div class=\"d-flex w-100 justify-content-between align-items-center\">\n                                <form id=\"editTask" + i + "\">\n                                    <span>" + tasks[i].description + "</span>\n                                    <input class=\"form-control\" type=\"hidden\" name=\"tasks[" + i + "]\" value=\"" + tasks[i].description + "\">\n                                </form>\n                                <span>\n                                    <a class=\"js-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                                    <a class=\"js-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                                </span>\n                            </div>\n                        </td>\n                        <td class=\"js-datetime\" data-timestamp=\"" + tasks[i].deadline + "\">" + (tasks[i].deadline ? moment(tasks[i]).format('DD.M.YYYY') : '---') + "</td>\n                        <td>\n                            <label class=\"js-done custom-control custom-checkbox\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" " + (tasks[i].done ? 'checked' : '') + ">\n                                <span class=\"custom-control-indicator\"></span>\n                            </label>\n                        </td>\n                    </tr>");
                    }
                }
            }
        }]);

        return TaskView;
    }();

    window.todo = window.todo || {};
    window.todo.TaskView = TaskView;
})(window, jQuery);
"use strict";

(function () {
    "use strict";

    var store = new todo.Store(),
        model = new todo.Model(store),
        listView = new todo.ListView(),
        taskView = new todo.TaskView(),
        controller = new todo.Controller(model, listView, taskView);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJ0eXBlIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJ3aW5kb3ciLCIkIiwiU3Bpbm5lciIsIiRyb290Iiwic2VsZWN0b3IiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsInRvZG8iLCJqUXVlcnkiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInNwaW5uZXIiLCJyZW5kZXIiLCJmaW5kQWxsIiwiYmluZCIsIm9uIiwiX2JpbmRMaXN0SXRlbUNsaWNrIiwiX2JpbmROZXdMaXN0U3VibWl0IiwiX2JpbmROZXdUYXNrU3VibWl0IiwiX2JpbmRUYXNrSXRlbUNsaWNrIiwiZSIsIiRlbG0iLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0SWQiLCJkYXRhIiwiaGFzQ2xhc3MiLCJnZXRUYXNrcyIsInBhcnNlSW50IiwiY29uc29sZSIsImxvZyIsInJlbW92ZSIsInRhcmdldCIsInRhc2tJZCIsIl9kb25lVGFzayIsIl9lZGl0VGFzayIsInJlbW92ZVRhc2siLCJwcmV2ZW50RGVmYXVsdCIsImNyZWF0ZSIsInZhbCIsInVwZGF0ZSIsImVkaXRUYXNrIiwiYWRkQ2xhc3MiLCJ0b2dnbGVFZGl0VGFzayIsIm9mZiIsInJlbW92ZUNsYXNzIiwidXBkYXRlVGFzayIsImZpZWxkIiwidmFsdWUiLCJlbGVtZW50cyIsIl8iLCJMaXN0VmlldyIsImdldFJvb3QiLCJsaXN0VGFza3MiLCJodG1sIiwiZm9yRWFjaCIsImFwcGVuZCIsImxpc3RJdGVtIiwiaWQiLCJ0aXRsZSIsImZpbmQiLCJlYWNoIiwiaXRlbSIsIiRsaXN0SXRlbSIsIk1vZGVsIiwic3RvcmUiLCJsaXN0cyIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwibGlzdCIsImdldExpc3QiLCJkZXNjcmlwdGlvbiIsImRvbmUiLCJkZWFkbGluZSIsInVwZGF0ZWQiLCJkZWxldGVkIiwicmVkdWNlIiwidGFza0RhdGEiLCJTdG9yZSIsImVuZHBvaW50IiwiU1RBVEVfUkVBRFkiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm1ldGhvZCIsInVybCIsInJlc29sdmUiLCJyZWplY3QiLCJyZXEiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25sb2FkIiwic3RhdHVzIiwicGFyc2UiLCJyZXNwb25zZSIsIkVycm9yIiwic3RhdHVzVGV4dCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJvbmVycm9yIiwiVGFza1ZpZXciLCIkZGF0ZVRpbWVNb2RhbCIsImRydW0iLCJ0YXNrIiwicHJvcCIsImZvY3VzIiwibW9tZW50IiwiZm9ybWF0IiwiY29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxXQUFZLFlBQU07QUFDcEI7O0FBRUEsV0FBTztBQUNIQyxxQkFBYTtBQUNUQyxpQkFBSyxFQURJLENBQ0Q7QUFEQyxTQURWOztBQUtIQyxpQkFMRyxxQkFLUUMsRUFMUixFQUswQjtBQUFBLGdCQUFkQyxJQUFjLHVFQUFQLEtBQU87O0FBQ3pCLGdCQUFJLE9BQU8sS0FBS0osV0FBTCxDQUFpQkksSUFBakIsQ0FBUCxLQUFrQyxXQUF0QyxFQUFt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LENBQXBCLEdBQTJELEtBYi9ILDZOQWdCa0V4QyxNQUFNekYsQ0FBTixFQUFTNkYsSUFBVCxHQUFnQixTQUFoQixHQUE0QixFQWhCOUY7QUFxQkg7QUFDSjtBQUNKO0FBM0RPOztBQUFBO0FBQUE7O0FBOERaMUYsV0FBT1EsSUFBUCxHQUFjUixPQUFPUSxJQUFQLElBQWUsRUFBN0I7QUFDQVIsV0FBT1EsSUFBUCxDQUFZK0csUUFBWixHQUF1QkEsUUFBdkI7QUFDSCxDQWhFRCxFQWdFR3ZILE1BaEVILEVBZ0VXUyxNQWhFWDs7O0FDQUMsYUFBWTtBQUNUOztBQUVBLFFBQU02RCxRQUFRLElBQUk5RCxLQUFLd0YsS0FBVCxFQUFkO0FBQUEsUUFDSXJGLFFBQVEsSUFBSUgsS0FBSzZELEtBQVQsQ0FBZUMsS0FBZixDQURaO0FBQUEsUUFFSTFELFdBQVcsSUFBSUosS0FBS2dELFFBQVQsRUFGZjtBQUFBLFFBR0kzQyxXQUFXLElBQUlMLEtBQUsrRyxRQUFULEVBSGY7QUFBQSxRQUlJUSxhQUFhLElBQUl2SCxLQUFLRSxVQUFULENBQW9CQyxLQUFwQixFQUEyQkMsUUFBM0IsRUFBcUNDLFFBQXJDLENBSmpCO0FBS0gsQ0FSQSxHQUFEIiwiZmlsZSI6InRhZy5tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgTWVkaWF0b3IgPSAoKCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaWJlcnM6IHtcbiAgICAgICAgICAgIGFueTogW10gLy8gZXZlbnQgdHlwZTogc3Vic2NyaWJlcnNcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJzY3JpYmUgKGZuLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XG4gICAgICAgIH0sXG4gICAgICAgIHVuc3Vic2NyaWJlIChmbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCd1bnN1YnNjcmliZScsIGZuLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVibGlzaCAocHVibGljYXRpb24sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygncHVibGlzaCcsIHB1YmxpY2F0aW9uLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRTdWJzY3JpYmVycyAoYWN0aW9uLCBhcmcsIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgbGV0IHN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVyc1t0eXBlXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdwdWJsaXNoJykge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyc1tpXSA9PT0gYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBsZXQgU3Bpbm5lciA9IHNlbGVjdG9yID0+IHtcbiAgICAgICAgY29uc3QgJHJvb3QgPSAkKHNlbGVjdG9yKTtcbiAgICAgICAgbGV0IHNob3cgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9nZ2xlOiAodHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgICh0eXBlID09PSAnc2hvdycpID8gJHJvb3Quc2hvdygpIDogJHJvb3QuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy5TcGlubmVyIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlNwaW5uZXIgPSBTcGlubmVyO1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIENvbnRyb2xsZXIge1xuICAgICAgICBjb25zdHJ1Y3RvciAobW9kZWwsIGxpc3RWaWV3LCB0YXNrVmlldykge1xuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICAgICAgdGhpcy5saXN0VmlldyA9IGxpc3RWaWV3O1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldyA9IHRhc2tWaWV3O1xuICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gJyc7XG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIgPSBuZXcgdG9kby5TcGlubmVyKCcjc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLmxpc3RWaWV3LnJlbmRlciwgJ2xpc3QnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnRhc2tWaWV3LnJlbmRlciwgJ3Rhc2snKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLmxpc3RWaWV3Lmxpc3RBY3RpdmUsICdsaXN0QWN0aXZlJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5zcGlubmVyLnRvZ2dsZSwgJ3NwaW5uZXInKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmZpbmRBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmluZCAoKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LiRyb290Lm9uKCdjbGljaycsICdhJywgdGhpcy5fYmluZExpc3RJdGVtQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjYWRkTmV3TGlzdEZvcm0nKS5vbignc3VibWl0JywgdGhpcy5fYmluZE5ld0xpc3RTdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjYWRkTmV3VGFza0Zvcm0nKS5vbignc3VibWl0JywgdGhpcy5fYmluZE5ld1Rhc2tTdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjdG9kb1Rhc2tzJykub24oJ2NsaWNrJywgdGhpcy5fYmluZFRhc2tJdGVtQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZExpc3RJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLmN1cnJlbnRUYXJnZXQpLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxtLmNsb3Nlc3QoJy5qcy1saXN0LXBhcmVudCcpLFxuICAgICAgICAgICAgICAgIGxpc3RJZCA9ICRwYXJlbnQuZGF0YSgnbGlzdElkJykgfHwgJyc7XG5cbiAgICAgICAgICAgIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1zZXQnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdEFjdGl2ZSA9IGxpc3RJZDtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwuZ2V0VGFza3MocGFyc2VJbnQodGhpcy5saXN0QWN0aXZlKSksICd0YXNrJyk7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RBY3RpdmUsICdsaXN0QWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWVkaXQnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZGl0Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLXJlbW92ZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5yZW1vdmUobGlzdElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kVGFza0l0ZW1DbGljayAoZSkge1xuICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUudGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtdGFzay1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICB0YXNrSWQgPSAkcGFyZW50LmRhdGEoJ3Rhc2tJZCcpO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtZGF0ZXRpbWUnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gZGF0ZXRpbWUnLCB0YXNrSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1kb25lJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb25lVGFzayh0YXNrSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtZWRpdCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRUYXNrKHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1yZW1vdmUnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdMaXN0U3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNyZWF0ZShlLnRhcmdldCk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld1Rhc2tTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlKGUudGFyZ2V0LCB0aGlzLmxpc3RBY3RpdmUpO1xuICAgICAgICAgICAgJCgnI25ld1RvRG9UYXNrJykudmFsKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2VkaXRUYXNrICh0YXNrSWQpIHtcbiAgICAgICAgICAgIGxldCBlZGl0VGFzayA9ICQoYCNlZGl0VGFzayR7dGFza0lkfWApO1xuXG4gICAgICAgICAgICBlZGl0VGFzay5hZGRDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuXG4gICAgICAgICAgICBlZGl0VGFzay5vbignc3VibWl0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGVkaXRUYXNrLm9mZignc3VibWl0Jyk7XG5cbiAgICAgICAgICAgICAgICBlZGl0VGFzay5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6ICdkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlLnRhcmdldC5lbGVtZW50c1swXS52YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfZG9uZVRhc2sgKHRhc2tJZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJz4+PiB0YXNrRG9uZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Db250cm9sbGVyID0gQ29udHJvbGxlcjtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIigod2luZG93LCAkLCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBMaXN0VmlldyB7XG5cbiAgICAgICAgc3RhdGljIGdldFJvb3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjdG9kb0xpc3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyIChsaXN0VGFza3MpIHtcblxuICAgICAgICAgICAgbGV0ICRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLXNldFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4ke2xpc3RJdGVtLnRpdGxlfTwvYT48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RBY3RpdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgTGlzdFZpZXcuZ2V0Um9vdCgpLmZpbmQoJ1tkYXRhLWxpc3QtaWRdJykuZWFjaCgoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCAkbGlzdEl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICRsaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGxpc3RJdGVtLmRhdGEoJ2xpc3RJZCcpKSA9PT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkxpc3RWaWV3ID0gTGlzdFZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIHRoaXMubGlzdHMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0SWRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpc3RJZHMubWFwKGxpc3RJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1lcmdlKHJlcywge2lkOiBsaXN0SWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS50aGVuKGxpc3RzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RzID0gbGlzdHM7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kT25lIChsaXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IE1lZGlhdG9yLnB1Ymxpc2gocmVzLCAndGFzaycpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SWQgPSBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlKGxpc3RJZCwgZGF0YSkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmNyZWF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKCdub3QgY3JlYXRlZCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChmb3JtLCBsaXN0SWQgPSAwKSB7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG5cbiAgICAgICAgICAgIGxpc3QudGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVhZGxpbmU6IERhdGUubm93KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnZXJyb3I6JywgcmVzLmVycm9yKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMuZmluZChsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFRhc2tzIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0cy5yZWR1Y2UoKHRhc2tzLCBsaXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QuaWQgPT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0LnRhc2tzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3M7XG4gICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVUYXNrIChsaXN0SWQsIHRhc2tJZCwgdGFza0RhdGEpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5saXN0cy5maW5kKCBsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGFza3NbdGFza0lkXVt0YXNrRGF0YS5maWVsZF0gPSB0YXNrRGF0YS52YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVUYXNrIChsaXN0SWQsIHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGFza3Muc3BsaWNlKHRhc2tJZCwgMSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Nb2RlbCA9IE1vZGVsO1xufSkod2luZG93LCBfKTtcbiIsIigod2luZG93KSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBTdG9yZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy5lbmRwb2ludCA9ICcvdG9kbyc7XG4gICAgICAgICAgICB0aGlzLlNUQVRFX1JFQURZID0gNDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmQgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0dFVCcsIGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnUE9TVCcsIGxpc3RJZCwge3RvZG86IEpTT04uc3RyaW5naWZ5KGRhdGEpfSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnUFVUJywgbGlzdElkLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnREVMRVRFJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmQgKG1ldGhvZCA9ICdHRVQnLCBsaXN0SWQsIGRhdGEpIHtcblxuICAgICAgICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5lbmRwb2ludH0vJHtsaXN0SWQgPT09IDAgPyAnJyA6IGxpc3RJZH1gO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCgnc2hvdycsICdzcGlubmVyJyk7XG5cbiAgICAgICAgICAgICAgICByZXEub3BlbihtZXRob2QsIHVybCk7XG4gICAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXEucmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT09IHRoaXMuU1RBVEVfUkVBRFkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goJ2hpZGUnLCAnc3Bpbm5lcicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHJlamVjdChFcnJvcihcIk5ldHdvcmsgZXJyb3JcIikpO1xuICAgICAgICAgICAgICAgIHJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TdG9yZSA9IFN0b3JlO1xufSkod2luZG93KTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBUYXNrVmlldyB7XG5cbiAgICAgICAgc3RhdGljIGdldFJvb3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjdG9kb1Rhc2tzXCIpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gVGFza1ZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgdGhpcy4kZGF0ZVRpbWVNb2RhbCA9ICQoJyNkYXRlVGltZVBpY2tlcicpO1xuICAgICAgICAgICAgdGhpcy4kZGF0ZVRpbWVNb2RhbC5maW5kKCdzZWxlY3QuZGF0ZScpLmRydW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUVkaXRUYXNrICh0YXNrKSB7XG4gICAgICAgICAgICBpZiAodGFzay5oYXNDbGFzcygnb3BlbkZvcm0nKSkge1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ3RleHQnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnc3BhbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyICh0YXNrcykge1xuICAgICAgICAgICAgbGV0ICRyb290ID0gVGFza1ZpZXcuZ2V0Um9vdCgpO1xuXG4gICAgICAgICAgICAkcm9vdC5odG1sKCcnKTtcblxuICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiIGNvbHNwYW49XCIzXCI+Tm8gVGFza3MhPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyIGNsYXNzPVwianMtdGFzay1wYXJlbnRcIiBkYXRhLXRhc2staWQ9XCIke2l9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJlZGl0VGFzayR7aX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dGFza3NbaV0uZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJ0YXNrc1ske2l9XVwiIHZhbHVlPVwiJHt0YXNrc1tpXS5kZXNjcmlwdGlvbn1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwianMtZGF0ZXRpbWVcIiBkYXRhLXRpbWVzdGFtcD1cIiR7dGFza3NbaV0uZGVhZGxpbmV9XCI+JHt0YXNrc1tpXS5kZWFkbGluZSA/IG1vbWVudCh0YXNrc1tpXSkuZm9ybWF0KCdERC5NLllZWVknKSA6ICctLS0nfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwianMtZG9uZSBjdXN0b20tY29udHJvbCBjdXN0b20tY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2tzW2ldLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uVGFza1ZpZXcgPSBUYXNrVmlldztcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjb25zdCBzdG9yZSA9IG5ldyB0b2RvLlN0b3JlKCksXG4gICAgICAgIG1vZGVsID0gbmV3IHRvZG8uTW9kZWwoc3RvcmUpLFxuICAgICAgICBsaXN0VmlldyA9IG5ldyB0b2RvLkxpc3RWaWV3KCksXG4gICAgICAgIHRhc2tWaWV3ID0gbmV3IHRvZG8uVGFza1ZpZXcoKSxcbiAgICAgICAgY29udHJvbGxlciA9IG5ldyB0b2RvLkNvbnRyb2xsZXIobW9kZWwsIGxpc3RWaWV3LCB0YXNrVmlldyk7XG59KCkpO1xuXG4iXX0=
