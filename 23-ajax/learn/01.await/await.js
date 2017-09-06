(function () {
   'use strict';

   var xhr = new XMLHttpRequest();

    /**
     * .open(method, URL, async, user, password)
     */
   xhr.open('GET', '//jsonplaceholder.typicode.com/users', false);

   xhr.send();

   if (xhr.status !== 200) {
       console.log(xhr.status, xhr.statusText);
   } else {
       console.log('Response', JSON.parse(xhr.responseText));
   }
}());
