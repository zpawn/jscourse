console.log('right ib script', document.querySelector('.test'));

$(function () {
    console.log('on DOM ready', document.querySelector('.test'));

    // http://api.jquery.com/category/selectors/
    var listWithClose = $('.menu-item:has(.close)');
    console.log(listWithClose);

    $('.menu li').find('> ul').addClass('underline');

    // create element
    var div = $('<div>');
    div.text('lorem');
    $('body').append(div);


    var btn1 = $('.button-one');
    var btn2 = $('.button-two');
    btn1.attr('disabled', 'disabled');
    console.log(btn1, btn2);
    console.log('offsetBtn2:', btn2.offset());
});
