(function ($) {
    'use strict';

    function SimpleSlider (selector) {
        var _ss,
            $root = $(selector),
            $controls = $root.find('.js-control'),
            $slides = $root.find('.js-slides'),
            _activeSlide = 0,
            _autoPlayTimeoutIndex;

        return {
            init: function () {
                _ss = this;
                this.setSlide(_activeSlide);
                this._eventListeners();
                this._setAutoPlay();
            },

            nextSlide: function () {
                _ss.setSlide($controls[_activeSlide + 1] ? _activeSlide + 1 : 0);
                _ss._setAutoPlay();
            },

            prevSlide: function () {},

            _eventListeners: function () {
                this._clickControls();
            },

            _clickControls: function () {

                $root.on('click', '.js-control', function () {
                    var $this = $(this),
                        index = $this.data('index');

                    _ss.setSlide(index);
                    clearTimeout(_autoPlayTimeoutIndex);
                    setTimeout(_ss._setAutoPlay, 4000);

                });
            },

            _setAutoPlay: function () {
                _autoPlayTimeoutIndex = setTimeout(_ss.nextSlide, 2000);
            },


            setSlide: function (index) {
                index = index || 0;

                $controls.eq(_activeSlide).removeClass('active');
                _activeSlide = index;
                $controls.eq(index).addClass('active');
                $slides.animate({
                    marginLeft: -(910 * index) + 'px'
                }, 1000, 'easeInOutExpo');
            }
        };
    }

    window.SimpleSlider = SimpleSlider;
}(jQuery));