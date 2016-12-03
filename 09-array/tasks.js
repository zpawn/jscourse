/*
 Преобразовать одномерный массив в двумерный

 Реализовать функцию toMatrix(data, rowSize), которая принимает аргументом массив и число, возвращает новый массив.
 Число показывает количество элементов в подмассивах, элементы подмассивов беруться из массива data. Оригинальный
 массив не должен быть изменен.
 */
function toMatrix (data, rowSize) {

    var arrayMatrix = [],
        subArrayMatrix = [];

    for (var i = 0; i < data.length; i += 1) {

        subArrayMatrix.push(data[i]);

        if ( (subArrayMatrix.length % rowSize === 0) || (data.length - 1 === i) ) {
            arrayMatrix.push(subArrayMatrix);
            subArrayMatrix = [];
        }
    }

    console.log(arrayMatrix);
    return arrayMatrix;
}

toMatrix([1,2,3,4,5,6,7,8,9], 3); // [[1,2,3], [4,5,6], [7,8,9]]
toMatrix([1,2,3,4,5,6,7], 3); // [[1,2,3], [4,5,6], [7]]
toMatrix([1,2,3], 5); // [[1,2,3]]
toMatrix([], 3); // []
toMatrix([1,2,3], 4);
toMatrix([1,2,3], 1);
console.log('==========================================================');

/*
 Выбрать ключи-значения из объекта

 Реализовать функцию pick(obj, keys), которая принимает аргументами объект и массив строк (названия ключей).
 Возвращает новый объект, куда вошли все ключи, указанные в массиве keys, и соответствующие значения из объекта obj.
 Если в объекте obj, нет ключа, указанного в массиве keys, в результирующем объекте этот ключ не должен присутствовать.
 */

function pick (obj, keys) {
    return keys.reduce(function (result, currentValue, index, list) {

        if (obj.hasOwnProperty(currentValue)) {
            result[currentValue] = obj[currentValue];
        }

        return result;
    }, {});
}

var user = {
    name: 'Sergey',
    age: 30,
    email: 'sergey@gmail.com',
    friends: ['Sveta', 'Artem']
};

console.log(pick(user, ['name'])); // {name: 'Sergey'}
console.log(pick(user, ['name', 'friends'])); // {name: 'Sergey', friends:['Sveta', 'Artem']}
console.log(pick(user, ['name', 'second-name'])); // {name: 'Sergey'}