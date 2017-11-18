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
        function Scroller() {
            _classCallCheck(this, Scroller);
        }

        _createClass(Scroller, [{
            key: "render",
            value: function render() {
                Scroller.get().forEach(function (scroll) {
                    var ps = new PerfectScrollbar(scroll);
                });
            }
        }], [{
            key: "get",
            value: function get() {
                return document.querySelectorAll('.js-scroller');
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
            this.scroller = new todo.Scroller();

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');
            Mediator.subscribe(this.listView.listActive, 'listActive');
            Mediator.subscribe(this.spinner.toggle, 'spinner');
            Mediator.subscribe(this.alert.render, 'alert');
            Mediator.subscribe(this.scroller.render, 'scroller');

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
                    Mediator.publish({}, 'scroller');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFsZXJ0LmpzIiwiTWVkaWF0b3IuanMiLCJTY3JvbGxlci5qcyIsIlNwaW5uZXIuanMiLCJDb250cm9sbGVyLmNsYXNzLmpzIiwiTGlzdFZpZXcuY2xhc3MuanMiLCJNb2RlbC5jbGFzcy5qcyIsIlN0b3JlLmNsYXNzLmpzIiwiVGFza1ZpZXcuY2xhc3MuanMiLCJhcHAuanMiXSwibmFtZXMiOlsid2luZG93IiwiJCIsIkFsZXJ0IiwiZGF0YSIsImFsZXJ0IiwidHlwZSIsIm5hbWUiLCJtZXNzYWdlIiwiYXBwZW5kIiwic2V0VGltZW91dCIsInJlbW92ZSIsInRvZG8iLCJqUXVlcnkiLCJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIlNjcm9sbGVyIiwiZ2V0IiwiZm9yRWFjaCIsInBzIiwiUGVyZmVjdFNjcm9sbGJhciIsInNjcm9sbCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsIlNwaW5uZXIiLCIkcm9vdCIsInNlbGVjdG9yIiwic2hvdyIsInRvZ2dsZSIsImhpZGUiLCJfIiwiQ29udHJvbGxlciIsIm1vZGVsIiwibGlzdFZpZXciLCJ0YXNrVmlldyIsImxpc3RBY3RpdmUiLCJzcGlubmVyIiwic2Nyb2xsZXIiLCJyZW5kZXIiLCJmaW5kQWxsIiwiYmluZCIsIm9uIiwiX2JpbmRMaXN0SXRlbUNsaWNrIiwiX2JpbmROZXdMaXN0U3VibWl0IiwiX2JpbmROZXdUYXNrU3VibWl0IiwiX2JpbmRUYXNrSXRlbUNsaWNrIiwiX2JpbmRTZWFyY2hMaXN0IiwiX2JpbmRTZWFyY2hUYXNrIiwiX2JpbmRTb3J0QnlEb25lIiwiZSIsIiRlbG0iLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0SWQiLCJoYXNDbGFzcyIsImdldFRhc2tzIiwicGFyc2VJbnQiLCJfZWRpdExpc3QiLCJlZGl0TGlzdCIsImZpbmQiLCJhZGRDbGFzcyIsInRvZ2dsZUVkaXRMaXN0IiwicHJldmVudERlZmF1bHQiLCJvZmYiLCJyZW1vdmVDbGFzcyIsInVwZGF0ZUxpc3QiLCJ0YXJnZXQiLCJlbGVtZW50cyIsInZhbHVlIiwiY3JlYXRlIiwidmFsIiwidGFza0lkIiwiY29uc29sZSIsImxvZyIsInVwZGF0ZVRhc2siLCJmaWVsZCIsInByb3AiLCJfZWRpdFRhc2siLCJyZW1vdmVUYXNrIiwidXBkYXRlIiwiZWRpdFRhc2siLCJ0b2dnbGVFZGl0VGFzayIsInNlYXJjaCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsImxpc3RzIiwiZmlsdGVyIiwibGlzdCIsInRpdGxlIiwiaW5kZXhPZiIsInRhc2siLCJkZXNjcmlwdGlvbiIsInNvcnRJY29uIiwiaXMiLCJkb25lIiwiTGlzdFZpZXciLCJnZXRSb290IiwiZm9jdXMiLCJsaXN0VGFza3MiLCJodG1sIiwibGlzdEl0ZW0iLCJpZCIsImVhY2giLCJpdGVtIiwiJGxpc3RJdGVtIiwiTW9kZWwiLCJzdG9yZSIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyIiwiZm9ybSIsIkRhdGUiLCJub3ciLCJjcmVhdGVkIiwidG9TdHJpbmciLCJ0YXNrcyIsImVycm9yIiwiZ2V0TGlzdCIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwicmVhZHlTdGF0ZSIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsIm1vbWVudCIsImZvcm1hdCIsImNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsVUFBQ0EsTUFBRCxFQUFTQyxDQUFULEVBQWU7QUFDWjs7QUFEWSxRQUdOQyxLQUhNO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxtQ0FJQUMsSUFKQSxFQUlNO0FBQ1Ysb0JBQUlDLFFBQVFILGdDQUE2QkUsS0FBS0UsSUFBTCxHQUFZRixLQUFLRSxJQUFqQixHQUF3QixRQUFyRCxxUUFJRUYsS0FBS0csSUFBTCxHQUFZSCxLQUFLRyxJQUFMLEdBQVksR0FBeEIsR0FBOEIsRUFKaEMsb0NBS05ILEtBQUtJLE9BTEMsMEJBQVo7O0FBUUFOLGtCQUFFLFNBQUYsRUFBYU8sTUFBYixDQUFvQkosS0FBcEI7O0FBRUFLLDJCQUFXO0FBQUEsMkJBQU1MLE1BQU1NLE1BQU4sRUFBTjtBQUFBLGlCQUFYLEVBQWlDLElBQWpDO0FBQ0g7QUFoQk87O0FBQUE7QUFBQTs7QUFtQlpWLFdBQU9XLElBQVAsR0FBY1gsT0FBT1csSUFBUCxJQUFlLEVBQTdCO0FBQ0FYLFdBQU9XLElBQVAsQ0FBWVQsS0FBWixHQUFvQkEsS0FBcEI7QUFDSCxDQXJCRCxFQXFCR0YsTUFyQkgsRUFxQldZLE1BckJYOzs7QUNBQSxJQUFNQyxXQUFZLFlBQU07QUFDcEI7O0FBRUEsV0FBTztBQUNIQyxxQkFBYTtBQUNUQyxpQkFBSyxFQURJLENBQ0Q7QUFEQyxTQURWOztBQUtIQyxpQkFMRyxxQkFLUUMsRUFMUixFQUswQjtBQUFBLGdCQUFkWixJQUFjLHVFQUFQLEtBQU87O0FBQ3pCLGdCQUFJLE9BQU8sS0FBS1MsV0FBTCxDQUFpQlQsSUFBakIsQ0FBUCxLQUFrQyxXQUF0QyxFQUFtRDtBQUMvQyxxQkFBS1MsV0FBTCxDQUFpQlQsSUFBakIsSUFBeUIsRUFBekI7QUFDSDtB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SUFBUCxDQUFZMEosUUFBWixHQUF1QkEsUUFBdkI7QUFDSCxDQWpFRCxFQWlFR3JLLE1BakVILEVBaUVXWSxNQWpFWCxFQWlFbUI4QixDQWpFbkI7OztBQ0FDLGFBQVk7QUFDVDs7QUFFQSxRQUFNNkUsUUFBUSxJQUFJNUcsS0FBS21JLEtBQVQsRUFBZDtBQUFBLFFBQ0lsRyxRQUFRLElBQUlqQyxLQUFLMkcsS0FBVCxDQUFlQyxLQUFmLENBRFo7QUFBQSxRQUVJMUUsV0FBVyxJQUFJbEMsS0FBS2lHLFFBQVQsRUFGZjtBQUFBLFFBR0k5RCxXQUFXLElBQUluQyxLQUFLMEosUUFBVCxFQUhmO0FBQUEsUUFJSUssYUFBYSxJQUFJL0osS0FBS2dDLFVBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxRQUEzQixFQUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQWxlcnQge1xuICAgICAgICByZW5kZXIgKGRhdGEpIHtcbiAgICAgICAgICAgIGxldCBhbGVydCA9ICQoYDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC0ke2RhdGEudHlwZSA/IGRhdGEudHlwZSA6ICdkYW5nZXInfSBhbGVydC1kaXNtaXNzaWJsZSBmYWRlIHNob3dcIiByb2xlPVwiYWxlcnRcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPiR7ZGF0YS5uYW1lID8gZGF0YS5uYW1lICsgJzonIDogJyd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgJHtkYXRhLm1lc3NhZ2V9XG4gICAgICAgICAgICA8L2Rpdj5gKTtcblxuICAgICAgICAgICAgJCgnI2FsZXJ0cycpLmFwcGVuZChhbGVydCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYWxlcnQucmVtb3ZlKCksIDMwMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5BbGVydCA9IEFsZXJ0O1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiY29uc3QgTWVkaWF0b3IgPSAoKCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaWJlcnM6IHtcbiAgICAgICAgICAgIGFueTogW10gLy8gZXZlbnQgdHlwZTogc3Vic2NyaWJlcnNcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJzY3JpYmUgKGZuLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XG4gICAgICAgIH0sXG4gICAgICAgIHVuc3Vic2NyaWJlIChmbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCd1bnN1YnNjcmliZScsIGZuLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVibGlzaCAocHVibGljYXRpb24sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygncHVibGlzaCcsIHB1YmxpY2F0aW9uLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRTdWJzY3JpYmVycyAoYWN0aW9uLCBhcmcsIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgbGV0IHN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVyc1t0eXBlXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdwdWJsaXNoJykge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyc1tpXSA9PT0gYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbiIsIigod2luZG93KSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBTY3JvbGxlciB7XG4gICAgICAgIHN0YXRpYyBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1zY3JvbGxlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyICgpIHtcbiAgICAgICAgICAgIFNjcm9sbGVyLmdldCgpLmZvckVhY2goc2Nyb2xsID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcHMgPSBuZXcgUGVyZmVjdFNjcm9sbGJhcihzY3JvbGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlNjcm9sbGVyID0gU2Nyb2xsZXI7XG59KSh3aW5kb3cpOyIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBsZXQgU3Bpbm5lciA9IHNlbGVjdG9yID0+IHtcbiAgICAgICAgY29uc3QgJHJvb3QgPSAkKHNlbGVjdG9yKTtcbiAgICAgICAgbGV0IHNob3cgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9nZ2xlICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgKHR5cGUgPT09ICdzaG93JykgPyAkcm9vdC5zaG93KCkgOiAkcm9vdC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3Bpbm5lciA9IFNwaW5uZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQ29udHJvbGxlciB7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcgPSBsaXN0VmlldztcbiAgICAgICAgICAgIHRoaXMudGFza1ZpZXcgPSB0YXNrVmlldztcbiAgICAgICAgICAgIHRoaXMubGlzdEFjdGl2ZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy5zcGlubmVyID0gbmV3IHRvZG8uU3Bpbm5lcignI3NwaW5uZXInKTtcbiAgICAgICAgICAgIHRoaXMuYWxlcnQgPSBuZXcgdG9kby5BbGVydCgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlciA9IG5ldyB0b2RvLlNjcm9sbGVyKCk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcucmVuZGVyLCAnbGlzdCcpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMudGFza1ZpZXcucmVuZGVyLCAndGFzaycpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnNwaW5uZXIudG9nZ2xlLCAnc3Bpbm5lcicpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMuYWxlcnQucmVuZGVyLCAnYWxlcnQnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnNjcm9sbGVyLnJlbmRlciwgJ3Njcm9sbGVyJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQgKCkge1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy4kcm9vdC5vbignY2xpY2snLCAnYScsIHRoaXMuX2JpbmRMaXN0SXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld0xpc3RGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdMaXN0U3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld1Rhc2tGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdUYXNrU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3RvZG9UYXNrcycpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRUYXNrSXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3NlYXJjaExpc3QnKS5vbigna2V5dXAnLCB0aGlzLl9iaW5kU2VhcmNoTGlzdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNzZWFyY2hUYXNrJykub24oJ2tleXVwJywgdGhpcy5fYmluZFNlYXJjaFRhc2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjc29ydEJ5RG9uZScpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRTb3J0QnlEb25lLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRMaXN0SXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlKGxpc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRMaXN0ID0gdGhpcy5saXN0Vmlldy4kcm9vdC5maW5kKGAjZWRpdExpc3Qke2xpc3RJZH1gKTtcblxuICAgICAgICAgICAgZWRpdExpc3QuYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcblxuICAgICAgICAgICAgZWRpdExpc3Qub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdExpc3QucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaXN0KGxpc3RJZCwgZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0Lm9uKCdmb2N1c291dCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0LnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcudG9nZ2xlRWRpdExpc3QoZWRpdExpc3QpO1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0Lm9mZignZm9jdXNvdXQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdMaXN0U3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNyZWF0ZShlLnRhcmdldCk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFRhc2tJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLXRhc2stcGFyZW50JyksXG4gICAgICAgICAgICAgICAgdGFza0lkID0gJHBhcmVudC5kYXRhKCd0YXNrSWQnKTtcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRhdGV0aW1lJykpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPj4+IGRhdGV0aW1lJywgdGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZG9uZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZG9uZScsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAhJGVsbS5maW5kKCdpbnB1dCcpLnByb3AoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCcuanMtZWRpdCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRUYXNrKHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1yZW1vdmUnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdUYXNrU3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZShlLnRhcmdldCwgdGhpcy5saXN0QWN0aXZlKTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvVGFzaycpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9lZGl0VGFzayAodGFza0lkKSB7XG4gICAgICAgICAgICBsZXQgZWRpdFRhc2sgPSAkKGAjZWRpdFRhc2ske3Rhc2tJZH1gKTtcblxuICAgICAgICAgICAgZWRpdFRhc2suYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcblxuICAgICAgICAgICAgZWRpdFRhc2sub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdFRhc2sucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiAnZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlZGl0VGFzay5vbignZm9jdXNvdXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcbiAgICAgICAgICAgICAgICBlZGl0VGFzay5vZmYoJ2ZvY3Vzb3V0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kU2VhcmNoTGlzdCAoZSkge1xuICAgICAgICAgICAgbGV0IHNlYXJjaCA9IF8udHJpbShlLnRhcmdldC52YWx1ZSkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5saXN0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0+IGxpc3QudGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgIT09IC0xXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICdsaXN0J1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kU2VhcmNoVGFzayAoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGlzdEFjdGl2ZSkge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNlYXJjaCA9IF8udHJpbShlLnRhcmdldC52YWx1ZSkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWFyY2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9PiB0YXNrLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpICE9PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFzaydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubW9kZWwuZ2V0VGFza3ModGhpcy5saXN0QWN0aXZlKSwgJ3Rhc2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFNvcnRCeURvbmUgKGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpc3RBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBsZXQgc29ydEljb24gPSAkKCcjc29ydEJ5RG9uZUljb24nKTtcblxuICAgICAgICAgICAgICAgIGlmIChzb3J0SWNvbi5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgICAgICAgICBzb3J0SWNvbi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpLCAndGFzaycpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc29ydEljb24uc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih0YXNrID0+IHRhc2suZG9uZSA9PT0gZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Rhc2snXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Db250cm9sbGVyID0gQ29udHJvbGxlcjtcbn0pKHdpbmRvdywgalF1ZXJ5LCBfKTtcbiIsIigod2luZG93LCAkLCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBMaXN0VmlldyB7XG5cbiAgICAgICAgc3RhdGljIGdldFJvb3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjdG9kb0xpc3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9nZ2xlRWRpdExpc3QgKGxpc3QpIHtcbiAgICAgICAgICAgIGlmIChsaXN0Lmhhc0NsYXNzKCdvcGVuRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAndGV4dCcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgbGlzdC5maW5kKCdzcGFuJykuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ3NwYW4nKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKGxpc3RUYXNrcykge1xuXG4gICAgICAgICAgICBsZXQgJHJvb3QgPSBMaXN0Vmlldy5nZXRSb290KCk7XG4gICAgICAgICAgICAkcm9vdC5odG1sKCcnKTtcblxuICAgICAgICAgICAgXy5mb3JFYWNoKGxpc3RUYXNrcywgbGlzdEl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGpzLWxpc3QtcGFyZW50XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiIGRhdGEtbGlzdC1pZD1cIiR7bGlzdEl0ZW0uaWR9XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiZWRpdExpc3Qke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPjxhIGNsYXNzPVwianMtc2V0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPiR7bGlzdEl0ZW0udGl0bGV9PC9hPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImxpc3RzWyR7bGlzdEl0ZW0uaWR9XVwiIHZhbHVlPVwiJHtsaXN0SXRlbS50aXRsZX1cIj4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtcmVtb3ZlXCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLWNyb3NzXCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9saT5gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGlzdEFjdGl2ZSAobGlzdElkKSB7XG4gICAgICAgICAgICBMaXN0Vmlldy5nZXRSb290KCkuZmluZCgnW2RhdGEtbGlzdC1pZF0nKS5lYWNoKChpLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0ICRsaXN0SXRlbSA9ICQoaXRlbSk7XG4gICAgICAgICAgICAgICAgJGxpc3RJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChwYXJzZUludCgkbGlzdEl0ZW0uZGF0YSgnbGlzdElkJykpID09PSBsaXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGxpc3RJdGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTGlzdFZpZXcgPSBMaXN0Vmlldztcbn0pKHdpbmRvdywgalF1ZXJ5LCBfKTtcbiIsIigod2luZG93LCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBNb2RlbCB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChzdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICAgICAgdGhpcy5saXN0cyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZEFsbCAoKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQoKS50aGVuKFxuICAgICAgICAgICAgICAgIGxpc3RJZHMgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwobGlzdElkcy5tYXAobGlzdElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8ubWVyZ2UocmVzLCB7aWQ6IGxpc3RJZH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKS50aGVuKGxpc3RzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RzID0gbGlzdHM7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goe30sICdzY3JvbGxlcicpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRPbmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gTWVkaWF0b3IucHVibGlzaChyZXMsICd0YXNrJyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChmb3JtKSB7XG4gICAgICAgICAgICBsZXQgbGlzdElkID0gRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICB0YXNrczogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZShsaXN0SWQsIGRhdGEpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5jcmVhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChmb3JtLCBsaXN0SWQgPSAwKSB7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG5cbiAgICAgICAgICAgIGxpc3QudGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVhZGxpbmU6IERhdGUubm93KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0TGlzdCAobGlzdElkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0cy5maW5kKGxpc3QgPT4gbGlzdC5pZCA9PSBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlTGlzdCAobGlzdElkID0gMCwgbGlzdFRpdGxlKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50aXRsZSA9IGxpc3RUaXRsZTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IHRoaXMuZmluZEFsbCgpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFRhc2tzIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0cy5yZWR1Y2UoKHRhc2tzLCBsaXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QuaWQgPT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0LnRhc2tzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3M7XG4gICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVUYXNrIChsaXN0SWQsIHRhc2tJZCwgdGFza0RhdGEpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5saXN0cy5maW5kKCBsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGFza3NbdGFza0lkXVt0YXNrRGF0YS5maWVsZF0gPSB0YXNrRGF0YS52YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IE1lZGlhdG9yLnB1Ymxpc2gocmVzLmVycm9yLCAnYWxlcnQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVUYXNrIChsaXN0SWQsIHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGFza3Muc3BsaWNlKHRhc2tJZCwgMSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Nb2RlbCA9IE1vZGVsO1xufSkod2luZG93LCBfKTtcbiIsIigod2luZG93KSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBTdG9yZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy5lbmRwb2ludCA9ICcvdG9kbyc7XG4gICAgICAgICAgICB0aGlzLlNUQVRFX1JFQURZID0gNDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmQgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQobGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKGxpc3RJZCwgJ1BPU1QnLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKGxpc3RJZCwgJ1BVVCcsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKGxpc3RJZCwgJ0RFTEVURScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobGlzdElkLCBtZXRob2QgPSAnR0VUJywgZGF0YSA9IHt9KSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuZW5kcG9pbnR9LyR7bGlzdElkID09PSAwID8gJycgOiBsaXN0SWR9YDtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goJ3Nob3cnLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSB0aGlzLlNUQVRFX1JFQURZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdoaWRlJywgJ3NwaW5uZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoRXJyb3IoXCJOZXR3b3JrIGVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3RvcmUgPSBTdG9yZTtcbn0pKHdpbmRvdyk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgVGFza1ZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9UYXNrc1wiKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwgPSAkKCcjZGF0ZVRpbWVQaWNrZXInKTtcbiAgICAgICAgICAgIHRoaXMuJGRhdGVUaW1lTW9kYWwuZmluZCgnc2VsZWN0LmRhdGUnKS5kcnVtKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0VGFzayAodGFzaykge1xuICAgICAgICAgICAgaWYgKHRhc2suaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0YXNrLmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAodGFza3MpIHtcbiAgICAgICAgICAgIGxldCAkcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcblxuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidGV4dC1jZW50ZXJcIiBjb2xzcGFuPVwiM1wiPk5vIFRhc2tzITwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLmZvckVhY2godGFza3MsICh0YXNrLCB0YXNrSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8dHIgY2xhc3M9XCJqcy10YXNrLXBhcmVudFwiIGRhdGEtdGFzay1pZD1cIiR7dGFza0lkfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdy0xMDAganVzdGlmeS1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmb3JtIGlkPVwiZWRpdFRhc2ske3Rhc2tJZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dGFzay5kZXNjcmlwdGlvbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInRhc2tzWyR7dGFza0lkfV1cIiB2YWx1ZT1cIiR7dGFzay5kZXNjcmlwdGlvbn1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwianMtZGF0ZXRpbWVcIiBkYXRhLXRpbWVzdGFtcD1cIiR7dGFzay5kZWFkbGluZX1cIj4ke3Rhc2suZGVhZGxpbmUgPyBtb21lbnQodGFzay5kZWFkbGluZSkuZm9ybWF0KCdERC5NLllZWVknKSA6ICctLS0nfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwianMtZG9uZSBjdXN0b20tY29udHJvbCBjdXN0b20tY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2suZG9uZSA/ICdjaGVja2VkJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXN0b20tY29udHJvbC1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlRhc2tWaWV3ID0gVGFza1ZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgdG9kby5TdG9yZSgpLFxuICAgICAgICBtb2RlbCA9IG5ldyB0b2RvLk1vZGVsKHN0b3JlKSxcbiAgICAgICAgbGlzdFZpZXcgPSBuZXcgdG9kby5MaXN0VmlldygpLFxuICAgICAgICB0YXNrVmlldyA9IG5ldyB0b2RvLlRhc2tWaWV3KCksXG4gICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgdG9kby5Db250cm9sbGVyKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpO1xufSgpKTtcblxuIl19
