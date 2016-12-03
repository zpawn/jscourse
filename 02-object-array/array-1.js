var arr = ['Яблоко', 'Апельсин', 'Груша', 'Лимон', 'Гранат'];
console.log(arr);

/*
 get last value in array
 */
var lastValue = arr.length - 1;
console.log('last:', arr[lastValue]);

/*
 add new value in array
 */
arr.push('Слива');
console.log('add:', arr);

/*
 1. Создайте массив styles с элементами «Джаз», «Блюз».
 2. Добавьте в конец значение «Рок-н-Ролл»
 3. Замените предпоследнее значение с конца на «Классика». Код замены предпоследнего значения должен работать для массивов любой длины.
 4. Удалите первое значение массива и выведите его alert.
 5. Добавьте в начало значения «Рэп» и «Регги».
 */

var music = ['Джаз', 'Блюз'];   // 1.
music.push('Рок-н-Ролл');       // 2.
music[music.length - 1] = 'Классика';   // 3.
music.shift();                  // 4.
music.unshift('Рэп','Регги');   // 5.
console.log(music);

/*
 show random value in array
 */
var min = 0;
var max = 4;
var rand = Math.floor(Math.random() * arr.length);
console.log('rand:', arr[rand]);

/*
 Создайте калькулятор для введённых значений:
 - Запрашивает по очереди значения при помощи prompt и сохраняет их в массиве.
 - Заканчивает ввод, как только посетитель введёт пустую строку, не число или нажмёт «Отмена».
 - При этом ноль 0 не должен заканчивать ввод, это разрешённое число.
 - Выводит сумму всех значений массива
 */

var calc = [],
    emptyValue = false,
    sumFor = sumReduce = 0,
    promptValue;

while(!emptyValue){

    promptValue = prompt('enter the number');

    if(promptValue || promptValue === 0){
        calc.push(parseInt(promptValue));
    }else{
        emptyValue = true;
    }
}

for(var i = 0; i < calc.length; i += 1){
    sumFor += calc[i];
}

if(calc.length){
    sumReduce = calc.reduce(function(a, b){
        return a + b;
    });
}
console.log('calc:', calc);
console.log('sum:', sumReduce);

/*
 Создайте функцию filterRange(arr, a, b), которая принимает массив чисел arr и возвращает новый массив,
 который содержит только числа из arr из диапазона от a до b. То есть, проверка имеет вид a ≤ arr[i] ≤ b.
 Функция не должна менять arr.
 */
/**
 *
 * @param arr - array
 * @param a - start filter
 * @param b - end filter
 * @returns {Array} - new filtered array
 */
function filterRange(arr, a, b){
    var newArray = [];
    for(var i = 0; i < arr.length; i += 1){
        if(arr[i] >= a && arr[i] <= b){
            newArray.push(arr[i]);
        }
    }
    return newArray;
}

var array = [5, 4, 3, 8, 0];
var filtered = filterRange(array, 3, 5);

/*
 Решето Эратосфена

 Целое число, большее 1, называется простым, если оно не делится нацело ни на какое другое, кроме себя и 1.
 Древний алгоритм «Решето Эратосфена» для поиска всех простых чисел до n выглядит так:

 1. Создать список последовательных чисел от 2 до n: 2, 3, 4, ..., n.
 2. Пусть p=2, это первое простое число.
 3. Зачеркнуть все последующие числа в списке с разницей в p, т.е. 2*p, 3*p, 4*p и т.д. В случае p=2 это будут 4,6,8....
 4. Поменять значение p на первое не зачеркнутое число после p.
 5. Повторить шаги 3-4 пока p2 < n.
 6. Все оставшиеся не зачеркнутыми числа — простые.
 */

// 1.
var naturalNum = [];
var count = 100;

for(var i = 0; i < count; i += 1){
    naturalNum[i] = true;
}
// 2.
var p = 2;

while( (p * p) < count ){   // 5.

    // 3.
    for(i = 2 * p; i < count; i += p){
        naturalNum[i] = false;
    }

    // 4.
    for(i = p + 1; i < count; i += i){
        if(naturalNum[i]) break;
    }

    p = i;
}

var naturalSum = 0;
for(i = 0; i < count; i += 1){
    if(naturalNum[i]){
        naturalSum += i
    }
}

console.log(naturalSum);