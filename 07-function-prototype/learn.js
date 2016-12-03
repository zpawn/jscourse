var arr = ['a', 'b'];
arr.push(function () {
    console.log(this);
});
arr[2]();

console.log('======================');

var obj = {
    go: function() { console.log(this); }
};
(obj.go)();

console.log('======================');

(function () {
    'use strict';

    var obj, method;
    obj = {
        go: function() { console.log(this); }
    };

    obj.go();               // (1) object
    (obj.go)();             // (2) object
    (method = obj.go)();    // (3) undefined
    (obj.go || obj.stop)(); // (4) undefined
}());

console.log('======================');

(function () {
    var user = {
        firstName: 'Vasiliy',
        export: this
    };
    console.log(user.export.firstName);
})();

console.log('======================');

(function () {
    var user = {
        firstName: 'Vasiliy',
        export: function () {
            return this;
        }
    };

    console.log(user.export().firstName);
})();

console.log('======================');

(function () {
    var name = '';
    var user = {
        name: 'Vasiliy',
        export: function () {
            return {
                value: this
            }
        }
    };
    console.log(user.export().value.name);
})();

console.log('======================');

/*
Создайте объект calculator с тремя методами:
read() запрашивает prompt два значения и сохраняет их как свойства объекта
sum() возвращает сумму этих двух значений
mul() возвращает произведение этих двух значений
 */
(function () {
    var calc = {
        read: function () {
//            this.a = parseInt(prompt('a:'));
//            this.b = parseInt(prompt('b:'));
        },
        sum: function () {
            return this.a + this.b;
        },
        mul: function () {
            return this.a * this.b;
        }
    };

    calc.read();
    console.log('sum:', calc.sum());
    console.log('mil:', calc.mul());
})();

console.log('======================');

/*
 * Цепочечный вызов
 * Есть объект "лестница" ladder
 */
var  ladder = {
    step: 0,
    up: function () {
        this.step += 1;
        return this;
    },
    down: function () {
        this.step -= 1;
        return this;
    },
    showStep: function () {
        return this.step;
    }
};
console.log(ladder.up().up().down().up().up().showStep());