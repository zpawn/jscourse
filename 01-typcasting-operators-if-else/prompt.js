var MINIMAL_AGE_ALLOWED = 18;
var userInput = prompt('Сколько Вам лет?');
var age = parseInt(userInput);

if(isNaN(age)){
    alert('Вводить нужно число !!!');
}else{
    if(age >= MINIMAL_AGE_ALLOWED){
        alert('Вам уже можно сюда =)');
    }else{
        alert('Access denied');
    }
}