/**
 * Упрощенный пример виджета
 */
function Counter (node, initValue) {
    this.val = initValue || 0;
    this.node = node;
    this.init();
}

Counter.prototype.init = function () {
    this.node.innerHTML = '<div class="counter-value"></div>'+
        '<div class="counter-controls">' +
            '<div class="counter-control-inc">+</div>' +
            '<div class="counter-control-dec">-</div>'
        '</div>';
    this.valueNode = this.node.querySelector('.counter-value');

    // first variand event listener: присваиваем callback ф-цию и привязываем (bind) ей контекст,
    // т.к. в callback ф-цию слущателя событий передается ссылка на объект по которому произошел клик,
    // а нам надо работать с методами экземпляра Counter
    this.node.querySelector('.counter-control-inc').addEventListener('click', this.inc.bind(this), false);

    // second variant event listener: сохраняем контекст и вызываем метод inc() внутри callback ф-ции
    var _this = this;
    this.node.querySelector('.counter-control-dec').addEventListener('click', function () {
        _this.dec();
    }, false);

    this.updateValue();
};

Counter.prototype.updateValue = function () {
    this.valueNode.innerHTML = this.val;
};

Counter.prototype.inc = function () {
    this.val += 1;
    this.updateValue();
};

Counter.prototype.dec = function () {
    this.val -= 1;
    this.updateValue();
};

/**
 * bind - присвоение контекста
 * bind implementation - метод реализуется в три строчки кода
 */
function bind (func, context) {
    return function () {
        return func.apply(context, arguments);
    }
}