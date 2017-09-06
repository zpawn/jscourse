function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}



function get(url, callback) {
	var request = new XMLHttpRequest();
	var STATE_READY = 4;
	request.open('get', url, true);
	request.onreadystatechange = function () {
		if (request.readyState === STATE_READY) {
			callback(request.responseText);
		}
	};
	request.send();
}




function doMyStuff(data, willDoAfterMyStuffFinished) {
	setTimeuot(function () {
		willDoAfterMyStuffFinished();
	}, Math.random() * 2000);
}



doMyStuff(['uno', 'tuo', 'tre'], function () {
	alert('Done with it!');
});

console.log(1);
console.log(2);
setTimeout(function () {
	console.log('ajax1-1');
	console.log('ajax1-2');
	console.time('last-ajax')
	setTimeout(function () {
		console.timeEnd('last-ajax')
		console.log('ajax1-3-1');
		console.log('ajax1-3-2');
	}, 0);
}, 0);
setTimeout(function () {
	console.log('ajax2-1');
	console.log('ajax2-2');
}, 0);
console.log(3);