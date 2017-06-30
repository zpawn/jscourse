'use strict';

window.usedEmails = ['author@mail.com', 'foo@mail.com', 'tester@mail.com'];

(function() {
	var ERROR_CLASS = 'has-error';
	var form = document.querySelector('form');

	// var validations = {
	// 	email: {
	// 		empty: "Введите свой емейл. Это поле обязательно к заполнению",
	// 		incorrect: "Проверьте написание. В адресе не должно быть ошибок.",
	// 		used: "Выберите другой адрес. Этот адрес уже используется"
	// 	},
	// 	password: {
	// 		empty: 'Введите пароль. Это поле обазательно к заполнению',
	// 		short: 'Введите пароль подлиннее. Минимальная длина пароля 5 символов',
	// 		simple: 'Ведите пароль сложнее. В пароле должны быть и числа и буквы'
	// 	}
	// }

	function topWalker(node, testFunc, lastParent) {
		while (node && node !== lastParent) {
			if (testFunc(node)) {
				return node;
			}
			node = node.parentNode;
		}
	}

	function showError(formElement, errorMessage) {
		if (formElement.classList.contains(ERROR_CLASS)) {
			return;
		}
		formElement.classList.add(ERROR_CLASS);
		var errorContainer = document.createElement('div');
		errorContainer.className = 'alert alert-danger';
		errorContainer.innerHTML = errorMessage;
		formElement.appendChild(errorContainer);
	}


	function hideError(formElement) {
		if (!formElement.classList.contains(ERROR_CLASS)) {
			return;
		}
		formElement.classList.remove(ERROR_CLASS)
		var errorContainer = formElement.querySelector('.alert.alert-danger')
		errorContainer.parentNode.removeChild(errorContainer)
	}

	function getContainer(node) {
		return topWalker(node, function (oneOfParents) {
			return oneOfParents.classList.contains('form-group')
		})
	}

	// function validateEmail() {
	// 	var emailNode = document.getElementById('email')
	// 	var emailWrapper = getContainer(emailNode)
	// 	var emailNodeValue = emailNode.value.trim();
	// 	var reportError = showError.bind(this, emailWrapper)

	// 	hideError(emailWrapper);
	// 	if (!emailNodeValue) {
	// 		reportError(validations.email.empty)
	// 		return false;
	// 	}
	// 	if (window.usedEmails.indexOf(emailNodeValue) !== -1) {
	// 		reportError(validations.email.used)
	// 		return false;
	// 	}
	// 	if (!/[^@]+@[^@\.]+\.[^@]+/.test(emailNodeValue)) {
	// 		reportError(validations.email.incorrect)
	// 		return false;
	// 	}
	// 	return true;
	// }
	// var emailInput = document.getElementById('email')
	// emailInput.addEventListener('keyup', validateEmail, false)
	// emailInput.addEventListener('change', validateEmail, false)
	// emailInput.addEventListener('blur', validateEmail, false)


	// function validatePassword() {
	// 	var passwordNode = document.getElementById('password')
	// 	var passwordWrapper = getContainer(passwordNode)
	// 	var passwordNodeValue = passwordNode.value.trim();
	// 	var reportError = showError.bind(this, passwordWrapper)

	// 	if (!passwordNodeValue) {
	// 		reportError(validations.password.required)
	// 		return false
	// 	}
	// 	if (passwordNodeValue.length < 5) {
	// 		reportError(validations.password.short)
	// 		return false;
	// 	}

	// 	return true;
	// }

	// function validateForm() {
	// 	var emailValid = validateEmail();
	// 	var passwordValid = validatePassword();
	// 	return emailValid && passwordValid;
	// }


	// form.addEventListener('submit', function (event) {
	// 	var formIsValid = validateForm();
	// 	if (!formIsValid) {
	// 		event.preventDefault();
	// 	}
	// })



	var validationStatus = [];
	var allValidators = [];
	var submitButton = document.querySelector('button[type="submit"]');

	function updateSubmitButtonStatus() {
		var everythingIsValid = validationStatus.every(function (validStatus) {return validStatus});
		if (everythingIsValid) {
			submitButton.disabled = false;
		} else {
			submitButton.disabled = true;
		}
	}

	function createValidator(id, rules) {
		var node = document.getElementById(id);
		var nodeWrapper = getContainer(node);
		var validationStatusIndex = validationStatus.push(true) - 1;
		function validate() {
			var nodeValue = node.value.trim();
			hideError(nodeWrapper);
			var isValid = rules.every(function (rule) {
				if (rule.validator(nodeValue, node)) {
					showError(nodeWrapper, rule.message);
					return false;
				} else {
					return true;
				}
			})
			validationStatus[validationStatusIndex] = isValid;
			updateSubmitButtonStatus();
		}
		node.addEventListener('keyup', validate, false);
		node.addEventListener('blur', validate, false);
		node.addEventListener('change', validate, false);
		return validate
	}

	document.querySelector('form').addEventListener('submit', function () {
		var everythingIsValid = allValidators.reduce(function (totallyValid, validator) {
			var inputIsValid = validator();
			if (!totallyValid) {
				return false;
			} else {
				return inputIsValid;
			}
		}, true);
		submitButton.disabled = !everythingIsValid;
		if (!everythingIsValid) {
			event.preventDefault();
		}
	}, false)

	var validators = {
		email: [{
			validator: function (value) {return !value},
			message: "Введите свой емейл. Это поле обязательно к заполнению"
		}, {
			validator: function (value) {return !/[^@]+@[^@\.]+\.[^@]+/.test(value)},
			message: "Проверьте написание. В адресе не должно быть ошибок."
		}, {
			validator: function (value) {return window.usedEmails.indexOf(value) !== -1},
			message: "Укажите другой email. Этот уже используется"
		}],
		password: [{
			validator: function (value) {return !value},
			message: "Введите пароль. Это поле обязательно к заполнению"
		}, {
			validator: function (value) {return /^[a-z]+$/i.test(value) || /^\d+$/i.test(value)},
			message: "Введите пароль посложнее. Пароль должен состоять из чисел и букв"
		}],
		rules: [{
			validator: function (value, node) {return !node.checked},
			message: "Надо согласиться"
		}]
	};

	for (var inputId in validators) {
		allValidators.push(createValidator(inputId, validators[inputId]));
	}
}())