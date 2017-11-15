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
                    this._editList(listId);
                } else if ($elm.hasClass('js-remove')) {
                    this.model.remove(listId);
                }
            }
        }, {
            key: '_editList',
            value: function _editList(listId) {
                var _this = this;

                var editList = this.listView.$root.find('#editList' + listId);

                editList.addClass('openForm');
                this.listView.toggleEditList(editList);

                editList.on('submit', function (e) {
                    e.preventDefault();
                    editList.off('submit');

                    editList.removeClass('openForm');
                    _this.listView.toggleEditList(editList);
                    _this.model.updateList(listId, e.target.elements[0].value);
                });
            }
        }, {
            key: '_bindNewListSubmit',
            value: function _bindNewListSubmit(e) {
                e.preventDefault();
                this.model.create(e.target);
                $('#newToDoList').val("");
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
                    this.model.updateTask(this.listActive, taskId, {
                        field: 'done',
                        value: !$elm.find('input').prop('checked')
                    });
                } else if ($(e.target).closest('.js-edit').length) {
                    this._editTask(taskId);
                } else if ($(e.target).closest('.js-remove').length) {
                    this.model.removeTask(this.listActive, taskId);
                }
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
                var _this2 = this;

                var editTask = $('#editTask' + taskId);

                editTask.addClass('openForm');
                this.taskView.toggleEditTask(editTask);

                editTask.on('submit', function (e) {
                    e.preventDefault();
                    editTask.off('submit');

                    editTask.removeClass('openForm');
                    _this2.taskView.toggleEditTask(editTask);
                    _this2.model.updateTask(_this2.listActive, taskId, {
                        field: 'description',
                        value: e.target.elements[0].value
                    });
                });

                editTask.on('focusout', function (e) {
                    editTask.removeClass('openForm');
                    _this2.taskView.toggleEditTask(editTask);
                    editTask.off('focusout');
                });
            }
        }, {
            key: '_doneTask',
            value: function _doneTask(taskId) {}
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
            key: "toggleEditList",
            value: function toggleEditList(list) {
                if (list.hasClass('openForm')) {
                    list.find('input').prop('type', 'text').focus();
                    list.find('span').hide();
                } else {
                    list.find('input').prop('type', 'hidden');
                    list.find('span').show();
                }
            }
        }, {
            key: "render",
            value: function render(listTasks) {

                var $root = ListView.getRoot();
                $root.html('');

                _.forEach(listTasks, function (listItem) {
                    $root.append("<li class=\"list-group-item js-list-parent\" href=\"javascript:void(0)\" data-list-id=\"" + listItem.id + "\">\n                    <div class=\"d-flex w-100 justify-content-between\">\n                        <form id=\"editList" + listItem.id + "\">\n                            <span><a class=\"js-set\" href=\"javascript:void(0)\">" + listItem.title + "</a></span>\n                            <input class=\"form-control\" type=\"hidden\" name=\"lists[" + listItem.id + "]\" value=\"" + listItem.title + "\">                        \n                        </form>\n                        <span>\n                            <a class=\"js-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                            <a class=\"js-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                        </span>\n                    </div>\n                </li>");
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
            key: 'updateList',
            value: function updateList() {
                var _this4 = this;

                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var listTitle = arguments[1];

                var list = this.getList(listId);
                list.title = listTitle;

                this.store.update(listId, list).then(function (res) {
                    return res.updated ? _this4.findAll() : console.log(res);
                }, function (err) {
                    return console.log(err);
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

(function (window, $, _) {
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

                    _.forEach(tasks, function (task, taskId) {
                        $root.append("<tr class=\"js-task-parent\" data-task-id=\"" + taskId + "\">\n                        <td>\n                            <div class=\"d-flex w-100 justify-content-between align-items-center\">\n                                <form id=\"editTask" + taskId + "\">\n                                    <span>" + task.description + "</span>\n                                    <input class=\"form-control\" type=\"hidden\" name=\"tasks[" + taskId + "]\" value=\"" + task.description + "\">\n                                </form>\n                                <span>\n                                    <a class=\"js-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                                    <a class=\"js-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                                </span>\n                            </div>\n                        </td>\n                        <td class=\"js-datetime\" data-timestamp=\"" + task.deadline + "\">" + (task.deadline ? moment(task.deadline).format('DD.M.YYYY') : '---') + "</td>\n                        <td>\n                            <label class=\"js-done custom-control custom-checkbox\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" " + (task.done ? 'checked' : '') + ">\n                                <span class=\"custom-control-indicator\"></span>\n                            </label>\n                        </td>\n                    </tr>");
                    });
                }
            }
        }]);

        return TaskView;
    }();

    window.todo = window.todo || {};
    window.todo.TaskView = TaskView;
})(window, jQuery, _);
"use strict";

(function () {
    "use strict";

    var store = new todo.Store(),
        model = new todo.Model(store),
        listView = new todo.ListView(),
        taskView = new todo.TaskView(),
        controller = new todo.Controller(model, listView, taskView);
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJ0eXBlIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJ3aW5kb3ciLCIkIiwiU3Bpbm5lciIsIiRyb290Iiwic2VsZWN0b3IiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsInRvZG8iLCJqUXVlcnkiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInNwaW5uZXIiLCJyZW5kZXIiLCJmaW5kQWxsIiwiYmluZCIsIm9uIiwiX2JpbmRMaXN0SXRlbUNsaWNrIiwiX2JpbmROZXdMaXN0U3VibWl0IiwiX2JpbmROZXdUYXNrU3VibWl0IiwiX2JpbmRUYXNrSXRlbUNsaWNrIiwiZSIsIiRlbG0iLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0SWQiLCJkYXRhIiwiaGFzQ2xhc3MiLCJnZXRUYXNrcyIsInBhcnNlSW50IiwiX2VkaXRMaXN0IiwicmVtb3ZlIiwiZWRpdExpc3QiLCJmaW5kIiwiYWRkQ2xhc3MiLCJ0b2dnbGVFZGl0TGlzdCIsInByZXZlbnREZWZhdWx0Iiwib2ZmIiwicmVtb3ZlQ2xhc3MiLCJ1cGRhdGVMaXN0IiwidGFyZ2V0IiwiZWxlbWVudHMiLCJ2YWx1ZSIsImNyZWF0ZSIsInZhbCIsInRhc2tJZCIsImNvbnNvbGUiLCJsb2ciLCJfZG9uZVRhc2siLCJ1cGRhdGVUYXNrIiwiZmllbGQiLCJwcm9wIiwiX2VkaXRUYXNrIiwicmVtb3ZlVGFzayIsInVwZGF0ZSIsImVkaXRUYXNrIiwidG9nZ2xlRWRpdFRhc2siLCJfIiwiTGlzdFZpZXciLCJnZXRSb290IiwibGlzdCIsImZvY3VzIiwibGlzdFRhc2tzIiwiaHRtbCIsImZvckVhY2giLCJhcHBlbmQiLCJsaXN0SXRlbSIsImlkIiwidGl0bGUiLCJlYWNoIiwiaXRlbSIsIiRsaXN0SXRlbSIsIk1vZGVsIiwic3RvcmUiLCJsaXN0cyIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwiZ2V0TGlzdCIsImRlc2NyaXB0aW9uIiwiZG9uZSIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsInRhc2siLCJtb21lbnQiLCJmb3JtYXQiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVksWUFBTTtBQUNwQjs7QUFFQSxXQUFPO0FBQ0hDLHFCQUFhO0FBQ1RDLGlCQUFLLEVBREksQ0FDRDtBQURDLFNBRFY7O0FBS0hDLGlCQUxHLHFCQUtRQyxFQUxSLEVBSzBCO0FBQUEsZ0JBQWRDLElBQWMsdUVBQVAsS0FB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dkI7QUFDSCxDQWpFRCxFQWlFRzlILE1BakVILEVBaUVXUyxNQWpFWCxFQWlFbUJvRCxDQWpFbkI7OztBQ0FDLGFBQVk7QUFDVDs7QUFFQSxRQUFNZ0IsUUFBUSxJQUFJckUsS0FBSytGLEtBQVQsRUFBZDtBQUFBLFFBQ0k1RixRQUFRLElBQUlILEtBQUtvRSxLQUFULENBQWVDLEtBQWYsQ0FEWjtBQUFBLFFBRUlqRSxXQUFXLElBQUlKLEtBQUtzRCxRQUFULEVBRmY7QUFBQSxRQUdJakQsV0FBVyxJQUFJTCxLQUFLc0gsUUFBVCxFQUhmO0FBQUEsUUFJSU0sYUFBYSxJQUFJNUgsS0FBS0UsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxRQUFyQyxDQUpqQjtBQUtILENBUkEsR0FBRCIsImZpbGUiOiJ0YWcubWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1lZGlhdG9yID0gKCgpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZXJzOiB7XG4gICAgICAgICAgICBhbnk6IFtdIC8vIGV2ZW50IHR5cGU6IHN1YnNjcmliZXJzXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3Vic2NyaWJlIChmbiwgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xuICAgICAgICB9LFxuICAgICAgICB1bnN1YnNjcmliZSAoZm4sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygndW5zdWJzY3JpYmUnLCBmbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1Ymxpc2ggKHB1YmxpY2F0aW9uLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3B1Ymxpc2gnLCBwdWJsaWNhdGlvbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0U3Vic2NyaWJlcnMgKGFjdGlvbiwgYXJnLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncHVibGlzaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbaV0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IFNwaW5uZXIgPSBzZWxlY3RvciA9PiB7XG4gICAgICAgIGNvbnN0ICRyb290ID0gJChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBzaG93ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvZ2dsZTogKHR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gJ3Nob3cnKSA/ICRyb290LnNob3coKSA6ICRyb290LmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cuU3Bpbm5lciB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TcGlubmVyID0gU3Bpbm5lcjtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBDb250cm9sbGVyIHtcbiAgICAgICAgY29uc3RydWN0b3IgKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcgPSBsaXN0VmlldztcbiAgICAgICAgICAgIHRoaXMudGFza1ZpZXcgPSB0YXNrVmlldztcbiAgICAgICAgICAgIHRoaXMubGlzdEFjdGl2ZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zcGlubmVyID0gbmV3IHRvZG8uU3Bpbm5lcignI3NwaW5uZXInKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5yZW5kZXIsICdsaXN0Jyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy50YXNrVmlldy5yZW5kZXIsICd0YXNrJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMuc3Bpbm5lci50b2dnbGUsICdzcGlubmVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQgKCkge1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy4kcm9vdC5vbignY2xpY2snLCAnYScsIHRoaXMuX2JpbmRMaXN0SXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld0xpc3RGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdMaXN0U3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld1Rhc2tGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdUYXNrU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3RvZG9UYXNrcycpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRUYXNrSXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRMaXN0SXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlKGxpc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRMaXN0ID0gdGhpcy5saXN0Vmlldy4kcm9vdC5maW5kKGAjZWRpdExpc3Qke2xpc3RJZH1gKTtcblxuICAgICAgICAgICAgZWRpdExpc3QuYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcblxuICAgICAgICAgICAgZWRpdExpc3Qub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdExpc3QucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaXN0KGxpc3RJZCwgZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld0xpc3RTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuY3JlYXRlKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvTGlzdCcpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kVGFza0l0ZW1DbGljayAoZSkge1xuICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUudGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtdGFzay1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICB0YXNrSWQgPSAkcGFyZW50LmRhdGEoJ3Rhc2tJZCcpO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtZGF0ZXRpbWUnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gZGF0ZXRpbWUnLCB0YXNrSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1kb25lJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kb25lVGFzayh0YXNrSWQpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2RvbmUnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogISRlbG0uZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLWVkaXQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0VGFzayh0YXNrSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtcmVtb3ZlJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5yZW1vdmVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3VGFza1N1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGUoZS50YXJnZXQsIHRoaXMubGlzdEFjdGl2ZSk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb1Rhc2snKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdFRhc2sgKHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRUYXNrID0gJChgI2VkaXRUYXNrJHt0YXNrSWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRUYXNrLnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdFRhc2sub24oJ2ZvY3Vzb3V0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdmb2N1c291dCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfZG9uZVRhc2sgKHRhc2tJZCkge31cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkNvbnRyb2xsZXIgPSBDb250cm9sbGVyO1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIExpc3RWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvTGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBMaXN0Vmlldy5nZXRSb290KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0TGlzdCAobGlzdCkge1xuICAgICAgICAgICAgaWYgKGxpc3QuaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2gobGlzdFRhc2tzLCBsaXN0SXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0ganMtbGlzdC1wYXJlbnRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgZGF0YS1saXN0LWlkPVwiJHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJlZGl0TGlzdCR7bGlzdEl0ZW0uaWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGEgY2xhc3M9XCJqcy1zZXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+JHtsaXN0SXRlbS50aXRsZX08L2E+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibGlzdHNbJHtsaXN0SXRlbS5pZH1dXCIgdmFsdWU9XCIke2xpc3RJdGVtLnRpdGxlfVwiPiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPmApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0QWN0aXZlIChsaXN0SWQpIHtcbiAgICAgICAgICAgIExpc3RWaWV3LmdldFJvb3QoKS5maW5kKCdbZGF0YS1saXN0LWlkXScpLmVhY2goKGksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgJGxpc3RJdGVtID0gJChpdGVtKTtcbiAgICAgICAgICAgICAgICAkbGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KCRsaXN0SXRlbS5kYXRhKCdsaXN0SWQnKSkgPT09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5MaXN0VmlldyA9IExpc3RWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKCh3aW5kb3csIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIE1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgICAgICB0aGlzLmxpc3RzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQWxsICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZCgpLnRoZW4oXG4gICAgICAgICAgICAgICAgbGlzdElkcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChsaXN0SWRzLm1hcChsaXN0SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tZXJnZShyZXMsIHtpZDogbGlzdElkfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkudGhlbihsaXN0cyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0cyA9IGxpc3RzO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZE9uZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiBNZWRpYXRvci5wdWJsaXNoKHJlcywgJ3Rhc2snKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChmb3JtKSB7XG4gICAgICAgICAgICBsZXQgbGlzdElkID0gRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICB0YXNrczogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZShsaXN0SWQsIGRhdGEpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5jcmVhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnbm90IGNyZWF0ZWQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAoZm9ybSwgbGlzdElkID0gMCkge1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuXG4gICAgICAgICAgICBsaXN0LnRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRlYWRsaW5lOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5yZW1vdmUobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuZGVsZXRlZCA/IHRoaXMuZmluZEFsbCgpIDogY29uc29sZS5sb2coJ2Vycm9yOicsIHJlcy5lcnJvciksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRMaXN0IChsaXN0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLmZpbmQobGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVMaXN0IChsaXN0SWQgPSAwLCBsaXN0VGl0bGUpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRpdGxlID0gbGlzdFRpdGxlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VGFza3MgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLnJlZHVjZSgodGFza3MsIGxpc3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pZCA9PSBsaXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QudGFza3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrcztcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVRhc2sgKGxpc3RJZCwgdGFza0lkLCB0YXNrRGF0YSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmxpc3RzLmZpbmQoIGxpc3QgPT4gbGlzdC5pZCA9PSBsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrc1t0YXNrSWRdW3Rhc2tEYXRhLmZpZWxkXSA9IHRhc2tEYXRhLnZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVRhc2sgKGxpc3RJZCwgdGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrcy5zcGxpY2UodGFza0lkLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLk1vZGVsID0gTW9kZWw7XG59KSh3aW5kb3csIF8pO1xuIiwiKCh3aW5kb3cpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLmVuZHBvaW50ID0gJy90b2RvJztcbiAgICAgICAgICAgIHRoaXMuU1RBVEVfUkVBRFkgPSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZCAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgbGlzdElkLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdERUxFVEUnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobWV0aG9kID0gJ0dFVCcsIGxpc3RJZCwgZGF0YSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3RJZCA9PT0gMCA/ICcnIDogbGlzdElkfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdzaG93JywgJ3NwaW5uZXInKTtcblxuICAgICAgICAgICAgICAgIHJlcS5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gICAgICAgICAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHJlcS5yZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gdGhpcy5TVEFURV9SRUFEWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCgnaGlkZScsICdzcGlubmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KEVycm9yKFwiTmV0d29yayBlcnJvclwiKSk7XG4gICAgICAgICAgICAgICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlN0b3JlID0gU3RvcmU7XG59KSh3aW5kb3cpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFRhc2tWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvVGFza3NcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsID0gJCgnI2RhdGVUaW1lUGlja2VyJyk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsLmZpbmQoJ3NlbGVjdC5kYXRlJykuZHJ1bSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlRWRpdFRhc2sgKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLmhhc0NsYXNzKCdvcGVuRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAndGV4dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKHRhc2tzKSB7XG4gICAgICAgICAgICBsZXQgJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG5cbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRleHQtY2VudGVyXCIgY29sc3Bhbj1cIjNcIj5ObyBUYXNrcyE8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKHRhc2tzLCAodGFzaywgdGFza0lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyIGNsYXNzPVwianMtdGFzay1wYXJlbnRcIiBkYXRhLXRhc2staWQ9XCIke3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRUYXNrJHt0YXNrSWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3Rhc2suZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJ0YXNrc1ske3Rhc2tJZH1dXCIgdmFsdWU9XCIke3Rhc2suZGVzY3JpcHRpb259XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImpzLWRhdGV0aW1lXCIgZGF0YS10aW1lc3RhbXA9XCIke3Rhc2suZGVhZGxpbmV9XCI+JHt0YXNrLmRlYWRsaW5lID8gbW9tZW50KHRhc2suZGVhZGxpbmUpLmZvcm1hdCgnREQuTS5ZWVlZJykgOiAnLS0tJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImpzLWRvbmUgY3VzdG9tLWNvbnRyb2wgY3VzdG9tLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWlucHV0XCIgJHt0YXNrLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5UYXNrVmlldyA9IFRhc2tWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IHN0b3JlID0gbmV3IHRvZG8uU3RvcmUoKSxcbiAgICAgICAgbW9kZWwgPSBuZXcgdG9kby5Nb2RlbChzdG9yZSksXG4gICAgICAgIGxpc3RWaWV3ID0gbmV3IHRvZG8uTGlzdFZpZXcoKSxcbiAgICAgICAgdGFza1ZpZXcgPSBuZXcgdG9kby5UYXNrVmlldygpLFxuICAgICAgICBjb250cm9sbGVyID0gbmV3IHRvZG8uQ29udHJvbGxlcihtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KTtcbn0oKSk7XG5cbiJdfQ==
