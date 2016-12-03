/**
 * (c) 2016 FF.ua. Lev Boyko, Ilya M.
 * Created by zpawn on 07.06.16.
 */


var zpawnHelper = {

    /**
     * Напишите функцию range, принимающую два аргумента, начало и конец диапазона, и возвращающую массив, который содержит все числа из него, включая начальное и конечное.
     * В качестве бонуса дополните функцию range, чтобы она могла принимать необязательный третий аргумент – шаг для построения массива. Если он не задан, шаг равен единице. Убедитесь, что она работает с отрицательным шагом
     */
    range: function (start, end) {

        var array = [];
        var step;

        if (arguments.length > 2) {
            step = arguments[arguments.length - 1]
        } else {
            step = 1;
        }

        for (start; start <= end; start += Math.abs(step)) {
            (step < 0) ? array.unshift(start) : array.push(start);
        }

        return array;
    },

    /**
     * Сумма чисел массива
     */
    sum: function (array) {
        var sum = 0;

        for (var i = 0; i < array.length; i += 1) {
            sum += array[i];
        }
        return sum;
    },

    /**
     * Вернуть новый пересортированный массив
     */
    reverseArray: function (array) {
        var reverseArray = [];

        for (var i = 0; i < array.length; i+= 1) {
            reverseArray.unshift(array[i]);
        }

        return reverseArray;
    },

    /**
     * Пересортировать массив по ссылке
     */
    reverseArrayInPlace: function (array) {

        var copyArray = JSON.parse(
            JSON.stringify(array)
        );

        for (var i = 0; i < copyArray.length; i += 1) {
            array[copyArray.length - i - 1] = copyArray[i]
        }
    }
};

var rangeArray = zpawnHelper.range(1, 10, 2);
var sum = zpawnHelper.sum(rangeArray);

console.log('rangeArray:', rangeArray);
console.log('sum:', sum);

var reverseArray = zpawnHelper.reverseArray(rangeArray);
console.log('reverseArray:', reverseArray);

zpawnHelper.reverseArrayInPlace(rangeArray);
console.log('reverseArrayInPlace', rangeArray);