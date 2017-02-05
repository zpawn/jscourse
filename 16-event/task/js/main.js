/**
 * Реализовать ContextMenu
 * 
 * - первый аргумент - узел на котором будет работать контекстное меню
 * - второй аргумент - описание структуры меню. Пример описания прикладывается. Структура может 
 *   быть любой по вложенности и количеству элементов меню. (рекурсивно генерировать DOM будет ок)
 * - подменю может содержать вложенные подменю
 * - при правом клике по узлу, для которого было создано ContextMenu показывать меню прямо под местом клика.
 * - при клике по пункту меню должна выполняться соответствующая функция
 * - каждый элемент, содержащий подменю, должен быть отмечен ">" символом
 * - подменю открывается при наведении на пункт подменю, и закрывается при уходе мышки с подменю или 
 *   пункта подменю (смотри события mouseenter и mouseleave)
 * - с позиционированием (чтобы все меню и подменю вмещались в видимую часть экрана) можно не заморачиваться
 * - стилизовать меню можно на свой вкус (главное - видимые границы элементов)
 * 
 * @see: https://www.sitepoint.com/building-custom-right-click-context-menu-javascript/
 
var menuExample = [{
	title: 'File',
	action: function () {console.log('open file')}
}, {
	title: 'Edit',
	action: function () {console.log('edit content')}
}, {
	title: 'More stuff',
	submenu: [{
		title: 'Send by email',
		action: function () {console.log('emailed')}
	}, {
		title: 'Send via skype',
		action: function () {console.log('skyped')}
	}]
}]
 */

/*
<nav class="menu">
    <ul class="context-menu">
        <li class="item"><a href="#">item 1</a></li>
        <li class="item">
            <a href="#">item 2</a>
            <ul class="sub-menu">
                <li class="item"><a href="#">sub item 1</a></li>
                <li class="item"><a href="#">sub item 2</a></li>
                <li class="item"><a href="#">sub item 3</a></li>
            </ul>
        </li>
    </ul>
</nav>
*/
var menuParams = [{
	title: 'File',
	action: function () {console.log('open file')}
}, {
	title: 'Edit',
	action: function () {console.log('edit content')}
}, {
	title: 'More stuff',
	submenu: [{
		title: 'Send by email',
		action: function () {console.log('emailed')}
	}, {
		title: 'Send via skype',
		action: function () {console.log('skyped')}
	}]
}]

var contextMenu = (function () {
	var menu,
		params = {};
	return {
		init: function (context, _params) {
			params = _params || {};
			this.createMenu();
			this.contextOnClick(context);
		},
		getMenu: function () {
			return menu;
		},
		createMenu: function () {
			menu = document.createElement('nav');
			menu.classList.add('menu');

			var menuItems = this.createMenuItems(params);
			menu.appendChild(menuItems);
		},
		createMenuItems: function (itemsParams, isSubmenu) {
			var items = document.createElement('ul'),
				itemsClass = isSubmenu ? 'sub-menu' : 'context-menu';
			
			for (var i = 0; i < itemsParams.length; i += 1) {
				var submenu = false;
				if (itemsParams[i].submenu !== undefined) {
					var submenu = this.createMenuItems(itemsParams[i].submenu, true);
				}
				var item = this.generateItem(itemsParams[i], submenu);
				
				items.classList.add(itemsClass);
				items.appendChild(item);
			}

			return items;
		},
		generateItem: function (itemParams, submenu) {
			var item = document.createElement('li'),
				itemLink = document.createElement('a'),
				itemLinkText = document.createTextNode(itemParams.title);
				
			itemLink.href = '#';
			itemLink.appendChild(itemLinkText);
			item.appendChild(itemLink);
			item.classList.add('item');

			if (itemParams.action !== undefined && typeof itemParams.action == 'function') {
				item.addEventListener('click', itemParams.action, false);
			}

			if (submenu !== false) {
				var submenuIcon = document.createElement('i');
				submenuIcon.classList.add('icon-submenu');
				itemLink.appendChild(submenuIcon);
				item.appendChild(submenu);
			}

			return item;
		},
		contextOnClick: function (contextSelector) {
			var menu = this.getMenu();
			var context = document.querySelector(contextSelector);
			context.addEventListener('contextmenu', function (event) {
				event.preventDefault();

				menu.style.top = event.pageY + 'px';
				menu.style.left = event.pageX + 'px';
				context.appendChild(menu);
			}, false);
		}
	}
}());

contextMenu.init('.header', menuParams);