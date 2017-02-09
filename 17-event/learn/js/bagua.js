(function () {
    'use strict';

    var selectedNode,
        table = document.getElementById('bagua-table'),
        HIGHLIGHT_CLASS = 'highlight';

    table.addEventListener('click', function (event) {
        var target = event.target;
        
        while (target !== table) {
            if (target.nodeName === 'TD') {
                highlight(target);
                return;
            }
            target = target.parentNode;
        }
    }, false);

    function highlight (targetNode) {
        if (selectedNode) {
            selectedNode.classList.remove(HIGHLIGHT_CLASS);
        }
        selectedNode = targetNode;
        selectedNode.classList.add(HIGHLIGHT_CLASS);
    }
}());