/**
 * Game: how much?
 */

var min = 0;
var max = 50;
var randomNumber = _.random(min, max);
var victory = false;
var answers = [],
    answer = 'enter the number from '+ min +' to '+ max +':',
    currentNumber, prevAnswer;

console.log(randomNumber);

do {
    currentNumber = parseInt(prompt(answer));
    answers.push(currentNumber);

    if (currentNumber == randomNumber) {
        victory = true;
    } else {

        if (answers.length < 2) {
            answer = (currentNumber > randomNumber) ? 'меньше' : 'больше';
        } else {

            prevAnswer = answers[answers.length - 2];

            var isMore = Math.abs(randomNumber - currentNumber);
            var isPrevMore = Math.abs(randomNumber - prevAnswer);

            answer = (isMore < isPrevMore) ? 'теплее' : (isMore === isPrevMore) ? 'так же' : 'холоднее';
        }
    }

} while (!victory);

alert('attempts: ' + answers.length);