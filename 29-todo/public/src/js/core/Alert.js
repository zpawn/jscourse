((window, $) => {
    "use strict";

    class Alert {
        render (data) {
            let alert = $(`<div class="alert alert-${data.type ? data.type : 'danger'} alert-dismissible fade show" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <strong>${data.name ? data.name + ':' : ''}</strong>
                ${data.message}
            </div>`);

            $('#alerts').append(alert);

            setTimeout(() => alert.remove(), 3000);
        }
    }

    window.todo = window.todo || {};
    window.todo.Alert = Alert;
})(window, jQuery);
