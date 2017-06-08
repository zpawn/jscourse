console.time('loop');
for (var i =0; i < 9999; i += 1) {
    new Date();
}
console.timeEnd('loop');