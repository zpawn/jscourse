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
            }
        }, {
            key: '_bindListItemClick',
            value: function _bindListItemClick(e) {
                var $elm = $(e.currentTarget),
                    $parent = $elm.closest('.js-list-parent'),
                    listId = $parent.data('listId') || '';

                if ($elm.hasClass('js-list-set')) {
                    this.listActive = listId;
                    Mediator.publish(this.model.getTasks(parseInt(this.listActive)), 'task');
                    Mediator.publish(this.listActive, 'listActive');
                } else if ($elm.hasClass('js-list-edit')) {
                    console.log('edit');
                } else if ($elm.hasClass('js-list-remove')) {
                    this.model.remove(listId);
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
                    $root.append("<li class=\"list-group-item js-list-parent\" href=\"javascript:void(0)\" data-list-id=\"" + listItem.id + "\">\n                    <div class=\"d-flex w-100 justify-content-between\">\n                        <span><a class=\"js-list-set\" href=\"javascript:void(0)\">" + listItem.title + "</a></span>\n                        <span>\n                            <a class=\"js-list-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                            <a class=\"js-list-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                        </span>\n                    </div>\n                </li>");
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
            value: function getList() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                return this.lists.reduce(function (lists, list) {
                    if (list.id == listId) {
                        return list;
                    }
                    return lists;
                }, {});
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
        }

        _createClass(TaskView, [{
            key: "render",
            value: function render(tasks) {
                var $root = TaskView.getRoot();

                $root.html('');

                if (tasks.length === 0) {
                    $root.append("<tr>\n                    <td class=\"text-center\" colspan=\"3\">No Tasks!</td>\n                </tr>");
                } else {
                    for (var i = 0; i < tasks.length; i += 1) {
                        $root.append("<tr>\n                        <td>" + tasks[i].description + "</td>\n                        <td>" + (tasks[i].deadline ? tasks[i].deadline : '---') + "</td>\n                        <td>\n                            <label class=\"custom-control custom-checkbox\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" " + (tasks[i].done ? 'checked' : '') + ">\n                                <span class=\"custom-control-indicator\"></span>\n                            </label>\n                        </td>\n                    </tr>");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiQ29udHJvbGxlci5jbGFzcy5qcyIsIkxpc3RWaWV3LmNsYXNzLmpzIiwiTW9kZWwuY2xhc3MuanMiLCJTdG9yZS5jbGFzcy5qcyIsIlRhc2tWaWV3LmNsYXNzLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIk1lZGlhdG9yIiwic3Vic2NyaWJlcnMiLCJhbnkiLCJzdWJzY3JpYmUiLCJmbiIsInR5cGUiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIndpbmRvdyIsIiQiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInJlbmRlciIsImZpbmRBbGwiLCJiaW5kIiwiJHJvb3QiLCJvbiIsIl9iaW5kTGlzdEl0ZW1DbGljayIsIl9iaW5kTmV3TGlzdFN1Ym1pdCIsIl9iaW5kTmV3VGFza1N1Ym1pdCIsImUiLCIkZWxtIiwiY3VycmVudFRhcmdldCIsIiRwYXJlbnQiLCJjbG9zZXN0IiwibGlzdElkIiwiZGF0YSIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJwYXJzZUludCIsImNvbnNvbGUiLCJsb2ciLCJyZW1vdmUiLCJwcmV2ZW50RGVmYXVsdCIsImNyZWF0ZSIsInRhcmdldCIsInZhbCIsInVwZGF0ZSIsInRvZG8iLCJqUXVlcnkiLCJfIiwiTGlzdFZpZXciLCJnZXRSb290IiwibGlzdFRhc2tzIiwiaHRtbCIsImZvckVhY2giLCJhcHBlbmQiLCJsaXN0SXRlbSIsImlkIiwidGl0bGUiLCJmaW5kIiwiZWFjaCIsIml0ZW0iLCIkbGlzdEl0ZW0iLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiTW9kZWwiLCJzdG9yZSIsImxpc3RzIiwidGhlbiIsIlByb21pc2UiLCJhbGwiLCJsaXN0SWRzIiwibWFwIiwibWVyZ2UiLCJyZXMiLCJlcnJvciIsImVyciIsImZvcm0iLCJEYXRlIiwibm93IiwiZWxlbWVudHMiLCJ2YWx1ZSIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwibGlzdCIsImdldExpc3QiLCJkZXNjcmlwdGlvbiIsImRvbmUiLCJkZWFkbGluZSIsInVwZGF0ZWQiLCJkZWxldGVkIiwicmVkdWNlIiwiU3RvcmUiLCJlbmRwb2ludCIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25lcnJvciIsIlRhc2tWaWV3IiwiY29udHJvbGxlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxXQUFZLFlBQU07QUFDcEI7O0FBRUEsV0FBTztBQUNIQyxxQkFBYTtBQUNUQyxpQkFBSyxFQURJLENBQ0Q7QUFEQyxTQURWOztBQUtIQyxpQkFMRyxxQkFLUUMsRUFMUixFQUswQjtBQUFBLGdCQUFkQyxJQUFjLHVFQUFQLEtBQU87O0FBQ3pCLGdCQUFJLE9BQU8sS0FBS0osV0FBTCxDQUFpQkksSUFBakIsQ0FBUCxLQUFrQyxXQUF0QyxFQUFtRDtBQUMvQyxxQkFBS0osV0FBTCxDQUFpQkksSUFBakIsSUFBeUIsRUFBekI7QUFDSDtBQUNELGlCQUFLSixXQUFMLENBQWlCSSxJQUFqQixFQUF1QkMsSUFBdkIsQ0FBNEJGLEVBQTVCO0FBQ0gsU0FWRTtBQVdIRyxtQkFYRyx1QkFXVUgsRUFYVixFQVdjQyxJQVhkLEVBV29CO0FBQ25CLGlCQUFLRyxnQkFBTCxDQUFzQixhQUF0QixFQUFxQ0osRUFBckMsRUFBeUNDLElBQXpDO0FBQ0gsU0FiRTtBQWNISSxlQWRHLG1CQWNNQyxXQWROLEVBY21CTCxJQWRuQixFQWN5QjtBQUN4QixpQkFBS0csZ0JBQUwsQ0FBc0IsU0FBdEIsRUFBaUNFLFdBQWpDLEVB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OztBQXVDWjFFLFdBQU9pQyxJQUFQLEdBQWNqQyxPQUFPaUMsSUFBUCxJQUFlLEVBQTdCO0FBQ0FqQyxXQUFPaUMsSUFBUCxDQUFZa0UsUUFBWixHQUF1QkEsUUFBdkI7QUFDSCxDQXpDRCxFQXlDR25HLE1BekNILEVBeUNXa0MsTUF6Q1g7OztBQ0FDLGFBQVk7QUFDVDs7QUFFQSxRQUFNa0IsUUFBUSxJQUFJbkIsS0FBSzhDLEtBQVQsRUFBZDtBQUFBLFFBQ0k1RSxRQUFRLElBQUk4QixLQUFLa0IsS0FBVCxDQUFlQyxLQUFmLENBRFo7QUFBQSxRQUVJaEQsV0FBVyxJQUFJNkIsS0FBS0csUUFBVCxFQUZmO0FBQUEsUUFHSS9CLFdBQVcsSUFBSTRCLEtBQUtrRSxRQUFULEVBSGY7QUFBQSxRQUlJQyxhQUFhLElBQUluRSxLQUFLL0IsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxRQUFyQyxDQUpqQjtBQUtILENBUkEsR0FBRCIsImZpbGUiOiJ0YWcubWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1lZGlhdG9yID0gKCgpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZXJzOiB7XG4gICAgICAgICAgICBhbnk6IFtdIC8vIGV2ZW50IHR5cGU6IHN1YnNjcmliZXJzXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3Vic2NyaWJlIChmbiwgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3R5cGVdLnB1c2goZm4pO1xuICAgICAgICB9LFxuICAgICAgICB1bnN1YnNjcmliZSAoZm4sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygndW5zdWJzY3JpYmUnLCBmbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1Ymxpc2ggKHB1YmxpY2F0aW9uLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3B1Ymxpc2gnLCBwdWJsaWNhdGlvbiwgdHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHZpc2l0U3Vic2NyaWJlcnMgKGFjdGlvbiwgYXJnLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGxldCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbdHlwZV07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAncHVibGlzaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnNbaV0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlcnNbaV0gPT09IGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgQ29udHJvbGxlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KSB7XG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3ID0gbGlzdFZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhc2tWaWV3ID0gdGFza1ZpZXc7XG4gICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSAnJztcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5yZW5kZXIsICdsaXN0Jyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy50YXNrVmlldy5yZW5kZXIsICd0YXNrJyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIHRoaXMubW9kZWwuZmluZEFsbCgpO1xuICAgICAgICAgICAgdGhpcy5iaW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBiaW5kICgpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcuJHJvb3Qub24oJ2NsaWNrJywgJ2EnLCB0aGlzLl9iaW5kTGlzdEl0ZW1DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdMaXN0Rm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3TGlzdFN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICQoJyNhZGROZXdUYXNrRm9ybScpLm9uKCdzdWJtaXQnLCB0aGlzLl9iaW5kTmV3VGFza1N1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaW5kTGlzdEl0ZW1DbGljayAoZSkge1xuICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRlbG0uY2xvc2VzdCgnLmpzLWxpc3QtcGFyZW50JyksXG4gICAgICAgICAgICAgICAgbGlzdElkID0gJHBhcmVudC5kYXRhKCdsaXN0SWQnKSB8fCAnJztcblxuICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWxpc3Qtc2V0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RBY3RpdmUgPSBsaXN0SWQ7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLm1vZGVsLmdldFRhc2tzKHBhcnNlSW50KHRoaXMubGlzdEFjdGl2ZSkpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1saXN0LWVkaXQnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZGl0Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWxpc3QtcmVtb3ZlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZShsaXN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdMaXN0U3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNyZWF0ZShlLnRhcmdldCk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld1Rhc2tTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubW9kZWwudXBkYXRlKGUudGFyZ2V0LCB0aGlzLmxpc3RBY3RpdmUpO1xuICAgICAgICAgICAgJCgnI25ld1RvRG9UYXNrJykudmFsKFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Db250cm9sbGVyID0gQ29udHJvbGxlcjtcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIigod2luZG93LCAkLCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBMaXN0VmlldyB7XG5cbiAgICAgICAgc3RhdGljIGdldFJvb3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoXCIjdG9kb0xpc3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyIChsaXN0VGFza3MpIHtcblxuICAgICAgICAgICAgbGV0ICRyb290ID0gTGlzdFZpZXcuZ2V0Um9vdCgpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLWxpc3Qtc2V0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPiR7bGlzdEl0ZW0udGl0bGV9PC9hPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtbGlzdC1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1saXN0LXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RBY3RpdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgTGlzdFZpZXcuZ2V0Um9vdCgpLmZpbmQoJ1tkYXRhLWxpc3QtaWRdJykuZWFjaCgoaSwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCAkbGlzdEl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICRsaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGxpc3RJdGVtLmRhdGEoJ2xpc3RJZCcpKSA9PT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkxpc3RWaWV3ID0gTGlzdFZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIHRoaXMubGlzdHMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0SWRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpc3RJZHMubWFwKGxpc3RJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1lcmdlKHJlcywge2lkOiBsaXN0SWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS50aGVuKGxpc3RzID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RzID0gbGlzdHM7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RzLCAnbGlzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kT25lIChsaXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IE1lZGlhdG9yLnB1Ymxpc2gocmVzLCAndGFzaycpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SWQgPSBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlKGxpc3RJZCwgZGF0YSkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmNyZWF0ZWQgPyB0aGlzLmZpbmRBbGwoKSA6IGNvbnNvbGUubG9nKCdub3QgY3JlYXRlZCcpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlIChmb3JtLCBsaXN0SWQgPSAwKSB7XG5cbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5nZXRMaXN0KGxpc3RJZCk7XG5cbiAgICAgICAgICAgIGxpc3QudGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGVhZGxpbmU6IERhdGUubm93KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZShsaXN0SWQsIGxpc3QpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy51cGRhdGVkID8gTWVkaWF0b3IucHVibGlzaChsaXN0LnRhc2tzLCAndGFzaycpIDogY29uc29sZS5sb2cocmVzKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnZXJyb3I6JywgcmVzLmVycm9yKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldExpc3QgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RzLnJlZHVjZSgobGlzdHMsIGxpc3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdC5pZCA9PSBsaXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cztcbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFRhc2tzIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0cy5yZWR1Y2UoKHRhc2tzLCBsaXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QuaWQgPT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0LnRhc2tzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3M7XG4gICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLk1vZGVsID0gTW9kZWw7XG59KSh3aW5kb3csIF8pO1xuIiwiKCh3aW5kb3cpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLmVuZHBvaW50ID0gJy90b2RvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmQgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0dFVCcsIGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnUE9TVCcsIGxpc3RJZCwge3RvZG86IEpTT04uc3RyaW5naWZ5KGRhdGEpfSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnUFVUJywgbGlzdElkLCB7dG9kbzogSlNPTi5zdHJpbmdpZnkoZGF0YSl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnREVMRVRFJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmQgKG1ldGhvZCA9ICdHRVQnLCBsaXN0SWQsIGRhdGEpIHtcblxuICAgICAgICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5lbmRwb2ludH0vJHtsaXN0SWQgPT09IDAgPyAnJyA6IGxpc3RJZH1gO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoRXJyb3IoXCJOZXR3b3JrIGVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3RvcmUgPSBTdG9yZTtcbn0pKHdpbmRvdyk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgVGFza1ZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9UYXNrc1wiKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAodGFza3MpIHtcbiAgICAgICAgICAgIGxldCAkcm9vdCA9IFRhc2tWaWV3LmdldFJvb3QoKTtcblxuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwidGV4dC1jZW50ZXJcIiBjb2xzcGFuPVwiM1wiPk5vIFRhc2tzITwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4ke3Rhc2tzW2ldLmRlc2NyaXB0aW9ufTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+JHt0YXNrc1tpXS5kZWFkbGluZSA/IHRhc2tzW2ldLmRlYWRsaW5lIDogJy0tLSd9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjdXN0b20tY29udHJvbCBjdXN0b20tY2hlY2tib3hcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2tzW2ldLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uVGFza1ZpZXcgPSBUYXNrVmlldztcbn0pKHdpbmRvdywgalF1ZXJ5KTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjb25zdCBzdG9yZSA9IG5ldyB0b2RvLlN0b3JlKCksXG4gICAgICAgIG1vZGVsID0gbmV3IHRvZG8uTW9kZWwoc3RvcmUpLFxuICAgICAgICBsaXN0VmlldyA9IG5ldyB0b2RvLkxpc3RWaWV3KCksXG4gICAgICAgIHRhc2tWaWV3ID0gbmV3IHRvZG8uVGFza1ZpZXcoKSxcbiAgICAgICAgY29udHJvbGxlciA9IG5ldyB0b2RvLkNvbnRyb2xsZXIobW9kZWwsIGxpc3RWaWV3LCB0YXNrVmlldyk7XG59KCkpO1xuXG4iXX0=
