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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJ0eXBlIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJ3aW5kb3ciLCIkIiwiU3Bpbm5lciIsIiRyb290Iiwic2VsZWN0b3IiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsInRvZG8iLCJqUXVlcnkiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInNwaW5uZXIiLCJyZW5kZXIiLCJmaW5kQWxsIiwiYmluZCIsIm9uIiwiX2JpbmRMaXN0SXRlbUNsaWNrIiwiX2JpbmROZXdMaXN0U3VibWl0IiwiX2JpbmROZXdUYXNrU3VibWl0IiwiX2JpbmRUYXNrSXRlbUNsaWNrIiwiZSIsIiRlbG0iLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0SWQiLCJkYXRhIiwiaGFzQ2xhc3MiLCJnZXRUYXNrcyIsInBhcnNlSW50IiwiX2VkaXRMaXN0IiwicmVtb3ZlIiwidGFyZ2V0IiwidGFza0lkIiwiY29uc29sZSIsImxvZyIsIl9kb25lVGFzayIsIl9lZGl0VGFzayIsInJlbW92ZVRhc2siLCJlZGl0TGlzdCIsImZpbmQiLCJhZGRDbGFzcyIsInRvZ2dsZUVkaXRMaXN0IiwicHJldmVudERlZmF1bHQiLCJvZmYiLCJyZW1vdmVDbGFzcyIsInVwZGF0ZUxpc3QiLCJlbGVtZW50cyIsInZhbHVlIiwiY3JlYXRlIiwidmFsIiwidXBkYXRlIiwiZWRpdFRhc2siLCJ0b2dnbGVFZGl0VGFzayIsInVwZGF0ZVRhc2siLCJmaWVsZCIsIl8iLCJMaXN0VmlldyIsImdldFJvb3QiLCJsaXN0IiwicHJvcCIsImZvY3VzIiwibGlzdFRhc2tzIiwiaHRtbCIsImZvckVhY2giLCJhcHBlbmQiLCJsaXN0SXRlbSIsImlkIiwidGl0bGUiLCJlYWNoIiwiaXRlbSIsIiRsaXN0SXRlbSIsIk1vZGVsIiwic3RvcmUiLCJsaXN0cyIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwiZ2V0TGlzdCIsImRlc2NyaXB0aW9uIiwiZG9uZSIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsInRhc2siLCJtb21lbnQiLCJmb3JtYXQiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVksWUFBTTtBQUNwQjs7QUFFQSxXQUFPO0FBQ0hDLHFCQUFhO0FBQ1RDLGlCQUFLLEVBREksQ0FDRDtBQURDLFNBRFY7O0FBS0hDLGlCQUxHLHFCQUtRQyxFQUxSLEVBSzBCO0FBQUEsZ0JBQWRDLElBQWMsdUVBQVAsS0FB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NUgsS0FBS0UsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxRQUFyQyxDQUpqQjtBQUtILENBUkEsR0FBRCIsImZpbGUiOiJ0YWcubWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1lZGlhdG9yID0gKCgpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZXJzOiB7XG4gICAgICAgICAgICBhbnk6IFtdIC8vIGV2ZW50IHR5cGU6IHN1YnNjcmliZXJzXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3Vic2NyaWJlIChmbiwgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xuICAgICAgICB9LFxuICAgICAgICB1bnN1YnNjcmliZSAoZm4sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygndW5zdWJzY3JpYmUnLCBmbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1Ymxpc2ggKHB1YmxpY2F0aW9uLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3B1Ymxpc2gnLCBwdWJsaWNhdGlvbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0U3Vic2NyaWJlcnMgKGFjdGlvbiwgYXJnLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncHVibGlzaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbaV0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IFNwaW5uZXIgPSBzZWxlY3RvciA9PiB7XG4gICAgICAgIGNvbnN0ICRyb290ID0gJChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBzaG93ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvZ2dsZTogKHR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gJ3Nob3cnKSA/ICRyb290LnNob3coKSA6ICRyb290LmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cuU3Bpbm5lciB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TcGlubmVyID0gU3Bpbm5lcjtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBDb250cm9sbGVyIHtcbiAgICAgICAgY29uc3RydWN0b3IgKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcgPSBsaXN0VmlldztcbiAgICAgICAgICAgIHRoaXMudGFza1ZpZXcgPSB0YXNrVmlldztcbiAgICAgICAgICAgIHRoaXMubGlzdEFjdGl2ZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zcGlubmVyID0gbmV3IHRvZG8uU3Bpbm5lcignI3NwaW5uZXInKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5yZW5kZXIsICdsaXN0Jyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy50YXNrVmlldy5yZW5kZXIsICd0YXNrJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMuc3Bpbm5lci50b2dnbGUsICdzcGlubmVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQgKCkge1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy4kcm9vdC5vbignY2xpY2snLCAnYScsIHRoaXMuX2JpbmRMaXN0SXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld0xpc3RGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdMaXN0U3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld1Rhc2tGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdUYXNrU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3RvZG9UYXNrcycpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRUYXNrSXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRMaXN0SXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlKGxpc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFRhc2tJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLXRhc2stcGFyZW50JyksXG4gICAgICAgICAgICAgICAgdGFza0lkID0gJHBhcmVudC5kYXRhKCd0YXNrSWQnKTtcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRhdGV0aW1lJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPj4+IGRhdGV0aW1lJywgdGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZG9uZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZG9uZVRhc2sodGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLWVkaXQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0VGFzayh0YXNrSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtcmVtb3ZlJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5yZW1vdmVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9lZGl0TGlzdCAobGlzdElkKSB7XG4gICAgICAgICAgICBsZXQgZWRpdExpc3QgPSB0aGlzLmxpc3RWaWV3LiRyb290LmZpbmQoYCNlZGl0TGlzdCR7bGlzdElkfWApO1xuXG4gICAgICAgICAgICBlZGl0TGlzdC5hZGRDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcudG9nZ2xlRWRpdExpc3QoZWRpdExpc3QpO1xuXG4gICAgICAgICAgICBlZGl0TGlzdC5vbignc3VibWl0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0Lm9mZignc3VibWl0Jyk7XG5cbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZUxpc3QobGlzdElkLCBlLnRhcmdldC5lbGVtZW50c1swXS52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3TGlzdFN1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5jcmVhdGUoZS50YXJnZXQpO1xuICAgICAgICAgICAgJCgnI25ld1RvRG9MaXN0JykudmFsKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdUYXNrU3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZShlLnRhcmdldCwgdGhpcy5saXN0QWN0aXZlKTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvVGFzaycpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9lZGl0VGFzayAodGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgZWRpdFRhc2sgPSAkKGAjZWRpdFRhc2ske3Rhc2tJZH1gKTtcblxuICAgICAgICAgICAgZWRpdFRhc2suYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcblxuICAgICAgICAgICAgZWRpdFRhc2sub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdFRhc2sucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2RvbmVUYXNrICh0YXNrSWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gdGFza0RvbmUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9MaXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUVkaXRMaXN0IChsaXN0KSB7XG4gICAgICAgICAgICBpZiAobGlzdC5oYXNDbGFzcygnb3BlbkZvcm0nKSkge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ3RleHQnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdzcGFuJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyIChsaXN0VGFza3MpIHtcblxuICAgICAgICAgICAgbGV0ICRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRMaXN0JHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLXNldFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4ke2xpc3RJdGVtLnRpdGxlfTwvYT48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJsaXN0c1ske2xpc3RJdGVtLmlkfV1cIiB2YWx1ZT1cIiR7bGlzdEl0ZW0udGl0bGV9XCI+ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RBY3RpdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgTGlzdFZpZXcuZ2V0Um9vdCgpLmZpbmQoJ1tkYXRhLWxpc3QtaWRdJykuZWFjaCgoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCAkbGlzdEl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICRsaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGxpc3RJdGVtLmRhdGEoJ2xpc3RJZCcpKSA9PT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkxpc3RWaWV3ID0gTGlzdFZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIHRoaXMubGlzdHMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0SWRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpc3RJZHMubWFwKGxpc3RJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1lcmdlKHJlcywge2lkOiBsaXN0SWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS50aGVuKGxpc3RzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RzID0gbGlzdHM7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kT25lIChsaXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IE1lZGlhdG9yLnB1Ymxpc2gocmVzLCAndGFzaycpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SWQgPSBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlKGxpc3RJZCwgZGF0YSkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmNyZWF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKCdub3QgY3JlYXRlZCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChmb3JtLCBsaXN0SWQgPSAwKSB7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG5cbiAgICAgICAgICAgIGxpc3QudGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVhZGxpbmU6IERhdGUubm93KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnZXJyb3I6JywgcmVzLmVycm9yKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMuZmluZChsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZUxpc3QgKGxpc3RJZCA9IDAsIGxpc3RUaXRsZSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGl0bGUgPSBsaXN0VGl0bGU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUYXNrcyAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMucmVkdWNlKCh0YXNrcywgbGlzdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmlkID09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdC50YXNrcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2tzO1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlVGFzayAobGlzdElkLCB0YXNrSWQsIHRhc2tEYXRhKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMubGlzdHMuZmluZCggbGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzW3Rhc2tJZF1bdGFza0RhdGEuZmllbGRdID0gdGFza0RhdGEudmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVGFzayAobGlzdElkLCB0YXNrSWQpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzLnNwbGljZSh0YXNrSWQsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTW9kZWwgPSBNb2RlbDtcbn0pKHdpbmRvdywgXyk7XG4iLCIoKHdpbmRvdykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kcG9pbnQgPSAnL3RvZG8nO1xuICAgICAgICAgICAgdGhpcy5TVEFURV9SRUFEWSA9IDQ7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdHRVQnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChsaXN0SWQgPSAwLCBkYXRhID0ge30pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BPU1QnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChsaXN0SWQgPSAwLCBkYXRhID0ge30pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BVVCcsIGxpc3RJZCwge3RvZG86IEpTT04uc3RyaW5naWZ5KGRhdGEpfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0RFTEVURScsIGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZW5kIChtZXRob2QgPSAnR0VUJywgbGlzdElkLCBkYXRhKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuZW5kcG9pbnR9LyR7bGlzdElkID09PSAwID8gJycgOiBsaXN0SWR9YDtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goJ3Nob3cnLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSB0aGlzLlNUQVRFX1JFQURZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdoaWRlJywgJ3NwaW5uZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoRXJyb3IoXCJOZXR3b3JrIGVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3RvcmUgPSBTdG9yZTtcbn0pKHdpbmRvdyk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgVGFza1ZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9UYXNrc1wiKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwgPSAkKCcjZGF0ZVRpbWVQaWNrZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwuZmluZCgnc2VsZWN0LmRhdGUnKS5kcnVtKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0VGFzayAodGFzaykge1xuICAgICAgICAgICAgaWYgKHRhc2suaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAodGFza3MpIHtcbiAgICAgICAgICAgIGxldCAkcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcblxuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidGV4dC1jZW50ZXJcIiBjb2xzcGFuPVwiM1wiPk5vIFRhc2tzITwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0ciBjbGFzcz1cImpzLXRhc2stcGFyZW50XCIgZGF0YS10YXNrLWlkPVwiJHtpfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiZWRpdFRhc2ske2l9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3Rhc2tzW2ldLmRlc2NyaXB0aW9ufTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwidGFza3NbJHtpfV1cIiB2YWx1ZT1cIiR7dGFza3NbaV0uZGVzY3JpcHRpb259XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImpzLWRhdGV0aW1lXCIgZGF0YS10aW1lc3RhbXA9XCIke3Rhc2tzW2ldLmRlYWRsaW5lfVwiPiR7dGFza3NbaV0uZGVhZGxpbmUgPyBtb21lbnQodGFza3NbaV0pLmZvcm1hdCgnREQuTS5ZWVlZJykgOiAnLS0tJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImpzLWRvbmUgY3VzdG9tLWNvbnRyb2wgY3VzdG9tLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWlucHV0XCIgJHt0YXNrc1tpXS5kb25lID8gJ2NoZWNrZWQnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWluZGljYXRvclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPC90cj5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlRhc2tWaWV3ID0gVGFza1ZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgdG9kby5TdG9yZSgpLFxuICAgICAgICBtb2RlbCA9IG5ldyB0b2RvLk1vZGVsKHN0b3JlKSxcbiAgICAgICAgbGlzdFZpZXcgPSBuZXcgdG9kby5MaXN0VmlldygpLFxuICAgICAgICB0YXNrVmlldyA9IG5ldyB0b2RvLlRhc2tWaWV3KCksXG4gICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgdG9kby5Db250cm9sbGVyKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpO1xufSgpKTtcblxuIl19
