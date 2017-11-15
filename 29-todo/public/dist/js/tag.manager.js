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
                $('#sortByDone').on('click', this._bindSortByDone.bind(this));
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
        }, {
            key: '_bindSortByDone',
            value: function _bindSortByDone(e) {
                if (this.listActive) {
                    var sortIcon = $('#sortByDoneIcon');

                    if (sortIcon.is(':visible')) {
                        sortIcon.hide();
                        Mediator.publish(this.model.getTasks(this.listActive), 'task');
                    } else {
                        sortIcon.show();
                        Mediator.publish(this.model.getTasks(this.listActive).filter(function (task) {
                            return task.done === false;
                        }), 'task');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJ0eXBlIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJ3aW5kb3ciLCIkIiwiU3Bpbm5lciIsIiRyb290Iiwic2VsZWN0b3IiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsInRvZG8iLCJqUXVlcnkiLCJfIiwiQ29udHJvbGxlciIsIm1vZGVsIiwibGlzdFZpZXciLCJ0YXNrVmlldyIsImxpc3RBY3RpdmUiLCJzcGlubmVyIiwicmVuZGVyIiwiZmluZEFsbCIsImJpbmQiLCJvbiIsIl9iaW5kTGlzdEl0ZW1DbGljayIsIl9iaW5kTmV3TGlzdFN1Ym1pdCIsIl9iaW5kTmV3VGFza1N1Ym1pdCIsIl9iaW5kVGFza0l0ZW1DbGljayIsIl9iaW5kU2VhcmNoTGlzdCIsIl9iaW5kU2VhcmNoVGFzayIsIl9iaW5kU29ydEJ5RG9uZSIsImUiLCIkZWxtIiwiY3VycmVudFRhcmdldCIsIiRwYXJlbnQiLCJjbG9zZXN0IiwibGlzdElkIiwiZGF0YSIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJwYXJzZUludCIsIl9lZGl0TGlzdCIsInJlbW92ZSIsImVkaXRMaXN0IiwiZmluZCIsImFkZENsYXNzIiwidG9nZ2xlRWRpdExpc3QiLCJwcmV2ZW50RGVmYXVsdCIsIm9mZiIsInJlbW92ZUNsYXNzIiwidXBkYXRlTGlzdCIsInRhcmdldCIsImVsZW1lbnRzIiwidmFsdWUiLCJjcmVhdGUiLCJ2YWwiLCJ0YXNrSWQiLCJjb25zb2xlIiwibG9nIiwidXBkYXRlVGFzayIsImZpZWxkIiwicHJvcCIsIl9lZGl0VGFzayIsInJlbW92ZVRhc2siLCJ1cGRhdGUiLCJlZGl0VGFzayIsInRvZ2dsZUVkaXRUYXNrIiwic2VhcmNoIiwidHJpbSIsInRvTG93ZXJDYXNlIiwibGlzdHMiLCJmaWx0ZXIiLCJsaXN0IiwidGl0bGUiLCJpbmRleE9mIiwidGFzayIsImRlc2NyaXB0aW9uIiwic29ydEljb24iLCJpcyIsImRvbmUiLCJMaXN0VmlldyIsImdldFJvb3QiLCJmb2N1cyIsImxpc3RUYXNrcyIsImh0bWwiLCJmb3JFYWNoIiwiYXBwZW5kIiwibGlzdEl0ZW0iLCJpZCIsImVhY2giLCJpdGVtIiwiJGxpc3RJdGVtIiwiTW9kZWwiLCJzdG9yZSIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwiZ2V0TGlzdCIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsIm1vbWVudCIsImZvcm1hdCIsImNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsV0FBWSxZQUFNO0FBQ3BCOztBQUVB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USxJQUFQLEdBQWNSLE9BQU9RLElBQVAsSUFBZSxFQUE3QjtBQUNBUixXQUFPUSxJQUFQLENBQVlnSSxRQUFaLEdBQXVCQSxRQUF2QjtBQUNILENBakVELEVBaUVHeEksTUFqRUgsRUFpRVdTLE1BakVYLEVBaUVtQkMsQ0FqRW5COzs7QUNBQyxhQUFZO0FBQ1Q7O0FBRUEsUUFBTWdGLFFBQVEsSUFBSWxGLEtBQUt5RyxLQUFULEVBQWQ7QUFBQSxRQUNJckcsUUFBUSxJQUFJSixLQUFLaUYsS0FBVCxDQUFlQyxLQUFmLENBRFo7QUFBQSxRQUVJN0UsV0FBVyxJQUFJTCxLQUFLcUUsUUFBVCxFQUZmO0FBQUEsUUFHSS9ELFdBQVcsSUFBSU4sS0FBS2dJLFFBQVQsRUFIZjtBQUFBLFFBSUlLLGFBQWEsSUFBSXJJLEtBQUtHLFVBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxRQUEzQixFQUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNZWRpYXRvciA9ICgoKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmVyczoge1xuICAgICAgICAgICAgYW55OiBbXSAvLyBldmVudCB0eXBlOiBzdWJzY3JpYmVyc1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnNjcmliZSAoZm4sIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXS5wdXNoKGZuKTtcbiAgICAgICAgfSxcbiAgICAgICAgdW5zdWJzY3JpYmUgKGZuLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3Vuc3Vic2NyaWJlJywgZm4sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICBwdWJsaXNoIChwdWJsaWNhdGlvbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCdwdWJsaXNoJywgcHVibGljYXRpb24sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdFN1YnNjcmliZXJzIChhY3Rpb24sIGFyZywgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3B1Ymxpc2gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2ldKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuIiwiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBTcGlubmVyID0gc2VsZWN0b3IgPT4ge1xuICAgICAgICBjb25zdCAkcm9vdCA9ICQoc2VsZWN0b3IpO1xuICAgICAgICBsZXQgc2hvdyA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b2dnbGU6ICh0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09ICdzaG93JykgPyAkcm9vdC5zaG93KCkgOiAkcm9vdC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LlNwaW5uZXIgfHwge307XG4gICAgd2luZG93LnRvZG8uU3Bpbm5lciA9IFNwaW5uZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQ29udHJvbGxlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbGlzdFZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3ID0gdGFza1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lciA9IG5ldyB0b2RvLlNwaW5uZXIoJyNzcGlubmVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcucmVuZGVyLCAnbGlzdCcpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMudGFza1ZpZXcucmVuZGVyLCAndGFzaycpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnNwaW5uZXIudG9nZ2xlLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZmluZEFsbCgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kICgpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuJHJvb3Qub24oJ2NsaWNrJywgJ2EnLCB0aGlzLl9iaW5kTGlzdEl0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdMaXN0Rm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3TGlzdFN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdUYXNrRm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3VGFza1N1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyN0b2RvVGFza3MnKS5vbignY2xpY2snLCB0aGlzLl9iaW5kVGFza0l0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNzZWFyY2hMaXN0Jykub24oJ2tleXVwJywgdGhpcy5fYmluZFNlYXJjaExpc3QuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjc2VhcmNoVGFzaycpLm9uKCdrZXl1cCcsIHRoaXMuX2JpbmRTZWFyY2hUYXNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3NvcnRCeURvbmUnKS5vbignY2xpY2snLCB0aGlzLl9iaW5kU29ydEJ5RG9uZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTGlzdEl0ZW1DbGljayAoZSkge1xuICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLWxpc3QtcGFyZW50JyksXG4gICAgICAgICAgICAgICAgbGlzdElkID0gJHBhcmVudC5kYXRhKCdsaXN0SWQnKSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLXNldCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gbGlzdElkO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyhwYXJzZUludCh0aGlzLmxpc3RBY3RpdmUpKSwgJ3Rhc2snKTtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZWRpdCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtcmVtb3ZlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZShsaXN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2VkaXRMaXN0IChsaXN0SWQpIHtcbiAgICAgICAgICAgIGxldCBlZGl0TGlzdCA9IHRoaXMubGlzdFZpZXcuJHJvb3QuZmluZChgI2VkaXRMaXN0JHtsaXN0SWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0LmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0Lm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdExpc3Qub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRMaXN0LnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcudG9nZ2xlRWRpdExpc3QoZWRpdExpc3QpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlTGlzdChsaXN0SWQsIGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0TGlzdC5vbignZm9jdXNvdXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ2ZvY3Vzb3V0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3TGlzdFN1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5jcmVhdGUoZS50YXJnZXQpO1xuICAgICAgICAgICAgJCgnI25ld1RvRG9MaXN0JykudmFsKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRUYXNrSXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxtLmNsb3Nlc3QoJy5qcy10YXNrLXBhcmVudCcpLFxuICAgICAgICAgICAgICAgIHRhc2tJZCA9ICRwYXJlbnQuZGF0YSgndGFza0lkJyk7XG5cbiAgICAgICAgICAgIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1kYXRldGltZScpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJz4+PiBkYXRldGltZScsIHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRvbmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2RvbmUnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogISRlbG0uZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLWVkaXQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0VGFzayh0YXNrSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtcmVtb3ZlJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5yZW1vdmVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3VGFza1N1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGUoZS50YXJnZXQsIHRoaXMubGlzdEFjdGl2ZSk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb1Rhc2snKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdFRhc2sgKHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRUYXNrID0gJChgI2VkaXRUYXNrJHt0YXNrSWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRUYXNrLnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdFRhc2sub24oJ2ZvY3Vzb3V0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdmb2N1c291dCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFNlYXJjaExpc3QgKGUpIHtcbiAgICAgICAgICAgIGxldCBzZWFyY2ggPSBfLnRyaW0oZS50YXJnZXQudmFsdWUpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwubGlzdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9PiBsaXN0LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpICE9PSAtMVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAnbGlzdCdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwubGlzdHMsICdsaXN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFNlYXJjaFRhc2sgKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3RBY3RpdmUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBzZWFyY2ggPSBfLnRyaW0oZS50YXJnZXQudmFsdWUpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sgPT4gdGFzay5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSAhPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Rhc2snXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHRoaXMubGlzdEFjdGl2ZSksICd0YXNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRTb3J0QnlEb25lIChlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5saXN0QWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNvcnRJY29uID0gJCgnI3NvcnRCeURvbmVJY29uJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc29ydEljb24uaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEljb24uaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKSwgJ3Rhc2snKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRJY29uLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIodGFzayA9PiB0YXNrLmRvbmUgPT09IGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YXNrJ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9MaXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUVkaXRMaXN0IChsaXN0KSB7XG4gICAgICAgICAgICBpZiAobGlzdC5oYXNDbGFzcygnb3BlbkZvcm0nKSkge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ3RleHQnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdzcGFuJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyIChsaXN0VGFza3MpIHtcblxuICAgICAgICAgICAgbGV0ICRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRMaXN0JHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLXNldFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4ke2xpc3RJdGVtLnRpdGxlfTwvYT48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJsaXN0c1ske2xpc3RJdGVtLmlkfV1cIiB2YWx1ZT1cIiR7bGlzdEl0ZW0udGl0bGV9XCI+ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RBY3RpdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgTGlzdFZpZXcuZ2V0Um9vdCgpLmZpbmQoJ1tkYXRhLWxpc3QtaWRdJykuZWFjaCgoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCAkbGlzdEl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICRsaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGxpc3RJdGVtLmRhdGEoJ2xpc3RJZCcpKSA9PT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkxpc3RWaWV3ID0gTGlzdFZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIHRoaXMubGlzdHMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0SWRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpc3RJZHMubWFwKGxpc3RJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1lcmdlKHJlcywge2lkOiBsaXN0SWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS50aGVuKGxpc3RzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RzID0gbGlzdHM7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kT25lIChsaXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IE1lZGlhdG9yLnB1Ymxpc2gocmVzLCAndGFzaycpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SWQgPSBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlKGxpc3RJZCwgZGF0YSkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmNyZWF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKCdub3QgY3JlYXRlZCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChmb3JtLCBsaXN0SWQgPSAwKSB7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG5cbiAgICAgICAgICAgIGxpc3QudGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVhZGxpbmU6IERhdGUubm93KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnZXJyb3I6JywgcmVzLmVycm9yKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMuZmluZChsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZUxpc3QgKGxpc3RJZCA9IDAsIGxpc3RUaXRsZSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGl0bGUgPSBsaXN0VGl0bGU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUYXNrcyAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMucmVkdWNlKCh0YXNrcywgbGlzdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmlkID09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdC50YXNrcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2tzO1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlVGFzayAobGlzdElkLCB0YXNrSWQsIHRhc2tEYXRhKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMubGlzdHMuZmluZCggbGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzW3Rhc2tJZF1bdGFza0RhdGEuZmllbGRdID0gdGFza0RhdGEudmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVGFzayAobGlzdElkLCB0YXNrSWQpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzLnNwbGljZSh0YXNrSWQsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTW9kZWwgPSBNb2RlbDtcbn0pKHdpbmRvdywgXyk7XG4iLCIoKHdpbmRvdykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kcG9pbnQgPSAnL3RvZG8nO1xuICAgICAgICAgICAgdGhpcy5TVEFURV9SRUFEWSA9IDQ7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdHRVQnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChsaXN0SWQgPSAwLCBkYXRhID0ge30pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BPU1QnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChsaXN0SWQgPSAwLCBkYXRhID0ge30pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ1BVVCcsIGxpc3RJZCwge3RvZG86IEpTT04uc3RyaW5naWZ5KGRhdGEpfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0RFTEVURScsIGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZW5kIChtZXRob2QgPSAnR0VUJywgbGlzdElkLCBkYXRhKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuZW5kcG9pbnR9LyR7bGlzdElkID09PSAwID8gJycgOiBsaXN0SWR9YDtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goJ3Nob3cnLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSB0aGlzLlNUQVRFX1JFQURZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdoaWRlJywgJ3NwaW5uZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoRXJyb3IoXCJOZXR3b3JrIGVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3RvcmUgPSBTdG9yZTtcbn0pKHdpbmRvdyk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgVGFza1ZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9UYXNrc1wiKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwgPSAkKCcjZGF0ZVRpbWVQaWNrZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwuZmluZCgnc2VsZWN0LmRhdGUnKS5kcnVtKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0VGFzayAodGFzaykge1xuICAgICAgICAgICAgaWYgKHRhc2suaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAodGFza3MpIHtcbiAgICAgICAgICAgIGxldCAkcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcblxuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidGV4dC1jZW50ZXJcIiBjb2xzcGFuPVwiM1wiPk5vIFRhc2tzITwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLmZvckVhY2godGFza3MsICh0YXNrLCB0YXNrSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHIgY2xhc3M9XCJqcy10YXNrLXBhcmVudFwiIGRhdGEtdGFzay1pZD1cIiR7dGFza0lkfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiZWRpdFRhc2ske3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dGFzay5kZXNjcmlwdGlvbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInRhc2tzWyR7dGFza0lkfV1cIiB2YWx1ZT1cIiR7dGFzay5kZXNjcmlwdGlvbn1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwianMtZGF0ZXRpbWVcIiBkYXRhLXRpbWVzdGFtcD1cIiR7dGFzay5kZWFkbGluZX1cIj4ke3Rhc2suZGVhZGxpbmUgPyBtb21lbnQodGFzay5kZWFkbGluZSkuZm9ybWF0KCdERC5NLllZWVknKSA6ICctLS0nfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwianMtZG9uZSBjdXN0b20tY29udHJvbCBjdXN0b20tY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2suZG9uZSA/ICdjaGVja2VkJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXN0b20tY29udHJvbC1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlRhc2tWaWV3ID0gVGFza1ZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgdG9kby5TdG9yZSgpLFxuICAgICAgICBtb2RlbCA9IG5ldyB0b2RvLk1vZGVsKHN0b3JlKSxcbiAgICAgICAgbGlzdFZpZXcgPSBuZXcgdG9kby5MaXN0VmlldygpLFxuICAgICAgICB0YXNrVmlldyA9IG5ldyB0b2RvLlRhc2tWaWV3KCksXG4gICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgdG9kby5Db250cm9sbGVyKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpO1xufSgpKTtcblxuIl19
