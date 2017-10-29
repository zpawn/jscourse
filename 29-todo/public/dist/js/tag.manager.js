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

            ////

            Mediator.subscribe(this.listView.render, 'list');
            Mediator.subscribe(this.taskView.render, 'task');

            ////

            this.model.findAll();
            this.bind();
        }

        _createClass(Controller, [{
            key: 'bind',
            value: function bind() {
                var _this = this;

                this.listView.$root.on('click', 'a', function (e) {
                    var $elm = $(e.currentTarget),
                        $parent = $elm.closest('.js-list-parent'),
                        listName = $parent.data('listName') || '';

                    if ($elm.hasClass('js-list-set')) {
                        _this.model.find(listName);
                    } else if ($elm.hasClass('js-list-edit')) {
                        console.log('edit');
                    } else if ($elm.hasClass('js-list-remove')) {
                        _this.model.remove(listName);
                    }
                });

                $('#addNewListForm').on('submit', function (e) {
                    e.preventDefault();
                    _this.model.create(e.target);
                    $('#newToDoList').val("");
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
        function ListView() {
            _classCallCheck(this, ListView);

            this.$root = $("#todoList");
        }

        _createClass(ListView, [{
            key: "render",
            value: function render(listTasks) {

                var $root = $('#todoList');
                $root.html('');

                _.forEach(listTasks, function (listItem) {
                    $root.append("<li class=\"list-group-item js-list-parent\" href=\"javascript:void(0)\" data-list-id=\"" + listItem.id + "\">\n                    <div class=\"d-flex w-100 justify-content-between\">\n                        <span><a class=\"js-list-set\" href=\"javascript:void(0)\">" + listItem.title + "</a></span>\n                        <span>\n                            <a class=\"js-list-edit\" href=\"javascript:void(0)\"><span class=\"dripicons-pencil\"></span></a>\n                            <a class=\"js-list-remove\" href=\"javascript:void(0)\"><span class=\"dripicons-cross\"></span></a>\n                        </span>\n                    </div>\n                </li>");
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

                this.store.find().then(function (listNames) {
                    return Promise.all(listNames.map(function (listName) {
                        return _this.store.find(listName).then(function (res) {
                            return _.merge(res, { id: listName });
                        });
                    }));
                }).then(function (listTasks) {
                    _this.listTasks = listTasks;
                    Mediator.publish(_this.listTasks, 'list');
                });
            }
        }, {
            key: 'findOne',
            value: function findOne(listName) {
                this.store.find(listName).then(function (res) {
                    return Mediator.publish(res, 'task');
                }, function (err) {
                    return console.error(err);
                });
            }

            /**
             * example: {
             *      title: '',
             *      created: new Date().toString(),
             *      tasks: []
             * }
             */

        }, {
            key: 'create',
            value: function create(form) {
                var _this2 = this;

                var listName = Date.now();
                var data = {
                    todo: JSON.stringify({
                        title: form.elements[0].value,
                        created: new Date().toString(),
                        tasks: []
                    })
                };

                this.store.create(listName, data).then(function (res) {
                    return res.created ? _this2.find() : console.log('not created');
                }, function (err) {
                    return console.log(err);
                });
            }
        }, {
            key: 'remove',
            value: function remove(listName) {
                var _this3 = this;

                this.store.remove(listName).then(function (res) {
                    return res.deleted ? _this3.find() : console.log('error:', res.error);
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
                var listName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                return this.send('GET', listName);
            }
        }, {
            key: 'create',
            value: function create() {
                var listName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return this.send('POST', listName, data);
            }
        }, {
            key: 'update',
            value: function update() {
                var listName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                return this.send('PUT', listName, data);
            }
        }, {
            key: 'remove',
            value: function remove() {
                var listName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                return this.send('DELETE', listName);
            }
        }, {
            key: 'send',
            value: function send() {
                var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GET';
                var listName = arguments[1];
                var data = arguments[2];


                var url = this.endpoint + '/' + listName;

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
            value: function render(data) {
                var $root = $("#todoTasks"),
                    tasks = data.tasks;

                $root.html('');

                for (var i = 0; i < tasks.length; i += 1) {
                    $root.append("<tr>\n                    <td>" + tasks[i].description + "</td>\n                    <td>" + (tasks[i].deadline ? tasks[i].deadline : '---') + "</td>\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\" " + (tasks[i].done ? 'checked' : '') + ">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                </tr>");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiQ29udHJvbGxlci5jbGFzcy5qcyIsIkxpc3RWaWV3LmNsYXNzLmpzIiwiTW9kZWwuY2xhc3MuanMiLCJTdG9yZS5jbGFzcy5qcyIsIlRhc2tWaWV3LmNsYXNzLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIk1lZGlhdG9yIiwic3Vic2NyaWJlcnMiLCJhbnkiLCJzdWJzY3JpYmUiLCJmbiIsInR5cGUiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIndpbmRvdyIsIiQiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwicmVuZGVyIiwiZmluZEFsbCIsImJpbmQiLCIkcm9vdCIsIm9uIiwiJGVsbSIsImUiLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0TmFtZSIsImRhdGEiLCJoYXNDbGFzcyIsImZpbmQiLCJjb25zb2xlIiwibG9nIiwicmVtb3ZlIiwicHJldmVudERlZmF1bHQiLCJjcmVhdGUiLCJ0YXJnZXQiLCJ2YWwiLCJ0b2RvIiwialF1ZXJ5IiwiXyIsIkxpc3RWaWV3IiwibGlzdFRhc2tzIiwiaHRtbCIsImZvckVhY2giLCJhcHBlbmQiLCJsaXN0SXRlbSIsImlkIiwidGl0bGUiLCJNb2RlbCIsInN0b3JlIiwidGhlbiIsIlByb21pc2UiLCJhbGwiLCJsaXN0TmFtZXMiLCJtYXAiLCJtZXJnZSIsInJlcyIsImVycm9yIiwiZXJyIiwiZm9ybSIsIkRhdGUiLCJub3ciLCJKU09OIiwic3RyaW5naWZ5IiwiZWxlbWVudHMiLCJ2YWx1ZSIsImNyZWF0ZWQiLCJ0b1N0cmluZyIsInRhc2tzIiwiZGVsZXRlZCIsIlN0b3JlIiwiZW5kcG9pbnQiLCJzZW5kIiwibWV0aG9kIiwidXJsIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJvbmxvYWQiLCJzdGF0dXMiLCJwYXJzZSIsInJlc3BvbnNlIiwiRXJyb3IiLCJzdGF0dXNUZXh0Iiwib25lcnJvciIsIlRhc2tWaWV3IiwiZGVzY3JpcHRpb24iLCJkZWFkbGluZSIsImRvbmUiLCJjb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFdBQVksWUFBTTtBQUNwQjs7QUFFQSxXQUFPO0FBQ0hDLHFCQUFhO0FBQ1RDLGlCQUFLLEVBREksQ0FDRDtBQURDLFNBRFY7O0FBS0hDLGlCQUxHLHFCQUtRQyxFQUxSLEVBSzBCO0FBQUEsZ0JBQWRDLElBQWMsdUVBQVAsS0FBTzs7QUFDekIsZ0JBQUksT0FBTyxLQUFLSixXQUFMLENBQWlCSSxJQUFqQixDQUFQLEtBQWtDLFdBQXRDLEVBQW1EO0FBQy9DLHFCQUFLSixXQUFMLENBQWlCSSxJQUFqQixJQUF5QixFQUF6QjtBQUNIO0FBQ0QsaUJBQUtKLFdBQUwsQ0FBaUJJLElBQWpCLEVBQXVCQyxJQUF2QixDQUE0QkYsRUFBNUI7QUFDSCxTQVZFO0FBV0hHLG1CQVhHLHVCQVdVSCxFQVhWLEVBV2NDLElBWGQsRUFXb0I7QUFDbkIsaUJBQUtHLGdCQUFMLENBQXNCLGFBQXRCLEVBQXFDSixFQUFyQyxFQUF5Q0MsSUFBekM7QUFDSCxTQWJFO0FBY0hJLGVBZEcsbUJBY01DLFdBZE4sRUFjbUJMLElBZG5CLEVBY3lCO0FBQ3hCLGlCQUFLRyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQ0UsV0FBakMsRUFBOENMLElBQTlDO0FBQ0gsU0FoQkU7QUFpQkhHLHdCQWpCRyw0QkFpQmVHLE1BakJmLEVBaUJ1QkMsR0FqQnZCLEVBaUIwQztBQUFBLGdCQUFkUCxJQUFjLHVFQUFQLEtBQU87O0FBQ3pDLGdCQUFJSixjQUFjLEtBQUtBLFdBQUwsQ0FBaUJJLElBQWpCLENBQWxCOztBQUVBLGlCQUFLLElBQUlRLElBQUksQ0FBYixFQUFnQkEsSUFBSVosWUFBWWEsTUFBaEMsRUFBd0NELEtBQUssQ0FBN0MsRUFBZ0Q7QUFDNUMsb0JBQUlGLFdBQVcsU0FBZixFQUEwQjtBQUN0QlYsZ0NBQVlZLENBQVosRUFBZUQsR0FBZjtBQUNILGlCQUZELE1BRU87QUFDSCx3QkFBSVgsWUFBWVksQ0FBWixNQUFtQkQsR0FBdkIsRUFBNEI7QUFDeEJYLG9DQUFZYyxNQUFaLENBQW1CRixDQUFuQixFQUFzQixDQUF0QjtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBN0JFLEtBQVA7QUErQkgsQ0FsQ2dCLEVBQWpCOzs7Ozs7O0FDQUEsQ0FBQyxVQUFDRyxNQUFELEVBQVNDLENBQVQsRUFBZTtBQUNaOztBQURZLFFBR05DLFVBSE07QUFJUiw0QkFBYUMsS0FBYixFQUFvQkMsUUFBcEIsRUFBOEJDLFFBQTlCLEVBQXdDO0FBQUE7O0FBQ3BDLGlCQUFLRixLQUFMLEdBQWFBLEtBQWI7QUFDQSxpQkFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxpQkFBS0MsUUFBTCxHQUFnQkEsUUFBaEI7O0FBRUE7O0FBRUFyQixxQkFBU0csU0FBVCxDQUFtQixLQUFLaUIsUUFBTCxDQUFjRSxNQUFqQyxFQUF5QyxNQUF6QztBQUNBdEIscUJBQVNHLFNBQVQsQ0FBbUIsS0FBS2tCLFFBQUwsQ0FBY0MsTUFBakMsRUFBeUMsTUFBekM7O0FBRUE7O0FBRUEsaUJBQUtILEtBQUwsQ0FBV0ksT0FBWDtBQUNBLGlCQUFLQyxJQUFMO0FBQ0g7O0FBbEJPO0FBQUE7QUFBQSxtQ0FvQkE7QUFBQTs7QUFDSixxQkFBS0osUUFBTCxDQUFjSyxLQUFkLENBQW9CQyxFQUFwQixDQUF1QixPQUF2QixFQUFnQyxHQUFoQyxFQUFxQyxhQUFLO0FBQ3RDLHdCQUFJQyxPQUFPVixFQUFFVyxFQUFFQyxhQUFKLENBQVg7QUFBQSx3QkFDSUMsVUFBVUgsS0FBS0ksT0FBTCxDQUFhLGlCQUFiLENBRGQ7QUFBQSx3QkFFSUMsV0FBV0YsUUFBUUcsSUFBUixDQUFhLFVBQWIsS0FBNEIsRUFGM0M7O0FBSUEsd0JBQUlOLEtBQUtPLFFBQUwsQ0FBYyxhQUFkLENBQUosRUFBa0M7QUFDOUIsOEJBQUtmLEtBQUwsQ0FBV2dCLElBQVgsQ0FBZ0JILFFBQWhCO0FBQ0gscUJBRkQsTUFFTyxJQUFJTCxLQUFLTyxRQUFMLENBQWMsY0FBZCxDQUFKLEVBQW1DO0FBQ3RDRSxnQ0FBUUMsR0FBUixDQUFZLE1BQVo7QUFDSCxxQkFGTSxNQUVBLElBQUlWLEtBQUtPLFFBQUwsQ0FBYyxnQkFBZCxDQUFKLEVBQXFDO0FBQ3hDLDhCQUFLZixLQUFMLENBQVdtQixNQUFYLENBQWtCTixRQUFsQjtBQUNIO0FBQ0osaUJBWkQ7O0FBY0FmLGtCQUFFLGlCQUFGLEVBQXFCUyxFQUFyQixDQUF3QixRQUF4QixFQUFrQyxhQUFLO0FBQ25DRSxzQkFBRVcsY0FBRjtBQUNBLDBCQUFLcEIsS0FBTCxDQUFXcUIsTUFBWCxDQUFrQlosRUFBRWEsTUFBcEI7QUFDQXhCLHNCQUFFLGNBQUYsRUFBa0J5QixHQUFsQixDQUFzQixFQUF0QjtBQUNILGlCQUpEO0FBS0g7QUF4Q087O0FBQUE7QUFBQTs7QUEyQ1oxQixXQUFPMkIsSUFBUCxHQUFjM0IsT0FBTzJCLElBQVAsSUFBZSxFQUE3QjtBQUNBM0IsV0FBTzJCLElBQVAsQ0FBWXpCLFVBQVosR0FBeUJBLFVBQXpCO0FBQ0gsQ0E3Q0QsRUE2Q0dGLE1BN0NILEVBNkNXNEIsTUE3Q1g7Ozs7Ozs7QUNBQSxDQUFDLFVBQUM1QixNQUFELEVBQVNDLENBQVQsRUFBWTRCLENBQVosRUFBa0I7QUFDZjs7QUFEZSxRQUdUQyxRQUhTO0FBSVgsNEJBQWU7QUFBQTs7QUFDWCxpQkFBS3JCLEtBQUwsR0FBYVIsRUFBRSxXQUFGLENBQWI7QUFDSDs7QUFOVTtBQUFBO0FBQUEsbUNBUUg4QixTQVJHLEVBUVE7O0FBRWYsb0JBQUl0QixRQUFRUixFQUFFLFdBQUYsQ0FBWjtBQUNBUSxzQkFBTXVCLElBQU4sQ0FBVyxFQUFYOztBQUVBSCxrQkFBRUksT0FBRixDQUFVRixTQUFWLEVBQXFCLG9CQUFZO0FBQzdCdEIsMEJBQU15QixNQUFOLDhGQUFtR0MsU0FBU0MsRUFBNUcsMEtBRWlFRCxTQUFTRSxLQUYxRTtBQVNILGlCQVZEO0FBV0g7QUF4QlU7O0FBQUE7QUFBQTs7QUEyQmZyQyxXQUFPMkIsSUFBUCxHQUFjM0IsT0FBTzJCLElBQVAsSUFBZSxFQUE3QjtBQUNBM0IsV0FBTzJCLElBQVAsQ0FBWUcsUUFBWixHQUF1QkEsUUFBdkI7QUFDSCxDQTdCRCxFQTZCRzlCLE1BN0JILEVBNkJXNEIsTUE3QlgsRUE2Qm1CQyxDQTdCbkI7Ozs7Ozs7QUNBQSxDQUFDLFVBQUM3QixNQUFELEVBQVM2QixDQUFULEVBQWU7QUFDWjs7QUFEWSxRQUdOUyxLQUhNO0FBSVIsdUJBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFDaEIsaUJBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUNBLGlCQUFLUixTQUFMLEdBQWlCLEVBQWpCO0FBQ0g7O0FBUE87QUFBQTtBQUFBLHNDQVNHO0FBQUE7O0FBQ1AscUJBQUtRLEtBQUwsQ0FBV3BCLElBQVgsR0FBa0JxQixJQUFsQixDQUNJLHFCQUFhO0FBQ1QsMkJBQU9DLFFBQVFDLEdBQVIsQ0FBWUMsVUFBVUMsR0FBVixDQUFjLG9CQUFZO0FBQ3pDLCtCQUFPLE1BQUtMLEtBQUwsQ0FBV3BCLElBQVgsQ0FBZ0JILFFBQWhCLEVBQTBCd0IsSUFBMUIsQ0FBK0IsZUFBTztBQUN6QyxtQ0FBT1gsRUFBRWdCLEtBQUYsQ0FBUUMsR0FBUixFQUFhLEVBQUNWLElBQUlwQixRQUFMLEVBQWIsQ0FBUDtBQUNILHlCQUZNLENBQVA7QUFHSCxxQkFKa0IsQ0FBWixDQUFQO0FBS0gsaUJBUEwsRUFRRXdCLElBUkYsQ0FRTyxxQkFBYTtBQUNoQiwwQkFBS1QsU0FBTCxHQUFpQkEsU0FBakI7QUFDQS9DLDZCQUFTUyxPQUFULENBQWlCLE1BQUtzQyxTQUF0QixFQUFpQyxNQUFqQztBQUNILGlCQVhEO0FBWUg7QUF0Qk87QUFBQTtBQUFBLG9DQXdCQ2YsUUF4QkQsRUF3Qlc7QUFDZixxQkFBS3VCLEtBQUwsQ0FBV3BCLElBQVgsQ0FBZ0JILFFBQWhCLEVBQTBCd0IsSUFBMUIsQ0FDSTtBQUFBLDJCQUFPeEQsU0FBU1MsT0FBVCxDQUFpQnFELEdBQWpCLEVBQXNCLE1BQXRCLENBQVA7QUFBQSxpQkFESixFQUVJO0FBQUEsMkJBQU8xQixRQUFRMkIsS0FBUixDQUFjQyxHQUFkLENBQVA7QUFBQSxpQkFGSjtBQUlIOztBQUVEOzs7Ozs7OztBQS9CUTtBQUFBO0FBQUEsbUNBc0NBQyxJQXRDQSxFQXNDTTtBQUFBOztBQUNWLG9CQUFJakMsV0FBV2tDLEtBQUtDLEdBQUwsRUFBZjtBQUNBLG9CQUFJbEMsT0FBTztBQUNQVSwwQkFBTXlCLEtBQUtDLFNBQUwsQ0FBZTtBQUNqQmhCLCtCQUFPWSxLQUFLSyxRQUFMLENBQWMsQ0FBZCxFQUFpQkMsS0FEUDtBQUVqQkMsaUNBQVMsSUFBSU4sSUFBSixHQUFXTyxRQUFYLEVBRlE7QUFHakJDLCtCQUFPO0FBSFUscUJBQWY7QUFEQyxpQkFBWDs7QUFRQSxxQkFBS25CLEtBQUwsQ0FBV2YsTUFBWCxDQUFrQlIsUUFBbEIsRUFBNEJDLElBQTVCLEVBQWtDdUIsSUFBbEMsQ0FDSTtBQUFBLDJCQUFPTSxJQUFJVSxPQUFKLEdBQWMsT0FBS3JDLElBQUwsRUFBZCxHQUE0QkMsUUFBUUMsR0FBUixDQUFZLGFBQVosQ0FBbkM7QUFBQSxpQkFESixFQUVJO0FBQUEsMkJBQU9ELFFBQVFDLEdBQVIsQ0FBWTJCLEdBQVosQ0FBUDtBQUFBLGlCQUZKO0FBSUg7QUFwRE87QUFBQTtBQUFBLG1DQXNEQWhDLFFBdERBLEVBc0RVO0FBQUE7O0FBQ2QscUJBQUt1QixLQUFMLENBQVdqQixNQUFYLENBQWtCTixRQUFsQixFQUE0QndCLElBQTVCLENBQ0k7QUFBQSwyQkFBT00sSUFBSWEsT0FBSixHQUFjLE9BQUt4QyxJQUFMLEVBQWQsR0FBNEJDLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLEVBQXNCeUIsSUFBSUMsS0FBMUIsQ0FBbkM7QUFBQSxpQkFESixFQUVJO0FBQUEsMkJBQU8zQixRQUFRQyxHQUFSLENBQVkyQixHQUFaLENBQVA7QUFBQSxpQkFGSjtBQUlIO0FBM0RPOztBQUFBO0FBQUE7O0FBOERaaEQsV0FBTzJCLElBQVAsR0FBYzNCLE9BQU8yQixJQUFQLElBQWUsRUFBN0I7QUFDQTNCLFdBQU8yQixJQUFQLENBQVlXLEtBQVosR0FBb0JBLEtBQXBCO0FBQ0gsQ0FoRUQsRUFnRUd0QyxNQWhFSCxFQWdFVzZCLENBaEVYOzs7Ozs7O0FDQUEsQ0FBQyxVQUFDN0IsTUFBRCxFQUFZO0FBQ1Q7O0FBRFMsUUFHSDRELEtBSEc7QUFLTCx5QkFBZTtBQUFBOztBQUNYLGlCQUFLQyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0g7O0FBUEk7QUFBQTtBQUFBLG1DQVNnQjtBQUFBLG9CQUFmN0MsUUFBZSx1RUFBSixFQUFJOztBQUNqQix1QkFBTyxLQUFLOEMsSUFBTCxDQUFVLEtBQVYsRUFBaUI5QyxRQUFqQixDQUFQO0FBQ0g7QUFYSTtBQUFBO0FBQUEscUNBYTZCO0FBQUEsb0JBQTFCQSxRQUEwQix1RUFBZixFQUFlO0FBQUEsb0JBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFDOUIsdUJBQU8sS0FBSzZDLElBQUwsQ0FBVSxNQUFWLEVBQWtCOUMsUUFBbEIsRUFBNEJDLElBQTVCLENBQVA7QUFDSDtBQWZJO0FBQUE7QUFBQSxxQ0FpQjZCO0FBQUEsb0JBQTFCRCxRQUEwQix1RUFBZixFQUFlO0FBQUEsb0JBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFDOUIsdUJBQU8sS0FBSzZDLElBQUwsQ0FBVSxLQUFWLEVBQWlCOUMsUUFBakIsRUFBMkJDLElBQTNCLENBQVA7QUFDSDtBQW5CSTtBQUFBO0FBQUEscUNBcUJrQjtBQUFBLG9CQUFmRCxRQUFlLHVFQUFKLEVBQUk7O0FBQ25CLHVCQUFPLEtBQUs4QyxJQUFMLENBQVUsUUFBVixFQUFvQjlDLFFBQXBCLENBQVA7QUFDSDtBQXZCSTtBQUFBO0FBQUEsbUNBeUJpQztBQUFBLG9CQUFoQytDLE1BQWdDLHVFQUF2QixLQUF1QjtBQUFBLG9CQUFoQi9DLFFBQWdCO0FBQUEsb0JBQU5DLElBQU07OztBQUVsQyxvQkFBTStDLE1BQVMsS0FBS0gsUUFBZCxTQUEwQjdDLFFBQWhDOztBQUVBLHVCQUFPLElBQUl5QixPQUFKLENBQVksVUFBQ3dCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQyx3QkFBTUMsTUFBTSxJQUFJQyxjQUFKLEVBQVo7O0FBRUFELHdCQUFJRSxJQUFKLENBQVNOLE1BQVQsRUFBaUJDLEdBQWpCO0FBQ0FHLHdCQUFJRyxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxpQ0FBckM7QUFDQUgsd0JBQUlJLE1BQUosR0FBYSxZQUFNO0FBQ2YsNEJBQUlKLElBQUlLLE1BQUosS0FBZSxHQUFuQixFQUF3QjtBQUNwQlAsb0NBQVFiLEtBQUtxQixLQUFMLENBQVdOLElBQUlPLFFBQWYsQ0FBUjtBQUNILHlCQUZELE1BRU87QUFDSFIsbUNBQU9TLE1BQU1SLElBQUlTLFVBQVYsQ0FBUDtBQUNIO0FBQ0oscUJBTkQ7QUFPQVQsd0JBQUlVLE9BQUosR0FBYztBQUFBLCtCQUFNWCxPQUFPUyxNQUFNLGVBQU4sQ0FBUCxDQUFOO0FBQUEscUJBQWQ7QUFDQVIsd0JBQUlMLElBQUosQ0FBU1YsS0FBS0MsU0FBTCxDQUFlcEMsSUFBZixDQUFUO0FBQ0gsaUJBZE0sQ0FBUDtBQWVIO0FBNUNJOztBQUFBO0FBQUE7O0FBK0NUakIsV0FBTzJCLElBQVAsR0FBYzNCLE9BQU8yQixJQUFQLElBQWUsRUFBN0I7QUFDQTNCLFdBQU8yQixJQUFQLENBQVlpQyxLQUFaLEdBQW9CQSxLQUFwQjtBQUNILENBakRELEVBaURHNUQsTUFqREg7Ozs7Ozs7QUNBQSxDQUFDLFVBQUNBLE1BQUQsRUFBU0MsQ0FBVCxFQUFlO0FBQ1o7O0FBRFksUUFHTjZFLFFBSE07QUFJUiw0QkFBZTtBQUFBOztBQUNYLGlCQUFLckUsS0FBTCxHQUFhUixFQUFFLFlBQUYsQ0FBYjtBQUNIOztBQU5PO0FBQUE7QUFBQSxtQ0FRQWdCLElBUkEsRUFRTTtBQUNWLG9CQUFJUixRQUFRUixFQUFFLFlBQUYsQ0FBWjtBQUFBLG9CQUNJeUQsUUFBUXpDLEtBQUt5QyxLQURqQjs7QUFHQWpELHNCQUFNdUIsSUFBTixDQUFXLEVBQVg7O0FBRUEscUJBQUssSUFBSW5DLElBQUksQ0FBYixFQUFnQkEsSUFBSTZELE1BQU01RCxNQUExQixFQUFrQ0QsS0FBSyxDQUF2QyxFQUEwQztBQUN0Q1ksMEJBQU15QixNQUFOLG9DQUNVd0IsTUFBTTdELENBQU4sRUFBU2tGLFdBRG5CLHdDQUVVckIsTUFBTTdELENBQU4sRUFBU21GLFFBQVQsR0FBb0J0QixNQUFNN0QsQ0FBTixFQUFTbUYsUUFBN0IsR0FBd0MsS0FGbEQseU1BS2tFdEIsTUFBTTdELENBQU4sRUFBU29GLElBQVQsR0FBZ0IsU0FBaEIsR0FBNEIsRUFMOUY7QUFVSDtBQUNKO0FBMUJPOztBQUFBO0FBQUE7O0FBNkJaakYsV0FBTzJCLElBQVAsR0FBYzNCLE9BQU8yQixJQUFQLElBQWUsRUFBN0I7QUFDQTNCLFdBQU8yQixJQUFQLENBQVltRCxRQUFaLEdBQXVCQSxRQUF2QjtBQUNILENBL0JELEVBK0JHOUUsTUEvQkgsRUErQlc0QixNQS9CWDs7O0FDQUMsYUFBWTtBQUNUOztBQUVBLFFBQU1XLFFBQVEsSUFBSVosS0FBS2lDLEtBQVQsRUFBZDtBQUFBLFFBQ0l6RCxRQUFRLElBQUl3QixLQUFLVyxLQUFULENBQWVDLEtBQWYsQ0FEWjtBQUFBLFFBRUluQyxXQUFXLElBQUl1QixLQUFLRyxRQUFULEVBRmY7QUFBQSxRQUdJekIsV0FBVyxJQUFJc0IsS0FBS21ELFFBQVQsRUFIZjtBQUFBLFFBSUlJLGFBQWEsSUFBSXZELEtBQUt6QixVQUFULENBQW9CQyxLQUFwQixFQUEyQkMsUUFBM0IsRUFBcUNDLFFBQXJDLENBSmpCO0FBS0gsQ0FSQSxHQUFEIiwiZmlsZSI6InRhZy5tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgTWVkaWF0b3IgPSAoKCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaWJlcnM6IHtcbiAgICAgICAgICAgIGFueTogW10gLy8gZXZlbnQgdHlwZTogc3Vic2NyaWJlcnNcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJzY3JpYmUgKGZuLCB0eXBlID0gJ2FueScpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlcnNbdHlwZV0ucHVzaChmbik7XG4gICAgICAgIH0sXG4gICAgICAgIHVuc3Vic2NyaWJlIChmbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCd1bnN1YnNjcmliZScsIGZuLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVibGlzaCAocHVibGljYXRpb24sIHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTdWJzY3JpYmVycygncHVibGlzaCcsIHB1YmxpY2F0aW9uLCB0eXBlKTtcbiAgICAgICAgfSxcbiAgICAgICAgdmlzaXRTdWJzY3JpYmVycyAoYWN0aW9uLCBhcmcsIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgbGV0IHN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVyc1t0eXBlXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdwdWJsaXNoJykge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShhcmcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyc1tpXSA9PT0gYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBDb250cm9sbGVyIHtcbiAgICAgICAgY29uc3RydWN0b3IgKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgICAgIHRoaXMubGlzdFZpZXcgPSBsaXN0VmlldztcbiAgICAgICAgICAgIHRoaXMudGFza1ZpZXcgPSB0YXNrVmlldztcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy5saXN0Vmlldy5yZW5kZXIsICdsaXN0Jyk7XG4gICAgICAgICAgICBNZWRpYXRvci5zdWJzY3JpYmUodGhpcy50YXNrVmlldy5yZW5kZXIsICd0YXNrJyk7XG5cbiAgICAgICAgICAgIC8vLy9cblxuICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kQWxsKCk7XG4gICAgICAgICAgICB0aGlzLmJpbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJpbmQgKCkge1xuICAgICAgICAgICAgdGhpcy5saXN0Vmlldy4kcm9vdC5vbignY2xpY2snLCAnYScsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGxldCAkZWxtID0gJChlLmN1cnJlbnRUYXJnZXQpLFxuICAgICAgICAgICAgICAgICAgICAkcGFyZW50ID0gJGVsbS5jbG9zZXN0KCcuanMtbGlzdC1wYXJlbnQnKSxcbiAgICAgICAgICAgICAgICAgICAgbGlzdE5hbWUgPSAkcGFyZW50LmRhdGEoJ2xpc3ROYW1lJykgfHwgJyc7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGVsbS5oYXNDbGFzcygnanMtbGlzdC1zZXQnKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLmZpbmQobGlzdE5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtbGlzdC1lZGl0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VkaXQnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWxpc3QtcmVtb3ZlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5yZW1vdmUobGlzdE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjYWRkTmV3TGlzdEZvcm0nKS5vbignc3VibWl0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuY3JlYXRlKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gJChcIiN0b2RvTGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9ICQoJyN0b2RvTGlzdCcpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLWxpc3Qtc2V0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPiR7bGlzdEl0ZW0udGl0bGV9PC9hPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtbGlzdC1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1saXN0LXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTGlzdFZpZXcgPSBMaXN0Vmlldztcbn0pKHdpbmRvdywgalF1ZXJ5LCBfKTtcbiIsIigod2luZG93LCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBNb2RlbCB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChzdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICAgICAgdGhpcy5saXN0VGFza3MgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0TmFtZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwobGlzdE5hbWVzLm1hcChsaXN0TmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3ROYW1lKS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8ubWVyZ2UocmVzLCB7aWQ6IGxpc3ROYW1lfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkudGhlbihsaXN0VGFza3MgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdFRhc2tzID0gbGlzdFRhc2tzO1xuICAgICAgICAgICAgICAgIE1lZGlhdG9yLnB1Ymxpc2godGhpcy5saXN0VGFza3MsICdsaXN0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRPbmUgKGxpc3ROYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQobGlzdE5hbWUpLnRoZW4oXG4gICAgICAgICAgICAgICAgcmVzID0+IE1lZGlhdG9yLnB1Ymxpc2gocmVzLCAndGFzaycpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogZXhhbXBsZToge1xuICAgICAgICAgKiAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICogICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLnRvU3RyaW5nKCksXG4gICAgICAgICAqICAgICAgdGFza3M6IFtdXG4gICAgICAgICAqIH1cbiAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZSAoZm9ybSkge1xuICAgICAgICAgICAgbGV0IGxpc3ROYW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHRvZG86IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGZvcm0uZWxlbWVudHNbMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgdGFza3M6IFtdXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMuc3RvcmUuY3JlYXRlKGxpc3ROYW1lLCBkYXRhKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuY3JlYXRlZCA/IHRoaXMuZmluZCgpIDogY29uc29sZS5sb2coJ25vdCBjcmVhdGVkJyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3ROYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZShsaXN0TmFtZSkudGhlbihcbiAgICAgICAgICAgICAgICByZXMgPT4gcmVzLmRlbGV0ZWQgPyB0aGlzLmZpbmQoKSA6IGNvbnNvbGUubG9nKCdlcnJvcjonLCByZXMuZXJyb3IpLFxuICAgICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5Nb2RlbCA9IE1vZGVsO1xufSkod2luZG93LCBfKTtcbiIsIigod2luZG93KSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBTdG9yZSB7XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy5lbmRwb2ludCA9ICcvdG9kbyc7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kIChsaXN0TmFtZSA9ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdHRVQnLCBsaXN0TmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGxpc3ROYW1lID0gJycsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnUE9TVCcsIGxpc3ROYW1lLCBkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSAobGlzdE5hbWUgPSAnJywgZGF0YSA9IHt9KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZW5kKCdQVVQnLCBsaXN0TmFtZSwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3ROYW1lID0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0RFTEVURScsIGxpc3ROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmQgKG1ldGhvZCA9ICdHRVQnLCBsaXN0TmFtZSwgZGF0YSkge1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmVuZHBvaW50fS8ke2xpc3ROYW1lfWA7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgICAgICAgICByZXEub3BlbihtZXRob2QsIHVybCk7XG4gICAgICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXEucmVzcG9uc2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHJlamVjdChFcnJvcihcIk5ldHdvcmsgZXJyb3JcIikpO1xuICAgICAgICAgICAgICAgIHJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5TdG9yZSA9IFN0b3JlO1xufSkod2luZG93KTtcbiIsIigod2luZG93LCAkKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBUYXNrVmlldyB7XG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuJHJvb3QgPSAkKFwiI3RvZG9UYXNrc1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAoZGF0YSkge1xuICAgICAgICAgICAgbGV0ICRyb290ID0gJChcIiN0b2RvVGFza3NcIiksXG4gICAgICAgICAgICAgICAgdGFza3MgPSBkYXRhLnRhc2tzO1xuXG4gICAgICAgICAgICAkcm9vdC5odG1sKCcnKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICRyb290LmFwcGVuZChgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+JHt0YXNrc1tpXS5kZXNjcmlwdGlvbn08L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQ+JHt0YXNrc1tpXS5kZWFkbGluZSA/IHRhc2tzW2ldLmRlYWRsaW5lIDogJy0tLSd9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wgY3VzdG9tLWNoZWNrYm94XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5wdXRcIiAke3Rhc2tzW2ldLmRvbmUgPyAnY2hlY2tlZCcgOiAnJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXN0b20tY29udHJvbC1pbmRpY2F0b3JcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDwvdHI+YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLlRhc2tWaWV3ID0gVGFza1ZpZXc7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgdG9kby5TdG9yZSgpLFxuICAgICAgICBtb2RlbCA9IG5ldyB0b2RvLk1vZGVsKHN0b3JlKSxcbiAgICAgICAgbGlzdFZpZXcgPSBuZXcgdG9kby5MaXN0VmlldygpLFxuICAgICAgICB0YXNrVmlldyA9IG5ldyB0b2RvLlRhc2tWaWV3KCksXG4gICAgICAgIGNvbnRyb2xsZXIgPSBuZXcgdG9kby5Db250cm9sbGVyKG1vZGVsLCBsaXN0VmlldywgdGFza1ZpZXcpO1xufSgpKTtcblxuIl19
