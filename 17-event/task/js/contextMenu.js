'use strict';

(function () {

    var ESC_KEYCODE = 27;

    /**
     * Declaration constructor
     */
    function ContextMenu (node, menuStructure) {
        var _this = this;
        this.root = node;
        this.menu = this._buildMenuMarkup(menuStructure);
        
        this.menu.classList.add('context-menu');
        document.body.appendChild(this.menu);
        this._eventHandler();
    }

    ContextMenu.prototype._buildMenuMarkup = function (structure) {
        var root = document.createElement('ul');
        for (var i = 0; i < structure.length; i += 1) {
            var item = document.createElement('li');
            item.appendChild(
                document.createTextNode(structure[i].title)
            );
            if (structure[i].submenu) {
                var iconSubmenu = document.createElement('span');
                iconSubmenu.classList.add('icon-submenu');
                item.appendChild(iconSubmenu);
                item.appendChild(this._buildMenuMarkup(structure[i].submenu));
            } else {
                item.addEventListener('click', structure[i].action, false);
            }
            root.appendChild(item);
        }
        return root;
    };

    ContextMenu.prototype._eventHandler = function () {
        var _this = this;
        
        this.root.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            _this.show(event.pageX, event.pageY);
        }, false);

        document.documentElement.addEventListener('click', function (event) {
            var target = event.target;
            while (target !== document) {
                if (target === _this.menu) {
                    return
                }
                target = target.parentNode;
            }
            _this.hide();
        }, false);

        document.documentElement.addEventListener('keyup', function (event) {
            if (event.keyCode === ESC_KEYCODE) {
                _this.hide();
            }
        }, false);
    };

    ContextMenu.prototype.show = function (x, y) {
        x = x || 0;
        y = y || 0;
        this.menu.style.top = y + 'px';
        this.menu.style.left = x + 'px';
        this.menu.style.display = 'block';
    };

    ContextMenu.prototype.hide = function () {
        this.menu.style.display = 'none';
    };

    /** Export to global level */
    window.ContextMenu = ContextMenu;
}());