'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    "use strict";

    console.log('thisIsTagManager');

    var TagManager = function () {
        function TagManager(name) {
            _classCallCheck(this, TagManager);

            this.name = name;
        }

        _createClass(TagManager, [{
            key: 'sayName',
            value: function sayName() {
                console.log('ThisIsTagManager' + this.name);
            }
        }]);

        return TagManager;
    }();

    var tagManager = new TagManager('Class');
    tagManager.sayName();
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhZy5tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIiQiLCJjb25zb2xlIiwibG9nIiwiVGFnTWFuYWdlciIsIm5hbWUiLCJ0YWdNYW5hZ2VyIiwic2F5TmFtZSIsImpRdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUMsV0FBVUEsQ0FBVixFQUFhO0FBQ1Y7O0FBRUFDLFlBQVFDLEdBQVIsQ0FBWSxrQkFBWjs7QUFIVSxRQUtKQyxVQUxJO0FBTU4sNEJBQWFDLElBQWIsRUFBbUI7QUFBQTs7QUFDZixpQkFBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0g7O0FBUks7QUFBQTtBQUFBLHNDQVVLO0FBQ1BILHdCQUFRQyxHQUFSLENBQVkscUJBQXFCLEtBQUtFLElBQXRDO0FBQ0g7QUFaSzs7QUFBQTtBQUFBOztBQWVWLFFBQU1DLGFBQWEsSUFBSUYsVUFBSixDQUFlLE9BQWYsQ0FBbkI7QUFDQUUsZUFBV0MsT0FBWDtBQUNILENBakJBLEVBaUJDQyxNQWpCRCxDQUFEIiwiZmlsZSI6InRhZy5tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBjb25zb2xlLmxvZygndGhpc0lzVGFnTWFuYWdlcicpO1xuXG4gICAgY2xhc3MgVGFnTWFuYWdlciB7XG4gICAgICAgIGNvbnN0cnVjdG9yIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgc2F5TmFtZSAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVGhpc0lzVGFnTWFuYWdlcicgKyB0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGFnTWFuYWdlciA9IG5ldyBUYWdNYW5hZ2VyKCdDbGFzcycpO1xuICAgIHRhZ01hbmFnZXIuc2F5TmFtZSgpO1xufShqUXVlcnkpKTtcbiJdfQ==
