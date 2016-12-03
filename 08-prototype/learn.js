/*
 Задание состоит из двух частей:
 Присвойте объектам ссылки __proto__ так, чтобы любой поиск чего-либо шёл по алгоритму pockets -> bed -> table -> head.
 То есть pockets.pen == 3, bed.glasses == 1, но table.money == undefined.
 После этого ответьте на вопрос, как быстрее искать glasses: обращением к pockets.glasses или head.glasses? Попробуйте протестировать.
 */
var head = {
    glasses: 1
};

var table = {
    pen: 3
};

var bed = {
    sheet: 1,
    pillow: 2
};

var pockets = {
    money: 2000
};

table.__proto__ = head;
bed.__proto__ = table;
pockets.__proto__ = bed;

console.log('pockets.pen:', pockets.pen);
console.log('bed.glasses:', bed.glasses);
console.log('table.money:', table.money);
console.log('========================================');

/*
 * function way
 */
function AnimalFunc(name) {
    this.speed = 0;
    this.name = name;

    this.run = function(speed) {
        this.speed += speed;
        console.log( this.name + ' бежит, скорость ' + this.speed );
    };

    this.stop = function() {
        this.speed = 0;
        console.log( this.name + ' стоит' );
    };

    this.sayHi = function () {
        console.log(name);
    };
}

var animal = new AnimalFunc('Зверь');

console.log( animal.speed ); // 0, начальная скорость
animal.run(3); // Зверь бежит, скорость 3
animal.run(10); // Зверь бежит, скорость 13
animal.stop(); // Зверь стоит
animal.sayHi();

/*
 * Prototype way
 */

/**
 * @param name
 * @constructor
 */
function Animal (name) {
    this._name = name;
    this.speed = 0;
}

Animal.prototype.run = function (speed) {
    this.speed += speed;
    console.log( this._name + ' бежит, скорость ' + this.speed );
};

Animal.prototype.stop = function () {
    this.speed = 0;
    console.log( this._name + ' стоит' );
};

Animal.prototype.sayHi = function () {
    console.log(this._name);
};

var animalPug = new Animal('Pug');
console.log( animal.speed ); // 0, свойство взято из прототипа
animalPug.run(5); // Зверь бежит, скорость 5
animalPug.run(5); // Зверь бежит, скорость 10
animalPug.stop(); // Зверь стоит
animalPug.sayHi();

/*
 ## Перепишите в виде класса
 Есть класс CoffeeMachine, заданный в функциональном стиле.
 Задача: переписать CoffeeMachine в виде класса с использованием прототипа.
 Исходный код:
 function CoffeeMachine(power) {
     var waterAmount = 0;
     var WATER_HEAT_CAPACITY = 4200;

     function getTimeToBoil() {
         return waterAmount * WATER_HEAT_CAPACITY * 80 / power;
     }

     this.run = function() {
         setTimeout(function() {
             alert( 'Кофе готов!' );
         }, getTimeToBoil());
     };

     this.setWaterAmount = function(amount) {
         waterAmount = amount;
     };
 }

 var coffeeMachine = new CoffeeMachine(10000);
 coffeeMachine.setWaterAmount(50);
 coffeeMachine.run();
 */
function CoffeeMachine(power) {
    this._waterAmount = 0;
    this.power = power;
}

CoffeeMachine.prototype.WATER_HEAT_CAPACITY = 4200;

CoffeeMachine.prototype.getTimeToBoil = function () {
    return this._waterAmount * this.WATER_HEAT_CAPACITY * 80 / this.power;
};

CoffeeMachine.prototype.run = function() {
    setTimeout(function() {
        console.log( 'Кофе готов!' );
    }, this.getTimeToBoil());
};

CoffeeMachine.prototype.setWaterAmount = function(amount) {
    this._waterAmount = amount;
};

var coffeeMachine = new CoffeeMachine(10000);
coffeeMachine.setWaterAmount(50);
coffeeMachine.run();
console.log('=============================================');
/*
 Вы – руководитель команды, которая разрабатывает игру, хомяковую ферму. Один из программистов получил задание создать
 класс «хомяк» (англ – "Hamster").
 Объекты-хомяки должны иметь массив food для хранения еды и метод found для добавления.
 Ниже – его решение. При создании двух хомяков, если поел один – почему-то сытым становится и второй тоже.
 В чём дело? Как поправить?
function Hamster() {}

Hamster.prototype.food = []; // пустой "живот"

Hamster.prototype.found = function(something) {
    this.food.push(something);
};

// Создаём двух хомяков и кормим первого
var speedy = new Hamster();
var lazy = new Hamster();

speedy.found("яблоко");
speedy.found("орех");

alert( speedy.food.length ); // 2
alert( lazy.food.length ); // 2 (!??)
 */

function Hamster() {
    this._food = [];
}


Hamster.prototype.found = function(something) {
    this._food.push(something);
};

// Создаём двух хомяков и кормим первого
var speedy = new Hamster();
var lazy = new Hamster();

speedy.found("яблоко");
speedy.found("орех");

console.log( speedy._food.length ); // 2
console.log( lazy._food.length ); // 2 (!??)