'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, $) {
    "use strict";

    var Alert = function () {
        function Alert() {
            _classCallCheck(this, Alert);
        }

        _createClass(Alert, [{
            key: 'render',
            value: function render(data) {
                var alert = $('<div class="alert alert-' + (data.type ? data.type : 'danger') + ' alert-dismissible fade show" role="alert">\n                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n                    <span aria-hidden="true">&times;</span>\n                </button>\n                <strong>' + (data.name ? data.name + ':' : '') + '</strong>\n                ' + data.message + '\n            </div>');

                $('#alerts').append(alert);

                setTimeout(function () {
                    return alert.remove();
                }, 3000);
            }
        }]);

        return Alert;
    }();

    window.todo = window.todo || {};
    window.todo.Alert = Alert;
})(window, jQuery);
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

    window.todo = window.todo || {};
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
            this.alert = new todo.Alert();

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');
            Mediator.subscribe(this.listView.listActive, 'listActive');
            Mediator.subscribe(this.spinner.toggle, 'spinner');
            Mediator.subscribe(this.alert.render, 'alert');

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
                }, function (err) {
                    return Mediator.publish({ message: err }, 'alert');
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
                    return Mediator.publish({ message: err }, 'alert');
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
                    return res.created ? _this2.findAll() : Mediator.publish(res.error, 'alert');
                }, function (err) {
                    return Mediator.publish({ message: err }, 'alert');
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
                    return res.updated ? Mediator.publish(list.tasks, 'task') : Mediator.publish(res.error, 'alert');
                }, function (err) {
                    return Mediator.publish({ message: err }, 'alert');
                });
            }
        }, {
            key: 'remove',
            value: function remove(listId) {
                var _this3 = this;

                this.store.remove(listId).then(function (res) {
                    return res.deleted ? _this3.findAll() : Mediator.publish(res.error, 'alert');
                }, function (err) {
                    return Mediator.publish({ message: err }, 'alert');
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
                    return res.updated ? _this4.findAll() : Mediator.publish(res.error, 'alert');
                }, function (err) {
                    return Mediator.publish({ message: err }, 'alert');
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
                    return res.updated ? Mediator.publish(list.tasks, 'task') : Mediator.publish(res.error, 'alert');
                }, function (err) {
                    return Mediator.publish({ message: err }, 'alert');
                });
            }
        }, {
            key: 'removeTask',
            value: function removeTask(listId, taskId) {
                var list = this.getList(listId);
                list.tasks.splice(taskId, 1);

                this.store.update(listId, list).then(function (res) {
                    return res.updated ? Mediator.publish(list.tasks, 'task') : Mediator.publish(res.error, 'alert');
                }, function (err) {
                    return Mediator.publish({ message: err }, 'alert');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFsZXJ0LmpzIiwiTWVkaWF0b3IuanMiLCJTcGlubmVyLmpzIiwiQ29udHJvbGxlci5jbGFzcy5qcyIsIkxpc3RWaWV3LmNsYXNzLmpzIiwiTW9kZWwuY2xhc3MuanMiLCJTdG9yZS5jbGFzcy5qcyIsIlRhc2tWaWV3LmNsYXNzLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsIiQiLCJBbGVydCIsImRhdGEiLCJhbGVydCIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImFwcGVuZCIsInNldFRpbWVvdXQiLCJyZW1vdmUiLCJ0b2RvIiwialF1ZXJ5IiwiTWVkaWF0b3IiLCJzdWJzY3JpYmVycyIsImFueSIsInN1YnNjcmliZSIsImZuIiwicHVzaCIsInVuc3Vic2NyaWJlIiwidmlzaXRTdWJzY3JpYmVycyIsInB1Ymxpc2giLCJwdWJsaWNhdGlvbiIsImFjdGlvbiIsImFyZyIsImkiLCJsZW5ndGgiLCJzcGxpY2UiLCJTcGlubmVyIiwiJHJvb3QiLCJzZWxlY3RvciIsInNob3ciLCJ0b2dnbGUiLCJoaWRlIiwiXyIsIkNvbnRyb2xsZXIiLCJtb2RlbCIsImxpc3RWaWV3IiwidGFza1ZpZXciLCJsaXN0QWN0aXZlIiwic3Bpbm5lciIsInJlbmRlciIsImZpbmRBbGwiLCJiaW5kIiwib24iLCJfYmluZExpc3RJdGVtQ2xpY2siLCJfYmluZE5ld0xpc3RTdWJtaXQiLCJfYmluZE5ld1Rhc2tTdWJtaXQiLCJfYmluZFRhc2tJdGVtQ2xpY2siLCJfYmluZFNlYXJjaExpc3QiLCJfYmluZFNlYXJjaFRhc2siLCJfYmluZFNvcnRCeURvbmUiLCJlIiwiJGVsbSIsImN1cnJlbnRUYXJnZXQiLCIkcGFyZW50IiwiY2xvc2VzdCIsImxpc3RJZCIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJwYXJzZUludCIsIl9lZGl0TGlzdCIsImVkaXRMaXN0IiwiZmluZCIsImFkZENsYXNzIiwidG9nZ2xlRWRpdExpc3QiLCJwcmV2ZW50RGVmYXVsdCIsIm9mZiIsInJlbW92ZUNsYXNzIiwidXBkYXRlTGlzdCIsInRhcmdldCIsImVsZW1lbnRzIiwidmFsdWUiLCJjcmVhdGUiLCJ2YWwiLCJ0YXNrSWQiLCJjb25zb2xlIiwibG9nIiwidXBkYXRlVGFzayIsImZpZWxkIiwicHJvcCIsIl9lZGl0VGFzayIsInJlbW92ZVRhc2siLCJ1cGRhdGUiLCJlZGl0VGFzayIsInRvZ2dsZUVkaXRUYXNrIiwic2VhcmNoIiwidHJpbSIsInRvTG93ZXJDYXNlIiwibGlzdHMiLCJmaWx0ZXIiLCJsaXN0IiwidGl0bGUiLCJpbmRleE9mIiwidGFzayIsImRlc2NyaXB0aW9uIiwic29ydEljb24iLCJpcyIsImRvbmUiLCJMaXN0VmlldyIsImdldFJvb3QiLCJmb2N1cyIsImxpc3RUYXNrcyIsImh0bWwiLCJmb3JFYWNoIiwibGlzdEl0ZW0iLCJpZCIsImVhY2giLCJpdGVtIiwiJGxpc3RJdGVtIiwiTW9kZWwiLCJzdG9yZSIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyIiwiZm9ybSIsIkRhdGUiLCJub3ciLCJjcmVhdGVkIiwidG9TdHJpbmciLCJ0YXNrcyIsImVycm9yIiwiZ2V0TGlzdCIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsIm1vbWVudCIsImZvcm1hdCIsImNv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QUtrQyxRQWJuRCxZQWFnRWxDLEtBQUtrQyxRQUFMLEdBQWdCZ0MsT0FBT2xFLEtBQUtrQyxRQUFaLEVBQXNCaUMsTUFBdEIsQ0FBNkIsV0FBN0IsQ0FBaEIsR0FBNEQsS0FiNUgsNk5BZ0JrRW5FLEtBQUtJLElBQUwsR0FBWSxTQUFaLEdBQXdCLEVBaEIxRjtBQXFCSCxxQkF0QkQ7QUF1Qkg7QUFDSjtBQTVEVTs7QUFBQTtBQUFBOztBQStEZmxHLFdBQU9XLElBQVAsR0FBY1gsT0FBT1csSUFBUCxJQUFlLEVBQTdCO0FBQ0FYLFdBQU9XLElBQVAsQ0FBWWtKLFFBQVosR0FBdUJBLFFBQXZCO0FBQ0gsQ0FqRUQsRUFpRUc3SixNQWpFSCxFQWlFV1ksTUFqRVgsRUFpRW1Cc0IsQ0FqRW5COzs7QUNBQyxhQUFZO0FBQ1Q7O0FBRUEsUUFBTTZFLFFBQVEsSUFBSXBHLEtBQUsySCxLQUFULEVBQWQ7QUFBQSxRQUNJbEcsUUFBUSxJQUFJekIsS0FBS21HLEtBQVQsQ0FBZUMsS0FBZixDQURaO0FBQUEsUUFFSTFFLFdBQVcsSUFBSTFCLEtBQUt3RixRQUFULEVBRmY7QUFBQSxRQUdJN0QsV0FBVyxJQUFJM0IsS0FBS2tKLFFBQVQsRUFIZjtBQUFBLFFBSUlLLGFBQWEsSUFBSXZKLEtBQUt3QixVQUFULENBQW9CQyxLQUFwQixFQUEyQkMsUUFBM0IsRUFBcUNDLFFBQXJDLENBSmpCO0FBS0gsQ0FSQSxHQUFEIiwiZmlsZSI6InRhZy5tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIEFsZXJ0IHtcbiAgICAgICAgcmVuZGVyIChkYXRhKSB7XG4gICAgICAgICAgICBsZXQgYWxlcnQgPSAkKGA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtJHtkYXRhLnR5cGUgPyBkYXRhLnR5cGUgOiAnZGFuZ2VyJ30gYWxlcnQtZGlzbWlzc2libGUgZmFkZSBzaG93XCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHN0cm9uZz4ke2RhdGEubmFtZSA/IGRhdGEubmFtZSArICc6JyA6ICcnfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICR7ZGF0YS5tZXNzYWdlfVxuICAgICAgICAgICAgPC9kaXY+YCk7XG5cbiAgICAgICAgICAgICQoJyNhbGVydHMnKS5hcHBlbmQoYWxlcnQpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGFsZXJ0LnJlbW92ZSgpLCAzMDAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQWxlcnQgPSBBbGVydDtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsImNvbnN0IE1lZGlhdG9yID0gKCgpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZXJzOiB7XG4gICAgICAgICAgICBhbnk6IFtdIC8vIGV2ZW50IHR5cGU6IHN1YnNjcmliZXJzXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3Vic2NyaWJlIChmbiwgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xuICAgICAgICB9LFxuICAgICAgICB1bnN1YnNjcmliZSAoZm4sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygndW5zdWJzY3JpYmUnLCBmbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1Ymxpc2ggKHB1YmxpY2F0aW9uLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3B1Ymxpc2gnLCBwdWJsaWNhdGlvbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0U3Vic2NyaWJlcnMgKGFjdGlvbiwgYXJnLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncHVibGlzaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbaV0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IFNwaW5uZXIgPSBzZWxlY3RvciA9PiB7XG4gICAgICAgIGNvbnN0ICRyb290ID0gJChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBzaG93ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvZ2dsZSAodHlwZSkge1xuICAgICAgICAgICAgICAgICh0eXBlID09PSAnc2hvdycpID8gJHJvb3Quc2hvdygpIDogJHJvb3QuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlNwaW5uZXIgPSBTcGlubmVyO1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIENvbnRyb2xsZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yIChtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbGlzdFZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3ID0gdGFza1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lciA9IG5ldyB0b2RvLlNwaW5uZXIoJyNzcGlubmVyJyk7XG4gICAgICAgICAgICB0aGlzLmFsZXJ0ID0gbmV3IHRvZG8uQWxlcnQoKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5yZW5kZXIsICdsaXN0Jyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy50YXNrVmlldy5yZW5kZXIsICd0YXNrJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMuc3Bpbm5lci50b2dnbGUsICdzcGlubmVyJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5hbGVydC5yZW5kZXIsICdhbGVydCcpO1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZmluZEFsbCgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kICgpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuJHJvb3Qub24oJ2NsaWNrJywgJ2EnLCB0aGlzLl9iaW5kTGlzdEl0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdMaXN0Rm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3TGlzdFN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdUYXNrRm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3VGFza1N1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyN0b2RvVGFza3MnKS5vbignY2xpY2snLCB0aGlzLl9iaW5kVGFza0l0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNzZWFyY2hMaXN0Jykub24oJ2tleXVwJywgdGhpcy5fYmluZFNlYXJjaExpc3QuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjc2VhcmNoVGFzaycpLm9uKCdrZXl1cCcsIHRoaXMuX2JpbmRTZWFyY2hUYXNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3NvcnRCeURvbmUnKS5vbignY2xpY2snLCB0aGlzLl9iaW5kU29ydEJ5RG9uZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTGlzdEl0ZW1DbGljayAoZSkge1xuICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLWxpc3QtcGFyZW50JyksXG4gICAgICAgICAgICAgICAgbGlzdElkID0gJHBhcmVudC5kYXRhKCdsaXN0SWQnKSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLXNldCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gbGlzdElkO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyhwYXJzZUludCh0aGlzLmxpc3RBY3RpdmUpKSwgJ3Rhc2snKTtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZWRpdCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtcmVtb3ZlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZShsaXN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2VkaXRMaXN0IChsaXN0SWQpIHtcbiAgICAgICAgICAgIGxldCBlZGl0TGlzdCA9IHRoaXMubGlzdFZpZXcuJHJvb3QuZmluZChgI2VkaXRMaXN0JHtsaXN0SWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0LmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0Lm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdExpc3Qub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRMaXN0LnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcudG9nZ2xlRWRpdExpc3QoZWRpdExpc3QpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlTGlzdChsaXN0SWQsIGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0TGlzdC5vbignZm9jdXNvdXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ2ZvY3Vzb3V0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3TGlzdFN1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5jcmVhdGUoZS50YXJnZXQpO1xuICAgICAgICAgICAgJCgnI25ld1RvRG9MaXN0JykudmFsKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRUYXNrSXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxtLmNsb3Nlc3QoJy5qcy10YXNrLXBhcmVudCcpLFxuICAgICAgICAgICAgICAgIHRhc2tJZCA9ICRwYXJlbnQuZGF0YSgndGFza0lkJyk7XG5cbiAgICAgICAgICAgIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1kYXRldGltZScpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJz4+PiBkYXRldGltZScsIHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRvbmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2RvbmUnLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogISRlbG0uZmluZCgnaW5wdXQnKS5wcm9wKCdjaGVja2VkJylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLWVkaXQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0VGFzayh0YXNrSWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtcmVtb3ZlJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5yZW1vdmVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3VGFza1N1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGUoZS50YXJnZXQsIHRoaXMubGlzdEFjdGl2ZSk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb1Rhc2snKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdFRhc2sgKHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRUYXNrID0gJChgI2VkaXRUYXNrJHt0YXNrSWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRUYXNrLnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWRpdFRhc2sub24oJ2ZvY3Vzb3V0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdmb2N1c291dCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFNlYXJjaExpc3QgKGUpIHtcbiAgICAgICAgICAgIGxldCBzZWFyY2ggPSBfLnRyaW0oZS50YXJnZXQudmFsdWUpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwubGlzdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9PiBsaXN0LnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpICE9PSAtMVxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAnbGlzdCdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwubGlzdHMsICdsaXN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFNlYXJjaFRhc2sgKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3RBY3RpdmUpIHtcblxuICAgICAgICAgICAgICAgIGxldCBzZWFyY2ggPSBfLnRyaW0oZS50YXJnZXQudmFsdWUpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VhcmNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sgPT4gdGFzay5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSAhPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Rhc2snXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHRoaXMubGlzdEFjdGl2ZSksICd0YXNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRTb3J0QnlEb25lIChlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5saXN0QWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNvcnRJY29uID0gJCgnI3NvcnRCeURvbmVJY29uJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc29ydEljb24uaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEljb24uaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKSwgJ3Rhc2snKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRJY29uLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIodGFzayA9PiB0YXNrLmRvbmUgPT09IGZhbHNlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YXNrJ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9MaXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUVkaXRMaXN0IChsaXN0KSB7XG4gICAgICAgICAgICBpZiAobGlzdC5oYXNDbGFzcygnb3BlbkZvcm0nKSkge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ3RleHQnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdzcGFuJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyIChsaXN0VGFza3MpIHtcblxuICAgICAgICAgICAgbGV0ICRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRMaXN0JHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLXNldFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4ke2xpc3RJdGVtLnRpdGxlfTwvYT48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJsaXN0c1ske2xpc3RJdGVtLmlkfV1cIiB2YWx1ZT1cIiR7bGlzdEl0ZW0udGl0bGV9XCI+ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RBY3RpdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgTGlzdFZpZXcuZ2V0Um9vdCgpLmZpbmQoJ1tkYXRhLWxpc3QtaWRdJykuZWFjaCgoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCAkbGlzdEl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICRsaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGxpc3RJdGVtLmRhdGEoJ2xpc3RJZCcpKSA9PT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkxpc3RWaWV3ID0gTGlzdFZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIHRoaXMubGlzdHMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0SWRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpc3RJZHMubWFwKGxpc3RJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1lcmdlKHJlcywge2lkOiBsaXN0SWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICkudGhlbihsaXN0cyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0cyA9IGxpc3RzO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZE9uZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiBNZWRpYXRvci5wdWJsaXNoKHJlcywgJ3Rhc2snKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SWQgPSBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlKGxpc3RJZCwgZGF0YSkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmNyZWF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IE1lZGlhdG9yLnB1Ymxpc2gocmVzLmVycm9yLCAnYWxlcnQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUgKGZvcm0sIGxpc3RJZCA9IDApIHtcblxuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcblxuICAgICAgICAgICAgbGlzdC50YXNrcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkZWFkbGluZTogRGF0ZS5ub3coKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUucmVtb3ZlKGxpc3RJZCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmRlbGV0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IE1lZGlhdG9yLnB1Ymxpc2gocmVzLmVycm9yLCAnYWxlcnQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRMaXN0IChsaXN0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLmZpbmQobGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVMaXN0IChsaXN0SWQgPSAwLCBsaXN0VGl0bGUpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRpdGxlID0gbGlzdFRpdGxlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VGFza3MgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLnJlZHVjZSgodGFza3MsIGxpc3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pZCA9PSBsaXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QudGFza3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrcztcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVRhc2sgKGxpc3RJZCwgdGFza0lkLCB0YXNrRGF0YSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmxpc3RzLmZpbmQoIGxpc3QgPT4gbGlzdC5pZCA9PSBsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrc1t0YXNrSWRdW3Rhc2tEYXRhLmZpZWxkXSA9IHRhc2tEYXRhLnZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZVRhc2sgKGxpc3RJZCwgdGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50YXNrcy5zcGxpY2UodGFza0lkLCAxKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IE1lZGlhdG9yLnB1Ymxpc2gocmVzLmVycm9yLCAnYWxlcnQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLk1vZGVsID0gTW9kZWw7XG59KSh3aW5kb3csIF8pO1xuIiwiKCh3aW5kb3cpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLmVuZHBvaW50ID0gJy90b2RvJztcbiAgICAgICAgICAgIHRoaXMuU1RBVEVfUkVBRFkgPSA0O1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZCAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgbGlzdElkLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdERUxFVEUnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobWV0aG9kID0gJ0dFVCcsIGxpc3RJZCwgZGF0YSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3RJZCA9PT0gMCA/ICcnIDogbGlzdElkfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdzaG93JywgJ3NwaW5uZXInKTtcblxuICAgICAgICAgICAgICAgIHJlcS5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gICAgICAgICAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHJlcS5yZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gdGhpcy5TVEFURV9SRUFEWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCgnaGlkZScsICdzcGlubmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KEVycm9yKFwiTmV0d29yayBlcnJvclwiKSk7XG4gICAgICAgICAgICAgICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlN0b3JlID0gU3RvcmU7XG59KSh3aW5kb3cpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFRhc2tWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvVGFza3NcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsID0gJCgnI2RhdGVUaW1lUGlja2VyJyk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsLmZpbmQoJ3NlbGVjdC5kYXRlJykuZHJ1bSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlRWRpdFRhc2sgKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLmhhc0NsYXNzKCdvcGVuRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAndGV4dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKHRhc2tzKSB7XG4gICAgICAgICAgICBsZXQgJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG5cbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRleHQtY2VudGVyXCIgY29sc3Bhbj1cIjNcIj5ObyBUYXNrcyE8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKHRhc2tzLCAodGFzaywgdGFza0lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyIGNsYXNzPVwianMtdGFzay1wYXJlbnRcIiBkYXRhLXRhc2staWQ9XCIke3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRUYXNrJHt0YXNrSWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3Rhc2suZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJ0YXNrc1ske3Rhc2tJZH1dXCIgdmFsdWU9XCIke3Rhc2suZGVzY3JpcHRpb259XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImpzLWRhdGV0aW1lXCIgZGF0YS10aW1lc3RhbXA9XCIke3Rhc2suZGVhZGxpbmV9XCI+JHt0YXNrLmRlYWRsaW5lID8gbW9tZW50KHRhc2suZGVhZGxpbmUpLmZvcm1hdCgnREQuTS5ZWVlZJykgOiAnLS0tJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImpzLWRvbmUgY3VzdG9tLWNvbnRyb2wgY3VzdG9tLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWlucHV0XCIgJHt0YXNrLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5UYXNrVmlldyA9IFRhc2tWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IHN0b3JlID0gbmV3IHRvZG8uU3RvcmUoKSxcbiAgICAgICAgbW9kZWwgPSBuZXcgdG9kby5Nb2RlbChzdG9yZSksXG4gICAgICAgIGxpc3RWaWV3ID0gbmV3IHRvZG8uTGlzdFZpZXcoKSxcbiAgICAgICAgdGFza1ZpZXcgPSBuZXcgdG9kby5UYXNrVmlldygpLFxuICAgICAgICBjb250cm9sbGVyID0gbmV3IHRvZG8uQ29udHJvbGxlcihtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KTtcbn0oKSk7XG5cbiJdfQ==
