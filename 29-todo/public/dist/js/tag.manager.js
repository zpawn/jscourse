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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJ0eXBlIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJ3aW5kb3ciLCIkIiwiU3Bpbm5lciIsIiRyb290Iiwic2VsZWN0b3IiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsInRvZG8iLCJqUXVlcnkiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInNwaW5uZXIiLCJyZW5kZXIiLCJmaW5kQWxsIiwiYmluZCIsIm9uIiwiX2JpbmRMaXN0SXRlbUNsaWNrIiwiX2JpbmROZXdMaXN0U3VibWl0IiwiX2JpbmROZXdUYXNrU3VibWl0IiwiX2JpbmRUYXNrSXRlbUNsaWNrIiwiZSIsIiRlbG0iLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0SWQiLCJkYXRhIiwiaGFzQ2xhc3MiLCJnZXRUYXNrcyIsInBhcnNlSW50IiwiX2VkaXRMaXN0IiwicmVtb3ZlIiwidGFyZ2V0IiwidGFza0lkIiwiY29uc29sZSIsImxvZyIsIl9kb25lVGFzayIsInVwZGF0ZVRhc2siLCJmaWVsZCIsInZhbHVlIiwiZmluZCIsInByb3AiLCJfZWRpdFRhc2siLCJyZW1vdmVUYXNrIiwiZWRpdExpc3QiLCJhZGRDbGFzcyIsInRvZ2dsZUVkaXRMaXN0IiwicHJldmVudERlZmF1bHQiLCJvZmYiLCJyZW1vdmVDbGFzcyIsInVwZGF0ZUxpc3QiLCJlbGVtZW50cyIsImNyZWF0ZSIsInZhbCIsInVwZGF0ZSIsImVkaXRUYXNrIiwidG9nZ2xlRWRpdFRhc2siLCJfIiwiTGlzdFZpZXciLCJnZXRSb290IiwibGlzdCIsImZvY3VzIiwibGlzdFRhc2tzIiwiaHRtbCIsImZvckVhY2giLCJhcHBlbmQiLCJsaXN0SXRlbSIsImlkIiwidGl0bGUiLCJlYWNoIiwiaXRlbSIsIiRsaXN0SXRlbSIsIk1vZGVsIiwic3RvcmUiLCJsaXN0cyIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwiZ2V0TGlzdCIsImRlc2NyaXB0aW9uIiwiZG9uZSIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsInRhc2siLCJtb21lbnQiLCJmb3JtYXQiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVksWUFBTTtBQUNwQjs7QUFFQSxXQUFPO0FBQ0hDLHFCQUFhO0FBQ1RDLGlCQUFLLEVBREksQ0FDRDtBQURDLFNBRFY7O0FBS0hDLGlCQUxHLHFCQUtRQyxFQUxSLEVBSzBCO0FBQUEsZ0JBQWRDLElBQWMsdUVBQVAsS0FB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LFFBRUlqRSxXQUFXLElBQUlKLEtBQUtzRCxRQUFULEVBRmY7QUFBQSxRQUdJakQsV0FBVyxJQUFJTCxLQUFLc0gsUUFBVCxFQUhmO0FBQUEsUUFJSU0sYUFBYSxJQUFJNUgsS0FBS0UsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxRQUFyQyxDQUpqQjtBQUtILENBUkEsR0FBRCIsImZpbGUiOiJ0YWcubWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1lZGlhdG9yID0gKCgpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZXJzOiB7XG4gICAgICAgICAgICBhbnk6IFtdIC8vIGV2ZW50IHR5cGU6IHN1YnNjcmliZXJzXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3Vic2NyaWJlIChmbiwgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xuICAgICAgICB9LFxuICAgICAgICB1bnN1YnNjcmliZSAoZm4sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygndW5zdWJzY3JpYmUnLCBmbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1Ymxpc2ggKHB1YmxpY2F0aW9uLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3B1Ymxpc2gnLCBwdWJsaWNhdGlvbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0U3Vic2NyaWJlcnMgKGFjdGlvbiwgYXJnLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncHVibGlzaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbaV0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IFNwaW5uZXIgPSBzZWxlY3RvciA9PiB7XG4gICAgICAgIGNvbnN0ICRyb290ID0gJChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBzaG93ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvZ2dsZTogKHR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gJ3Nob3cnKSA/ICRyb290LnNob3coKSA6ICRyb290LmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cuU3Bpbm5lciB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TcGlubmVyID0gU3Bpbm5lcjtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBDb250cm9sbGVyIHtcbiAgICAgICAgY29uc3RydWN0b3IgKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcgPSBsaXN0VmlldztcbiAgICAgICAgICAgIHRoaXMudGFza1ZpZXcgPSB0YXNrVmlldztcbiAgICAgICAgICAgIHRoaXMubGlzdEFjdGl2ZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zcGlubmVyID0gbmV3IHRvZG8uU3Bpbm5lcignI3NwaW5uZXInKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5yZW5kZXIsICdsaXN0Jyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy50YXNrVmlldy5yZW5kZXIsICd0YXNrJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMuc3Bpbm5lci50b2dnbGUsICdzcGlubmVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQgKCkge1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy4kcm9vdC5vbignY2xpY2snLCAnYScsIHRoaXMuX2JpbmRMaXN0SXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld0xpc3RGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdMaXN0U3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld1Rhc2tGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdUYXNrU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3RvZG9UYXNrcycpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRUYXNrSXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRMaXN0SXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlKGxpc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFRhc2tJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLXRhc2stcGFyZW50JyksXG4gICAgICAgICAgICAgICAgdGFza0lkID0gJHBhcmVudC5kYXRhKCd0YXNrSWQnKTtcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRhdGV0aW1lJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPj4+IGRhdGV0aW1lJywgdGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZG9uZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9uZVRhc2sodGFza0lkKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6ICdkb25lJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICEkZWxtLmZpbmQoJ2lucHV0JykucHJvcCgnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1lZGl0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdFRhc2sodGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLXJlbW92ZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRMaXN0ID0gdGhpcy5saXN0Vmlldy4kcm9vdC5maW5kKGAjZWRpdExpc3Qke2xpc3RJZH1gKTtcblxuICAgICAgICAgICAgZWRpdExpc3QuYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcblxuICAgICAgICAgICAgZWRpdExpc3Qub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdExpc3QucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaXN0KGxpc3RJZCwgZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld0xpc3RTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuY3JlYXRlKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvTGlzdCcpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3VGFza1N1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGUoZS50YXJnZXQsIHRoaXMubGlzdEFjdGl2ZSk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb1Rhc2snKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdFRhc2sgKHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRUYXNrID0gJChgI2VkaXRUYXNrJHt0YXNrSWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRUYXNrLnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9kb25lVGFzayAodGFza0lkKSB7fVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9MaXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUVkaXRMaXN0IChsaXN0KSB7XG4gICAgICAgICAgICBpZiAobGlzdC5oYXNDbGFzcygnb3BlbkZvcm0nKSkge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ3RleHQnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdzcGFuJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyIChsaXN0VGFza3MpIHtcblxuICAgICAgICAgICAgbGV0ICRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRMaXN0JHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLXNldFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4ke2xpc3RJdGVtLnRpdGxlfTwvYT48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJsaXN0c1ske2xpc3RJdGVtLmlkfV1cIiB2YWx1ZT1cIiR7bGlzdEl0ZW0udGl0bGV9XCI+ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RBY3RpdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgTGlzdFZpZXcuZ2V0Um9vdCgpLmZpbmQoJ1tkYXRhLWxpc3QtaWRdJykuZWFjaCgoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCAkbGlzdEl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICRsaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGxpc3RJdGVtLmRhdGEoJ2xpc3RJZCcpKSA9PT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkxpc3RWaWV3ID0gTGlzdFZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIHRoaXMubGlzdHMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0SWRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpc3RJZHMubWFwKGxpc3RJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1lcmdlKHJlcywge2lkOiBsaXN0SWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS50aGVuKGxpc3RzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RzID0gbGlzdHM7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kT25lIChsaXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IE1lZGlhdG9yLnB1Ymxpc2gocmVzLCAndGFzaycpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SWQgPSBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlKGxpc3RJZCwgZGF0YSkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmNyZWF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKCdub3QgY3JlYXRlZCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChmb3JtLCBsaXN0SWQgPSAwKSB7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG5cbiAgICAgICAgICAgIGxpc3QudGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVhZGxpbmU6IERhdGUubm93KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnZXJyb3I6JywgcmVzLmVycm9yKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMuZmluZChsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZUxpc3QgKGxpc3RJZCA9IDAsIGxpc3RUaXRsZSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGl0bGUgPSBsaXN0VGl0bGU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUYXNrcyAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMucmVkdWNlKCh0YXNrcywgbGlzdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmlkID09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdC50YXNrcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2tzO1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlVGFzayAobGlzdElkLCB0YXNrSWQsIHRhc2tEYXRhKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMubGlzdHMuZmluZCggbGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzW3Rhc2tJZF1bdGFza0RhdGEuZmllbGRdID0gdGFza0RhdGEudmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVGFzayAobGlzdElkLCB0YXNrSWQpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzLnNwbGljZSh0YXNrSWQsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTW9kZWwgPSBNb2RlbDtcbn0pKHdpbmRvdywgXyk7XG4iLCIoKHdpbmRvdykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kcG9pbnQgPSAnL3RvZG8nO1xuICAgICAgICAgICAgdGhpcy5TVEFURV9SRUFEWSA9IDQ7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdHRVQnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChsaXN0SWQgPSAwLCBkYXRhID0ge30pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BPU1QnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChsaXN0SWQgPSAwLCBkYXRhID0ge30pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BVVCcsIGxpc3RJZCwge3RvZG86IEpTT04uc3RyaW5naWZ5KGRhdGEpfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0RFTEVURScsIGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZW5kIChtZXRob2QgPSAnR0VUJywgbGlzdElkLCBkYXRhKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuZW5kcG9pbnR9LyR7bGlzdElkID09PSAwID8gJycgOiBsaXN0SWR9YDtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goJ3Nob3cnLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSB0aGlzLlNUQVRFX1JFQURZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdoaWRlJywgJ3NwaW5uZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoRXJyb3IoXCJOZXR3b3JrIGVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3RvcmUgPSBTdG9yZTtcbn0pKHdpbmRvdyk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgVGFza1ZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9UYXNrc1wiKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwgPSAkKCcjZGF0ZVRpbWVQaWNrZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwuZmluZCgnc2VsZWN0LmRhdGUnKS5kcnVtKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0VGFzayAodGFzaykge1xuICAgICAgICAgICAgaWYgKHRhc2suaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAodGFza3MpIHtcbiAgICAgICAgICAgIGxldCAkcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcblxuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidGV4dC1jZW50ZXJcIiBjb2xzcGFuPVwiM1wiPk5vIFRhc2tzITwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLmZvckVhY2godGFza3MsICh0YXNrLCB0YXNrSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHIgY2xhc3M9XCJqcy10YXNrLXBhcmVudFwiIGRhdGEtdGFzay1pZD1cIiR7dGFza0lkfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiZWRpdFRhc2ske3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dGFzay5kZXNjcmlwdGlvbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInRhc2tzWyR7dGFza0lkfV1cIiB2YWx1ZT1cIiR7dGFzay5kZXNjcmlwdGlvbn1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwianMtZGF0ZXRpbWVcIiBkYXRhLXRpbWVzdGFtcD1cIiR7dGFzay5kZWFkbGluZX1cIj4ke3Rhc2suZGVhZGxpbmUgPyBtb21lbnQodGFzay5kZWFkbGluZSkuZm9ybWF0KCdERC5NLllZWVknKSA6ICctLS0nfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwianMtZG9uZSBjdXN0b20tY29udHJvbCBjdXN0b20tY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2suZG9uZSA/ICdjaGVja2VkJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXN0b20tY29udHJvbC1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlRhc2tWaWV3ID0gVGFza1ZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgdG9kby5TdG9yZSgpLFxuICAgICAgICBtb2RlbCA9IG5ldyB0b2RvLk1vZGVsKHN0b3JlKSxcbiAgICAgICAgbGlzdFZpZXcgPSBuZXcgdG9kby5MaXN0VmlldygpLFxuICAgICAgICB0YXNrVmlldyA9IG5ldyB0b2RvLlRhc2tWaWV3KCksXG4gICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgdG9kby5Db250cm9sbGVyKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpO1xufSgpKTtcblxuIl19
