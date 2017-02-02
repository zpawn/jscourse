/**
 * Сделайте так, чтобы при клике на ссылки внутри элемента #contents пользователю выводился вопрос о 
 * том, действительно ли он хочет покинуть страницу и если он не хочет, то прерывать переход по ссылке.
 * 
 * Детали:
 * - Содержимое #contents может быть загружено динамически и присвоено при помощи innerHTML. Так 
 *   что найти все ссылки и поставить на них обработчики нельзя. Используйте делегирование.
 * - Содержимое может содержать вложенные теги, в том числе внутри ссылок, например, <a href=".."><i>...</i></a>.
 */

var contents = document.getElementById('contents');

contents.addEventListener('click', function (event) {
    var target = event.target;

    while (target != this) {
        if (target.nodeName == 'A') {
            if (!confirm('go?')) {
                event.preventDefault();
            }
        }
        target = target.parentElement;
    }
}, false);

/**
 * Создайте галерею изображений, в которой основное изображение изменяется при клике на уменьшенный вариант.
 * Для обработки событий используйте делегирование, т.е. не более одного обработчика.
 * 
 * P.S. Обратите внимание – клик может быть как на маленьком изображении IMG, так и на A вне него. 
 * При этом event.target будет, соответственно, либо IMG, либо A.
 * 
 * Дополнительно:
 * - Если получится – сделайте предзагрузку больших изображений, чтобы при клике они появлялись сразу.
 * - Всё ли в порядке с семантической вёрсткой в HTML исходного документа? Если нет – поправьте, чтобы было, как нужно.
 */
document.getElementById('thumbs').addEventListener('click', function (event) {
    var image = document.getElementById('largeImg');
    var currentTarget = event.target;

    while (this != currentTarget) {
        
        if (currentTarget.nodeName == 'A') {
            image.src = currentTarget.href;
            event.preventDefault();
        }
        currentTarget = currentTarget.parentElement;
    }
}, false);

// Как только элемент создан и ему назначен src, браузер сам начинает скачивать файл картинки.
var imgs = thumbs.getElementsByTagName('img');
for (var i = 0; i < imgs.length; i++) {
    var url = imgs[i].parentNode.href;

    var img = document.createElement('img');
    img.src = url;
}