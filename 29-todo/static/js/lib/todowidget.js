(function(){
	'use strict';

	//Класс
	function ToDoWidget(rootElement){
		//Корневой элемент виджета
		this.root = document.querySelector(rootElement);

		this.todoList;//Список todos.

		this.toDoGroupsDom;

		this.toDoListDOM
		//Инициализация HTML виджета
		this._generateHtml();



	}

//*******************************Инициалазация Html******************************************************************************************
	//Инициализатор разметки виджета
	ToDoWidget.prototype._generateHtml = function(){
		var todoGroups = '<div class="todo-groups">'+
							'<div class="filter col-md-10 col-md-offset-1 input-group input-group-sm">' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>' +
							'<input type="text" class="tag-input form-control" placeholder="...">' +
							'<span class="input-group-addon"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span></span>' +
							'</div>'+
							'<div class="todo-groups-list panel panel-default"><ul class="list-group"></ul></div>'+
							'<input class="addNewGroup btn btn-defult col-md-6 col-md-offset-3" type="button" value="Добавить">'+
						'</div>';

		var todos = '<div class="todos">'+
						'<div class="filter col-md-6 col-md-offset-1 input-group input-group-sm">' +
								'<span class="input-group-addon"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>' +
								'<input type="text" class="tag-input form-control" placeholder="..." >' +
								'<span class="input-group-addon">' +
									'<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>' +
								'</span>' +
						'</div>'+
						'<span class="todo-status-container"><input class="todo-condition" type="checkbox">Показывать сделанные</span>'+
						'<div class="todo-list">'+
							'<div class="table-responsive">'+
								'<table class="table table-bordered table-hover"></table>'+
							'</div>'+
						'</div>'+
						'<input class="addNewToDo btn btn-defult  col-md-6 col-md-offset-3" type="button" value="Добавить">'+
					'</div>'

		$('<div class="todo-widget panel panel-default">'+todoGroups+todos).appendTo(this.root);


		this.toDoGroupsDom = $(this.root).find('.todo-groups-list>.list-group');
		this.toDoListDOM = $(this.root).find('.todos>.todo-list .table');
		this.lodeData();
	}

	//Инициализация списка todo групп
	ToDoWidget.prototype.initToDoGroups = function() {
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
	ToDoWidget.prototype.initToDoList = function(index, completed) {
		var todos = this.todoList[index]['tasks'];
		debugger;
		this.toDoListDOM.empty();
		//Инициализация заголовка
		
		this.toDoListDOM.append('<tr class="active" >' +
			'<th><span class=" glyphicon glyphicon-triangle-bottom aria-hidden="true""></span>Что нужно сделать</th>' +
			'<th><span class="glyphicon glyphicon-triangle-bottom aria-hidden="true""></span>Когда</th>' +
			'<th><span class="glyphicon glyphicon-triangle-bottom aria-hidden="true""></span>Сделано</th>' +
			'</tr>')
		//Bнициализация Html єлемента списка todo
		var drowTask = function (toDoListDOM, task){
				toDoListDOM.append('<tr><td>' + task['description'] +
					'</td><td>' + task['when'] +
					'</td><td>' + '<input class="todo-status" type="checkbox"'+ (task['done'] ? ' checked>' : '>') +
					'</td></tr>');
			}

		for (var i = 0; i < todos.length; i++) {
			if(completed){
				if(todos[i]['done']){
					drowTask(this.toDoListDOM, todos[i]);
				}
			}else{
				drowTask(this.toDoListDOM, todos[i]);
			}
		};
	}
//*********************************Обработка событий**********************************************************************
//Инициализация обработчиков событий.
ToDoWidget.prototype.initEvents = function() {
	
}


//*********************************Ajax***************************************************************************************
	//Загрузчик данных на клиент
	ToDoWidget.prototype.lodeData = function(){
		var _this = this;
		$.get('/todos/kuwkuw-list').then(function(resulte) {
			_this.todoList = resulte;
			_this.initToDoGroups();
			_this.toDoGroupsDom.find('li').eq(0).addClass('item-active');;
			_this.initToDoList(0);
		});
	}

	//загрузчик данных на сервер
	ToDoWidget.prototype.saveData = function() {
		$.ajax({
			url: '/todos/kuwkuw-list',
			method: 'PUT',
			data: {
				todo: JSON.stringify(this.todoList)
			},
		});
	}

	//Обновление имени todo группы
	ToDoWidget.prototype.updateGroupName = function(todoGruopIndex, newName) {
		this.todoList[todoGruopIndex]['title-todo-list'] = newName;
		this.saveToDoList();
	}

	//Добавение новой группы
	ToDoWidget.prototype.addNewGroupItem = function(toDoGroupName) {
		this.todoList.push({
			'title-todo-list': toDoGroupName,
			'created': Date.now(),
			'tasks': []
		});
		this.saveToDoList();
	}

	//Удаления todo группы
	ToDoWidget.prototype.deleteGroup = function(todoGruopIndex) {
		var t = this.todoList.splice(todoGruopIndex, 1);
		debugger;
		this.saveToDoList();
	}


	//Вывод сылки на класс на глобальный уровень
	window.ToDoWidget = ToDoWidget;
})()

