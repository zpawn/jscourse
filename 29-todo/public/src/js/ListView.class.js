((window, $, _) => {
    "use strict";

    class ListView {
        constructor () {
            this.$root = $("#todoList");
        }

        render (listTasks) {

            let $root = $('#todoList');
            $root.html('');

            _.forEach(listTasks, listItem => {
                $root.append(`<li class="list-group-item js-list-parent" href="javascript:void(0)" data-list-id="${listItem.id}">
                    <div class="d-flex w-100 justify-content-between">
                        <span><a class="js-list-set" href="javascript:void(0)">${listItem.title}</a></span>
                        <span>
                            <a class="js-list-edit" href="javascript:void(0)"><span class="dripicons-pencil"></span></a>
                            <a class="js-list-remove" href="javascript:void(0)"><span class="dripicons-cross"></span></a>
                        </span>
                    </div>
                </li>`);
            });
        }
    }

    window.todo = window.todo || {};
    window.todo.ListView = ListView;
})(window, jQuery, _);
