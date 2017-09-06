/*
 Релизовать валидацию формы. Валидировать поля формы надо в процессе набора (но не показывать ошибки до того, как
 пользователь что-то ввел). Форму нельзя мочь отправить, если есть ошибки. Если показаны ошибки, кнопка отправки
 формы должна быть неактивной (код неактивной кнопки закомментирован). Поля, обязательные к заполнению помечены звездочками.
 Поля с ошибкой должны подсвечиваться должным образом (который можно увидеть, раскомментировав код на бутстрап странице).
 Все регулярки должны быть написаны самостоятельно.

 Возможные ошибочные ситуации. Для каждой придумать и выводить поясняющее сообщение. Из сообщения должно быть ясно в
 чем проблема. Варианты ("что-то не так") не использовать.
 1. Поле, обязательное к заполнению не заполнено
 2. Ошибка в email-е
 3. email уже занят (сверяться со статическим списком email-ов, который хоранится на глобальном уровне в переменной usedEmails)
 ['author@mail.com', 'foo@mail.com', 'tester@mail.com']
 4. Пароль слишком короток (до 5 символов)
 5. Простой пароль (только числа, только буквы)
 6. Пароль содержит запрещенные символы (разрешенные - латинские буквы, цифры, подчеркивание, минус)
 7. Международный формат записи телефона не выдержан
 8. Галочка "Согласен со всем" не поставлена

 Решение должно работать в ие9+

 Добавить к заданию с валидацией формы серверную валидацию email-а (использован ли он). Запрос с валидацией емейла
 слать на сервер https://aqueous-reaches-8130.herokuapp.com (я разрешил кроссдоменные запросы для этого сервера).
 jQuery использовать нельзя, синхронные запросы использовать нельзя. В папку с заданием положить все файлы формы.

 */

(function () {
    var infoForm = new FormHandler('infoForm');
}());