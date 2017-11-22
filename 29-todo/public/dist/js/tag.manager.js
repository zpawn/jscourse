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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window) {
    "use strict";

    var DateTimePicker = function () {
        function DateTimePicker() {
            _classCallCheck(this, DateTimePicker);

            this.picker = {
                $root: this,
                callback: {}
            };

            var picker = this.picker;

            $("#dateTimePicker").AnyPicker({
                onInit: function onInit() {
                    picker.$root = this;
                },
                mode: "datetime",
                theme: "iOS",
                rowsNavigation: "scroller",
                onSetOutput: function onSetOutput(sOutput, oArrSelectedValues) {
                    picker.callback(oArrSelectedValues.date);
                }
            });
        }

        _createClass(DateTimePicker, [{
            key: "open",
            value: function open(callback) {
                this.picker.$root.showOrHidePicker();
                this.picker.callback = callback;
            }
        }]);

        return DateTimePicker;
    }();

    window.todo = window.todo || {};
    window.todo.DateTimePicker = DateTimePicker;
})(window);
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
            this.dateTimePicker = new todo.DateTimePicker();

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
                var _this2 = this;

                var $elm = $(e.target),
                    $parent = $elm.closest('.js-task-parent'),
                    taskId = $parent.data('taskId');

                if ($elm.hasClass('js-datetime')) {
                    this.dateTimePicker.open(function (date) {
                        _this2.model.updateTask(_this2.listActive, taskId, {
                            field: 'deadline',
                            value: moment(date).valueOf()
                        });
                    });
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
                var _this3 = this;

                var editTask = $('#editTask' + taskId);

                editTask.addClass('openForm');
                this.taskView.toggleEditTask(editTask);

                editTask.on('submit', function (e) {
                    e.preventDefault();
                    editTask.off('submit');

                    editTask.removeClass('openForm');
                    _this3.taskView.toggleEditTask(editTask);
                    _this3.model.updateTask(_this3.listActive, taskId, {
                        field: 'description',
                        value: e.target.elements[0].value
                    });
                });

                editTask.on('focusout', function (e) {
                    editTask.removeClass('openForm');
                    _this3.taskView.toggleEditTask(editTask);
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
                        $root.append("<tr class=\"js-task-parent\" data-task-id=\"" + taskId + "\">\n                        <td>\n                            <div class=\"d-flex w-100 justify-content-between align-items-center\">\n                                <form id=\"editTask" + taskId + "\">\n                                    <span>" + task.description + "</span>\n                                    <input class=\"form-control\" type=\"hidden\" name=\"tasks[" + taskId + "]\" value=\"" + task.description + "\">\n                                </form>\n                                <span>\n                                    <a class=\"js-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                                    <a class=\"js-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                                </span>\n                            </div>\n                        </td>\n                        <td class=\"js-datetime\" data-timestamp=\"" + task.deadline + "\">" + (task.deadline ? moment(task.deadline).format('DD.MM.YYYY HH:mm') : '---') + "</td>\n                        <td>\n                            <label class=\"js-done custom-control custom-checkbox\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" " + (task.done ? 'checked' : '') + ">\n                                <span class=\"custom-control-indicator\"></span>\n                            </label>\n                        </td>\n                    </tr>");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFsZXJ0LmpzIiwiRGF0ZVRpbWVQaWNrZXIuanMiLCJNZWRpYXRvci5qcyIsIlNjcm9sbGVyLmpzIiwiU3Bpbm5lci5qcyIsIkNvbnRyb2xsZXIuY2xhc3MuanMiLCJMaXN0Vmlldy5jbGFzcy5qcyIsIk1vZGVsLmNsYXNzLmpzIiwiU3RvcmUuY2xhc3MuanMiLCJUYXNrVmlldy5jbGFzcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCIkIiwiQWxlcnQiLCJkYXRhIiwiYWxlcnQiLCJ0eXBlIiwibmFtZSIsIm1lc3NhZ2UiLCJhcHBlbmQiLCJzZXRUaW1lb3V0IiwicmVtb3ZlIiwidG9kbyIsImpRdWVyeSIsIkRhdGVUaW1lUGlja2VyIiwicGlja2VyIiwiJHJvb3QiLCJjYWxsYmFjayIsIkFueVBpY2tlciIsIm9uSW5pdCIsIm1vZGUiLCJ0aGVtZSIsInJvd3NOYXZpZ2F0aW9uIiwib25TZXRPdXRwdXQiLCJzT3V0cHV0Iiwib0FyclNlbGVjdGVkVmFsdWVzIiwiZGF0ZSIsInNob3dPckhpZGVQaWNrZXIiLCJNZWRpYXRvciIsInN1YnNjcmliZXJzIiwiYW55Iiwic3Vic2NyaWJlIiwiZm4iLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIlNjcm9sbGVyIiwic2VsZWN0b3IiLCJzY3JvbGxlckNvbnRhaW5lciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJwcyIsIlBlcmZlY3RTY3JvbGxiYXIiLCJzY3JvbGwiLCJTcGlubmVyIiwic2hvdyIsInRvZ2dsZSIsImhpZGUiLCJfIiwiQ29udHJvbGxlciIsIm1vZGVsIiwibGlzdFZpZXciLCJ0YXNrVmlldyIsImxpc3RBY3RpdmUiLCJzcGlubmVyIiwic2Nyb2xsZXIiLCJkYXRlVGltZVBpY2tlciIsInJlbmRlciIsImZpbmRBbGwiLCJiaW5kIiwib24iLCJfYmluZExpc3RJdGVtQ2xpY2siLCJfYmluZE5ld0xpc3RTdWJtaXQiLCJfYmluZE5ld1Rhc2tTdWJtaXQiLCJfYmluZFRhc2tJdGVtQ2xpY2siLCJfYmluZFNlYXJjaExpc3QiLCJfYmluZFNlYXJjaFRhc2siLCJfYmluZFNvcnRCeURvbmUiLCJlIiwiJGVsbSIsImN1cnJlbnRUYXJnZXQiLCIkcGFyZW50IiwiY2xvc2VzdCIsImxpc3RJZCIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJwYXJzZUludCIsIl9lZGl0TGlzdCIsImVkaXRMaXN0IiwiZmluZCIsImFkZENsYXNzIiwidG9nZ2xlRWRpdExpc3QiLCJwcmV2ZW50RGVmYXVsdCIsIm9mZiIsInJlbW92ZUNsYXNzIiwidXBkYXRlTGlzdCIsInRhcmdldCIsImVsZW1lbnRzIiwidmFsdWUiLCJjcmVhdGUiLCJ2YWwiLCJ0YXNrSWQiLCJvcGVuIiwidXBkYXRlVGFzayIsImZpZWxkIiwibW9tZW50IiwidmFsdWVPZiIsInByb3AiLCJfZWRpdFRhc2siLCJyZW1vdmVUYXNrIiwidXBkYXRlIiwiZWRpdFRhc2siLCJ0b2dnbGVFZGl0VGFzayIsInNlYXJjaCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsImxpc3RzIiwiZmlsdGVyIiwibGlzdCIsInRpdGxlIiwiaW5kZXhPZiIsInRhc2siLCJkZXNjcmlwdGlvbiIsInNvcnRJY29uIiwiaXMiLCJkb25lIiwiTGlzdFZpZXciLCJnZXRSb290IiwiZm9jdXMiLCJsaXN0VGFza3MiLCJodG1sIiwibGlzdEl0ZW0iLCJpZCIsImVhY2giLCJpdGVtIiwiJGxpc3RJdGVtIiwiTW9kZWwiLCJzdG9yZSIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyIiwiZm9ybSIsIkRhdGUiLCJub3ciLCJjcmVhdGVkIiwidG9TdHJpbmciLCJ0YXNrcyIsImVycm9yIiwiZ2V0TGlzdCIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJsaXN0VGl0bGUiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJTVEFURV9SRUFEWSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwic2V0UmVxdWVzdEhlYWRlciIsIm9ubG9hZCIsInN0YXR1cyIsInBhcnNlIiwicmVzcG9uc2UiLCJFcnJvciIsInN0YXR1c1RleHQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwib25lcnJvciIsIlRhc2tWaWV3IiwiZm9ybWF0IiwiY29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQ0FBQyxVQUFDQSxNQUFELEVBQVNDLENBQVQsRUFBZTtBQUNaOztBQURZLFFBR05DLEtBSE07QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLG1DQUlBQyxJQUpBLEVBSU07QUFDVixvQkFBSUMsUUFBUUgsZ0NBQTZCRSxLQUFLRSxJQUFMLEdBQVlGLEtBQUtFLElBQWpCLEdBQXdCLFFBQXJELHFRQUlFRixLQUFLRyxJQUFMLEdBQVlILEtBQUtHLElBQUwsR0FBWSxHQUF4QixHQUE4QixFQUpoQyxvQ0FLTkgsS0FBS0ksT0FMQywwQkFBWjs7QUFRQU4sa0JBQUUsU0FBRixFQUFhTyxNQUFiLENBQW9CSixLQUFwQjs7QUFFQUssMkJBQVc7QUFBQSwyQkFBTUwsTUFBTU0sTUFBTixFQUFOO0FBQUEsaUJBQVgsRUFBaUMsSUFBakM7QUFDSDtBQWhCTzs7QUFBQTtBQUFBOztBQW1CWlYsV0FBT1csSUFBUCxHQUFjWCxPQUFPVyxJQUFQLElBQWUsRUFBN0I7QUFDQVgsV0FBT1csSUFBUCxDQUFZVCxLQUFaLEdBQW9CQSxLQUFwQjtBQUNILENBckJELEVBcUJHRixNQXJCSCxFQXFCV1ksTUFyQlg7Ozs7Ozs7QUNBQSxDQUFDLFVBQUNaLE1BQUQsRUFBWTtBQUNUOztBQURTLFFBR0hhLGNBSEc7QUFLTCxrQ0FBZTtBQUFBOztBQUNY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MUgsV0FBT1csSUFBUCxHQUFjWCxPQUFPVyxJQUFQLElBQWUsRUFBN0I7QUFDQVgsV0FBT1csSUFBUCxDQUFZd0ssUUFBWixHQUF1QkEsUUFBdkI7QUFDSCxDQS9ERCxFQStER25MLE1BL0RILEVBK0RXWSxNQS9EWCxFQStEbUIyQyxDQS9EbkI7OztBQ0FDLGFBQVk7QUFDVDs7QUFFQSxRQUFNK0UsUUFBUSxJQUFJM0gsS0FBS2tKLEtBQVQsRUFBZDtBQUFBLFFBQ0lwRyxRQUFRLElBQUk5QyxLQUFLMEgsS0FBVCxDQUFlQyxLQUFmLENBRFo7QUFBQSxRQUVJNUUsV0FBVyxJQUFJL0MsS0FBS2dILFFBQVQsRUFGZjtBQUFBLFFBR0loRSxXQUFXLElBQUloRCxLQUFLd0ssUUFBVCxFQUhmO0FBQUEsUUFJSUUsYUFBYSxJQUFJMUssS0FBSzZDLFVBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxRQUEzQixFQUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQWxlcnQge1xuICAgICAgICByZW5kZXIgKGRhdGEpIHtcbiAgICAgICAgICAgIGxldCBhbGVydCA9ICQoYDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC0ke2RhdGEudHlwZSA/IGRhdGEudHlwZSA6ICdkYW5nZXInfSBhbGVydC1kaXNtaXNzaWJsZSBmYWRlIHNob3dcIiByb2xlPVwiYWxlcnRcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3Ryb25nPiR7ZGF0YS5uYW1lID8gZGF0YS5uYW1lICsgJzonIDogJyd9PC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgJHtkYXRhLm1lc3NhZ2V9XG4gICAgICAgICAgICA8L2Rpdj5gKTtcblxuICAgICAgICAgICAgJCgnI2FsZXJ0cycpLmFwcGVuZChhbGVydCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYWxlcnQucmVtb3ZlKCksIDMwMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5BbGVydCA9IEFsZXJ0O1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKCh3aW5kb3cpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIERhdGVUaW1lUGlja2VyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLnBpY2tlciA9IHtcbiAgICAgICAgICAgICAgICAkcm9vdDogdGhpcyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazoge31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBwaWNrZXIgPSB0aGlzLnBpY2tlcjtcblxuICAgICAgICAgICAgJChcIiNkYXRlVGltZVBpY2tlclwiKS5BbnlQaWNrZXIoe1xuICAgICAgICAgICAgICAgIG9uSW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBwaWNrZXIuJHJvb3QgPSB0aGlzO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbW9kZTogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICAgIHRoZW1lOiBcImlPU1wiLFxuICAgICAgICAgICAgICAgIHJvd3NOYXZpZ2F0aW9uOiBcInNjcm9sbGVyXCIsXG4gICAgICAgICAgICAgICAgb25TZXRPdXRwdXQ6IGZ1bmN0aW9uIChzT3V0cHV0LCBvQXJyU2VsZWN0ZWRWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGlja2VyLmNhbGxiYWNrKG9BcnJTZWxlY3RlZFZhbHVlcy5kYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wZW4gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnBpY2tlci4kcm9vdC5zaG93T3JIaWRlUGlja2VyKCk7XG4gICAgICAgICAgICB0aGlzLnBpY2tlci5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5EYXRlVGltZVBpY2tlciA9IERhdGVUaW1lUGlja2VyO1xufSkod2luZG93KTtcbiIsImNvbnN0IE1lZGlhdG9yID0gKCgpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZXJzOiB7XG4gICAgICAgICAgICBhbnk6IFtdIC8vIGV2ZW50IHR5cGU6IHN1YnNjcmliZXJzXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3Vic2NyaWJlIChmbiwgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xuICAgICAgICB9LFxuICAgICAgICB1bnN1YnNjcmliZSAoZm4sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygndW5zdWJzY3JpYmUnLCBmbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1Ymxpc2ggKHB1YmxpY2F0aW9uLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3B1Ymxpc2gnLCBwdWJsaWNhdGlvbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0U3Vic2NyaWJlcnMgKGFjdGlvbiwgYXJnLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncHVibGlzaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbaV0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIoKHdpbmRvdykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgU2Nyb2xsZXIge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyICgpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZXJDb250YWluZXIuZm9yRWFjaChzY3JvbGwgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwcyA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyKHNjcm9sbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU2Nyb2xsZXIgPSBTY3JvbGxlcjtcbn0pKHdpbmRvdyk7IiwiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGxldCBTcGlubmVyID0gc2VsZWN0b3IgPT4ge1xuICAgICAgICBjb25zdCAkcm9vdCA9ICQoc2VsZWN0b3IpO1xuICAgICAgICBsZXQgc2hvdyA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b2dnbGUgKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAodHlwZSA9PT0gJ3Nob3cnKSA/ICRyb290LnNob3coKSA6ICRyb290LmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TcGlubmVyID0gU3Bpbm5lcjtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIigod2luZG93LCAkLCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBDb250cm9sbGVyIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAobW9kZWwsIGxpc3RWaWV3LCB0YXNrVmlldykge1xuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICAgICAgdGhpcy5saXN0VmlldyA9IGxpc3RWaWV3O1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldyA9IHRhc2tWaWV3O1xuICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gJyc7XG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIgPSBuZXcgdG9kby5TcGlubmVyKCcjc3Bpbm5lcicpO1xuICAgICAgICAgICAgdGhpcy5hbGVydCA9IG5ldyB0b2RvLkFsZXJ0KCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyID0gbmV3IHRvZG8uU2Nyb2xsZXIoJy5qcy1zY3JvbGxlcicpO1xuICAgICAgICAgICAgdGhpcy5kYXRlVGltZVBpY2tlciA9IG5ldyB0b2RvLkRhdGVUaW1lUGlja2VyKCk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcucmVuZGVyLCAnbGlzdCcpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMudGFza1ZpZXcucmVuZGVyLCAndGFzaycpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnNwaW5uZXIudG9nZ2xlLCAnc3Bpbm5lcicpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMuYWxlcnQucmVuZGVyLCAnYWxlcnQnKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyLnJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQgKCkge1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy4kcm9vdC5vbignY2xpY2snLCAnYScsIHRoaXMuX2JpbmRMaXN0SXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld0xpc3RGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdMaXN0U3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI2FkZE5ld1Rhc2tGb3JtJykub24oJ3N1Ym1pdCcsIHRoaXMuX2JpbmROZXdUYXNrU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3RvZG9UYXNrcycpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRUYXNrSXRlbUNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgJCgnI3NlYXJjaExpc3QnKS5vbigna2V5dXAnLCB0aGlzLl9iaW5kU2VhcmNoTGlzdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNzZWFyY2hUYXNrJykub24oJ2tleXVwJywgdGhpcy5fYmluZFNlYXJjaFRhc2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjc29ydEJ5RG9uZScpLm9uKCdjbGljaycsIHRoaXMuX2JpbmRTb3J0QnlEb25lLmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRMaXN0SXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlKGxpc3RJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdExpc3QgKGxpc3RJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRMaXN0ID0gdGhpcy5saXN0Vmlldy4kcm9vdC5maW5kKGAjZWRpdExpc3Qke2xpc3RJZH1gKTtcblxuICAgICAgICAgICAgZWRpdExpc3QuYWRkQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LnRvZ2dsZUVkaXRMaXN0KGVkaXRMaXN0KTtcblxuICAgICAgICAgICAgZWRpdExpc3Qub24oJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlZGl0TGlzdC5vZmYoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAgICAgZWRpdExpc3QucmVtb3ZlQ2xhc3MoJ29wZW5Gb3JtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Vmlldy50b2dnbGVFZGl0TGlzdChlZGl0TGlzdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaXN0KGxpc3RJZCwgZS50YXJnZXQuZWxlbWVudHNbMF0udmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRMaXN0Lm9uKCdmb2N1c291dCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0LnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFZpZXcudG9nZ2xlRWRpdExpc3QoZWRpdExpc3QpO1xuICAgICAgICAgICAgICAgIGVkaXRMaXN0Lm9mZignZm9jdXNvdXQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdMaXN0U3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNyZWF0ZShlLnRhcmdldCk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZFRhc2tJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLXRhc2stcGFyZW50JyksXG4gICAgICAgICAgICAgICAgdGFza0lkID0gJHBhcmVudC5kYXRhKCd0YXNrSWQnKTtcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRhdGV0aW1lJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVUaW1lUGlja2VyLm9wZW4oKGRhdGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVUYXNrKHRoaXMubGlzdEFjdGl2ZSwgdGFza0lkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2RlYWRsaW5lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtb21lbnQoZGF0ZSkudmFsdWVPZigpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1kb25lJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6ICdkb25lJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICEkZWxtLmZpbmQoJ2lucHV0JykucHJvcCgnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1lZGl0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdFRhc2sodGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLXJlbW92ZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld1Rhc2tTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlKGUudGFyZ2V0LCB0aGlzLmxpc3RBY3RpdmUpO1xuICAgICAgICAgICAgJCgnI25ld1RvRG9UYXNrJykudmFsKFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgX2VkaXRUYXNrICh0YXNrSWQpIHtcbiAgICAgICAgICAgIGxldCBlZGl0VGFzayA9ICQoYCNlZGl0VGFzayR7dGFza0lkfWApO1xuXG4gICAgICAgICAgICBlZGl0VGFzay5hZGRDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuXG4gICAgICAgICAgICBlZGl0VGFzay5vbignc3VibWl0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGVkaXRUYXNrLm9mZignc3VibWl0Jyk7XG5cbiAgICAgICAgICAgICAgICBlZGl0VGFzay5yZW1vdmVDbGFzcygnb3BlbkZvcm0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tWaWV3LnRvZ2dsZUVkaXRUYXNrKGVkaXRUYXNrKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnVwZGF0ZVRhc2sodGhpcy5saXN0QWN0aXZlLCB0YXNrSWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6ICdkZXNjcmlwdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBlLnRhcmdldC5lbGVtZW50c1swXS52YWx1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLm9uKCdmb2N1c291dCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGVkaXRUYXNrLnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuICAgICAgICAgICAgICAgIGVkaXRUYXNrLm9mZignZm9jdXNvdXQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRTZWFyY2hMaXN0IChlKSB7XG4gICAgICAgICAgICBsZXQgc2VhcmNoID0gXy50cmltKGUudGFyZ2V0LnZhbHVlKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICBpZiAoc2VhcmNoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmxpc3RzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPT4gbGlzdC50aXRsZS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSAhPT0gLTFcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgJ2xpc3QnXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRTZWFyY2hUYXNrIChlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5saXN0QWN0aXZlKSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgc2VhcmNoID0gXy50cmltKGUudGFyZ2V0LnZhbHVlKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmdldFRhc2tzKHRoaXMubGlzdEFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrID0+IHRhc2suZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgIT09IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YXNrJ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kU29ydEJ5RG9uZSAoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubGlzdEFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGxldCBzb3J0SWNvbiA9ICQoJyNzb3J0QnlEb25lSWNvbicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNvcnRJY29uLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRJY29uLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHRoaXMubGlzdEFjdGl2ZSksICd0YXNrJylcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzb3J0SWNvbi5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmdldFRhc2tzKHRoaXMubGlzdEFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHRhc2sgPT4gdGFzay5kb25lID09PSBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFzaydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkNvbnRyb2xsZXIgPSBDb250cm9sbGVyO1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKCh3aW5kb3csICQsIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIExpc3RWaWV3IHtcblxuICAgICAgICBzdGF0aWMgZ2V0Um9vdCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJChcIiN0b2RvTGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSBMaXN0Vmlldy5nZXRSb290KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVFZGl0TGlzdCAobGlzdCkge1xuICAgICAgICAgICAgaWYgKGxpc3QuaGFzQ2xhc3MoJ29wZW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ2lucHV0JykucHJvcCgndHlwZScsICd0ZXh0JykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICBsaXN0LmZpbmQoJ3NwYW4nKS5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIGxpc3QuZmluZCgnc3BhbicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2gobGlzdFRhc2tzLCBsaXN0SXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0ganMtbGlzdC1wYXJlbnRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgZGF0YS1saXN0LWlkPVwiJHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJlZGl0TGlzdCR7bGlzdEl0ZW0uaWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGEgY2xhc3M9XCJqcy1zZXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+JHtsaXN0SXRlbS50aXRsZX08L2E+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibGlzdHNbJHtsaXN0SXRlbS5pZH1dXCIgdmFsdWU9XCIke2xpc3RJdGVtLnRpdGxlfVwiPiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPmApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0QWN0aXZlIChsaXN0SWQpIHtcbiAgICAgICAgICAgIExpc3RWaWV3LmdldFJvb3QoKS5maW5kKCdbZGF0YS1saXN0LWlkXScpLmVhY2goKGksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgJGxpc3RJdGVtID0gJChpdGVtKTtcbiAgICAgICAgICAgICAgICAkbGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KCRsaXN0SXRlbS5kYXRhKCdsaXN0SWQnKSkgPT09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5MaXN0VmlldyA9IExpc3RWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKCh3aW5kb3csIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIE1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgICAgICB0aGlzLmxpc3RzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQWxsICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZCgpLnRoZW4oXG4gICAgICAgICAgICAgICAgbGlzdElkcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChsaXN0SWRzLm1hcChsaXN0SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tZXJnZShyZXMsIHtpZDogbGlzdElkfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApLnRoZW4obGlzdHMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdHMgPSBsaXN0cztcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubGlzdHMsICdsaXN0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRPbmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gTWVkaWF0b3IucHVibGlzaChyZXMsICd0YXNrJyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChmb3JtKSB7XG4gICAgICAgICAgICBsZXQgbGlzdElkID0gRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICB0YXNrczogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZShsaXN0SWQsIGRhdGEpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5jcmVhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChmb3JtLCBsaXN0SWQgPSAwKSB7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG5cbiAgICAgICAgICAgIGxpc3QudGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVhZGxpbmU6IERhdGUubm93KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0TGlzdCAobGlzdElkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0cy5maW5kKGxpc3QgPT4gbGlzdC5pZCA9PSBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlTGlzdCAobGlzdElkID0gMCwgbGlzdFRpdGxlKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuICAgICAgICAgICAgbGlzdC50aXRsZSA9IGxpc3RUaXRsZTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IHRoaXMuZmluZEFsbCgpIDogTWVkaWF0b3IucHVibGlzaChyZXMuZXJyb3IsICdhbGVydCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBNZWRpYXRvci5wdWJsaXNoKHttZXNzYWdlOiBlcnJ9LCAnYWxlcnQnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFRhc2tzIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0cy5yZWR1Y2UoKHRhc2tzLCBsaXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QuaWQgPT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0LnRhc2tzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3M7XG4gICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVUYXNrIChsaXN0SWQsIHRhc2tJZCwgdGFza0RhdGEpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5saXN0cy5maW5kKCBsaXN0ID0+IGxpc3QuaWQgPT0gbGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGFza3NbdGFza0lkXVt0YXNrRGF0YS5maWVsZF0gPSB0YXNrRGF0YS52YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IE1lZGlhdG9yLnB1Ymxpc2gocmVzLmVycm9yLCAnYWxlcnQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gTWVkaWF0b3IucHVibGlzaCh7bWVzc2FnZTogZXJyfSwgJ2FsZXJ0JylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmVUYXNrIChsaXN0SWQsIHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGxpc3QgPSB0aGlzLmdldExpc3QobGlzdElkKTtcbiAgICAgICAgICAgIGxpc3QudGFza3Muc3BsaWNlKHRhc2tJZCwgMSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBNZWRpYXRvci5wdWJsaXNoKHJlcy5lcnJvciwgJ2FsZXJ0JyksXG4gICAgICAgICAgICAgICAgZXJyID0+IE1lZGlhdG9yLnB1Ymxpc2goe21lc3NhZ2U6IGVycn0sICdhbGVydCcpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Nb2RlbCA9IE1vZGVsO1xufSkod2luZG93LCBfKTtcbiIsIigod2luZG93KSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBTdG9yZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy5lbmRwb2ludCA9ICcvdG9kbyc7XG4gICAgICAgICAgICB0aGlzLlNUQVRFX1JFQURZID0gNDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmQgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQobGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKGxpc3RJZCwgJ1BPU1QnLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKGxpc3RJZCwgJ1BVVCcsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKGxpc3RJZCwgJ0RFTEVURScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobGlzdElkLCBtZXRob2QgPSAnR0VUJywgZGF0YSA9IHt9KSB7XG5cbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuZW5kcG9pbnR9LyR7bGlzdElkID09PSAwID8gJycgOiBsaXN0SWR9YDtcblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2goJ3Nob3cnLCAnc3Bpbm5lcicpO1xuXG4gICAgICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09PSB0aGlzLlNUQVRFX1JFQURZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKCdoaWRlJywgJ3NwaW5uZXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoRXJyb3IoXCJOZXR3b3JrIGVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3RvcmUgPSBTdG9yZTtcbn0pKHdpbmRvdyk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgVGFza1ZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9UYXNrc1wiKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUVkaXRUYXNrICh0YXNrKSB7XG4gICAgICAgICAgICBpZiAodGFzay5oYXNDbGFzcygnb3BlbkZvcm0nKSkge1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ3RleHQnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnc3BhbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyICh0YXNrcykge1xuICAgICAgICAgICAgbGV0ICRyb290ID0gVGFza1ZpZXcuZ2V0Um9vdCgpO1xuXG4gICAgICAgICAgICAkcm9vdC5odG1sKCcnKTtcblxuICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiIGNvbHNwYW49XCIzXCI+Tm8gVGFza3MhPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIF8uZm9yRWFjaCh0YXNrcywgKHRhc2ssIHRhc2tJZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0ciBjbGFzcz1cImpzLXRhc2stcGFyZW50XCIgZGF0YS10YXNrLWlkPVwiJHt0YXNrSWR9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJlZGl0VGFzayR7dGFza0lkfVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHt0YXNrLmRlc2NyaXB0aW9ufTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwidGFza3NbJHt0YXNrSWR9XVwiIHZhbHVlPVwiJHt0YXNrLmRlc2NyaXB0aW9ufVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJqcy1kYXRldGltZVwiIGRhdGEtdGltZXN0YW1wPVwiJHt0YXNrLmRlYWRsaW5lfVwiPiR7dGFzay5kZWFkbGluZSA/IG1vbWVudCh0YXNrLmRlYWRsaW5lKS5mb3JtYXQoJ0RELk1NLllZWVkgSEg6bW0nKSA6ICctLS0nfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwianMtZG9uZSBjdXN0b20tY29udHJvbCBjdXN0b20tY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2suZG9uZSA/ICdjaGVja2VkJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXN0b20tY29udHJvbC1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlRhc2tWaWV3ID0gVGFza1ZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgdG9kby5TdG9yZSgpLFxuICAgICAgICBtb2RlbCA9IG5ldyB0b2RvLk1vZGVsKHN0b3JlKSxcbiAgICAgICAgbGlzdFZpZXcgPSBuZXcgdG9kby5MaXN0VmlldygpLFxuICAgICAgICB0YXNrVmlldyA9IG5ldyB0b2RvLlRhc2tWaWV3KCksXG4gICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgdG9kby5Db250cm9sbGVyKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpO1xufSgpKTtcblxuIl19
