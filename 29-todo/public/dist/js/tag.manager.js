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

(function (window, $, _) {
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
                $('#searchList').on('keyup', this._bindSearchList.bind(this));
                $('#searchTask').on('keyup', this._bindSearchTask.bind(this));
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

                editList.on('focusout', function (e) {
                    editList.removeClass('openForm');
                    _this.listView.toggleEditList(editList);
                    editList.off('focusout');
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
            key: '_bindSearchList',
            value: function _bindSearchList(e) {
                var search = _.trim(e.target.value).toLowerCase();

                if (search.length > 0) {
                    Mediator.publish(this.model.lists.filter(function (list) {
                        return list.title.toLowerCase().indexOf(search) !== -1;
                    }), 'list');
                } else {
                    Mediator.publish(this.model.lists, 'list');
                }
            }
        }, {
            key: '_bindSearchTask',
            value: function _bindSearchTask(e) {
                if (this.listActive) {

                    var search = _.trim(e.target.value).toLowerCase();

                    if (search.length > 0) {
                        Mediator.publish(this.model.getTasks(this.listActive).filter(function (task) {
                            return task.description.toLowerCase().indexOf(search) !== -1;
                        }), 'task');
                    } else {
                        Mediator.publish(this.model.getTasks(this.listActive), 'task');
                    }
                }
            }
        }]);

        return Controller;
    }();

    window.todo = window.todo || {};
    window.todo.Controller = Controller;
})(window, jQuery, _);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJ0eXBlIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJ3aW5kb3ciLCIkIiwiU3Bpbm5lciIsIiRyb290Iiwic2VsZWN0b3IiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsInRvZG8iLCJqUXVlcnkiLCJfIiwiQ29udHJvbGxlciIsIm1vZGVsIiwibGlzdFZpZXciLCJ0YXNrVmlldyIsImxpc3RBY3RpdmUiLCJzcGlubmVyIiwicmVuZGVyIiwiZmluZEFsbCIsImJpbmQiLCJvbiIsIl9iaW5kTGlzdEl0ZW1DbGljayIsIl9iaW5kTmV3TGlzdFN1Ym1pdCIsIl9iaW5kTmV3VGFza1N1Ym1pdCIsIl9iaW5kVGFza0l0ZW1DbGljayIsIl9iaW5kU2VhcmNoTGlzdCIsIl9iaW5kU2VhcmNoVGFzayIsImUiLCIkZWxtIiwiY3VycmVudFRhcmdldCIsIiRwYXJlbnQiLCJjbG9zZXN0IiwibGlzdElkIiwiZGF0YSIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJwYXJzZUludCIsIl9lZGl0TGlzdCIsInJlbW92ZSIsImVkaXRMaXN0IiwiZmluZCIsImFkZENsYXNzIiwidG9nZ2xlRWRpdExpc3QiLCJwcmV2ZW50RGVmYXVsdCIsIm9mZiIsInJlbW92ZUNsYXNzIiwidXBkYXRlTGlzdCIsInRhcmdldCIsImVsZW1lbnRzIiwidmFsdWUiLCJjcmVhdGUiLCJ2YWwiLCJ0YXNrSWQiLCJjb25zb2xlIiwibG9nIiwidXBkYXRlVGFzayIsImZpZWxkIiwicHJvcCIsIl9lZGl0VGFzayIsInJlbW92ZVRhc2siLCJ1cGRhdGUiLCJlZGl0VGFzayIsInRvZ2dsZUVkaXRUYXNrIiwic2VhcmNoIiwidHJpbSIsInRvTG93ZXJDYXNlIiwibGlzdHMiLCJmaWx0ZXIiLCJsaXN0IiwidGl0bGUiLCJpbmRleE9mIiwidGFzayIsImRlc2NyaXB0aW9uIiwiTGlzdFZpZXciLCJnZXRSb290IiwiZm9jdXMiLCJsaXN0VGFza3MiLCJodG1sIiwiZm9yRWFjaCIsImFwcGVuZCIsImxpc3RJdGVtIiwiaWQiLCJlYWNoIiwiaXRlbSIsIiRsaXN0SXRlbSIsIk1vZGVsIiwic3RvcmUiLCJ0aGVuIiwiUHJvbWlzZSIsImFsbCIsImxpc3RJZHMiLCJtYXAiLCJtZXJnZSIsInJlcyIsImVycm9yIiwiZXJyIiwiZm9ybSIsIkRhdGUiLCJub3ciLCJjcmVhdGVkIiwidG9TdHJpbmciLCJ0YXNrcyIsImdldExpc3QiLCJkb25lIiwiZGVhZGxpbmUiLCJ1cGRhdGVkIiwiZGVsZXRlZCIsImxpc3RUaXRsZSIsInJlZHVjZSIsInRhc2tEYXRhIiwiU3RvcmUiLCJlbmRwb2ludCIsIlNUQVRFX1JFQURZIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXRob2QiLCJ1cmwiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsIm9ubG9hZCIsInN0YXR1cyIsInBhcnNlIiwicmVzcG9uc2UiLCJFcnJvciIsInN0YXR1c1RleHQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwib25lcnJvciIsIlRhc2tWaWV3IiwiJGRhdGVUaW1lTW9kYWwiLCJkcnVtIiwibW9tZW50IiwiZm9ybWF0IiwiY29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxXQUFZLFlBQU07QUFDcEI7O0FBRUEsV0FBTztBQUNIQyxxQkFBYTtBQUNUQyxpQkFBSyxFQURJ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QjtBQUMvQmpELDhCQUFNNEUsTUFBTixrREFBeUQzQixNQUF6RCxtTUFHZ0NBLE1BSGhDLHVEQUl3Qm1CLEtBQUtDLFdBSjdCLGdIQUt3RXBCLE1BTHhFLG9CQUsyRm1CLEtBQUtDLFdBTGhHLG9oQkFhOENELEtBQUtpQyxRQWJuRCxZQWFnRWpDLEtBQUtpQyxRQUFMLEdBQWdCZ0MsT0FBT2pFLEtBQUtpQyxRQUFaLEVBQXNCaUMsTUFBdEIsQ0FBNkIsV0FBN0IsQ0FBaEIsR0FBNEQsS0FiNUgsNk5BZ0JrRWxFLEtBQUtnQyxJQUFMLEdBQVksU0FBWixHQUF3QixFQWhCMUY7QUFxQkgscUJBdEJEO0FBdUJIO0FBQ0o7QUE1RFU7O0FBQUE7QUFBQTs7QUErRGZ2RyxXQUFPUSxJQUFQLEdBQWNSLE9BQU9RLElBQVAsSUFBZSxFQUE3QjtBQUNBUixXQUFPUSxJQUFQLENBQVk2SCxRQUFaLEdBQXVCQSxRQUF2QjtBQUNILENBakVELEVBaUVHckksTUFqRUgsRUFpRVdTLE1BakVYLEVBaUVtQkMsQ0FqRW5COzs7QUNBQyxhQUFZO0FBQ1Q7O0FBRUEsUUFBTTRFLFFBQVEsSUFBSTlFLEtBQUtzRyxLQUFULEVBQWQ7QUFBQSxRQUNJbEcsUUFBUSxJQUFJSixLQUFLNkUsS0FBVCxDQUFlQyxLQUFmLENBRFo7QUFBQSxRQUVJekUsV0FBVyxJQUFJTCxLQUFLaUUsUUFBVCxFQUZmO0FBQUEsUUFHSTNELFdBQVcsSUFBSU4sS0FBSzZILFFBQVQsRUFIZjtBQUFBLFFBSUlLLGFBQWEsSUFBSWxJLEtBQUtHLFVBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxRQUEzQixFQUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNZWRpYXRvciA9ICgoKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmVyczoge1xuICAgICAgICAgICAgYW55OiBbXSAvLyBldmVudCB0eXBlOiBzdWJzY3JpYmVyc1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnNjcmliZSAoZm4sIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXS5wdXNoKGZuKTtcbiAgICAgICAgfSxcbiAgICAgICAgdW5zdWJzY3JpYmUgKGZuLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3Vuc3Vic2NyaWJlJywgZm4sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICBwdWJsaXNoIChwdWJsaWNhdGlvbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCdwdWJsaXNoJywgcHVibGljYXRpb24sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdFN1YnNjcmliZXJzIChhY3Rpb24sIGFyZywgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3B1Ymxpc2gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2ldKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuIiwiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBTcGlubmVyID0gc2VsZWN0b3IgPT4ge1xuICAgICAgICBjb25zdCAkcm9vdCA9ICQoc2VsZWN0b3IpO1xuICAgICAgICBsZXQgc2hvdyA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b2dnbGU6ICh0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09ICdzaG93JykgPyAkcm9vdC5zaG93KCkgOiAkcm9vdC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LlNwaW5uZXIgfHwge307XG4gICAgd2luZG93LnRvZG8uU3Bpbm5lciA9IFNwaW5uZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQ29udHJvbGxlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbGlzdFZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3ID0gdGFza1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lciA9IG5ldyB0b2RvLlNwaW5uZXIoJyNzcGlubmVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcucmVuZGVyLCAnbGlzdCcpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMudGFza1ZpZXcucmVuZGVyLCAndGFzaycpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnNwaW5uZXIudG9nZ2xlLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZmluZEFsbCgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kICgpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuJHJvb3Qub24oJ2NsaWNrJywgJ2EnLCB0aGlzLl9iaW5kTGlzdEl0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdMaXN0Rm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3TGlzdFN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdUYXNrRm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3VGFza1N1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyN0b2RvVGFza3MnKS5vbignY2xpY2snLCB0aGlzLl9iaW5kVGFza0l0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNzZWFyY2hMaXN0Jykub24oJ2tleXVwJywgdGhpcy5fYmluZFNlYXJjaExpc3QuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjc2VhcmNoVGFzaycpLm9uKCdrZXl1cCcsIHRoaXMuX2JpbmRTZWFyY2hUYXNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRMaXN0SXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlKGxpc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRMaXN0ID0gdGhpcy5saXN0Vmlldy4kcm9vdC5maW5kKGAjZWRpdExpc3Qke2xpc3RJZH1gKTtcblxuICAgICAgICAgICAgZWRpdExpc3QuYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcblxuICAgICAgICAgICAgZWRpdExpc3Qub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdExpc3QucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaXN0KGxpc3RJZCwgZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0Lm9uKCdmb2N1c291dCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0LnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcudG9nZ2xlRWRpdExpc3QoZWRpdExpc3QpO1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0Lm9mZignZm9jdXNvdXQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdMaXN0U3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNyZWF0ZShlLnRhcmdldCk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFRhc2tJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLXRhc2stcGFyZW50JyksXG4gICAgICAgICAgICAgICAgdGFza0lkID0gJHBhcmVudC5kYXRhKCd0YXNrSWQnKTtcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRhdGV0aW1lJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPj4+IGRhdGV0aW1lJywgdGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZG9uZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZG9uZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAhJGVsbS5maW5kKCdpbnB1dCcpLnByb3AoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtZWRpdCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRUYXNrKHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1yZW1vdmUnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdUYXNrU3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZShlLnRhcmdldCwgdGhpcy5saXN0QWN0aXZlKTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvVGFzaycpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9lZGl0VGFzayAodGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgZWRpdFRhc2sgPSAkKGAjZWRpdFRhc2ske3Rhc2tJZH1gKTtcblxuICAgICAgICAgICAgZWRpdFRhc2suYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcblxuICAgICAgICAgICAgZWRpdFRhc2sub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdFRhc2sucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0VGFzay5vbignZm9jdXNvdXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5vZmYoJ2ZvY3Vzb3V0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kU2VhcmNoTGlzdCAoZSkge1xuICAgICAgICAgICAgbGV0IHNlYXJjaCA9IF8udHJpbShlLnRhcmdldC52YWx1ZSkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5saXN0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0+IGxpc3QudGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgIT09IC0xXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICdsaXN0J1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kU2VhcmNoVGFzayAoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGlzdEFjdGl2ZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNlYXJjaCA9IF8udHJpbShlLnRhcmdldC52YWx1ZSkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9PiB0YXNrLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpICE9PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFzaydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKSwgJ3Rhc2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkNvbnRyb2xsZXIgPSBDb250cm9sbGVyO1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIExpc3RWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvTGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBMaXN0Vmlldy5nZXRSb290KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0TGlzdCAobGlzdCkge1xuICAgICAgICAgICAgaWYgKGxpc3QuaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2gobGlzdFRhc2tzLCBsaXN0SXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0ganMtbGlzdC1wYXJlbnRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgZGF0YS1saXN0LWlkPVwiJHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJlZGl0TGlzdCR7bGlzdEl0ZW0uaWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGEgY2xhc3M9XCJqcy1zZXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+JHtsaXN0SXRlbS50aXRsZX08L2E+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibGlzdHNbJHtsaXN0SXRlbS5pZH1dXCIgdmFsdWU9XCIke2xpc3RJdGVtLnRpdGxlfVwiPiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPmApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0QWN0aXZlIChsaXN0SWQpIHtcbiAgICAgICAgICAgIExpc3RWaWV3LmdldFJvb3QoKS5maW5kKCdbZGF0YS1saXN0LWlkXScpLmVhY2goKGksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgJGxpc3RJdGVtID0gJChpdGVtKTtcbiAgICAgICAgICAgICAgICAkbGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KCRsaXN0SXRlbS5kYXRhKCdsaXN0SWQnKSkgPT09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5MaXN0VmlldyA9IExpc3RWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKCh3aW5kb3csIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIE1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgICAgICB0aGlzLmxpc3RzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQWxsICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZCgpLnRoZW4oXG4gICAgICAgICAgICAgICAgbGlzdElkcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChsaXN0SWRzLm1hcChsaXN0SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tZXJnZShyZXMsIHtpZDogbGlzdElkfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkudGhlbihsaXN0cyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0cyA9IGxpc3RzO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZE9uZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiBNZWRpYXRvci5wdWJsaXNoKHJlcywgJ3Rhc2snKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChmb3JtKSB7XG4gICAgICAgICAgICBsZXQgbGlzdElkID0gRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICB0YXNrczogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZShsaXN0SWQsIGRhdGEpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5jcmVhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnbm90IGNyZWF0ZWQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAoZm9ybSwgbGlzdElkID0gMCkge1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuXG4gICAgICAgICAgICBsaXN0LnRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRlYWRsaW5lOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5yZW1vdmUobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuZGVsZXRlZCA/IHRoaXMuZmluZEFsbCgpIDogY29uc29sZS5sb2coJ2Vycm9yOicsIHJlcy5lcnJvciksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRMaXN0IChsaXN0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLmZpbmQobGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVMaXN0IChsaXN0SWQgPSAwLCBsaXN0VGl0bGUpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRpdGxlID0gbGlzdFRpdGxlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VGFza3MgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLnJlZHVjZSgodGFza3MsIGxpc3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pZCA9PSBsaXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QudGFza3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrcztcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVRhc2sgKGxpc3RJZCwgdGFza0lkLCB0YXNrRGF0YSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmxpc3RzLmZpbmQoIGxpc3QgPT4gbGlzdC5pZCA9PSBsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrc1t0YXNrSWRdW3Rhc2tEYXRhLmZpZWxkXSA9IHRhc2tEYXRhLnZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVRhc2sgKGxpc3RJZCwgdGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrcy5zcGxpY2UodGFza0lkLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLk1vZGVsID0gTW9kZWw7XG59KSh3aW5kb3csIF8pO1xuIiwiKCh3aW5kb3cpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLmVuZHBvaW50ID0gJy90b2RvJztcbiAgICAgICAgICAgIHRoaXMuU1RBVEVfUkVBRFkgPSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZCAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgbGlzdElkLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdERUxFVEUnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobWV0aG9kID0gJ0dFVCcsIGxpc3RJZCwgZGF0YSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3RJZCA9PT0gMCA/ICcnIDogbGlzdElkfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdzaG93JywgJ3NwaW5uZXInKTtcblxuICAgICAgICAgICAgICAgIHJlcS5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gICAgICAgICAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHJlcS5yZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gdGhpcy5TVEFURV9SRUFEWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCgnaGlkZScsICdzcGlubmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KEVycm9yKFwiTmV0d29yayBlcnJvclwiKSk7XG4gICAgICAgICAgICAgICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlN0b3JlID0gU3RvcmU7XG59KSh3aW5kb3cpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFRhc2tWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvVGFza3NcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsID0gJCgnI2RhdGVUaW1lUGlja2VyJyk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsLmZpbmQoJ3NlbGVjdC5kYXRlJykuZHJ1bSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlRWRpdFRhc2sgKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLmhhc0NsYXNzKCdvcGVuRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAndGV4dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKHRhc2tzKSB7XG4gICAgICAgICAgICBsZXQgJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG5cbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRleHQtY2VudGVyXCIgY29sc3Bhbj1cIjNcIj5ObyBUYXNrcyE8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKHRhc2tzLCAodGFzaywgdGFza0lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyIGNsYXNzPVwianMtdGFzay1wYXJlbnRcIiBkYXRhLXRhc2staWQ9XCIke3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRUYXNrJHt0YXNrSWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3Rhc2suZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJ0YXNrc1ske3Rhc2tJZH1dXCIgdmFsdWU9XCIke3Rhc2suZGVzY3JpcHRpb259XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImpzLWRhdGV0aW1lXCIgZGF0YS10aW1lc3RhbXA9XCIke3Rhc2suZGVhZGxpbmV9XCI+JHt0YXNrLmRlYWRsaW5lID8gbW9tZW50KHRhc2suZGVhZGxpbmUpLmZvcm1hdCgnREQuTS5ZWVlZJykgOiAnLS0tJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImpzLWRvbmUgY3VzdG9tLWNvbnRyb2wgY3VzdG9tLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWlucHV0XCIgJHt0YXNrLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5UYXNrVmlldyA9IFRhc2tWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IHN0b3JlID0gbmV3IHRvZG8uU3RvcmUoKSxcbiAgICAgICAgbW9kZWwgPSBuZXcgdG9kby5Nb2RlbChzdG9yZSksXG4gICAgICAgIGxpc3RWaWV3ID0gbmV3IHRvZG8uTGlzdFZpZXcoKSxcbiAgICAgICAgdGFza1ZpZXcgPSBuZXcgdG9kby5UYXNrVmlldygpLFxuICAgICAgICBjb250cm9sbGVyID0gbmV3IHRvZG8uQ29udHJvbGxlcihtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KTtcbn0oKSk7XG5cbiJdfQ==
