((window, $) => {
    "use strict";

    class Controller {
        constructor (model, listView, taskView) {
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

        bind () {
            this.listView.$root.on('click', 'a', e => {
                let $elm = $(e.currentTarget),
                    $parent = $elm.closest('.js-list-parent'),
                    listId = $parent.data('listId') || '';

                if ($elm.hasClass('js-list-set')) {
                    this.model.find(listId);
                } else if ($elm.hasClass('js-list-edit')) {
                    console.log('edit');
                } else if ($elm.hasClass('js-list-remove')) {
                    this.model.remove(listId);
                }
            });

            $('#addNewListForm').on('submit', e => {
                e.preventDefault();
                this.model.create(e.target);
                $('#newToDoList').val("");
            });
        }
    }

    window.todo = window.todo || {};
    window.todo.Controller = Controller;
})(window, jQuery);
