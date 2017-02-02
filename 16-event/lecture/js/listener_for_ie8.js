function addEvent (obj, eventName, handler) {
    var handlerWrapper = function (event) {
        event = event || window.event;              // в ie 8- объект event лежит на глобальном уровне window.event
        if (!event.target && event.srcElement) {    // в ie8- нет event.target, но есть event.srcElement
            event.target = event.srcElement;        // создаем event.target
        }
        return handler.call(obj, event);            // this в handler ссылается на тот элемент на котором он был вызван
    }

    if (obj.addEventListener) {                     // в ie8- нет addEventListener
        obj.addEventListener(eventName, handlerWrapper, false);
    } else if (obj.attachEvent) {                   // в ie8- есть attachEvent
        obj.attachEvent('on' + eventName, handlerWrapper);
    }
    return handlerWrapper;
}