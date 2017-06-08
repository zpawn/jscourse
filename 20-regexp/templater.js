/*
 Описать функцию templater(templateString, dataObj). Функция, принимает аргументом строку и объект. Заменяет все
 вхождения подстрок вида ${STRING} значениями из объекта с ключом STRING. Пример использования:

 templater('${who} ${action} ${what}', {
     who: 'mama',
     action: 'mila',
     what: 'ramu'
 }); // 'mama mila ramu'
 */



function templater(template, data) {
    return template.match(/\w+/g).reduce(function (result, key) {
        result += ' ' + data[key];
        return result;
    }, '');
}

console.log(templater('${who} ${action} ${what}', {
    who: 'mama',
    action: 'mila',
    what: 'ramu'
}));
