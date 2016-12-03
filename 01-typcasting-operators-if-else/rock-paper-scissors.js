/**
 * https://en.wikipedia.org/wiki/Rock-paper-scissors
 */

var ROCK = 'камень';
var PAPER = 'бумага';
var SCISSORS = 'ножницы';
var programChoise;
var random = Math.random();

if(random < 0.33){
    programChoise = ROCK;
}else if(random < 0.66){
    programChoise = PAPER;
}else{
    programChoise = SCISSORS;
}

var userChoise = prompt('Выберите '+ ROCK +', '+ PAPER +' или ' + SCISSORS);

if(userChoise !== ROCK && userChoise !== PAPER && userChoise !== SCISSORS){
    alert('Херню ты написал');
}else if(programChoise === userChoise){
    alert('Ничья');
}else if(
    (programChoise === ROCK && userChoise === SCISSORS) ||
    (programChoise === PAPER && userChoise === ROCK) ||
    (programChoise === SCISSORS && userChoise === PAPER)
    ){
    alert('У меня: '+ programChoise +', у тебя: '+ userChoise +'\nЯ выиграл, а ты лошара');
}else{
    alert('У меня: '+ programChoise +', у тебя: '+ userChoise +'\nКрасавчек, ты выиграл');
}