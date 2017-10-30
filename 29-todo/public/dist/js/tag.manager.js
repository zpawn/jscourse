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
                        listId = $parent.data('listId') || '';

                    if ($elm.hasClass('js-list-set')) {
                        _this.model.find(listId);
                    } else if ($elm.hasClass('js-list-edit')) {
                        console.log('edit');
                    } else if ($elm.hasClass('js-list-remove')) {
                        _this.model.remove(listId);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1lZGlhdG9yLmpzIiwiQ29udHJvbGxlci5jbGFzcy5qcyIsIkxpc3RWaWV3LmNsYXNzLmpzIiwiTW9kZWwuY2xhc3MuanMiLCJTdG9yZS5jbGFzcy5qcyIsIlRhc2tWaWV3LmNsYXNzLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIk1lZGlhdG9yIiwic3Vic2NyaWJlcnMiLCJhbnkiLCJzdWJzY3JpYmUiLCJmbiIsInR5cGUiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJ2aXNpdFN1YnNjcmliZXJzIiwicHVibGlzaCIsInB1YmxpY2F0aW9uIiwiYWN0aW9uIiwiYXJnIiwiaSIsImxlbmd0aCIsInNwbGljZSIsIndpbmRvdyIsIiQiLCJDb250cm9sbGVyIiwibW9kZWwiLCJsaXN0VmlldyIsInRhc2tWaWV3IiwicmVuZGVyIiwiZmluZEFsbCIsImJpbmQiLCIkcm9vdCIsIm9uIiwiJGVsbSIsImUiLCJjdXJyZW50VGFyZ2V0IiwiJHBhcmVudCIsImNsb3Nlc3QiLCJsaXN0SWQiLCJkYXRhIiwiaGFzQ2xhc3MiLCJmaW5kIiwiY29uc29sZSIsImxvZyIsInJlbW92ZSIsInByZXZlbnREZWZhdWx0IiwiY3JlYXRlIiwidGFyZ2V0IiwidmFsIiwidG9kbyIsImpRdWVyeSIsIl8iLCJMaXN0VmlldyIsImxpc3RUYXNrcyIsImh0bWwiLCJmb3JFYWNoIiwiYXBwZW5kIiwibGlzdEl0ZW0iLCJpZCIsInRpdGxlIiwiTW9kZWwiLCJzdG9yZSIsInRoZW4iLCJQcm9taXNlIiwiYWxsIiwibGlzdElkcyIsIm1hcCIsIm1lcmdlIiwicmVzIiwiZXJyb3IiLCJlcnIiLCJmb3JtIiwiRGF0ZSIsIm5vdyIsIkpTT04iLCJzdHJpbmdpZnkiLCJlbGVtZW50cyIsInZhbHVlIiwiY3JlYXRlZCIsInRvU3RyaW5nIiwidGFza3MiLCJkZWxldGVkIiwiU3RvcmUiLCJlbmRwb2ludCIsInNlbmQiLCJtZXRob2QiLCJ1cmwiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVxIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwic2V0UmVxdWVzdEhlYWRlciIsIm9ubG9hZCIsInN0YXR1cyIsInBhcnNlIiwicmVzcG9uc2UiLCJFcnJvciIsInN0YXR1c1RleHQiLCJvbmVycm9yIiwiVGFza1ZpZXciLCJkZXNjcmlwdGlvbiIsImRlYWRsaW5lIiwiZG9uZSIsImNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsV0FBWSxZQUFNO0FBQ3BCOztBQUVBLFdBQU87QUFDSEMscUJBQWE7QUFDVEMsaUJBQUssRUFESSxDQUNEO0FBREMsU0FEVjs7QUFLSEMsaUJBTEcscUJBS1FDLEVBTFIsRUFLMEI7QUFBQSxnQkFBZEMsSUFBYyx1RUFBUCxLQUFPOztBQUN6QixnQkFBSSxPQUFPLEtBQUtKLFdBQUwsQ0FBaUJJLElBQWpCLENBQVAsS0FBa0MsV0FBdEMsRUFBbUQ7QUFDL0MscUJBQUtKLFdBQUwsQ0FBaUJJLElBQWpCLElBQXlCLEVBQXpCO0FBQ0g7QUFDRCxpQkFBS0osV0FBTCxDQUFpQkksSUFBakIsRUFBdUJDLElBQXZCLENBQTRCRixFQUE1QjtBQUNILFNBVkU7QUFXSEcsbUJBWEcsdUJBV1VILEVBWFYsRUFXY0MsSUFYZCxFQVdvQjtBQUNuQixpQkFBS0csZ0JBQUwsQ0FBc0IsYUFBdEIsRUFBcUNKLEVBQXJDLEVBQXlDQyxJQUF6QztBQUNILFNBYkU7QUFjSEksZUFkRyxtQkFjTUMsV0FkTixFQWNtQkwsSUFkbkIsRUFjeUI7QUFDeEIsaUJBQUtHLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDRSxXQUFqQyxFQUE4Q0wsSUFBOUM7QUFDSCxTQWhCRTtBQWlCSEcsd0JBakJHLDRCQWlCZUcsTUFqQmYsRUFpQnVCQyxHQWpCdkIsRUFpQjBDO0FBQUEsZ0JBQWRQLElBQWMsdUVBQVAsS0FBTzs7QUFDekMsZ0JBQUlKLGNBQWMsS0FBS0EsV0FBTCxDQUFpQkksSUFBakIsQ0FBbEI7O0FBRUEsaUJBQUssSUFBSVEsSUFBSSxDQUFiLEVBQWdCQSxJQUFJWixZQUFZYSxNQUFoQyxFQUF3Q0QsS0FB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QUFRekMsS0FBS3lDLEtBRGpCOztBQUdBakQsc0JBQU11QixJQUFOLENBQVcsRUFBWDs7QUFFQSxxQkFBSyxJQUFJbkMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJNkQsTUFBTTVELE1BQTFCLEVBQWtDRCxLQUFLLENBQXZDLEVBQTBDO0FBQ3RDWSwwQkFBTXlCLE1BQU4sb0NBQ1V3QixNQUFNN0QsQ0FBTixFQUFTa0YsV0FEbkIsd0NBRVVyQixNQUFNN0QsQ0FBTixFQUFTbUYsUUFBVCxHQUFvQnRCLE1BQU03RCxDQUFOLEVBQVNtRixRQUE3QixHQUF3QyxLQUZsRCx5TUFLa0V0QixNQUFNN0QsQ0FBTixFQUFTb0YsSUFBVCxHQUFnQixTQUFoQixHQUE0QixFQUw5RjtBQVVIO0FBQ0o7QUExQk87O0FBQUE7QUFBQTs7QUE2QlpqRixXQUFPMkIsSUFBUCxHQUFjM0IsT0FBTzJCLElBQVAsSUFBZSxFQUE3QjtBQUNBM0IsV0FBTzJCLElBQVAsQ0FBWW1ELFFBQVosR0FBdUJBLFFBQXZCO0FBQ0gsQ0EvQkQsRUErQkc5RSxNQS9CSCxFQStCVzRCLE1BL0JYOzs7QUNBQyxhQUFZO0FBQ1Q7O0FBRUEsUUFBTVcsUUFBUSxJQUFJWixLQUFLaUMsS0FBVCxFQUFkO0FBQUEsUUFDSXpELFFBQVEsSUFBSXdCLEtBQUtXLEtBQVQsQ0FBZUMsS0FBZixDQURaO0FBQUEsUUFFSW5DLFdBQVcsSUFBSXVCLEtBQUtHLFFBQVQsRUFGZjtBQUFBLFFBR0l6QixXQUFXLElBQUlzQixLQUFLbUQsUUFBVCxFQUhmO0FBQUEsUUFJSUksYUFBYSxJQUFJdkQsS0FBS3pCLFVBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxRQUEzQixFQUFxQ0MsUUFBckMsQ0FKakI7QUFLSCxDQVJBLEdBQUQiLCJmaWxlIjoidGFnLm1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNZWRpYXRvciA9ICgoKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmVyczoge1xuICAgICAgICAgICAgYW55OiBbXSAvLyBldmVudCB0eXBlOiBzdWJzY3JpYmVyc1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnNjcmliZSAoZm4sIHR5cGUgPSAnYW55Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnN1YnNjcmliZXJzW3R5cGVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVyc1t0eXBlXS5wdXNoKGZuKTtcbiAgICAgICAgfSxcbiAgICAgICAgdW5zdWJzY3JpYmUgKGZuLCB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0U3Vic2NyaWJlcnMoJ3Vuc3Vic2NyaWJlJywgZm4sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICBwdWJsaXNoIChwdWJsaWNhdGlvbiwgdHlwZSkge1xuICAgICAgICAgICAgdGhpcy52aXNpdFN1YnNjcmliZXJzKCdwdWJsaXNoJywgcHVibGljYXRpb24sIHR5cGUpO1xuICAgICAgICB9LFxuICAgICAgICB2aXNpdFN1YnNjcmliZXJzIChhY3Rpb24sIGFyZywgdHlwZSA9ICdhbnknKSB7XG4gICAgICAgICAgICBsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3R5cGVdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3B1Ymxpc2gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzW2ldKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmliZXJzW2ldID09PSBhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuIiwiKCh3aW5kb3csICQpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIENvbnRyb2xsZXIge1xuICAgICAgICBjb25zdHJ1Y3RvciAobW9kZWwsIGxpc3RWaWV3LCB0YXNrVmlldykge1xuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICAgICAgdGhpcy5saXN0VmlldyA9IGxpc3RWaWV3O1xuICAgICAgICAgICAgdGhpcy50YXNrVmlldyA9IHRhc2tWaWV3O1xuXG4gICAgICAgICAgICAvLy8vXG5cbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLmxpc3RWaWV3LnJlbmRlciwgJ2xpc3QnKTtcbiAgICAgICAgICAgIE1lZGlhdG9yLnN1YnNjcmliZSh0aGlzLnRhc2tWaWV3LnJlbmRlciwgJ3Rhc2snKTtcblxuICAgICAgICAgICAgLy8vL1xuXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmZpbmRBbGwoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYmluZCAoKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RWaWV3LiRyb290Lm9uKCdjbGljaycsICdhJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0ICRlbG0gPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkZWxtLmNsb3Nlc3QoJy5qcy1saXN0LXBhcmVudCcpLFxuICAgICAgICAgICAgICAgICAgICBsaXN0SWQgPSAkcGFyZW50LmRhdGEoJ2xpc3RJZCcpIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRlbG0uaGFzQ2xhc3MoJ2pzLWxpc3Qtc2V0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5maW5kKGxpc3RJZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkZWxtLmhhc0NsYXNzKCdqcy1saXN0LWVkaXQnKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZWRpdCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJGVsbS5oYXNDbGFzcygnanMtbGlzdC1yZW1vdmUnKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW92ZShsaXN0SWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjYWRkTmV3TGlzdEZvcm0nKS5vbignc3VibWl0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuY3JlYXRlKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAkKCcjbmV3VG9Eb0xpc3QnKS52YWwoXCJcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uQ29udHJvbGxlciA9IENvbnRyb2xsZXI7XG59KSh3aW5kb3csIGpRdWVyeSk7XG4iLCIoKHdpbmRvdywgJCwgXykgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgTGlzdFZpZXcge1xuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gJChcIiN0b2RvTGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlciAobGlzdFRhc2tzKSB7XG5cbiAgICAgICAgICAgIGxldCAkcm9vdCA9ICQoJyN0b2RvTGlzdCcpO1xuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIF8uZm9yRWFjaChsaXN0VGFza3MsIGxpc3RJdGVtID0+IHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBqcy1saXN0LXBhcmVudFwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBkYXRhLWxpc3QtaWQ9XCIke2xpc3RJdGVtLmlkfVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IHctMTAwIGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj48YSBjbGFzcz1cImpzLWxpc3Qtc2V0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPiR7bGlzdEl0ZW0udGl0bGV9PC9hPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwianMtbGlzdC1lZGl0XCIgaHJlZj1cImphdmFzY3JpcHQ6dm9pZCgwKVwiPjxzcGFuIGNsYXNzPVwiZHJpcGljb25zLXBlbmNpbFwiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1saXN0LXJlbW92ZVwiIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48c3BhbiBjbGFzcz1cImRyaXBpY29ucy1jcm9zc1wiPjwvc3Bhbj48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uTGlzdFZpZXcgPSBMaXN0Vmlldztcbn0pKHdpbmRvdywgalF1ZXJ5LCBfKTtcbiIsIigod2luZG93LCBfKSA9PiB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjbGFzcyBNb2RlbCB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChzdG9yZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgICAgICAgICAgdGhpcy5saXN0VGFza3MgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBbGwgKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5maW5kKCkudGhlbihcbiAgICAgICAgICAgICAgICBsaXN0SWRzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpc3RJZHMubWFwKGxpc3RJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5maW5kKGxpc3RJZCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1lcmdlKHJlcywge2lkOiBsaXN0SWR9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS50aGVuKGxpc3RUYXNrcyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0VGFza3MgPSBsaXN0VGFza3M7XG4gICAgICAgICAgICAgICAgTWVkaWF0b3IucHVibGlzaCh0aGlzLmxpc3RUYXNrcywgJ2xpc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZE9uZSAobGlzdElkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLmZpbmQobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiBNZWRpYXRvci5wdWJsaXNoKHJlcywgJ3Rhc2snKSxcbiAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGV4YW1wbGU6IHtcbiAgICAgICAgICogICAgICB0aXRsZTogJycsXG4gICAgICAgICAqICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgKiAgICAgIHRhc2tzOiBbXVxuICAgICAgICAgKiB9XG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGUgKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SWQgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdG9kbzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogZm9ybS5lbGVtZW50c1swXS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICB0YXNrczogW11cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS5jcmVhdGUobGlzdElkLCBkYXRhKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuY3JlYXRlZCA/IHRoaXMuZmluZEFsbCgpIDogY29uc29sZS5sb2coJ25vdCBjcmVhdGVkJyksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZW1vdmUgKGxpc3RJZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5yZW1vdmUobGlzdElkKS50aGVuKFxuICAgICAgICAgICAgICAgIHJlcyA9PiByZXMuZGVsZXRlZCA/IHRoaXMuZmluZEFsbCgpIDogY29uc29sZS5sb2coJ2Vycm9yOicsIHJlcy5lcnJvciksXG4gICAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cudG9kbyA9IHdpbmRvdy50b2RvIHx8IHt9O1xuICAgIHdpbmRvdy50b2RvLk1vZGVsID0gTW9kZWw7XG59KSh3aW5kb3csIF8pO1xuIiwiKCh3aW5kb3cpID0+IHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNsYXNzIFN0b3JlIHtcblxuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLmVuZHBvaW50ID0gJy90b2RvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmQgKGxpc3RJZCA9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbmQoJ0dFVCcsIGxpc3RJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBjcmVhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnUE9TVCcsIGxpc3RJZCwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUgKGxpc3RJZCA9IDAsIGRhdGEgPSB7fSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnUFVUJywgbGlzdElkLCBkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbW92ZSAobGlzdElkID0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VuZCgnREVMRVRFJywgbGlzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbmQgKG1ldGhvZCA9ICdHRVQnLCBsaXN0SWQsIGRhdGEpIHtcblxuICAgICAgICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5lbmRwb2ludH0vJHtsaXN0SWQgPT09IDAgPyAnJyA6IGxpc3RJZH1gO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICAgICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKEpTT04ucGFyc2UocmVxLnJlc3BvbnNlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IocmVxLnN0YXR1c1RleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IgPSAoKSA9PiByZWplY3QoRXJyb3IoXCJOZXR3b3JrIGVycm9yXCIpKTtcbiAgICAgICAgICAgICAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdpbmRvdy50b2RvID0gd2luZG93LnRvZG8gfHwge307XG4gICAgd2luZG93LnRvZG8uU3RvcmUgPSBTdG9yZTtcbn0pKHdpbmRvdyk7XG4iLCIoKHdpbmRvdywgJCkgPT4ge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY2xhc3MgVGFza1ZpZXcge1xuICAgICAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgICAgICB0aGlzLiRyb290ID0gJChcIiN0b2RvVGFza3NcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIgKGRhdGEpIHtcbiAgICAgICAgICAgIGxldCAkcm9vdCA9ICQoXCIjdG9kb1Rhc2tzXCIpLFxuICAgICAgICAgICAgICAgIHRhc2tzID0gZGF0YS50YXNrcztcblxuICAgICAgICAgICAgJHJvb3QuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAkcm9vdC5hcHBlbmQoYDx0cj5cbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7dGFza3NbaV0uZGVzY3JpcHRpb259PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPiR7dGFza3NbaV0uZGVhZGxpbmUgPyB0YXNrc1tpXS5kZWFkbGluZSA6ICctLS0nfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImN1c3RvbS1jb250cm9sIGN1c3RvbS1jaGVja2JveFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbS1jb250cm9sLWlucHV0XCIgJHt0YXNrc1tpXS5kb25lID8gJ2NoZWNrZWQnIDogJyd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY3VzdG9tLWNvbnRyb2wtaW5kaWNhdG9yXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8L3RyPmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2luZG93LnRvZG8gPSB3aW5kb3cudG9kbyB8fCB7fTtcbiAgICB3aW5kb3cudG9kby5UYXNrVmlldyA9IFRhc2tWaWV3O1xufSkod2luZG93LCBqUXVlcnkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGNvbnN0IHN0b3JlID0gbmV3IHRvZG8uU3RvcmUoKSxcbiAgICAgICAgbW9kZWwgPSBuZXcgdG9kby5Nb2RlbChzdG9yZSksXG4gICAgICAgIGxpc3RWaWV3ID0gbmV3IHRvZG8uTGlzdFZpZXcoKSxcbiAgICAgICAgdGFza1ZpZXcgPSBuZXcgdG9kby5UYXNrVmlldygpLFxuICAgICAgICBjb250cm9sbGVyID0gbmV3IHRvZG8uQ29udHJvbGxlcihtb2RlbCwgbGlzdFZpZXcsIHRhc2tWaWV3KTtcbn0oKSk7XG5cbiJdfQ==
