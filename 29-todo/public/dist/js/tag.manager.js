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

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');
            Mediator.subscribe(this.listView.listActive, 'listActive');

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
                    console.log('edit');
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
                    console.log('>>> done', taskId);
                } else if ($(e.target).closest('.js-edit').length) {
                    this._editTask(taskId);
                } else if ($(e.target).closest('.js-remove').length) {
                    this.model.removeTask(this.listActive, taskId);
                }
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
                var _this = this;

                var editTask = $('#editTask' + taskId);

                editTask.addClass('openForm');
                this.taskView.toggleEditTask(editTask);

                editTask.on('submit', function (e) {
                    e.preventDefault();
                    editTask.off('submit');

                    editTask.removeClass('openForm');
                    _this.taskView.toggleEditTask(editTask);
                    _this.model.updateTask(_this.listActive, taskId, {
                        field: 'description',
                        value: e.target.elements[0].value
                    });
                });
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
            key: "render",
            value: function render(listTasks) {

                var $root = ListView.getRoot();
                $root.html('');

                _.forEach(listTasks, function (listItem) {
                    $root.append("<li class=\"list-group-item js-list-parent\" href=\"javascript:void(0)\" data-list-id=\"" + listItem.id + "\">\n                    <div class=\"d-flex w-100 justify-content-between\">\n                        <span><a class=\"js-set\" href=\"javascript:void(0)\">" + listItem.title + "</a></span>\n                        <span>\n                            <a class=\"js-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                            <a class=\"js-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                        </span>\n                    </div>\n                </li>");
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
                var listId = arguments[1];
                var data = arguments[2];


                var url = this.endpoint + '/' + (listId === 0 ? '' : listId);

                return new Promise(function (resolve, reject) {
                    var req = new XMLHttpRequest();

                    req.open(method, url);
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.onload = function () {
                        if (req.status === 200) {
                            resolve(JSON.parse(req.response));
                        } else {
                            reject(Error(req.statusText));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiQ29udHJvbGxlci5jbGFzcy5qcyIsIkxpc3RWaWV3LmNsYXNzLmpzIiwiTW9kZWwuY2xhc3MuanMiLCJTdG9yZS5jbGFzcy5qcyIsIlRhc2tWaWV3LmNsYXNzLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIk1lZGlhdG9yIiwic3Vic2NyaWJlcnMiLCJhbnkiLCJzdWJzY3JpYmUiLCJmbiIsInR5cGUiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIndpbmRvdyIsIiQiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInJlbmRlciIsImZpbmRBbGwiLCJiaW5kIiwiJHJvb3QiLCJvbiIsIl9iaW5kTGlzdEl0ZW1DbGljayIsIl9iaW5kTmV3TGlzdFN1Ym1pdCIsIl9iaW5kTmV3VGFza1N1Ym1pdCIsIl9iaW5kVGFza0l0ZW1DbGljayIsImUiLCIkZWxtIiwiY3VycmVudFRhcmdldCIsIiRwYXJlbnQiLCJjbG9zZXN0IiwibGlzdElkIiwiZGF0YSIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJwYXJzZUludCIsImNvbnNvbGUiLCJsb2ciLCJyZW1vdmUiLCJ0YXJnZXQiLCJ0YXNrSWQiLCJfZWRpdFRhc2siLCJyZW1vdmVUYXNrIiwicHJldmVudERlZmF1bHQiLCJjcmVhdGUiLCJ2YWwiLCJ1cGRhdGUiLCJlZGl0VGFzayIsImFkZENsYXNzIiwidG9nZ2xlRWRpdFRhc2siLCJvZmYiLCJyZW1vdmVDbGFzcyIsInVwZGF0ZVRhc2siLCJmaWVsZCIsInZhbHVlIiwiZWxlbWVudHMiLCJ0b2RvIiwialF1ZXJ5IiwiXyIsIkxpc3RWaWV3IiwiZ2V0Um9vdCIsImxpc3RUYXNrcyIsImh0bWwiLCJmb3JFYWNoIiwiYXBwZW5kIiwibGlzdEl0ZW0iLCJpZCIsInRpdGxlIiwiZmluZCIsImVhY2giLCJpdGVtIiwiJGxpc3RJdGVtIiwiTW9kZWwiLCJzdG9yZSIsImxpc3RzIiwidGhlbiIsIlByb21pc2UiLCJhbGwiLCJsaXN0SWRzIiwibWFwIiwibWVyZ2UiLCJyZXMiLCJlcnJvciIsImVyciIsImZvcm0iLCJEYXRlIiwibm93IiwiY3JlYXRlZCIsInRvU3RyaW5nIiwidGFza3MiLCJsaXN0IiwiZ2V0TGlzdCIsImRlc2NyaXB0aW9uIiwiZG9uZSIsImRlYWRsaW5lIiwidXBkYXRlZCIsImRlbGV0ZWQiLCJyZWR1Y2UiLCJ0YXNrRGF0YSIsIlN0b3JlIiwiZW5kcG9pbnQiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm1ldGhvZCIsInVybCIsInJlc29sdmUiLCJyZWplY3QiLCJyZXEiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25sb2FkIiwic3RhdHVzIiwicGFyc2UiLCJyZXNwb25zZSIsIkVycm9yIiwic3RhdHVzVGV4dCIsIm9uZXJyb3IiLCJUYXNrVmlldyIsIiRkYXRlVGltZU1vZGFsIiwiZHJ1bSIsInRhc2siLCJwcm9wIiwiZm9jdXMiLCJoaWRlIiwic2hvdyIsIm1vbWVudCIsImZvcm1hdCIsImNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsV0FBWSxZQUFNO0FBQ3BCOztBQUVBLFdBQU87QUFDSEMscUJBQWE7QUFDVEMsaUJBQUssRUFESSxDQUNEO0FBREMsU0FEVjs7QUFLSEMsaUJBTEcscUJBS1FDLEVBTFIsRUFLMEI7QUFBQSxnQkFBZEMsSUFBYyx1RUFBUCxLQUFPOztBQUN6QixnQkFBSSxPQUFPLEtBQUtKLFdBQUwsQ0FBaUJJLElBQWpCLENBQVAsS0FBa0MsV0FBdEMsRUFBbUQ7QUFDL0MscUJBQUtKLFdBQUwsQ0FBaUJJLElBQWpCLElBQXlCLEVBQXpCO0FBQ0g7QUFDRCxpQkFBS0osV0FBTCxDQUFpQkksSUFBakIsRUFBdUJDLElBQXZCLENBQTRCRixFQUE1QjtBQUNILFNBVkU7QUFXSEcsbUJBWEcsdUJBV1VILEVBWFYsRUFXY0MsSUFYZCxFQVdvQjtBQUNuQixpQkFBS0csZ0JBQUwsQ0FBc0IsYUFBdEIsRUFBcUNKLEVBQXJDLEVBQXlDQyxJQUF6QztBQUNILFNBYkU7QUFjSEksZUFkRyxtQkFjTUMsV0FkTixFQWNtQkwsSUFkbkIsRUFjeUI7QUFDeEIsaUJBQUtHLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDRSxXQUFqQyxFQUE4Q0wsSUFBOUM7QUFDSCxTQWhCRTtBQWlCSEcsd0JBakJHLDRCQWlCZUcsTUFqQmYsRUFpQnVCQyxHQWpCdkIsRUFpQjBDO0FBQUEsZ0JBQWRQLElBQWMsdUVBQVAsS0FBTzs7QUFDekMsZ0JBQUlKLGNBQWMsS0FBS0EsV0FBTCxDQUFpQkksSUFBakIsQ0FBbEI7O0FBRUEsaUJBQUssSUFBSVEsSUFBSSxDQUFiLEVBQWdCQSxJQUFJWixZQUFZYSxNQUFoQyxFQUF3Q0QsS0FBSyxDQUE3QyxFQUFnRDtBQUM1QyxvQkFBSUYsV0FBVyxTQUFmLEVBQTBCO0FBQ3RCVixnQ0FBWVksQ0FBWixFQUFlRCxHQUFmO0FBQ0gsaUJBRkQsTUFFTztBQUNILHdCQUFJWCxZQUFZWSxDQUFaLE1BQW1CRCxHQUF2QixFQUE0QjtBQUN4Qlgsb0NBQVljLE1BQVosQ0FBbUJGLENBQW5CLEVBQXNCLENBQXRCO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUE3QkUsS0FBUDtBQStCSCxDQWxDZ0IsRUFBakI7Ozs7Ozs7QUNBQSxDQUFDLFVBQUNHLE1BQUQsRUFBU0MsQ0FBVCxFQUFlO0FBQ1o7O0FBRFksUUFHTkMsVUFITTtBQUlSLDRCQUFhQyxLQUFiLEVBQW9CQyxRQUFwQixFQUE4QkMsUUFBOUIsRUFBd0M7QUFBQTs7QUFDcEMsaUJBQUtGLEtBQUwsR0FBYUEsS0FBYjtBQUNBLGlCQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGlCQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGlCQUFLQyxVQUFMLEdBQWtCLEVBQWxCOztBQUVBOztBQUVBdEIscUJBQVNHLFNBQVQsQ0FBbUIsS0FBS2lCLFFBQUwsQ0FBY0csTUFBakMsRUFBeUMsTUFBekM7QUFDQXZCLHFCQUFTRyxTQUFULENBQW1CLEtBQUtrQixRQUFMLENBQWNFLE1BQWpDLEVBQXlDLE1BQXpDO0FBQ0F2QixxQkFBU0csU0FBVCxDQUFtQixLQUFLaUIsUUFBTCxDQUFjRSxVQUFqQyxFQUE2QyxZQUE3Qzs7QUFFQTs7QUFFQSxpQkFBS0gsS0FBTCxDQUFXSyxPQUFYO0FBQ0EsaUJBQUtDLElBQUw7QUFDSDs7QUFwQk87QUFBQTtBQUFBLG1DQXNCQTtBQUNKLHFCQUFLTCxRQUFMLENBQWNNLEtBQWQsQ0FBb0JDLEVBQXBCLENBQXVCLE9BQXZCLEVBQWdDLEdBQWhDLEVBQXFDLEtBQUtDLGtCQUFMLENBQXdCSCxJQUF4QixDQUE2QixJQUE3QixDQUFyQztBQUNBUixrQkFBRSxpQkFBRixFQUFxQlUsRUFBckIsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS0Usa0JBQUwsQ0FBd0JKLElBQXhCLENBQTZCLElBQTdCLENBQWxDO0FBQ0FSLGtCQUFFLGlCQUFGLEVBQXFCVSxFQUFyQixDQUF3QixRQUF4QixFQUFrQyxLQUFLRyxrQkFBTCxDQUF3QkwsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FBbEM7QUFDQVIsa0JBQUUsWUFBRixFQUFnQlUsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsS0FBS0ksa0JBQUwsQ0FBd0JOLElBQXhCLENBQTZCLElBQTdCLENBQTVCO0FBQ0g7QUEzQk87QUFBQTtBQUFBLCtDQTZCWU8sQ0E3QlosRUE2QmU7QUFDbkIsb0JBQUlDLE9BQU9oQixFQUFFZSxFQUFFRSxhQUFKLENBQVg7QUFBQSxvQkFDSUMsVUFBVUYsS0FBS0csT0FBTCxDQUFhLGlCQUFiLENBRGQ7QUFBQSxvQkFFSUMsU0FBU0YsUUFBUUcsSUFBUixDQUFhLFFBQWIsS0FBMEIsRUFGdkM7O0FBSUEsb0JBQUlMLEtBQUtNLFFBQUwsQ0FBYyxRQUFkLENBQUosRUFBNkI7QUFDekIseUJBQUtqQixVQUFMLEdBQWtCZSxNQUFsQjtBQUNBckMsNkJBQVNTLE9BQVQsQ0FBaUIsS0FBS1UsS0FBTCxDQUFXcUIsUUFBWCxDQUFvQkMsU0FBUyxLQUFLbkIsVUFBZCxDQUFwQixDQUFqQixFQUFpRSxNQUFqRTtBQUNBdEIsNkJBQVNTLE9BQVQsQ0FBaUIsS0FBS2EsVUFBdEIsRUFBa0MsWUFBbEM7QUFDSCxpQkFKRCxNQUlPLElBQUlXLEtBQUtNLFFBQUwsQ0FBYyxTQUFkLENBQUosRUFBOEI7QUFDakNHLDRCQUFRQyxHQUFSLENBQVksTUFBWjtBQUNILGlCQUZNLE1BRUEsSUFBSVYsS0FBS00sUUFBTCxDQUFjLFdBQWQsQ0FBSixFQUFnQztBQUNuQyx5QkFBS3BCLEtBQUwsQ0FBV3lCLE1BQVgsQ0FBa0JQLE1BQWxCO0FBQ0g7QUFDSjtBQTNDTztBQUFBO0FBQUEsK0NBNkNZTCxDQTdDWixFQTZDZTtBQUNuQixvQkFBSUMsT0FBT2hCLEVBQUVlLEVBQUVhLE1BQUosQ0FBWDtBQUFBLG9CQUNJVixVQUFVRixLQUFLRyxPQUFMLENBQWEsaUJBQWIsQ0FEZDtBQUFBLG9CQUVJVSxTQUFTWCxRQUFRRyxJQUFSLENBQWEsUUFBYixDQUZiOztBQUlBLG9CQUFJTCxLQUFLTSxRQUFMLENBQWMsYUFBZCxDQUFKLEVBQWtDO0FBQzlCRyw0QkFBUUMsR0FBUixDQUFZLGNBQVosRUFBNEJHLE1BQTVCO0FBQ0gsaUJBRkQsTUFFTyxJQUFJYixLQUFLTSxRQUFMLENBQWMsU0FBZCxDQUFKLEVBQThCO0FBQ2pDRyw0QkFBUUMsR0FBUixDQUFZLFVBQVosRUFBd0JHLE1BQXhCO0FBQ0gsaUJBRk0sTUFFQSxJQUFJN0IsRUFBRWUsRUFBRWEsTUFBSixFQUFZVCxPQUFaLENBQW9CLFVBQXBCLEVBQWdDdEIsTUFBcEMsRUFBNEM7QUFDL0MseUJBQUtpQyxTQUFMLENBQWVELE1BQWY7QUFDSCxpQkFGTSxNQUVBLElBQUk3QixFQUFFZSxFQUFFYSxNQUFKLEVBQVlULE9BQVosQ0FBb0IsWUFBcEIsRUFBa0N0QixNQUF0QyxFQUE4QztBQUNqRCx5QkFBS0ssS0FBTCxDQUFXNkIsVUFBWCxDQUFzQixLQUFLMUIsVUFBM0IsRUFBdUN3QixNQUF2QztBQUNIO0FBQ0o7QUEzRE87QUFBQTtBQUFBLCtDQTZEWWQsQ0E3RFosRUE2RGU7QUFDbkJBLGtCQUFFaUIsY0FBRjtBQUNBLHFCQUFLOUIsS0FBTCxDQUFXK0IsTUFBWCxDQUFrQmxCLEVBQUVhLE1BQXBCO0FBQ0E1QixrQkFBRSxjQUFGLEVBQWtCa0MsR0FBbEIsQ0FBc0IsRUFBdEI7QUFDSDtBQWpFTztBQUFBO0FBQUEsK0NBbUVZbkIsQ0FuRVosRUFtRWU7QUFDbkJBLGtCQUFFaUIsY0FBRjtBQUNBLHFCQUFLOUIsS0FBTCxDQUFXaUMsTUFBWCxDQUFrQnBCLEVBQUVhLE1BQXBCLEVBQTRCLEtBQUt2QixVQUFqQztBQUNBTCxrQkFBRSxjQUFGLEVBQWtCa0MsR0FBbEIsQ0FBc0IsRUFBdEI7QUFDSDtBQXZFTztBQUFBO0FBQUEsc0NBeUVHTCxNQXpFSCxFQXlFVztBQUFBOztBQUNmLG9CQUFJTyxXQUFXcEMsZ0JBQWM2QixNQUFkLENBQWY7O0FBRUFPLHlCQUFTQyxRQUFULENBQWtCLFVBQWxCO0FBQ0EscUJBQUtqQyxRQUFMLENBQWNrQyxjQUFkLENBQTZCRixRQUE3Qjs7QUFFQUEseUJBQVMxQixFQUFULENBQVksUUFBWixFQUFzQixhQUFLO0FBQ3ZCSyxzQkFBRWlCLGNBQUY7QUFDQUksNkJBQVNHLEdBQVQsQ0FBYSxRQUFiOztBQUVBSCw2QkFBU0ksV0FBVCxDQUFxQixVQUFyQjtBQUNBLDBCQUFLcEMsUUFBTCxDQUFja0MsY0FBZCxDQUE2QkYsUUFBN0I7QUFDQSwwQkFBS2xDLEtBQUwsQ0FBV3VDLFVBQVgsQ0FBc0IsTUFBS3BDLFVBQTNCLEVBQXVDd0IsTUFBdkMsRUFBK0M7QUFDM0NhLCtCQUFPLGFBRG9DO0FBRTNDQywrQkFBTzVCLEVBQUVhLE1BQUYsQ0FBU2dCLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUJEO0FBRmUscUJBQS9DO0FBSUgsaUJBVkQ7QUFXSDtBQTFGTzs7QUFBQTtBQUFBOztBQTZGWjVDLFdBQU84QyxJQUFQLEdBQWM5QyxPQUFPOEMsSUFBUCxJQUFlLEVBQTdCO0FBQ0E5QyxXQUFPOEMsSUFBUCxDQUFZNUMsVUFBWixHQUF5QkEsVUFBekI7QUFDSCxDQS9GRCxFQStGR0YsTUEvRkgsRUErRlcrQyxNQS9GWDs7Ozs7OztBQ0FBLENBQUMsVUFBQy9DLE1BQUQsRUFBU0MsQ0FBVCxFQUFZK0MsQ0FBWixFQUFrQjtBQUNmOztBQURlLFFBR1RDLFFBSFM7QUFBQTtBQUFBO0FBQUEsc0NBS087QUFDZCx1QkFBT2hELEVBQUUsV0FBRixDQUFQO0FBQ0g7QUFQVTs7QUFTWCw0QkFBZTtBQUFBOztBQUNYLGlCQUFLUyxLQUFMLEdBQWF1QyxTQUFTQyxPQUFULEVBQWI7QUFDSDs7QUFYVTtBQUFBO0FBQUEsbUNBYUhDLFNBYkcsRUFhUTs7QUFFZixvQkFBSXpDLFFBQVF1QyxTQUFTQyxPQUFULEVBQVo7QUFDQXhDLHNCQUFNMEMsSUFBTixDQUFXLEVBQVg7O0FBRUFKLGtCQUFFSyxPQUFGLENBQVVGLFNBQVYsRUFBcUIsb0JBQVk7QUFDN0J6QywwQkFBTTRDLE1BQU4sOEZBQW1HQyxTQUFTQyxFQUE1RyxxS0FFNERELFNBQVNFLEtBRnJFO0FBU0gsaUJBVkQ7QUFXSDtBQTdCVTtBQUFBO0FBQUEsdUNBK0JDcEMsTUEvQkQsRUErQlM7QUFDaEI0Qix5QkFBU0MsT0FBVCxHQUFtQlEsSUFBbkIsQ0FBd0IsZ0JBQXhCLEVBQTBDQyxJQUExQyxDQUErQyxVQUFDOUQsQ0FBRCxFQUFJK0QsSUFBSixFQUFhO0FBQ3hELHdCQUFJQyxZQUFZNUQsRUFBRTJELElBQUYsQ0FBaEI7QUFDQUMsOEJBQVVwQixXQUFWLENBQXNCLFFBQXRCOztBQUVBLHdCQUFJaEIsU0FBU29DLFVBQVV2QyxJQUFWLENBQWUsUUFBZixDQUFULE1BQXVDRCxNQUEzQyxFQUFtRDtBQUMvQ3dDLGtDQUFVdkIsUUFBVixDQUFtQixRQUFuQjtBQUNIO0FBQ0osaUJBUEQ7QUFRSDtBQXhDVTs7QUFBQTtBQUFBOztBQTJDZnRDLFdBQU84QyxJQUFQLEdBQWM5QyxPQUFPOEMsSUFBUCxJQUFlLEVBQTdCO0FBQ0E5QyxXQUFPOEMsSUFBUCxDQUFZRyxRQUFaLEdBQXVCQSxRQUF2QjtBQUNILENBN0NELEVBNkNHakQsTUE3Q0gsRUE2Q1crQyxNQTdDWCxFQTZDbUJDLENBN0NuQjs7Ozs7OztBQ0FBLENBQUMsVUFBQ2hELE1BQUQsRUFBU2dELENBQVQsRUFBZTtBQUNaOztBQURZLFFBR05jLEtBSE07QUFJUix1QkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUNoQixpQkFBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsaUJBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0g7O0FBUE87QUFBQTtBQUFBLHNDQVNHO0FBQUE7O0FBQ1AscUJBQUtELEtBQUwsQ0FBV0wsSUFBWCxHQUFrQk8sSUFBbEIsQ0FDSSxtQkFBVztBQUNQLDJCQUFPQyxRQUFRQyxHQUFSLENBQVlDLFFBQVFDLEdBQVIsQ0FBWSxrQkFBVTtBQUNyQywrQkFBTyxNQUFLTixLQUFMLENBQVdMLElBQVgsQ0FBZ0JyQyxNQUFoQixFQUF3QjRDLElBQXhCLENBQTZCLGVBQU87QUFDdkMsbUNBQU9qQixFQUFFc0IsS0FBRixDQUFRQyxHQUFSLEVBQWEsRUFBQ2YsSUFBSW5DLE1BQUwsRUFBYixDQUFQO0FBQ0gseUJBRk0sQ0FBUDtBQUdILHFCQUprQixDQUFaLENBQVA7QUFLSCxpQkFQTCxFQVFFNEMsSUFSRixDQVFPLGlCQUFTO0FBQ1osMEJBQUtELEtBQUwsR0FBYUEsS0FBYjtBQUNBaEYsNkJBQVNTLE9BQVQsQ0FBaUIsTUFBS3VFLEtBQXRCLEVBQTZCLE1BQTdCO0FBQ0gsaUJBWEQ7QUFZSDtBQXRCTztBQUFBO0FBQUEsb0NBd0JDM0MsTUF4QkQsRUF3QlM7QUFDYixxQkFBSzBDLEtBQUwsQ0FBV0wsSUFBWCxDQUFnQnJDLE1BQWhCLEVBQXdCNEMsSUFBeEIsQ0FDSTtBQUFBLDJCQUFPakYsU0FBU1MsT0FBVCxDQUFpQjhFLEdBQWpCLEVBQXNCLE1BQXRCLENBQVA7QUFBQSxpQkFESixFQUVJO0FBQUEsMkJBQU83QyxRQUFROEMsS0FBUixDQUFjQyxHQUFkLENBQVA7QUFBQSxpQkFGSjtBQUlIO0FBN0JPO0FBQUE7QUFBQSxtQ0ErQkFDLElBL0JBLEVBK0JNO0FBQUE7O0FBQ1Ysb0JBQUlyRCxTQUFTc0QsS0FBS0MsR0FBTCxFQUFiO0FBQUEsb0JBQ0l0RCxPQUFPO0FBQ0htQywyQkFBT2lCLEtBQUs3QixRQUFMLENBQWMsQ0FBZCxFQUFpQkQsS0FEckI7QUFFSGlDLDZCQUFTLElBQUlGLElBQUosR0FBV0csUUFBWCxFQUZOO0FBR0hDLDJCQUFPO0FBSEosaUJBRFg7O0FBT0EscUJBQUtoQixLQUFMLENBQVc3QixNQUFYLENBQWtCYixNQUFsQixFQUEwQkMsSUFBMUIsRUFBZ0MyQyxJQUFoQyxDQUNJO0FBQUEsMkJBQU9NLElBQUlNLE9BQUosR0FBYyxPQUFLckUsT0FBTCxFQUFkLEdBQStCa0IsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBdEM7QUFBQSxpQkFESixFQUVJO0FBQUEsMkJBQU9ELFFBQVFDLEdBQVIsQ0FBWThDLEdBQVosQ0FBUDtBQUFBLGlCQUZKO0FBSUg7QUEzQ087QUFBQTtBQUFBLG1DQTZDQUMsSUE3Q0EsRUE2Q2tCO0FBQUEsb0JBQVpyRCxNQUFZLHVFQUFILENBQUc7OztBQUV0QixvQkFBSTJELE9BQU8sS0FBS0MsT0FBTCxDQUFhNUQsTUFBYixDQUFYOztBQUVBMkQscUJBQUtELEtBQUwsQ0FBV3pGLElBQVgsQ0FBZ0I7QUFDWjRGLGlDQUFhUixLQUFLN0IsUUFBTCxDQUFjLENBQWQsRUFBaUJELEtBRGxCO0FBRVp1QywwQkFBTSxLQUZNO0FBR1pDLDhCQUFVVCxLQUFLQyxHQUFMO0FBSEUsaUJBQWhCOztBQU1BLHFCQUFLYixLQUFMLENBQVczQixNQUFYLENBQWtCZixNQUFsQixFQUEwQjJELElBQTFCLEVBQWdDZixJQUFoQyxDQUNJO0FBQUEsMkJBQU9NLElBQUljLE9BQUosR0FBY3JHLFNBQVNTLE9BQVQsQ0FBaUJ1RixLQUFLRCxLQUF0QixFQUE2QixNQUE3QixDQUFkLEdBQXFEckQsUUFBUUMsR0FBUixDQUFZNEMsR0FBWixDQUE1RDtBQUFBLGlCQURKLEVBRUk7QUFBQSwyQkFBTzdDLFFBQVFDLEdBQVIsQ0FBWThDLEdBQVosQ0FBUDtBQUFBLGlCQUZKO0FBSUg7QUEzRE87QUFBQTtBQUFBLG1DQTZEQXBELE1BN0RBLEVBNkRRO0FBQUE7O0FBQ1oscUJBQUswQyxLQUFMLENBQVduQyxNQUFYLENBQWtCUCxNQUFsQixFQUEwQjRDLElBQTFCLENBQ0k7QUFBQSwyQkFBT00sSUFBSWUsT0FBSixHQUFjLE9BQUs5RSxPQUFMLEVBQWQsR0FBK0JrQixRQUFRQyxHQUFSLENBQVksUUFBWixFQUFzQjRDLElBQUlDLEtBQTFCLENBQXRDO0FBQUEsaUJBREosRUFFSTtBQUFBLDJCQUFPOUMsUUFBUUMsR0FBUixDQUFZOEMsR0FBWixDQUFQO0FBQUEsaUJBRko7QUFJSDtBQWxFTztBQUFBO0FBQUEsb0NBb0VDcEQsTUFwRUQsRUFvRVM7QUFDYix1QkFBTyxLQUFLMkMsS0FBTCxDQUFXTixJQUFYLENBQWdCO0FBQUEsMkJBQVFzQixLQUFLeEIsRUFBTCxJQUFXbkMsTUFBbkI7QUFBQSxpQkFBaEIsQ0FBUDtBQUNIO0FBdEVPO0FBQUE7QUFBQSx1Q0F3RWM7QUFBQSxvQkFBWkEsTUFBWSx1RUFBSCxDQUFHOztBQUNsQix1QkFBTyxLQUFLMkMsS0FBTCxDQUFXdUIsTUFBWCxDQUFrQixVQUFDUixLQUFELEVBQVFDLElBQVIsRUFBaUI7QUFDdEMsd0JBQUlBLEtBQUt4QixFQUFMLElBQVduQyxNQUFmLEVBQXVCO0FBQ25CLCtCQUFPMkQsS0FBS0QsS0FBWjtBQUNIO0FBQ0QsMkJBQU9BLEtBQVA7QUFDSCxpQkFMTSxFQUtKLEVBTEksQ0FBUDtBQU1IO0FBL0VPO0FBQUE7QUFBQSx1Q0FpRkkxRCxNQWpGSixFQWlGWVMsTUFqRlosRUFpRm9CMEQsUUFqRnBCLEVBaUY4QjtBQUNsQyxvQkFBSVIsT0FBTyxLQUFLaEIsS0FBTCxDQUFXTixJQUFYLENBQWlCO0FBQUEsMkJBQVFzQixLQUFLeEIsRUFBTCxJQUFXbkMsTUFBbkI7QUFBQSxpQkFBakIsQ0FBWDtBQUNBMkQscUJBQUtELEtBQUwsQ0FBV2pELE1BQVgsRUFBbUIwRCxTQUFTN0MsS0FBNUIsSUFBcUM2QyxTQUFTNUMsS0FBOUM7O0FBRUEscUJBQUttQixLQUFMLENBQVczQixNQUFYLENBQWtCZixNQUFsQixFQUEwQjJELElBQTFCLEVBQWdDZixJQUFoQyxDQUNJO0FBQUEsMkJBQU9NLElBQUljLE9BQUosR0FBY3JHLFNBQVNTLE9BQVQsQ0FBaUJ1RixLQUFLRCxLQUF0QixFQUE2QixNQUE3QixDQUFkLEdBQXFEckQsUUFBUUMsR0FBUixDQUFZNEMsR0FBWixDQUE1RDtBQUFBLGlCQURKLEVBRUk7QUFBQSwyQkFBTzdDLFFBQVFDLEdBQVIsQ0FBWThDLEdBQVosQ0FBUDtBQUFBLGlCQUZKO0FBSUg7QUF6Rk87QUFBQTtBQUFBLHVDQTJGSXBELE1BM0ZKLEVBMkZZUyxNQTNGWixFQTJGb0I7QUFDeEIsb0JBQUlrRCxPQUFPLEtBQUtDLE9BQUwsQ0FBYTVELE1BQWIsQ0FBWDtBQUNBMkQscUJBQUtELEtBQUwsQ0FBV2hGLE1BQVgsQ0FBa0IrQixNQUFsQixFQUEwQixDQUExQjs7QUFFQSxxQkFBS2lDLEtBQUwsQ0FBVzNCLE1BQVgsQ0FBa0JmLE1BQWxCLEVBQTBCMkQsSUFBMUIsRUFBZ0NmLElBQWhDLENBQ0k7QUFBQSwyQkFBT00sSUFBSWMsT0FBSixHQUFjckcsU0FBU1MsT0FBVCxDQUFpQnVGLEtBQUtELEtBQXRCLEVBQTZCLE1BQTdCLENBQWQsR0FBcURyRCxRQUFRQyxHQUFSLENBQVk0QyxHQUFaLENBQTVEO0FBQUEsaUJBREosRUFFSTtBQUFBLDJCQUFPN0MsUUFBUUMsR0FBUixDQUFZOEMsR0FBWixDQUFQO0FBQUEsaUJBRko7QUFJSDtBQW5HTzs7QUFBQTtBQUFBOztBQXNHWnpFLFdBQU84QyxJQUFQLEdBQWM5QyxPQUFPOEMsSUFBUCxJQUFlLEVBQTdCO0FBQ0E5QyxXQUFPOEMsSUFBUCxDQUFZZ0IsS0FBWixHQUFvQkEsS0FBcEI7QUFDSCxDQXhHRCxFQXdHRzlELE1BeEdILEVBd0dXZ0QsQ0F4R1g7Ozs7Ozs7QUNBQSxDQUFDLFVBQUNoRCxNQUFELEVBQVk7QUFDVDs7QUFEUyxRQUdIeUYsS0FIRztBQUtMLHlCQUFlO0FBQUE7O0FBQ1gsaUJBQUtDLFFBQUwsR0FBZ0IsT0FBaEI7QUFDSDs7QUFQSTtBQUFBO0FBQUEsbUNBU2E7QUFBQSxvQkFBWnJFLE1BQVksdUVBQUgsQ0FBRzs7QUFDZCx1QkFBTyxLQUFLc0UsSUFBTCxDQUFVLEtBQVYsRUFBaUJ0RSxNQUFqQixDQUFQO0FBQ0g7QUFYSTtBQUFBO0FBQUEscUNBYTBCO0FBQUEsb0JBQXZCQSxNQUF1Qix1RUFBZCxDQUFjO0FBQUEsb0JBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFDM0IsdUJBQU8sS0FBS3FFLElBQUwsQ0FBVSxNQUFWLEVBQWtCdEUsTUFBbEIsRUFBMEIsRUFBQ3lCLE1BQU04QyxLQUFLQyxTQUFMLENBQWV2RSxJQUFmLENBQVAsRUFBMUIsQ0FBUDtBQUNIO0FBZkk7QUFBQTtBQUFBLHFDQWlCMEI7QUFBQSxvQkFBdkJELE1BQXVCLHVFQUFkLENBQWM7QUFBQSxvQkFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUMzQix1QkFBTyxLQUFLcUUsSUFBTCxDQUFVLEtBQVYsRUFBaUJ0RSxNQUFqQixFQUF5QixFQUFDeUIsTUFBTThDLEtBQUtDLFNBQUwsQ0FBZXZFLElBQWYsQ0FBUCxFQUF6QixDQUFQO0FBQ0g7QUFuQkk7QUFBQTtBQUFBLHFDQXFCZTtBQUFBLG9CQUFaRCxNQUFZLHVFQUFILENBQUc7O0FBQ2hCLHVCQUFPLEtBQUtzRSxJQUFMLENBQVUsUUFBVixFQUFvQnRFLE1BQXBCLENBQVA7QUFDSDtBQXZCSTtBQUFBO0FBQUEsbUNBeUIrQjtBQUFBLG9CQUE5QnlFLE1BQThCLHVFQUFyQixLQUFxQjtBQUFBLG9CQUFkekUsTUFBYztBQUFBLG9CQUFOQyxJQUFNOzs7QUFFaEMsb0JBQU15RSxNQUFTLEtBQUtMLFFBQWQsVUFBMEJyRSxXQUFXLENBQVgsR0FBZSxFQUFmLEdBQW9CQSxNQUE5QyxDQUFOOztBQUVBLHVCQUFPLElBQUk2QyxPQUFKLENBQVksVUFBQzhCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQyx3QkFBTUMsTUFBTSxJQUFJQyxjQUFKLEVBQVo7O0FBRUFELHdCQUFJRSxJQUFKLENBQVNOLE1BQVQsRUFBaUJDLEdBQWpCO0FBQ0FHLHdCQUFJRyxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxpQ0FBckM7QUFDQUgsd0JBQUlJLE1BQUosR0FBYSxZQUFNO0FBQ2YsNEJBQUlKLElBQUlLLE1BQUosS0FBZSxHQUFuQixFQUF3QjtBQUNwQlAsb0NBQVFKLEtBQUtZLEtBQUwsQ0FBV04sSUFBSU8sUUFBZixDQUFSO0FBQ0gseUJBRkQsTUFFTztBQUNIUixtQ0FBT1MsTUFBTVIsSUFBSVMsVUFBVixDQUFQO0FBQ0g7QUFDSixxQkFORDtBQU9BVCx3QkFBSVUsT0FBSixHQUFjO0FBQUEsK0JBQU1YLE9BQU9TLE1BQU0sZUFBTixDQUFQLENBQU47QUFBQSxxQkFBZDtBQUNBUix3QkFBSVAsSUFBSixDQUFTQyxLQUFLQyxTQUFMLENBQWV2RSxJQUFmLENBQVQ7QUFDSCxpQkFkTSxDQUFQO0FBZUg7QUE1Q0k7O0FBQUE7QUFBQTs7QUErQ1R0QixXQUFPOEMsSUFBUCxHQUFjOUMsT0FBTzhDLElBQVAsSUFBZSxFQUE3QjtBQUNBOUMsV0FBTzhDLElBQVAsQ0FBWTJDLEtBQVosR0FBb0JBLEtBQXBCO0FBQ0gsQ0FqREQsRUFpREd6RixNQWpESDs7Ozs7OztBQ0FBLENBQUMsVUFBQ0EsTUFBRCxFQUFTQyxDQUFULEVBQWU7QUFDWjs7QUFEWSxRQUdONEcsUUFITTtBQUFBO0FBQUE7QUFBQSxzQ0FLVTtBQUNkLHVCQUFPNUcsRUFBRSxZQUFGLENBQVA7QUFDSDtBQVBPOztBQVNSLDRCQUFlO0FBQUE7O0FBQ1gsaUJBQUtTLEtBQUwsR0FBYW1HLFNBQVMzRCxPQUFULEVBQWI7QUFDQSxpQkFBSzRELGNBQUwsR0FBc0I3RyxFQUFFLGlCQUFGLENBQXRCO0FBQ0EsaUJBQUs2RyxjQUFMLENBQW9CcEQsSUFBcEIsQ0FBeUIsYUFBekIsRUFBd0NxRCxJQUF4QztBQUNIOztBQWJPO0FBQUE7QUFBQSwyQ0FlUUMsSUFmUixFQWVjO0FBQ2xCLG9CQUFJQSxLQUFLekYsUUFBTCxDQUFjLFVBQWQsQ0FBSixFQUErQjtBQUMzQnlGLHlCQUFLdEQsSUFBTCxDQUFVLE9BQVYsRUFBbUJ1RCxJQUFuQixDQUF3QixNQUF4QixFQUFnQyxNQUFoQyxFQUF3Q0MsS0FBeEM7QUFDQUYseUJBQUt0RCxJQUFMLENBQVUsTUFBVixFQUFrQnlELElBQWxCO0FBQ0gsaUJBSEQsTUFHTztBQUNISCx5QkFBS3RELElBQUwsQ0FBVSxPQUFWLEVBQW1CdUQsSUFBbkIsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBaEM7QUFDQUQseUJBQUt0RCxJQUFMLENBQVUsTUFBVixFQUFrQjBELElBQWxCO0FBQ0g7QUFDSjtBQXZCTztBQUFBO0FBQUEsbUNBeUJBckMsS0F6QkEsRUF5Qk87QUFDWCxvQkFBSXJFLFFBQVFtRyxTQUFTM0QsT0FBVCxFQUFaOztBQUVBeEMsc0JBQU0wQyxJQUFOLENBQVcsRUFBWDs7QUFFQSxvQkFBSTJCLE1BQU1qRixNQUFOLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3BCWSwwQkFBTTRDLE1BQU47QUFHSCxpQkFKRCxNQUlPO0FBQ0gseUJBQUssSUFBSXpELElBQUksQ0FBYixFQUFnQkEsSUFBSWtGLE1BQU1qRixNQUExQixFQUFrQ0QsS0FBSyxDQUF2QyxFQUEwQztBQUN0Q2EsOEJBQU00QyxNQUFOLGtEQUF5RHpELENBQXpELG1NQUdnQ0EsQ0FIaEMsdURBSXdCa0YsTUFBTWxGLENBQU4sRUFBU3FGLFdBSmpDLGdIQUt3RXJGLENBTHhFLG9CQUtzRmtGLE1BQU1sRixDQUFOLEVBQVNxRixXQUwvRixvaEJBYThDSCxNQUFNbEYsQ0FBTixFQUFTdUYsUUFidkQsWUFhb0VMLE1BQU1sRixDQUFOLEVBQVN1RixRQUFULEdBQW9CaUMsT0FBT3RDLE1BQU1sRixDQUFOLENBQVAsRUFBaUJ5SCxNQUFqQixDQUF3QixXQUF4QixDQUFwQixHQUEyRCxLQWIvSCw2TkFnQmtFdkMsTUFBTWxGLENBQU4sRUFBU3NGLElBQVQsR0FBZ0IsU0FBaEIsR0FBNEIsRUFoQjlGO0FBcUJIO0FBQ0o7QUFDSjtBQTNETzs7QUFBQTtBQUFBOztBQThEWm5GLFdBQU84QyxJQUFQLEdBQWM5QyxPQUFPOEMsSUFBUCxJQUFlLEVBQTdCO0FBQ0E5QyxXQUFPOEMsSUFBUCxDQUFZK0QsUUFBWixHQUF1QkEsUUFBdkI7QUFDSCxDQWhFRCxFQWdFRzdHLE1BaEVILEVBZ0VXK0MsTUFoRVg7OztBQ0FDLGFBQVk7QUFDVDs7QUFFQSxRQUFNZ0IsUUFBUSxJQUFJakIsS0FBSzJDLEtBQVQsRUFBZDtBQUFBLFFBQ0l0RixRQUFRLElBQUkyQyxLQUFLZ0IsS0FBVCxDQUFlQyxLQUFmLENBRFo7QUFBQSxRQUVJM0QsV0FBVyxJQUFJMEMsS0FBS0csUUFBVCxFQUZmO0FBQUEsUUFHSTVDLFdBQVcsSUFBSXlDLEtBQUsrRCxRQUFULEVBSGY7QUFBQSxRQUlJVSxhQUFhLElBQUl6RSxLQUFLNUMsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxRQUFyQyxDQUpqQjtBQUtILENBUkEsR0FBRCIsImZpbGUiOiJ0YWcubWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1lZGlhdG9yID0gKCgpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZXJzOiB7XG4gICAgICAgICAgICBhbnk6IFtdIC8vIGV2ZW50IHR5cGU6IHN1YnNjcmliZXJzXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3Vic2NyaWJlIChmbiwgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xuICAgICAgICB9LFxuICAgICAgICB1bnN1YnNjcmliZSAoZm4sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygndW5zdWJzY3JpYmUnLCBmbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1Ymxpc2ggKHB1YmxpY2F0aW9uLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3B1Ymxpc2gnLCBwdWJsaWNhdGlvbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0U3Vic2NyaWJlcnMgKGFjdGlvbiwgYXJnLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncHVibGlzaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbaV0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQ29udHJvbGxlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbGlzdFZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3ID0gdGFza1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSAnJztcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5yZW5kZXIsICdsaXN0Jyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy50YXNrVmlldy5yZW5kZXIsICd0YXNrJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZmluZEFsbCgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kICgpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuJHJvb3Qub24oJ2NsaWNrJywgJ2EnLCB0aGlzLl9iaW5kTGlzdEl0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdMaXN0Rm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3TGlzdFN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdUYXNrRm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3VGFza1N1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyN0b2RvVGFza3MnKS5vbignY2xpY2snLCB0aGlzLl9iaW5kVGFza0l0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTGlzdEl0ZW1DbGljayAoZSkge1xuICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLWxpc3QtcGFyZW50JyksXG4gICAgICAgICAgICAgICAgbGlzdElkID0gJHBhcmVudC5kYXRhKCdsaXN0SWQnKSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLXNldCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gbGlzdElkO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyhwYXJzZUludCh0aGlzLmxpc3RBY3RpdmUpKSwgJ3Rhc2snKTtcbiAgICAgICAgICAgICAgICBNZWRpYXRvci5wdWJsaXNoKHRoaXMubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtZWRpdCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VkaXQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtcmVtb3ZlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZShsaXN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmRUYXNrSXRlbUNsaWNrIChlKSB7XG4gICAgICAgICAgICBsZXQgJGVsbSA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxtLmNsb3Nlc3QoJy5qcy10YXNrLXBhcmVudCcpLFxuICAgICAgICAgICAgICAgIHRhc2tJZCA9ICRwYXJlbnQuZGF0YSgndGFza0lkJyk7XG5cbiAgICAgICAgICAgIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1kYXRldGltZScpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJz4+PiBkYXRldGltZScsIHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWRvbmUnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc+Pj4gZG9uZScsIHRhc2tJZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5qcy1lZGl0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdFRhc2sodGFza0lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJChlLnRhcmdldCkuY2xvc2VzdCgnLmpzLXJlbW92ZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3ZlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld0xpc3RTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwuY3JlYXRlKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICQoJyNuZXdUb0RvTGlzdCcpLnZhbChcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTmV3VGFza1N1Ym1pdCAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGUoZS50YXJnZXQsIHRoaXMubGlzdEFjdGl2ZSk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb1Rhc2snKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfZWRpdFRhc2sgKHRhc2tJZCkge1xuICAgICAgICAgICAgbGV0IGVkaXRUYXNrID0gJChgI2VkaXRUYXNrJHt0YXNrSWR9YCk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLmFkZENsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldy50b2dnbGVFZGl0VGFzayhlZGl0VGFzayk7XG5cbiAgICAgICAgICAgIGVkaXRUYXNrLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZWRpdFRhc2sub2ZmKCdzdWJtaXQnKTtcblxuICAgICAgICAgICAgICAgIGVkaXRUYXNrLnJlbW92ZUNsYXNzKCdvcGVuRm9ybScpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFza1ZpZXcudG9nZ2xlRWRpdFRhc2soZWRpdFRhc2spO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlVGFzayh0aGlzLmxpc3RBY3RpdmUsIHRhc2tJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZDogJ2Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGUudGFyZ2V0LmVsZW1lbnRzWzBdLnZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9MaXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2gobGlzdFRhc2tzLCBsaXN0SXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0ganMtbGlzdC1wYXJlbnRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgZGF0YS1saXN0LWlkPVwiJHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGEgY2xhc3M9XCJqcy1zZXRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+JHtsaXN0SXRlbS50aXRsZX08L2E+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPmApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0QWN0aXZlIChsaXN0SWQpIHtcbiAgICAgICAgICAgIExpc3RWaWV3LmdldFJvb3QoKS5maW5kKCdbZGF0YS1saXN0LWlkXScpLmVhY2goKGksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgJGxpc3RJdGVtID0gJChpdGVtKTtcbiAgICAgICAgICAgICAgICAkbGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KCRsaXN0SXRlbS5kYXRhKCdsaXN0SWQnKSkgPT09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAkbGlzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5MaXN0VmlldyA9IExpc3RWaWV3O1xufSkod2luZG93LCBqUXVlcnksIF8pO1xuIiwiKCh3aW5kb3csIF8pID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIE1vZGVsIHtcbiAgICAgICAgY29uc3RydWN0b3IgKHN0b3JlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgICAgICAgICB0aGlzLmxpc3RzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQWxsICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZCgpLnRoZW4oXG4gICAgICAgICAgICAgICAgbGlzdElkcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChsaXN0SWRzLm1hcChsaXN0SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tZXJnZShyZXMsIHtpZDogbGlzdElkfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkudGhlbihsaXN0cyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0cyA9IGxpc3RzO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0cywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZE9uZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiBNZWRpYXRvci5wdWJsaXNoKHJlcywgJ3Rhc2snKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY3JlYXRlIChmb3JtKSB7XG4gICAgICAgICAgICBsZXQgbGlzdElkID0gRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICB0YXNrczogW11cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZShsaXN0SWQsIGRhdGEpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5jcmVhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnbm90IGNyZWF0ZWQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAoZm9ybSwgbGlzdElkID0gMCkge1xuXG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMuZ2V0TGlzdChsaXN0SWQpO1xuXG4gICAgICAgICAgICBsaXN0LnRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRlYWRsaW5lOiBEYXRlLm5vdygpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS51cGRhdGUobGlzdElkLCBsaXN0KS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMudXBkYXRlZCA/IE1lZGlhdG9yLnB1Ymxpc2gobGlzdC50YXNrcywgJ3Rhc2snKSA6IGNvbnNvbGUubG9nKHJlcyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5yZW1vdmUobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuZGVsZXRlZCA/IHRoaXMuZmluZEFsbCgpIDogY29uc29sZS5sb2coJ2Vycm9yOicsIHJlcy5lcnJvciksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRMaXN0IChsaXN0SWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLmZpbmQobGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRUYXNrcyAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdHMucmVkdWNlKCh0YXNrcywgbGlzdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmlkID09IGxpc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdC50YXNrcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2tzO1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlVGFzayAobGlzdElkLCB0YXNrSWQsIHRhc2tEYXRhKSB7XG4gICAgICAgICAgICBsZXQgbGlzdCA9IHRoaXMubGlzdHMuZmluZCggbGlzdCA9PiBsaXN0LmlkID09IGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzW3Rhc2tJZF1bdGFza0RhdGEuZmllbGRdID0gdGFza0RhdGEudmFsdWU7XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUudXBkYXRlKGxpc3RJZCwgbGlzdCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLnVwZGF0ZWQgPyBNZWRpYXRvci5wdWJsaXNoKGxpc3QudGFza3MsICd0YXNrJykgOiBjb25zb2xlLmxvZyhyZXMpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlVGFzayAobGlzdElkLCB0YXNrSWQpIHtcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG4gICAgICAgICAgICBsaXN0LnRhc2tzLnNwbGljZSh0YXNrSWQsIDEpO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTW9kZWwgPSBNb2RlbDtcbn0pKHdpbmRvdywgXyk7XG4iLCIoKHdpbmRvdykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kcG9pbnQgPSAnL3RvZG8nO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZCAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgbGlzdElkLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBsaXN0SWQsIHt0b2RvOiBKU09OLnN0cmluZ2lmeShkYXRhKX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdERUxFVEUnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobWV0aG9kID0gJ0dFVCcsIGxpc3RJZCwgZGF0YSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3RJZCA9PT0gMCA/ICcnIDogbGlzdElkfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICByZXEub3BlbihtZXRob2QsIHVybCk7XG4gICAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXEucmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHJlamVjdChFcnJvcihcIk5ldHdvcmsgZXJyb3JcIikpO1xuICAgICAgICAgICAgICAgIHJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TdG9yZSA9IFN0b3JlO1xufSkod2luZG93KTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBUYXNrVmlldyB7XG5cbiAgICAgICAgc3RhdGljIGdldFJvb3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjdG9kb1Rhc2tzXCIpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gVGFza1ZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgdGhpcy4kZGF0ZVRpbWVNb2RhbCA9ICQoJyNkYXRlVGltZVBpY2tlcicpO1xuICAgICAgICAgICAgdGhpcy4kZGF0ZVRpbWVNb2RhbC5maW5kKCdzZWxlY3QuZGF0ZScpLmRydW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvZ2dsZUVkaXRUYXNrICh0YXNrKSB7XG4gICAgICAgICAgICBpZiAodGFzay5oYXNDbGFzcygnb3BlbkZvcm0nKSkge1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnaW5wdXQnKS5wcm9wKCd0eXBlJywgJ3RleHQnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHRhc2suZmluZCgnc3BhbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdpbnB1dCcpLnByb3AoJ3R5cGUnLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgdGFzay5maW5kKCdzcGFuJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyICh0YXNrcykge1xuICAgICAgICAgICAgbGV0ICRyb290ID0gVGFza1ZpZXcuZ2V0Um9vdCgpO1xuXG4gICAgICAgICAgICAkcm9vdC5odG1sKCcnKTtcblxuICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiIGNvbHNwYW49XCIzXCI+Tm8gVGFza3MhPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyIGNsYXNzPVwianMtdGFzay1wYXJlbnRcIiBkYXRhLXRhc2staWQ9XCIke2l9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGZvcm0gaWQ9XCJlZGl0VGFzayR7aX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dGFza3NbaV0uZGVzY3JpcHRpb259PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJ0YXNrc1ske2l9XVwiIHZhbHVlPVwiJHt0YXNrc1tpXS5kZXNjcmlwdGlvbn1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwianMtZGF0ZXRpbWVcIiBkYXRhLXRpbWVzdGFtcD1cIiR7dGFza3NbaV0uZGVhZGxpbmV9XCI+JHt0YXNrc1tpXS5kZWFkbGluZSA/IG1vbWVudCh0YXNrc1tpXSkuZm9ybWF0KCdERC5NLllZWVknKSA6ICctLS0nfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwianMtZG9uZSBjdXN0b20tY29udHJvbCBjdXN0b20tY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2tzW2ldLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uVGFza1ZpZXcgPSBUYXNrVmlldztcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjb25zdCBzdG9yZSA9IG5ldyB0b2RvLlN0b3JlKCksXG4gICAgICAgIG1vZGVsID0gbmV3IHRvZG8uTW9kZWwoc3RvcmUpLFxuICAgICAgICBsaXN0VmlldyA9IG5ldyB0b2RvLkxpc3RWaWV3KCksXG4gICAgICAgIHRhc2tWaWV3ID0gbmV3IHRvZG8uVGFza1ZpZXcoKSxcbiAgICAgICAgY29udHJvbGxlciA9IG5ldyB0b2RvLkNvbnRyb2xsZXIobW9kZWwsIGxpc3RWaWV3LCB0YXNrVmlldyk7XG59KCkpO1xuXG4iXX0=
