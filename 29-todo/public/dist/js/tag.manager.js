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
                    Mediator.publish(this.model.getTasks(this.listActive), 'task');
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
                console.log('newTask:', e.target);
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
            this.listTasks = {};
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
                }).then(function (listTasks) {
                    _this.listTasks = listTasks;
                    Mediator.publish(_this.listTasks, 'list');
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

                var listId = Date.now();
                var data = {
                    todo: JSON.stringify({
                        title: form.elements[0].value,
                        created: new Date().toString(),
                        tasks: []
                    })
                };

                this.store.create(listId, data).then(function (res) {
                    return res.created ? _this2.findAll() : console.log('not created');
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
            key: 'getTasks',
            value: function getTasks() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                return this.listTasks.reduce(function (tasks, list) {
                    if (list.id == parseInt(listId)) {
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

                return this.send('POST', listId, data);
            }
        }, {
            key: 'update',
            value: function update() {
                var listId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return this.send('PUT', listId, data);
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
        function TaskView() {
            _classCallCheck(this, TaskView);

            this.$root = $("#todoTasks");
        }

        _createClass(TaskView, [{
            key: "render",
            value: function render(tasks) {
                var $root = $("#todoTasks");

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiQ29udHJvbGxlci5jbGFzcy5qcyIsIkxpc3RWaWV3LmNsYXNzLmpzIiwiTW9kZWwuY2xhc3MuanMiLCJTdG9yZS5jbGFzcy5qcyIsIlRhc2tWaWV3LmNsYXNzLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIk1lZGlhdG9yIiwic3Vic2NyaWJlcnMiLCJhbnkiLCJzdWJzY3JpYmUiLCJmbiIsInR5cGUiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIndpbmRvdyIsIiQiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwibGlzdEFjdGl2ZSIsInJlbmRlciIsImZpbmRBbGwiLCJiaW5kIiwiJHJvb3QiLCJvbiIsIl9iaW5kTGlzdEl0ZW1DbGljayIsIl9iaW5kTmV3TGlzdFN1Ym1pdCIsIl9iaW5kTmV3VGFza1N1Ym1pdCIsImUiLCIkZWxtIiwiY3VycmVudFRhcmdldCIsIiRwYXJlbnQiLCJjbG9zZXN0IiwibGlzdElkIiwiZGF0YSIsImhhc0NsYXNzIiwiZ2V0VGFza3MiLCJjb25zb2xlIiwibG9nIiwicmVtb3ZlIiwicHJldmVudERlZmF1bHQiLCJjcmVhdGUiLCJ0YXJnZXQiLCJ2YWwiLCJ0b2RvIiwialF1ZXJ5IiwiXyIsIkxpc3RWaWV3IiwiZ2V0Um9vdCIsImxpc3RUYXNrcyIsImh0bWwiLCJmb3JFYWNoIiwiYXBwZW5kIiwibGlzdEl0ZW0iLCJpZCIsInRpdGxlIiwiZmluZCIsImVhY2giLCJpdGVtIiwiJGxpc3RJdGVtIiwicmVtb3ZlQ2xhc3MiLCJwYXJzZUludCIsImFkZENsYXNzIiwiTW9kZWwiLCJzdG9yZSIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbGVtZW50cyIsInZhbHVlIiwiY3JlYXRlZCIsInRvU3RyaW5nIiwidGFza3MiLCJkZWxldGVkIiwicmVkdWNlIiwibGlzdCIsIlN0b3JlIiwiZW5kcG9pbnQiLCJzZW5kIiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25lcnJvciIsIlRhc2tWaWV3IiwiZGVzY3JpcHRpb24iLCJkZWFkbGluZSIsImRvbmUiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVksWUFBTTtBQUNwQjs7QUFFQSxXQUFPO0FBQ0hDLHFCQUFhO0FBQ1RDLGlCQUFLLEVBREksQ0FDRDtBQURDLFNBRFY7O0FBS0hDLGlCQUxHLHFCQUtRQyxFQUxSLEVBSzBCO0FBQUEsZ0JBQWRDLElBQWMsdUVBQVAsS0FBTzs7QUFDekIsZ0JBQUksT0FBTyxLQUFLSixXQUFMLENBQWlCSSxJQUFqQixDQUFQLEtBQWtDLFdBQXRDLEVBQW1EO0FBQy9DLHFCQUFLSixXQUFMLENBQWlCSSxJQUFqQixJQUF5QixFQUF6QjtBQUNIO0FBQ0QsaUJBQUtKLFdBQUwsQ0FBaUJJLElBQWpCLEVBQXVCQyxJQUF2QixDQUE0QkYsRUFBNUI7QUFDSCxTQVZFO0FBV0hHLG1CQVhHLHVCQVdVSCxFQVhWLEVBV2NDLElBWGQsRUFXb0I7QUFDbkIsaUJBQUtHLGdCQUFMLENBQXNCLGFBQXRCLEVBQXFDSixFQUFyQyxFQUF5Q0MsSUFBekM7QUFDSCxTQWJFO0FBY0hJLGVBZEcsbUJBY01DLFdBZE4sRUFjbUJMLElBZG5CLEVBY3lCO0FBQ3hCLGlCQUFLRyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQ0UsV0FBakMsRUFBOENMLElBQTlDO0FBQ0gsU0FoQkU7QUFpQkhHLHdCQWpCRyw0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V0FBTytCLElBQVAsQ0FBWTZELFFBQVosR0FBdUJBLFFBQXZCO0FBQ0gsQ0FwQ0QsRUFvQ0c1RixNQXBDSCxFQW9DV2dDLE1BcENYOzs7QUNBQyxhQUFZO0FBQ1Q7O0FBRUEsUUFBTW1CLFFBQVEsSUFBSXBCLEtBQUsyQyxLQUFULEVBQWQ7QUFBQSxRQUNJdkUsUUFBUSxJQUFJNEIsS0FBS21CLEtBQVQsQ0FBZUMsS0FBZixDQURaO0FBQUEsUUFFSS9DLFdBQVcsSUFBSTJCLEtBQUtHLFFBQVQsRUFGZjtBQUFBLFFBR0k3QixXQUFXLElBQUkwQixLQUFLNkQsUUFBVCxFQUhmO0FBQUEsUUFJSUksYUFBYSxJQUFJakUsS0FBSzdCLFVBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxRQUEzQixFQUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNZWRpYXRvciA9ICgoKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmVyczoge1xuICAgICAgICAgICAgYW55OiBbXSAvLyBldmVudCB0eXBlOiBzdWJzY3JpYmVyc1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnNjcmliZSAoZm4sIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXS5wdXNoKGZuKTtcbiAgICAgICAgfSxcbiAgICAgICAgdW5zdWJzY3JpYmUgKGZuLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3Vuc3Vic2NyaWJlJywgZm4sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICBwdWJsaXNoIChwdWJsaWNhdGlvbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCdwdWJsaXNoJywgcHVibGljYXRpb24sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdFN1YnNjcmliZXJzIChhY3Rpb24sIGFyZywgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3B1Ymxpc2gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2ldKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuIiwiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIENvbnRyb2xsZXIge1xuICAgICAgICBjb25zdHJ1Y3RvciAobW9kZWwsIGxpc3RWaWV3LCB0YXNrVmlldykge1xuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICAgICAgdGhpcy5saXN0VmlldyA9IGxpc3RWaWV3O1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldyA9IHRhc2tWaWV3O1xuICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gJyc7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcucmVuZGVyLCAnbGlzdCcpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMudGFza1ZpZXcucmVuZGVyLCAndGFzaycpO1xuICAgICAgICAgICAgTWVkaWF0b3Iuc3Vic2NyaWJlKHRoaXMubGlzdFZpZXcubGlzdEFjdGl2ZSwgJ2xpc3RBY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmZpbmRBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmluZCAoKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LiRyb290Lm9uKCdjbGljaycsICdhJywgdGhpcy5fYmluZExpc3RJdGVtQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjYWRkTmV3TGlzdEZvcm0nKS5vbignc3VibWl0JywgdGhpcy5fYmluZE5ld0xpc3RTdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAkKCcjYWRkTmV3VGFza0Zvcm0nKS5vbignc3VibWl0JywgdGhpcy5fYmluZE5ld1Rhc2tTdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZExpc3RJdGVtQ2xpY2sgKGUpIHtcbiAgICAgICAgICAgIGxldCAkZWxtID0gJChlLmN1cnJlbnRUYXJnZXQpLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxtLmNsb3Nlc3QoJy5qcy1saXN0LXBhcmVudCcpLFxuICAgICAgICAgICAgICAgIGxpc3RJZCA9ICRwYXJlbnQuZGF0YSgnbGlzdElkJykgfHwgJyc7XG5cbiAgICAgICAgICAgIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1saXN0LXNldCcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0QWN0aXZlID0gbGlzdElkO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5tb2RlbC5nZXRUYXNrcyh0aGlzLmxpc3RBY3RpdmUpLCAndGFzaycpO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0QWN0aXZlLCAnbGlzdEFjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1saXN0LWVkaXQnKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlZGl0Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWxpc3QtcmVtb3ZlJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZShsaXN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX2JpbmROZXdMaXN0U3VibWl0IChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm1vZGVsLmNyZWF0ZShlLnRhcmdldCk7XG4gICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICBfYmluZE5ld1Rhc2tTdWJtaXQgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXdUYXNrOicsIGUudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuXG4gICAgICAgIHN0YXRpYyBnZXRSb290ICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKFwiI3RvZG9MaXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy4kcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9IExpc3RWaWV3LmdldFJvb3QoKTtcbiAgICAgICAgICAgICRyb290Lmh0bWwoJycpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2gobGlzdFRhc2tzLCBsaXN0SXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgJHJvb3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0ganMtbGlzdC1wYXJlbnRcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgZGF0YS1saXN0LWlkPVwiJHtsaXN0SXRlbS5pZH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCB3LTEwMCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+PGEgY2xhc3M9XCJqcy1saXN0LXNldFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj4ke2xpc3RJdGVtLnRpdGxlfTwvYT48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImpzLWxpc3QtZWRpdFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1wZW5jaWxcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtbGlzdC1yZW1vdmVcIiBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCI+PHNwYW4gY2xhc3M9XCJkcmlwaWNvbnMtY3Jvc3NcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2xpPmApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0QWN0aXZlIChsaXN0SWQpIHtcbiAgICAgICAgICAgIExpc3RWaWV3LmdldFJvb3QoKS5maW5kKCdbZGF0YS1saXN0LWlkXScpLmVhY2goKGksIGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgJGxpc3RJdGVtID0gJChpdGVtKTtcblxuICAgICAgICAgICAgICAgICRsaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGxpc3RJdGVtLmRhdGEoJ2xpc3RJZCcpKSA9PT0gbGlzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0SXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLkxpc3RWaWV3ID0gTGlzdFZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSwgXyk7XG4iLCIoKHdpbmRvdywgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTW9kZWwge1xuICAgICAgICBjb25zdHJ1Y3RvciAoc3RvcmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgICAgIHRoaXMubGlzdFRhc2tzID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kQWxsICgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZCgpLnRoZW4oXG4gICAgICAgICAgICAgICAgbGlzdElkcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChsaXN0SWRzLm1hcChsaXN0SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuZmluZChsaXN0SWQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tZXJnZShyZXMsIHtpZDogbGlzdElkfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkudGhlbihsaXN0VGFza3MgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFRhc2tzID0gbGlzdFRhc2tzO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0VGFza3MsICdsaXN0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRPbmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gTWVkaWF0b3IucHVibGlzaChyZXMsICd0YXNrJyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAoZm9ybSkge1xuICAgICAgICAgICAgbGV0IGxpc3RJZCA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b2RvOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBmb3JtLmVsZW1lbnRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLnN0b3JlLmNyZWF0ZShsaXN0SWQsIGRhdGEpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5jcmVhdGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnbm90IGNyZWF0ZWQnKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0SWQpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IHJlcy5kZWxldGVkID8gdGhpcy5maW5kQWxsKCkgOiBjb25zb2xlLmxvZygnZXJyb3I6JywgcmVzLmVycm9yKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFRhc2tzIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saXN0VGFza3MucmVkdWNlKCh0YXNrcywgbGlzdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmlkID09IHBhcnNlSW50KGxpc3RJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QudGFza3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrcztcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTW9kZWwgPSBNb2RlbDtcbn0pKHdpbmRvdywgXyk7XG4iLCIoKHdpbmRvdykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgU3RvcmUge1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kcG9pbnQgPSAnL3RvZG8nO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZCAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnR0VUJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNyZWF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQT1NUJywgbGlzdElkLCBkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdElkID0gMCwgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBsaXN0SWQsIGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlIChsaXN0SWQgPSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdERUxFVEUnLCBsaXN0SWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZCAobWV0aG9kID0gJ0dFVCcsIGxpc3RJZCwgZGF0YSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3RJZCA9PT0gMCA/ICcnIDogbGlzdElkfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICByZXEub3BlbihtZXRob2QsIHVybCk7XG4gICAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXEucmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHJlamVjdChFcnJvcihcIk5ldHdvcmsgZXJyb3JcIikpO1xuICAgICAgICAgICAgICAgIHJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TdG9yZSA9IFN0b3JlO1xufSkod2luZG93KTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBUYXNrVmlldyB7XG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSAkKFwiI3RvZG9UYXNrc1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAodGFza3MpIHtcbiAgICAgICAgICAgIGxldCAkcm9vdCA9ICQoXCIjdG9kb1Rhc2tzXCIpO1xuXG4gICAgICAgICAgICAkcm9vdC5odG1sKCcnKTtcblxuICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiIGNvbHNwYW49XCIzXCI+Tm8gVGFza3MhPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPiR7dGFza3NbaV0uZGVzY3JpcHRpb259PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD4ke3Rhc2tzW2ldLmRlYWRsaW5lID8gdGFza3NbaV0uZGVhZGxpbmUgOiAnLS0tJ308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImN1c3RvbS1jb250cm9sIGN1c3RvbS1jaGVja2JveFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjdXN0b20tY29udHJvbC1pbnB1dFwiICR7dGFza3NbaV0uZG9uZSA/ICdjaGVja2VkJyA6ICcnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXN0b20tY29udHJvbC1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5UYXNrVmlldyA9IFRhc2tWaWV3O1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IHN0b3JlID0gbmV3IHRvZG8uU3RvcmUoKSxcbiAgICAgICAgbW9kZWwgPSBuZXcgdG9kby5Nb2RlbChzdG9yZSksXG4gICAgICAgIGxpc3RWaWV3ID0gbmV3IHRvZG8uTGlzdFZpZXcoKSxcbiAgICAgICAgdGFza1ZpZXcgPSBuZXcgdG9kby5UYXNrVmlldygpLFxuICAgICAgICBjb250cm9sbGVyID0gbmV3IHRvZG8uQ29udHJvbGxlcihtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KTtcbn0oKSk7XG5cbiJdfQ==
