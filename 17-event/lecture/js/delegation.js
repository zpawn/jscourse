/**
 * Отслеживание всех кликов по ссылкам
 */
(function () {

    /**
     * Cross-browser Event Listener
     */
    function addEvent (obj, eventName, handler) {
        var handlerWrapper = function (event) {
            event = event || window.event;
            if (!event.target && event.srcElement) {
                event.target = event.srcElement;
            }
            return handler.call(obj, event);
        }

        if (obj.addEventListener) {
            obj.addEventListener(eventName, handlerWrapper, false);
        } else if (obj.attachEvent) {
            obj.attachEvent('on' + eventName, handlerWrapper);
        }
    }

    /**
     * Find element on buuble phase
     */
    function topWalker (node, testFunc, lastParent) {
        while (node && node !== lastParent) {
            if (testFunc(node)) {
                return node;
            }
            node = node.parentNode;
        }
    }

    /**
     * Get clicked lick
     */
    function getLink (node) {
        return topWalker(node, function () {
            return node.nodeName === 'A';
        });
    }

    addEvent(document, 'click', function (event) {
        var link;
        link = getLink(event.target);
        if (link) {
            event.preventDefault();
            console.log(link);
        }
    });
}());