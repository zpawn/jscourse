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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJ0eXBlIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJ3aW5kb3ciLCIkIiwiU3Bpbm5lciIsIiRyb290Iiwic2VsZWN0b3IiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsInRvZG8iLCJqUXVlcnkiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInNwaW5uZXIiLCJyZW5kZXIiLCJmaW5kQWxsIiwiYmluZCIsIm9uIiwiX2JpbmRMaXN0SXRlbUNsaWNrIiwiX2JpbmROZXdMaXN0U3VibWl0IiwiX2JpbmROZXdUYXNrU3VibWl0IiwiX2JpbmRUYXNrSXRlbUNsaWNrIiwiZSIsIiRlbG0iLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0SWQiLCJkYXRhIiwiaGFzQ2xhc3MiLCJnZXRUYXNrcyIsInBhcnNlSW50IiwiX2VkaXRMaXN0IiwicmVtb3ZlIiwidGFyZ2V0IiwidGFza0lkIiwiY29uc29sZSIsImxvZyIsIl9kb25lVGFzayIsIl9lZGl0VGFzayIsInJlbW92ZVRhc2siLCJlZGl0TGlzdCIsImZpbmQiLCJhZGRDbGFzcyIsInRvZ2dsZUVkaXRMaXN0IiwicHJldmVudERlZmF1bHQiLCJvZmYiLCJyZW1vdmVDbGFzcyIsInVwZGF0ZUxpc3QiLCJlbGVtZW50cyIsInZhbHVlIiwiY3JlYXRlIiwidmFsIiwidXBkYXRlIiwiZWRpdFRhc2siLCJ0b2dnbGVFZGl0VGFzayIsInVwZGF0ZVRhc2siLCJmaWVsZCIsIl8iLCJMaXN0VmlldyIsImdldFJvb3QiLCJsaXN0IiwicHJvcCIsImZvY3VzIiwibGlzdFRhc2tzIiwiaHRtbCIsImZvckVhY2giLCJhcHBlbmQiLCJsaXN0SXRlbSIsImlkIiwidGl0bGUiLCJlYWNoIiwiaXRlbSIsIiRsaXN0SXRlbSIsIk1vZGVsIiwic3RvcmUiLCJsaXN0cyIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwiZ2V0TGlzdCIsImRlc2NyaXB0aW9uIiwiZG9uZSIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsInRhc2siLCJtb21lbnQiLCJmb3JtYXQiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVksWUFBTTtBQUNwQjs7QUFFQSxXQUFPO0FBQ0hDLHFCQUFhO0FBQ1RDLGlCQUFLLEVBREksQ0FDRDtBQURDLFNBRFY7O0FBS0hDLGlCQUxHLHFCQUtRQyxFQUxSLEVBSzBCO0FBQUEsZ0JBQWRDLElBQWMsdUVBQVAsS0FB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QUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNZWRpYXRvciA9ICgoKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmVyczoge1xuICAgICAgICAgICAgYW55OiBbXSAvLyBldmVudCB0eXBlOiBzdWJzY3JpYmVyc1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnNjcmliZSAoZm4sIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXS5wdXNoKGZuKTtcbiAgICAgICAgfSxcbiAgICAgICAgdW5zdWJzY3JpYmUgKGZuLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3Vuc3Vic2NyaWJlJywgZm4sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICBwdWJsaXNoIChwdWJsaWNhdGlvbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCdwdWJsaXNoJywgcHVibGljYXRpb24sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdFN1YnNjcmliZXJzIChhY3Rpb24sIGFyZywgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3B1Ymxpc2gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2ldKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuIiwiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBTcGlubmVyID0gc2VsZWN0b3IgPT4ge1xuICAgICAgICBjb25zdCAkcm9vdCA9ICQoc2VsZWN0b3IpO1xuICAgICAgICBsZXQgc2hvdyA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b2dnbGU6ICh0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09ICdzaG93JykgPyAkcm9vdC5zaG93KCkgOiAkcm9vdC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LlNwaW5uZXIgfHwge307XG4gICAgd2luZG93LnRvZG8uU3Bpbm5lciA9IFNwaW5uZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQ29udHJvbGxlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbGlzdFZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3ID0gdGFza1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lciA9IG5ldyB0b2RvLlNwaW5uZXIoJyNzcGlubmVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcucmVuZGVyLCAnbGlzdCcpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMudGFza1ZpZXcucmVuZGVyLCAndGFzaycpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnNwaW5uZXIudG9nZ2xlLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZmluZEFsbCgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kICgpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuJHJvb3Qub24oJ2NsaWNrJywgJ2EnLCB0aGlzLl9iaW5kTGlzdEl0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdMaXN0Rm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3TGlzdFN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdUYXNrRm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3VGFza1N1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyN0b2RvVGFza3MnKS5vbignY2xpY2snLCB0aGlzLl9iaW5kVGFza0l0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTGlzdEl0ZW1DbGljayAoZSkge1xuICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLWxpc3QtcGFyZW50JyksXG4gICAgICAgICAgICAgICAgbGlzdElkID0gJHBhcmVudC5kYXRhKCdsaXN0SWQnKSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLXNldCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gbGlzdElkO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyhwYXJzZUludCh0aGlzLmxpc3RBY3RpdmUpKSwgJ3Rhc2snKTtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZWRpdCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtcmVtb3ZlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZShsaXN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRUYXNrSXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxtLmNsb3Nlc3QoJy5qcy10YXNrLXBhcmVudCcpLFxuICAgICAgICAgICAgICAgIHRhc2tJZCA9ICRwYXJlbnQuZGF0YSgndGFza0lkJyk7XG5cbiAgICAgICAgICAgIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1kYXRldGltZScpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJz4+PiBkYXRldGltZScsIHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRvbmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvbmVUYXNrKHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1lZGl0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdFRhc2sodGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLXJlbW92ZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRMaXN0ID0gdGhpcy5saXN0Vmlldy4kcm9vdC5maW5kKGAjZWRpdExpc3Qke2xpc3RJZH1gKTtcblxuICAgICAgICAgICAgZWRpdExpc3QuYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcblxuICAgICAgICAgICAgZWRpdExpc3Qub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdExpc3QucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaXN0KGxpc3RJZCwgZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld0xpc3RTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuY3JlYXRlKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvTGlzdCcpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3VGFza1N1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGUoZS50YXJnZXQsIHRoaXMubGlzdEFjdGl2ZSk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb1Rhc2snKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdFRhc2sgKHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRUYXNrID0gJChgI2VkaXRUYXNrJHt0YXNrSWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRUYXNrLnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9kb25lVGFzayAodGFza0lkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnPj4+IHRhc2tEb25lJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkNvbnRyb2xsZXIgPSBDb250cm9sbGVyO1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIExpc3RWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvTGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBMaXN0Vmlldy5nZXRSb290KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0TGlzdCAobGlzdCkge1xuICAgICAgICAgICAgaWYgKGxpc3QuaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2gobGlzdFRhc2tzLCBsaXN0SXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0ganMtbGlzdC1wYXJlbnRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgZGF0YS1saXN0LWlkPVwiJHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJlZGl0TGlzdCR7bGlzdEl0ZW0uaWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGEgY2xhc3M9XCJqcy1zZXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+JHtsaXN0SXRlbS50aXRsZX08L2E+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibGlzdHNbJHtsaXN0SXRlbS5pZH1dXCIgdmFsdWU9XCIke2xpc3RJdGVtLnRpdGxlfVwiPiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPmApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0QWN0aXZlIChsaXN0SWQpIHtcbiAgICAgICAgICAgIExpc3RWaWV3LmdldFJvb3QoKS5maW5kKCdbZGF0YS1saXN0LWlkXScpLmVhY2goKGksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgJGxpc3RJdGVtID0gJChpdGVtKTtcbiAgICAgICAgICAgICAgICAkbGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KCRsaXN0SXRlbS5kYXRhKCdsaXN0SWQnKSkgPT09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5MaXN0VmlldyA9IExpc3RWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKCh3aW5kb3csIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIE1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgICAgICB0aGlzLmxpc3RzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQWxsICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZCgpLnRoZW4oXG4gICAgICAgICAgICAgICAgbGlzdElkcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChsaXN0SWRzLm1hcChsaXN0SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tZXJnZShyZXMsIHtpZDogbGlzdElkfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkudGhlbihsaXN0cyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0cyA9IGxpc3RzO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZE9uZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiBNZWRpYXRvci5wdWJsaXNoKHJlcywgJ3Rhc2snKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChmb3JtKSB7XG4gICAgICAgICAgICBsZXQgbGlzdElkID0gRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICB0YXNrczogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZShsaXN0SWQsIGRhdGEpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5jcmVhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnbm90IGNyZWF0ZWQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAoZm9ybSwgbGlzdElkID0gMCkge1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuXG4gICAgICAgICAgICBsaXN0LnRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRlYWRsaW5lOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5yZW1vdmUobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuZGVsZXRlZCA/IHRoaXMuZmluZEFsbCgpIDogY29uc29sZS5sb2coJ2Vycm9yOicsIHJlcy5lcnJvciksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRMaXN0IChsaXN0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLmZpbmQobGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVMaXN0IChsaXN0SWQgPSAwLCBsaXN0VGl0bGUpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRpdGxlID0gbGlzdFRpdGxlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VGFza3MgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLnJlZHVjZSgodGFza3MsIGxpc3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pZCA9PSBsaXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QudGFza3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrcztcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVRhc2sgKGxpc3RJZCwgdGFza0lkLCB0YXNrRGF0YSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmxpc3RzLmZpbmQoIGxpc3QgPT4gbGlzdC5pZCA9PSBsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrc1t0YXNrSWRdW3Rhc2tEYXRhLmZpZWxkXSA9IHRhc2tEYXRhLnZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVRhc2sgKGxpc3RJZCwgdGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrcy5zcGxpY2UodGFza0lkLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLk1vZGVsID0gTW9kZWw7XG59KSh3aW5kb3csIF8pO1xuIiwiKCh3aW5kb3cpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLmVuZHBvaW50ID0gJy90b2RvJztcbiAgICAgICAgICAgIHRoaXMuU1RBVEVfUkVBRFkgPSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZCAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgbGlzdElkLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdERUxFVEUnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobWV0aG9kID0gJ0dFVCcsIGxpc3RJZCwgZGF0YSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3RJZCA9PT0gMCA/ICcnIDogbGlzdElkfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdzaG93JywgJ3NwaW5uZXInKTtcblxuICAgICAgICAgICAgICAgIHJlcS5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gICAgICAgICAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHJlcS5yZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gdGhpcy5TVEFURV9SRUFEWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCgnaGlkZScsICdzcGlubmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KEVycm9yKFwiTmV0d29yayBlcnJvclwiKSk7XG4gICAgICAgICAgICAgICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlN0b3JlID0gU3RvcmU7XG59KSh3aW5kb3cpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFRhc2tWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvVGFza3NcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsID0gJCgnI2RhdGVUaW1lUGlja2VyJyk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsLmZpbmQoJ3NlbGVjdC5kYXRlJykuZHJ1bSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlRWRpdFRhc2sgKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLmhhc0NsYXNzKCdvcGVuRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAndGV4dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKHRhc2tzKSB7XG4gICAgICAgICAgICBsZXQgJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG5cbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRleHQtY2VudGVyXCIgY29sc3Bhbj1cIjNcIj5ObyBUYXNrcyE8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKHRhc2tzLCAodGFzaywgdGFza0lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyIGNsYXNzPVwianMtdGFzay1wYXJlbnRcIiBkYXRhLXRhc2staWQ9XCIke3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRUYXNrJHt0YXNrSWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3Rhc2suZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJ0YXNrc1ske3Rhc2tJZH1dXCIgdmFsdWU9XCIke3Rhc2suZGVzY3JpcHRpb259XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImpzLWRhdGV0aW1lXCIgZGF0YS10aW1lc3RhbXA9XCIke3Rhc2suZGVhZGxpbmV9XCI+JHt0YXNrLmRlYWRsaW5lID8gbW9tZW50KHRhc2suZGVhZGxpbmUpLmZvcm1hdCgnREQuTS5ZWVlZJykgOiAnLS0tJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImpzLWRvbmUgY3VzdG9tLWNvbnRyb2wgY3VzdG9tLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWlucHV0XCIgJHt0YXNrLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5UYXNrVmlldyA9IFRhc2tWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IHN0b3JlID0gbmV3IHRvZG8uU3RvcmUoKSxcbiAgICAgICAgbW9kZWwgPSBuZXcgdG9kby5Nb2RlbChzdG9yZSksXG4gICAgICAgIGxpc3RWaWV3ID0gbmV3IHRvZG8uTGlzdFZpZXcoKSxcbiAgICAgICAgdGFza1ZpZXcgPSBuZXcgdG9kby5UYXNrVmlldygpLFxuICAgICAgICBjb250cm9sbGVyID0gbmV3IHRvZG8uQ29udHJvbGxlcihtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KTtcbn0oKSk7XG5cbiJdfQ==
