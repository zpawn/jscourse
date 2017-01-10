/*
 Преобразовать одномерный массив в двумерный

 Реализовать функцию toMatrix(data, rowSize), которая принимает аргументом массив и число, возвращает новый массив.
 Число показывает количество элементов в подмассивах, элементы подмассивов беруться из массива data. Оригинальный
 массив не должен быть изменен.
 */
function toMatrix (data, rowSize) {
    var result = [];

    for (var i = 0; i < data.length; i+= rowSize) {
        result.push(data.slice(i, i + rowSize));
    }

    return result;
}

console.log(toMatrix([1,1,2,2,3,3], 2));