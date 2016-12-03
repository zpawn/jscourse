var obj = {};

console.log(obj.toString());

function f (a) {}
var arr = [1, 2, 3];    // [1, 2, 3] -> Array.prototype -> Object.prototype
var num = 5;

console.log('array:', arr.__proto__.__proto__ == Object.prototype);
console.log('func:', f.__proto__.__proto__ == Object.prototype);
console.log('num:', num.__proto__.__proto__ == Object.prototype);

console.log('Array:', Array.prototype.__proto__ == Object.prototype);

console.log('==========================================');
/*
 Добавьте всем функциям в прототип метод defer(ms), который откладывает вызов функции на ms миллисекунд.
 После этого должен работать такой код:
 function f() {
     alert( "привет" );
 }
 f.defer(1000); // выведет "привет" через 1 секунду
 */

Function.prototype.defer = function (ms) {
    setTimeout(this, ms);
};

function func () {
    console.log('halo');
}

//func.defer(1000);

/*
 Добавьте всем функциям в прототип метод defer(ms), который возвращает обёртку, откладывающую вызов функции на ms миллисекунд.
 Например, должно работать так:
     function f(a, b) {
     alert( a + b );
 }
 f.defer(1000)(1, 2); // выведет 3 через 1 секунду.
 То есть, должны корректно передаваться аргументы.
 */
Function.prototype.defers = function (ms) {

    var func = this; // сюда попадет оригинальная функция
    console.log('inner:', func);

    return function () { // результатом будет новая функция

        var arg = arguments;
        var context = this; // СВОЙ контекст вызова (объект перед точкой)
        console.log('outer:', context);

        setTimeout(function () {
            func.apply(context, arg);
        }, ms);
    };
};

function funcDefers (a, b) {
    console.log('callyFunction');
    console.log(a + b);
}

//funcDefers.defers(1500)(1, 2);

/*
Выразительный JavaScript
========================
 */

function speak (word) {
    console.log(this.type + ' кролик: ' + word);
}

var whiteRabbit = {type: 'Белый', speak: speak};
var fatRabbit = {type: 'Толстый', speak: speak};

whiteRabbit.speak('i am a white');
fatRabbit.speak('i am a FAT');

// Prototype way
function Rabbit (type) {
    this.type = type;
}

Rabbit.prototype.speak = function (word) {
    console.log(this.type + ' кролик: ' + word);
};

var blueRabbit = new Rabbit('Blue');
var thinRabbit = new Rabbit('Худой');

blueRabbit.speak('i am a Ladyboy');
thinRabbit.speak('i want to be a FAT');

console.log('====================================');
var obj = Object.create(null);
console.dir(obj);
console.log('====================================');

/*
Делаем табличку
name         height country
------------ ------ -------------
Kilimanjaro    5895 Tanzania
Everest        8848 Nepal
Mount Fuji     3776 Japan
Mont Blanc     4808 Italy/France
Vaalserberg     323 Netherlands
Denali         6168 United States
Popocatepetl   5465 Mexico
*/
function rowHeights(rows) {
    return rows.map(function(row) {
        return row.reduce(function(max, cell) {
            return Math.max(max, cell.minHeight());
        }, 0);
    });
}

function colWidths(rows) {
    return rows[0].map(function(_, i) {
        return rows.reduce(function(max, row) {
            return Math.max(max, row[i].minWidth());
        }, 0);
    });
}

function drawTable(rows) {
    var heights = rowHeights(rows);
    var widths = colWidths(rows);

    function drawLine(blocks, lineNo) {
        return blocks.map(function(block) {
            return block[lineNo];
        }).join(" ");
    }

    function drawRow(row, rowNum) {
        var blocks = row.map(function(cell, colNum) {
            return cell.draw(widths[colNum], heights[rowNum]);
        });
        return blocks[0].map(function(_, lineNo) {
            return drawLine(blocks, lineNo);
        }).join("\n");
    }

    return rows.map(drawRow).join("\n");
}

function repeat(string, times) {
    var result = "";
    for (var i = 0; i < times; i++)
        result += string;
    return result;
}

function TextCell(text) {
    this.text = text.split("\n");
}

TextCell.prototype.minWidth = function() {
    return this.text.reduce(function(width, line) {
        return Math.max(width, line.length);
    }, 0);
};

TextCell.prototype.minHeight = function() {
    return this.text.length;
};

TextCell.prototype.draw = function(width, height) {
    var result = [];
    for (var i = 0; i < height; i++) {
        var line = this.text[i] || "";
        result.push(line + repeat(" ", width - line.length));
    }
    return result;
};

function RTextCell(text) {
    TextCell.call(this, text);
}
RTextCell.prototype = Object.create(TextCell.prototype);

RTextCell.prototype.draw = function(width, height) {
    var result = [];
    for (var i = 0; i < height; i++) {
        var line = this.text[i] || "";
        result.push(repeat(" ", width - line.length) + line);
    }
    return result;
};

var rows = [];
for (var i = 0; i < 5; i++) {
    var row = [];
    for (var j = 0; j < 5; j++) {
        if ((j + i) % 2 == 0)
            row.push(new TextCell("##"));
        else
            row.push(new TextCell("  "));
    }
    rows.push(row);
}
console.log(drawTable(rows));

var MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
    {name: "Everest", height: 8848, country: "Nepal"},
    {name: "Mount Fuji", height: 3776, country: "Japan"},
    {name: "Mont Blanc", height: 4808, country: "Italy/France"},
    {name: "Vaalserberg", height: 323, country: "Netherlands"},
    {name: "Denali", height: 6168, country: "United States"},
    {name: "Popocatepetl", height: 5465, country: "Mexico"}
];

function UnderlinedCell(inner) {
    this.inner = inner;
}

UnderlinedCell.prototype.minWidth = function() {
    return this.inner.minWidth();
};

UnderlinedCell.prototype.minHeight = function() {
    return this.inner.minHeight() + 1;
};

UnderlinedCell.prototype.draw = function(width, height) {
    return this.inner.draw(width, height - 1)
        .concat([repeat("-", width)]);
};

function dataTable(data) {
    var keys = Object.keys(data[0]);
    var headers = keys.map(function(name) {
        return new UnderlinedCell(new TextCell(name));
    });
    var body = data.map(function(row) {
        return keys.map(function(name) {
            var value = row[name];
            // Тут поменяли:
            if (typeof value == "number")
                return new RTextCell(String(value));
            else
                return new TextCell(String(value));
        });
    });
    return [headers].concat(body);
}

console.log(drawTable(dataTable(MOUNTAINS)));
console.log('=================================');

/*
Getter and Setter
 */
var pile = {
    elements: ['скорлупа', 'кожура', 'червяк'],
    get height () {
        console.log(this.elements.length);
    },
    set height (value) {
        console.log('Игнорируем попытку задать высоту:', value);
    }
};

pile.height;
pile.height = 100;
console.log('=================================');

/*
 Векторный тип

 Напишите конструктор Vector, представляющий вектор в двумерном пространстве. Он принимает параметры x и y (числа),
 которые хранятся в одноимённых свойствах.

 Дайте прототипу Vector два метода, plus и minus, которые принимают другой вектор в качестве параметра, и возвращают
 новый вектор, который хранит в x и y сумму или разность двух (один this, второй — аргумент)

 Добавьте геттер length в прототип, подсчитывающий длину вектора – расстояние от (0, 0) до (x, y).
 */
function Vector (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.plus = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
};

Vector.prototype.minus = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
};

Object.defineProperty(Vector.prototype, 'length', {
    get: function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
});

console.log(new Vector(1, 2).plus(new Vector(2, 3)));
// → Vector{x: 3, y: 5}
console.log(new Vector(1, 2).minus(new Vector(2, 3)));
// → Vector{x: -1, y: -1}
console.log(new Vector(3, 4).length);
// → 5
console.log('=======================================================');
/*
 Интерфейс к последовательностям

 Разработайте интерфейс, абстрагирующий проход по набору значений. Объект с таким интерфейсом представляет собой
 последовательность, а интерфейс должен давать возможность в коде проходить по последовательности, работать со значениями,
 которые её составляют, и как-то сигнализировать о том, что мы достигли конца последовательности.

 Задав интерфейс, попробуйте сделать функцию logFive, которая принимает объект-последовательность и вызывает console.log
 для первых её пяти элементов – или для меньшего количества, если их меньше пяти.

 Затем создайте тип объекта ArraySeq, оборачивающий массив, и позволяющий проход по массиву с использованием разработанного
 вами интерфейса. Создайте другой тип объекта, RangeSeq, который проходит по диапазону чисел (его конструктор должен
 принимать аргументы from и to).
 */


logFive(new ArraySeq([1, 2]));
// → 1
// → 2
logFive(new RangeSeq(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104