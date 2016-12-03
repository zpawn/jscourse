/**
 * add class in string
 */
function addClass(classes, cls){
    var arrClassName = classes.split(' ');

    if(arrClassName.indexOf(cls) === -1){
        arrClassName.push(cls);
    }

    return arrClassName.join(' ');
}

var objClass = {
    className: 'open menu'
};

console.log(objClass);

objClass.className = addClass(objClass.className, 'new');
objClass.className = addClass(objClass.className, 'menu');
objClass.className = addClass(objClass.className, 'submenu');

console.log(objClass);

console.log('==============================');
/**
 * change string 'border-left-width' to 'borderLeftWidth'
 */
function capitalize(str){
    var i = 0;
    var first = true;
    var arr = str.split('-');

    while(i < arr.length){

        if(first){
            if(arr[i] == ''){
                arr.shift();
                continue;
            }else{
                first = false;
            }
        }else{
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        i += 1;
    }

    return arr.join('');
}

var str1 = 'background-color',
    str2 = 'list-style-image',
    str3 = '-webkit-transition';

console.log(capitalize(str1));
console.log(capitalize(str2));
console.log(capitalize(str3));

console.log('==============================');
/**
 * create class if isset in string
 */
function removeClass(classes, removeClass){

    var arr = classes.split(' ');

    for(var i = 0; i < arr.length; i += 1){
        if(arr[i] == removeClass){
            arr.splice(i, 1);
            i -= 1;
        }
    }

    return arr.join(' ');
}

var obj = {
    className: 'open menu new submenu menu'
};

console.log(obj);
obj.className = removeClass(obj.className, 'menu');
console.log(obj);
obj.className = removeClass(obj.className, 'new');
console.log(obj);

console.log('==============================');
/**
 * Фильтрация массива "на месте"
 * проверка имеет вид a ≤ arr[i] ≤ b
 */

