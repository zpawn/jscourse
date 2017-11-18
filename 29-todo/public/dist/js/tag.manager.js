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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    "use strict";

    var Scroller = function () {
        function Scroller(selector) {
            _classCallCheck(this, Scroller);

            this.scrollerContainer = document.querySelectorAll(selector);
        }

        _createClass(Scroller, [{
            key: "render",
            value: function render() {
                this.scrollerContainer.forEach(function (scroll) {
                    var ps = new PerfectScrollbar(scroll);
                });
            }
        }]);

        return Scroller;
    }();

    window.todo = window.todo || {};
    window.todo.Scroller = Scroller;
})(window);
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
            this.scroller = new todo.Scroller('.js-scroller');

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');
            Mediator.subscribe(this.listView.listActive, 'listActive');
            Mediator.subscribe(this.spinner.toggle, 'spinner');
            Mediator.subscribe(this.alert.render, 'alert');

            ////

            this.scroller.render();
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

                return this.send(listId);
            }
        }, {
            key: 'create',
            value: function create() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return this.send(listId, 'POST', { todo: JSON.stringify(data) });
            }
        }, {
            key: 'update',
            value: function update() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return this.send(listId, 'PUT', { todo: JSON.stringify(data) });
            }
        }, {
            key: 'remove',
            value: function remove() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                return this.send(listId, 'DELETE');
            }
        }, {
            key: 'send',
            value: function send(listId) {
                var _this = this;

                var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
                var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFsZXJ0LmpzIiwiTWVkaWF0b3IuanMiLCJTY3JvbGxlci5qcyIsIlNwaW5uZXIuanMiLCJDb250cm9sbGVyLmNsYXNzLmpzIiwiTGlzdFZpZXcuY2xhc3MuanMiLCJNb2RlbC5jbGFzcy5qcyIsIlN0b3JlLmNsYXNzLmpzIiwiVGFza1ZpZXcuY2xhc3MuanMiLCJhcHAuanMiXSwibmFtZXMiOlsid2luZG93IiwiJCIsIkFsZXJ0IiwiZGF0YSIsImFsZXJ0IiwidHlwZSIsIm5hbWUiLCJtZXNzYWdlIiwiYXBwZW5kIiwic2V0VGltZW91dCIsInJlbW92ZSIsInRvZG8iLCJqUXVlcnkiLCJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIlNjcm9sbGVyIiwic2VsZWN0b3IiLCJzY3JvbGxlckNvbnRhaW5lciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJwcyIsIlBlcmZlY3RTY3JvbGxiYXIiLCJzY3JvbGwiLCJTcGlubmVyIiwiJHJvb3QiLCJzaG93IiwidG9nZ2xlIiwiaGlkZSIsIl8iLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInNwaW5uZXIiLCJzY3JvbGxlciIsInJlbmRlciIsImZpbmRBbGwiLCJiaW5kIiwib24iLCJfYmluZExpc3RJdGVtQ2xpY2siLCJfYmluZE5ld0xpc3RTdWJtaXQiLCJfYmluZE5ld1Rhc2tTdWJtaXQiLCJfYmluZFRhc2tJdGVtQ2xpY2siLCJfYmluZFNlYXJjaExpc3QiLCJfYmluZFNlYXJjaFRhc2siLCJfYmluZFNvcnRCeURvbmUiLCJlIiwiJGVsbSIsImN1cnJlbnRUYXJnZXQiLCIkcGFyZW50IiwiY2xvc2VzdCIsImxpc3RJZCIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJwYXJzZUludCIsIl9lZGl0TGlzdCIsImVkaXRMaXN0IiwiZmluZCIsImFkZENsYXNzIiwidG9nZ2xlRWRpdExpc3QiLCJwcmV2ZW50RGVmYXVsdCIsIm9mZiIsInJlbW92ZUNsYXNzIiwidXBkYXRlTGlzdCIsInRhcmdldCIsImVsZW1lbnRzIiwidmFsdWUiLCJjcmVhdGUiLCJ2YWwiLCJ0YXNrSWQiLCJjb25zb2xlIiwibG9nIiwidXBkYXRlVGFzayIsImZpZWxkIiwicHJvcCIsIl9lZGl0VGFzayIsInJlbW92ZVRhc2siLCJ1cGRhdGUiLCJlZGl0VGFzayIsInRvZ2dsZUVkaXRUYXNrIiwic2VhcmNoIiwidHJpbSIsInRvTG93ZXJDYXNlIiwibGlzdHMiLCJmaWx0ZXIiLCJsaXN0IiwidGl0bGUiLCJpbmRleE9mIiwidGFzayIsImRlc2NyaXB0aW9uIiwic29ydEljb24iLCJpcyIsImRvbmUiLCJMaXN0VmlldyIsImdldFJvb3QiLCJmb2N1cyIsImxpc3RUYXNrcyIsImh0bWwiLCJsaXN0SXRlbSIsImlkIiwiZWFjaCIsIml0ZW0iLCIkbGlzdEl0ZW0iLCJNb2RlbCIsInN0b3JlIiwidGhlbiIsIlByb21pc2UiLCJhbGwiLCJsaXN0SWRzIiwibWFwIiwibWVyZ2UiLCJyZXMiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwiZXJyb3IiLCJnZXRMaXN0IiwiZGVhZGxpbmUiLCJ1cGRhdGVkIiwiZGVsZXRlZCIsImxpc3RUaXRsZSIsInJlZHVjZSIsInRhc2tEYXRhIiwiU3RvcmUiLCJlbmRwb2ludCIsIlNUQVRFX1JFQURZIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJtZXRob2QiLCJ1cmwiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsIm9ubG9hZCIsInN0YXR1cyIsInBhcnNlIiwicmVzcG9uc2UiLCJFcnJvciIsInN0YXR1c1RleHQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwib25lcnJvciIsIlRhc2tWaWV3IiwiJGRhdGVUaW1lTW9kYWwiLCJkcnVtIiwibW9tZW50IiwiZm9ybWF0IiwiY29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQ0FBQyxVQUFDQSxNQUFELEVBQVNDLENBQVQsRUFBZTtBQUNaOztBQURZLFFBR05DLEtBSE07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1DQUlBQyxJQUpBLEVBSU07QUFDVixvQkFBSUMsUUFBUUgsZ0NBQTZCRSxLQUFLRSxJQUFMLEdBQVlGLEtBQUtFLElBQWpCLEdBQXdCLFFBQXJELHFRQUlFRixLQUFLRyxJQUFMLEdBQVlILEtBQUtHLElBQUwsR0FBWSxHQUF4QixHQUE4QixFQUpoQyxvQ0FLTkgsS0FBS0ksT0FMQywwQkFBWjs7QUFRQU4sa0JBQUUsU0FBRixFQUFhTyxNQUFiLENBQW9CSixLQUFwQjs7QUFFQUssMkJBQVc7QUFBQSwyQkFBTUwsTUFBTU0sTUFBTixFQUFOO0FBQUEsaUJBQVgsRUFBaUMsSUFBakM7QUFDSDtBQWhCTzs7QUFBQTtBQUFBOztBQW1CWlYsV0FBT1csSUFBUCxHQUFjWCxPQUFPVyxJQUFQLElBQWUsRUFBN0I7QUFDQVgsV0FBT1csSUFBUCxDQUFZVCxLQUFaLEdBQW9CQSxLQUFwQjtBQUNILENBckJELEVBcUJHRixNQXJCSCxFQXFCV1ksTUFyQlg7OztBQ0FBLElBQU1DLFdBQVksWUFBTTtBQUNwQjs7QUFFQSxXQUFPO0FBQ0hDLHFCQUFhO0FBQ1RDLGlCQUFLLEVBREksQ0FDRDtBQURDLFNBRFY7O0FBS0hDLGlCQUxHLHFCQUtRQyxFQUxSLEVBSzBCO0FBQUEsZ0JBQWRaLElBQWMsdUVBQVAsS0FBTzs7QUFDekIsZ0JBQUksT0FBTyxLQUFLUyxXQUFMLENBQWlCVCxJQUFqQixDQUFQLEtBQWtDLFdBQXRDLEVBQW1EO0FBQy9DLHFCQUFLUyxXQUFMLENBQWlCVCxJQUFqQixJQUF5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RCxFQWlFR3JLLE1BakVILEVBaUVXWSxNQWpFWCxFQWlFbUI4QixDQWpFbkI7OztBQ0FDLGFBQVk7QUFDVDs7QUFFQSxRQUFNNkUsUUFBUSxJQUFJNUcsS0FBS21JLEtBQVQsRUFBZDtBQUFBLFFBQ0lsRyxRQUFRLElBQUlqQyxLQUFLMkcsS0FBVCxDQUFlQyxLQUFmLENBRFo7QUFBQSxRQUVJMUUsV0FBVyxJQUFJbEMsS0FBS2lHLFFBQVQsRUFGZjtBQUFBLFFBR0k5RCxXQUFXLElBQUluQyxLQUFLMEosUUFBVCxFQUhmO0FBQUEsUUFJSUssYUFBYSxJQUFJL0osS0FBS2dDLFVBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxRQUEzQixFQUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQWxlcnQge1xuICAgICAgICByZW5kZXIgKGRhdGEpIHtcbiAgICAgICAgICAgIGxldCBhbGVydCA9ICQoYDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC0ke2RhdGEudHlwZSA/IGRhdGEudHlwZSA6ICdkYW5nZXInfSBhbGVydC1kaXNtaXNzaWJsZSBmYWRlIHNob3dcIiByb2xlPVwiYWxlcnRcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPiR7ZGF0YS5uYW1lID8gZGF0YS5uYW1lICsgJzonIDogJyd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgJHtkYXRhLm1lc3NhZ2V9XG4gICAgICAgICAgICA8L2Rpdj5gKTtcblxuICAgICAgICAgICAgJCgnI2FsZXJ0cycpLmFwcGVuZChhbGVydCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYWxlcnQucmVtb3ZlKCksIDMwMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5BbGVydCA9IEFsZXJ0O1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiY29uc3QgTWVkaWF0b3IgPSAoKCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaWJlcnM6IHtcbiAgICAgICAgICAgIGFueTogW10gLy8gZXZlbnQgdHlwZTogc3Vic2NyaWJlcnNcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJzY3JpYmUgKGZuLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XG4gICAgICAgIH0sXG4gICAgICAgIHVuc3Vic2NyaWJlIChmbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCd1bnN1YnNjcmliZScsIGZuLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVibGlzaCAocHVibGljYXRpb24sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygncHVibGlzaCcsIHB1YmxpY2F0aW9uLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRTdWJzY3JpYmVycyAoYWN0aW9uLCBhcmcsIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgbGV0IHN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVyc1t0eXBlXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdwdWJsaXNoJykge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyc1tpXSA9PT0gYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbiIsIigod2luZG93KSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBTY3JvbGxlciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKCkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlckNvbnRhaW5lci5mb3JFYWNoKHNjcm9sbCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBzID0gbmV3IFBlcmZlY3RTY3JvbGxiYXIoc2Nyb2xsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TY3JvbGxlciA9IFNjcm9sbGVyO1xufSkod2luZG93KTsiLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgbGV0IFNwaW5uZXIgPSBzZWxlY3RvciA9PiB7XG4gICAgICAgIGNvbnN0ICRyb290ID0gJChzZWxlY3Rvcik7XG4gICAgICAgIGxldCBzaG93ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvZ2dsZSAodHlwZSkge1xuICAgICAgICAgICAgICAgICh0eXBlID09PSAnc2hvdycpID8gJHJvb3Quc2hvdygpIDogJHJvb3QuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlNwaW5uZXIgPSBTcGlubmVyO1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIENvbnRyb2xsZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yIChtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbGlzdFZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3ID0gdGFza1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lciA9IG5ldyB0b2RvLlNwaW5uZXIoJyNzcGlubmVyJyk7XG4gICAgICAgICAgICB0aGlzLmFsZXJ0ID0gbmV3IHRvZG8uQWxlcnQoKTtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZXIgPSBuZXcgdG9kby5TY3JvbGxlcignLmpzLXNjcm9sbGVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcucmVuZGVyLCAnbGlzdCcpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMudGFza1ZpZXcucmVuZGVyLCAndGFzaycpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnNwaW5uZXIudG9nZ2xlLCAnc3Bpbm5lcicpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMuYWxlcnQucmVuZGVyLCAnYWxlcnQnKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyLnJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQgKCkge1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy4kcm9vdC5vbignY2xpY2snLCAnYScsIHRoaXMuX2JpbmRMaXN0SXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld0xpc3RGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdMaXN0U3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld1Rhc2tGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdUYXNrU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3RvZG9UYXNrcycpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRUYXNrSXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3NlYXJjaExpc3QnKS5vbigna2V5dXAnLCB0aGlzLl9iaW5kU2VhcmNoTGlzdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNzZWFyY2hUYXNrJykub24oJ2tleXVwJywgdGhpcy5fYmluZFNlYXJjaFRhc2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjc29ydEJ5RG9uZScpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRTb3J0QnlEb25lLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRMaXN0SXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlKGxpc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRMaXN0ID0gdGhpcy5saXN0Vmlldy4kcm9vdC5maW5kKGAjZWRpdExpc3Qke2xpc3RJZH1gKTtcblxuICAgICAgICAgICAgZWRpdExpc3QuYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcblxuICAgICAgICAgICAgZWRpdExpc3Qub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdExpc3QucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaXN0KGxpc3RJZCwgZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0Lm9uKCdmb2N1c291dCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0LnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcudG9nZ2xlRWRpdExpc3QoZWRpdExpc3QpO1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0Lm9mZignZm9jdXNvdXQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdMaXN0U3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNyZWF0ZShlLnRhcmdldCk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFRhc2tJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLXRhc2stcGFyZW50JyksXG4gICAgICAgICAgICAgICAgdGFza0lkID0gJHBhcmVudC5kYXRhKCd0YXNrSWQnKTtcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRhdGV0aW1lJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPj4+IGRhdGV0aW1lJywgdGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZG9uZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZG9uZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAhJGVsbS5maW5kKCdpbnB1dCcpLnByb3AoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtZWRpdCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRUYXNrKHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1yZW1vdmUnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdUYXNrU3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZShlLnRhcmdldCwgdGhpcy5saXN0QWN0aXZlKTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvVGFzaycpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9lZGl0VGFzayAodGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgZWRpdFRhc2sgPSAkKGAjZWRpdFRhc2ske3Rhc2tJZH1gKTtcblxuICAgICAgICAgICAgZWRpdFRhc2suYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcblxuICAgICAgICAgICAgZWRpdFRhc2sub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdFRhc2sucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0VGFzay5vbignZm9jdXNvdXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5vZmYoJ2ZvY3Vzb3V0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kU2VhcmNoTGlzdCAoZSkge1xuICAgICAgICAgICAgbGV0IHNlYXJjaCA9IF8udHJpbShlLnRhcmdldC52YWx1ZSkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5saXN0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0+IGxpc3QudGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgIT09IC0xXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICdsaXN0J1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kU2VhcmNoVGFzayAoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGlzdEFjdGl2ZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNlYXJjaCA9IF8udHJpbShlLnRhcmdldC52YWx1ZSkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9PiB0YXNrLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpICE9PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFzaydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKSwgJ3Rhc2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFNvcnRCeURvbmUgKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3RBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBsZXQgc29ydEljb24gPSAkKCcjc29ydEJ5RG9uZUljb24nKTtcblxuICAgICAgICAgICAgICAgIGlmIChzb3J0SWNvbi5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICBzb3J0SWNvbi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpLCAndGFzaycpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEljb24uc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih0YXNrID0+IHRhc2suZG9uZSA9PT0gZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Rhc2snXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Db250cm9sbGVyID0gQ29udHJvbGxlcjtcbn0pKHdpbmRvdywgalF1ZXJ5LCBfKTtcbiIsIigod2luZG93LCAkLCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBMaXN0VmlldyB7XG5cbiAgICAgICAgc3RhdGljIGdldFJvb3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjdG9kb0xpc3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlRWRpdExpc3QgKGxpc3QpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lmhhc0NsYXNzKCdvcGVuRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAndGV4dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdzcGFuJykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ3NwYW4nKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKGxpc3RUYXNrcykge1xuXG4gICAgICAgICAgICBsZXQgJHJvb3QgPSBMaXN0Vmlldy5nZXRSb290KCk7XG4gICAgICAgICAgICAkcm9vdC5odG1sKCcnKTtcblxuICAgICAgICAgICAgXy5mb3JFYWNoKGxpc3RUYXNrcywgbGlzdEl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGpzLWxpc3QtcGFyZW50XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGRhdGEtbGlzdC1pZD1cIiR7bGlzdEl0ZW0uaWR9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiZWRpdExpc3Qke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjxhIGNsYXNzPVwianMtc2V0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPiR7bGlzdEl0ZW0udGl0bGV9PC9hPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImxpc3RzWyR7bGlzdEl0ZW0uaWR9XVwiIHZhbHVlPVwiJHtsaXN0SXRlbS50aXRsZX1cIj4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9saT5gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGlzdEFjdGl2ZSAobGlzdElkKSB7XG4gICAgICAgICAgICBMaXN0Vmlldy5nZXRSb290KCkuZmluZCgnW2RhdGEtbGlzdC1pZF0nKS5lYWNoKChpLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0ICRsaXN0SXRlbSA9ICQoaXRlbSk7XG4gICAgICAgICAgICAgICAgJGxpc3RJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZUludCgkbGlzdEl0ZW0uZGF0YSgnbGlzdElkJykpID09PSBsaXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxpc3RJdGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTGlzdFZpZXcgPSBMaXN0Vmlldztcbn0pKHdpbmRvdywgalF1ZXJ5LCBfKTtcbiIsIigod2luZG93LCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBNb2RlbCB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChzdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICAgICAgdGhpcy5saXN0cyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZEFsbCAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQoKS50aGVuKFxuICAgICAgICAgICAgICAgIGxpc3RJZHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwobGlzdElkcy5tYXAobGlzdElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8ubWVyZ2UocmVzLCB7aWQ6IGxpc3RJZH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKS50aGVuKGxpc3RzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RzID0gbGlzdHM7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kT25lIChsaXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IE1lZGlhdG9yLnB1Ymxpc2gocmVzLCAndGFzaycpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAoZm9ybSkge1xuICAgICAgICAgICAgbGV0IGxpc3RJZCA9IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgdGFza3M6IFtdXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS5jcmVhdGUobGlzdElkLCBkYXRhKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuY3JlYXRlZCA/IHRoaXMuZmluZEFsbCgpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAoZm9ybSwgbGlzdElkID0gMCkge1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuXG4gICAgICAgICAgICBsaXN0LnRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRlYWRsaW5lOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IE1lZGlhdG9yLnB1Ymxpc2gocmVzLmVycm9yLCAnYWxlcnQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5yZW1vdmUobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuZGVsZXRlZCA/IHRoaXMuZmluZEFsbCgpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMuZmluZChsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZUxpc3QgKGxpc3RJZCA9IDAsIGxpc3RUaXRsZSkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGl0bGUgPSBsaXN0VGl0bGU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IE1lZGlhdG9yLnB1Ymxpc2gocmVzLmVycm9yLCAnYWxlcnQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUYXNrcyAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMucmVkdWNlKCh0YXNrcywgbGlzdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmlkID09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdC50YXNrcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2tzO1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlVGFzayAobGlzdElkLCB0YXNrSWQsIHRhc2tEYXRhKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMubGlzdHMuZmluZCggbGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzW3Rhc2tJZF1bdGFza0RhdGEuZmllbGRdID0gdGFza0RhdGEudmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVGFzayAobGlzdElkLCB0YXNrSWQpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzLnNwbGljZSh0YXNrSWQsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTW9kZWwgPSBNb2RlbDtcbn0pKHdpbmRvdywgXyk7XG4iLCIoKHdpbmRvdykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kcG9pbnQgPSAnL3RvZG8nO1xuICAgICAgICAgICAgdGhpcy5TVEFURV9SRUFEWSA9IDQ7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZChsaXN0SWQsICdQT1NUJywge3RvZG86IEpTT04uc3RyaW5naWZ5KGRhdGEpfSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZChsaXN0SWQsICdQVVQnLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZChsaXN0SWQsICdERUxFVEUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmQgKGxpc3RJZCwgbWV0aG9kID0gJ0dFVCcsIGRhdGEgPSB7fSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3RJZCA9PT0gMCA/ICcnIDogbGlzdElkfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdzaG93JywgJ3NwaW5uZXInKTtcblxuICAgICAgICAgICAgICAgIHJlcS5vcGVuKG1ldGhvZCwgdXJsKTtcbiAgICAgICAgICAgICAgICByZXEuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gICAgICAgICAgICAgICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHJlcS5yZXNwb25zZSkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEVycm9yKHJlcS5zdGF0dXNUZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PT0gdGhpcy5TVEFURV9SRUFEWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCgnaGlkZScsICdzcGlubmVyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KEVycm9yKFwiTmV0d29yayBlcnJvclwiKSk7XG4gICAgICAgICAgICAgICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlN0b3JlID0gU3RvcmU7XG59KSh3aW5kb3cpO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFRhc2tWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvVGFza3NcIilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsID0gJCgnI2RhdGVUaW1lUGlja2VyJyk7XG4gICAgICAgICAgICB0aGlzLiRkYXRlVGltZU1vZGFsLmZpbmQoJ3NlbGVjdC5kYXRlJykuZHJ1bSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlRWRpdFRhc2sgKHRhc2spIHtcbiAgICAgICAgICAgIGlmICh0YXNrLmhhc0NsYXNzKCdvcGVuRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAndGV4dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKHRhc2tzKSB7XG4gICAgICAgICAgICBsZXQgJHJvb3QgPSBUYXNrVmlldy5nZXRSb290KCk7XG5cbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInRleHQtY2VudGVyXCIgY29sc3Bhbj1cIjNcIj5ObyBUYXNrcyE8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgXy5mb3JFYWNoKHRhc2tzLCAodGFzaywgdGFza0lkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyIGNsYXNzPVwianMtdGFzay1wYXJlbnRcIiBkYXRhLXRhc2staWQ9XCIke3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zm9ybSBpZD1cImVkaXRUYXNrJHt0YXNrSWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3Rhc2suZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJ0YXNrc1ske3Rhc2tJZH1dXCIgdmFsdWU9XCIke3Rhc2suZGVzY3JpcHRpb259XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWVkaXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtcGVuY2lsXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImpzLWRhdGV0aW1lXCIgZGF0YS10aW1lc3RhbXA9XCIke3Rhc2suZGVhZGxpbmV9XCI+JHt0YXNrLmRlYWRsaW5lID8gbW9tZW50KHRhc2suZGVhZGxpbmUpLmZvcm1hdCgnREQuTS5ZWVlZJykgOiAnLS0tJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImpzLWRvbmUgY3VzdG9tLWNvbnRyb2wgY3VzdG9tLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWlucHV0XCIgJHt0YXNrLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5UYXNrVmlldyA9IFRhc2tWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IHN0b3JlID0gbmV3IHRvZG8uU3RvcmUoKSxcbiAgICAgICAgbW9kZWwgPSBuZXcgdG9kby5Nb2RlbChzdG9yZSksXG4gICAgICAgIGxpc3RWaWV3ID0gbmV3IHRvZG8uTGlzdFZpZXcoKSxcbiAgICAgICAgdGFza1ZpZXcgPSBuZXcgdG9kby5UYXNrVmlldygpLFxuICAgICAgICBjb250cm9sbGVyID0gbmV3IHRvZG8uQ29udHJvbGxlcihtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KTtcbn0oKSk7XG5cbiJdfQ==
