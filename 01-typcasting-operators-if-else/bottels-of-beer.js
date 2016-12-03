/**
 * https://en.wikipedia.org/wiki/99_Bottles_of_Beer
 */

var BOTTELS_AT_START = 99;
var verseOfTheSong;
for(var currentBottleIndex = BOTTELS_AT_START; currentBottleIndex > 0; currentBottleIndex -= 1){
    verseOfTheSong = '';

    verseOfTheSong += currentBottleIndex + ' bottles of beer on the wall, '+ currentBottleIndex +' bottles of beer.\n';
    verseOfTheSong += 'Take one down, pass it around, '+ (currentBottleIndex - 1) +' bottles of beer on the wall...\n';

    console.log(verseOfTheSong);
}