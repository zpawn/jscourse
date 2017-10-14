$(function() {
	function ToDoList(rootNode) {
	this.root = $(rootNode);
	this.todoList;//Список todos.

	this.initDom();
	this.toDoGroupsDom = this.root.find('.todo-groups-list>.list-group');
	this.toDoListDOM = this.root.find('.todos>.todo-list .table');

	this.lodeToDo();

	this.initEvents();
}
//Инициализация DOM
ToDoList.prototype.initDom = function() {
	var todoWidget = $('<div class="todo-widget panel panel-default">');
	var todoGroups = initDomToDoGroups();
	var todos = initDomToDoslist();
	todoWidget.append(todoGroups);
	todoWidget.append(todos);
	this.root.append(todoWidget);
}
//Инициализация обработчиков событий.
ToDoList.prototype.initEvents = function() {
	this.toDoGroupsDom.on('click', '.list-group-item', this._toDoGroupSelectHendler.bind(this));
	$('.todo-condition').on('click', this._toDoConditionClickHendler.bind(this));
	this.toDoGroupsDom.on('mouseenter', '.list-group-item', this._toDoGroupMouseEnterHendler.bind(this));
	this.toDoGroupsDom.on('mouseleave', '.list-group-item', this._toDoGroupMouseLeaveHendler.bind(this));
	$('.addNewGroup').mouseup(this._addNewToDoGroupHendler.bind(this));
	$('.todos').on('click', '.todo-status', this._toDOStatusClickHendler.bind(this));
	$('.addNewToDo').on('click', this._addNewToDoHendler.bind(this));
	$('.todos').on('click', '.confirm', this._addNewToDoConfirmHendler.bind(this));
	$('.todos').on('click', '.cancel', this._addNewToDoCancelHendler.bind(this));
}

//Event hendlers****************************************

//Обработка наведени курсора мыши на элемента.
ToDoList.prototype._toDoGroupMouseEnterHendler = function(event) {
	$(event.target).find('.list-group-item-control').css('display', 'inline-block');
}

//Обработка покидания курсора мыши элемента.
ToDoList.prototype._toDoGroupMouseLeaveHendler = function(event) {
	$(event.target).find('.list-group-item-control').css('display', 'none');
}

//Выбор фильтра стостояния заданий.
ToDoList.prototype._toDoConditionClickHendler = function(event) {
	this.initToDoList(
		$('.list-group-item.item-active').attr('data-index'),
		event.target.checked);
}

//Обработка выбора группы.
ToDoList.prototype._toDoGroupSelectHendler = function(event) {
	var target = $(event.target);
	//Вывод элементов списка
	if (target[0].nodeName === 'LI') {
		this.toDoGroupsDom.children().removeClass('item-active');
		target.addClass('item-active');
		this.initToDoList(parseInt(target.attr('data-index')));
	}

	//Вызов интерфейса имени группы todo.
	if (target.hasClass('modify')) {

		console.log(target);
		this.modifyToDoGroupName(target);
	}
	//Подтверждения изменения/добавления имени и сохранения на сервере и обновление списка.
	if (target.hasClass('confirm')) {
		console.log('confirm');
		if (target.closest('.list-group-item').hasClass('new-item')) {
			console.log('added new item');
			this.addNewGroupItem($('.new-name').val());
		} else {
			this.updateGroupName(parseInt(target.closest('.list-group-item').attr('data-index')), $('.new-name').val());
		}
		this.initToDoGroups();
	}
	//Отмета изменения
	if (target.hasClass('cancel')) {
		console.log('cancel');
		this.initToDoGroups();
	}
	//Удаление группы
	if (target.hasClass('delete')) {
		console.log('delete');
		this.deleteGroup(parseInt(target.closest('.list-group-item').attr('data-index')));
		this.initToDoGroups();
	}

}

//Обработчик нажатия на контрол добавления новой группы.
ToDoList.prototype._addNewToDoGroupHendler = function() {
	console.log('Adding new item')
	this.toDoGroupsDom.append('<li  class="new-item list-group-item">' +
		'<input class="new-name" type="text" placeholder="Новая список">' +
		'<span class="list-group-item-control">' +
		'<a href="#"><span class="confirm glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
		'<a href="#"><span class="cancel glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
		'</span></li>');
	this.toDoGroupsDom.closest('.todo-groups-list').scrollTop(this.toDoGroupsDom.height());
}

//Обработчик нажатия на кнопку добавления ногого todo.
ToDoList.prototype._addNewToDoHendler = function(){
	console.log('Adding new todo');
	this.toDoListDOM.append('<tr><td><input type="text" placeholder="Новое задание"></td>'+
		'<td><input class="new-date" type="text" placeholder="Дата"></td>'+
		'<td><span class="todo-item-control">'+
		'<a href="#"><span class="confirm glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
		'<a href="#"><span class="cancel glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
		'</span></td></tr>');
	$('.new-date').datepicker();
	this.toDoListDOM.closest('.todo-list').scrollTop(this.toDoListDOM.height());
}

//Подтвердить добавление елемента списка.
ToDoList.prototype._addNewToDoConfirmHendler = function(){
	this.initToDoList($('.list-group-item.item-active').attr('data-index'));
	console.log('confirm')
}

//ОТменить добавление нового елемента списка.
ToDoList.prototype._addNewToDoCancelHendler = function(){

	this.initToDoList($('.list-group-item.item-active').attr('data-index'));
	console.log('cancel');
}

//Обработка  изменения состояния(выполнен/невыполнен) элемента списка todo
ToDoList.prototype._toDOStatusClickHendler = function(event){
	console.log($(event.target).closest('tr').find(':first').text());
	var tasks = this.todoList[$('.list-group-item.item-active').attr('data-index')]['tasks'];
	console.log(tasks);
	for (var i = 0; i < tasks.length; i++) {
		if(tasks[i]['description']===$(event.target).closest('tr').find(':first').text()){
			tasks[i]['done'] = !tasks[i]['done'];

		}
	};
	this.saveToDoList();
}



//************************************Логика работы со списками***********************************************
//Обновление имени todo группы
ToDoList.prototype.updateGroupName = function(todoGruopIndex, newName) {
	this.todoList[todoGruopIndex]['title-todo-list'] = newName;
	this.saveToDoList();
}

//Добавение новой группы
ToDoList.prototype.addNewGroupItem = function(toDoGroupName) {
	this.todoList.push({
		'title-todo-list': toDoGroupName,
		'created': Date.now(),
		'tasks': []
	});
	this.saveToDoList();
}

//Удаления todo группы
ToDoList.prototype.deleteGroup = function(todoGruopIndex) {
	var t = this.todoList.splice(todoGruopIndex, 1);
	debugger;
	this.saveToDoList();
}

//Сохранить локальный список на сервере
ToDoList.prototype.saveToDoList = function() {
	$.ajax({
		url: '/todos/kuwkuw-list',
		method: 'PUT',
		data: {
			todo: JSON.stringify(this.todoList)
		},
	});
}

//Загрузка списка с сервера
ToDoList.prototype.lodeToDo = function() {
	var _this = this;
	$.get('/todos/kuwkuw-list').then(function(resulte) {
		console.log(resulte);
		_this.todoList = resulte;
		_this.initToDoGroups();
		_this.toDoGroupsDom.find('li').eq(0).addClass('item-active');;
		_this.initToDoList(0);
	});
};

//**********************Инициализация DOM*********************************************************

//Инициализация списка todo групп
ToDoList.prototype.initToDoGroups = function() {
	this.toDoGroupsDom.empty();
	for (var item = 0; item < this.todoList.length; item++) {
		this.toDoGroupsDom.append('<li  class="list-group-item" data-index="' + item + '">' + this.todoList[item]['title-todo-list'] +
			'<span class="list-group-item-control" style="display: none">' +
			'<a href="#"><span class="modify glyphicon glyphicon-pencil" aria-hidden="true"></span></a>' +
			'<a href="#"><span class="delete glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
			'</span></li>');
	};
}

//Инициализация списка todo
ToDoList.prototype.initToDoList = function(index, completed) {
	var todos = this.todoList[index]['tasks'];
	this.toDoListDOM.empty();
	//Инициализация заголовка
	this.toDoListDOM.append('<tr class="active" >' +
		'<th><span class=" glyphicon glyphicon-triangle-bottom aria-hidden="true""></span>Что нужно сделать</th>' +
		'<th><span class="glyphicon glyphicon-triangle-bottom aria-hidden="true""></span>Когда</th>' +
		'<th><span class="glyphicon glyphicon-triangle-bottom aria-hidden="true""></span>Сделано</th>' +
		'</tr>')
	for (var i = 0; i < todos.length; i++) {
		if(completed){
			if(todos[i]['done']){
				this.drowTask(todos[i]);
			}
		}else{
			this.drowTask(todos[i]);
		}
	};
}

//Инициализация DOM єлемента списка todo
ToDoList.prototype.drowTask = function (task){
		this.toDoListDOM.append('<tr><td>' + task['description'] +
			'</td><td>' + task['when'] +
			'</td><td>' + '<input class="todo-status" type="checkbox"'+ (task['done'] ? ' checked>' : '>') +
			'</td></tr>');
	}




//Инициализация интерфейса изминения имени группы todo
ToDoList.prototype.modifyToDoGroupName = function(innerElement) {
	var item = innerElement.closest('.list-group-item');
	var oldeText = item.text();
	item.empty();
	item.append('<input class="new-name" type="text" placeholder="' + oldeText + '">' +
		'<span class="list-group-item-control">' +
		'<a href="#"><span class="confirm glyphicon glyphicon-ok" aria-hidden="true"></span></a>' +
		'<a href="#"><span class="cancel glyphicon glyphicon-remove" aria-hidden="true"></span></a>' +
		'</span></li>');
	item.find('input').value = oldeText;
}

//Инициализация todo-групп (левая часть)  DOM
function initDomToDoGroups() {
	var todoGroups = $('<div class="todo-groups">');
	var filterInput = $('<div class="filter col-md-10 col-md-offset-1 input-group input-group-sm">' +
		'<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>' +
		'<input type="text" class="tag-input form-control" placeholder="...">' +
		'<span class="input-group-addon"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></span>' +
		'</div>');
	var toDoGroupsList = $('<div class="todo-groups-list panel panel-default"><ul class="list-group"></ul></div>');
	var addNewItemBtn = $('<input class="addNewGroup btn btn-defult col-md-6 col-md-offset-3" type="button" value="Добавить">');
	todoGroups.append(filterInput);
	todoGroups.append(toDoGroupsList);
	todoGroups.append(addNewItemBtn);
	return todoGroups;
}

//Инициализация списока todo (правая часть) DOM
function initDomToDoslist() {
	var todos = $('<div class="todos">');

	var filterInput = $('<div class="filter col-md-6 col-md-offset-1 input-group input-group-sm">' +
		'<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>' +
		'<input type="text" class="tag-input form-control" placeholder="..." >' +
		'<span class="input-group-addon">' +
		'<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>' +
		'</span>' +
		'</div><span class="todo-status-container"><input class="todo-condition" type="checkbox">Показывать сделанные</span>');
	var list = $('<div class="todo-list"><div class="table-responsive"><table class="table table-bordered table-hover">');

	var addNewItemBtn = $('<input class="addNewToDo btn btn-defult  col-md-6 col-md-offset-3" type="button" value="Добавить">');
	todos.append(filterInput);
	todos.append(list);
	todos.append(addNewItemBtn);
	return todos;
}
	window.ToDoList = ToDoList();
});

