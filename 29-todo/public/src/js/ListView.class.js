((window, $, _) => {
    "use strict";

    class ListView {

        static getRoot () {
            return $("#todoList");
        }

        constructor () {
            this.$root = ListView.getRoot();
        }

        render (listTasks) {

            let $root = ListView.getRoot();
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

        listActive (listId) {
            ListView.getRoot().find('[data-list-id]').each((i, item) => {
                let $listItem = $(item);
                $listItem.removeClass('active');

                if (parseInt($listItem.data('listId')) === listId) {
                    $listItem.addClass('active');
                }
            });
        }
    }

    window.todo = window.todo || {};
    window.todo.ListView = ListView;
})(window, jQuery, _);
