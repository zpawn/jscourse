// Array
var matrix = [
    ['o', 'x', 'o'],
    [' ', 'x', 'o'],
    [' ', 'o', 'x']
];

for (var row = 0; row < matrix.length; row += 1) {
    for (var column = 0; column < matrix[row].length; column += 1) {
        console.log(row, column, matrix[row][column]);
    }
}

var students = [{
    name: 'Afanasiy Sergeevich',
    skype: 'afanas',
    email: 'afanas@gmail.com'
},{
    name: 'Petro Kush',
    skype: 'petrokush',
    email: 'petrokush@gmail.com'
},{
    name: 'Polina Medova',
    skype: 'polinamedova',
    email: 'p.medova@icloud.com'
}];

console.dir(students);
// Object
var obj1 = students[0];
var obj2 = students[0];
obj2.lastname = 'Mark';

console.log(obj1.hasOwnProperty('age'));

// Hack: создать объект (не по ссылку)
var objToString = JSON.stringify(obj1);
var stringToNewObj = JSON.parse(objToString);

console.log(objToString);
console.log(stringToNewObj);

console.log(obj1 === stringToNewObj);

for (var propName in students[0]) {
    console.log(students[0][propName]);
}