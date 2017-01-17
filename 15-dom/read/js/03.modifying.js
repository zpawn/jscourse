var textSuccess = '<strong>Well done!</strong> You successfully read this important alert message.',
    textInfo = '<strong>Heads up!</strong> This alert needs your attention, but it\'s not super important.',
    textWarning = '<strong>Warning!</strong> Better check yourself, you\'re not looking too good.',
    textDanger = '<strong>Oh snap!</strong> Change a few things up and try submitting again.';

// create Node
var alertSuccess = document.createElement('div');
alertSuccess.className = 'alert alert-success';
alertSuccess.innerHTML = textSuccess;

document.body.appendChild(alertSuccess);
document.body.insertBefore(alertSuccess, document.body.firstChild);

// clone Node
var alertInfo = alertSuccess.cloneNode(true);
alertInfo.className = 'alert alert-info';
alertInfo.innerHTML = textInfo;
alertSuccess.parentNode.insertBefore(alertInfo, alertSuccess.nextSibling);

// replace Node
setTimeout(function () {
    document.body.insertBefore(alertInfo, alertSuccess);
}, 2000);

// remove Node
setTimeout(function () {
    alertSuccess.parentNode.removeChild(alertSuccess);
}, 4000);