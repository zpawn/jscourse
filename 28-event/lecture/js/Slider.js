(function ($) {
    'use strict';

    function SimpleSlider (selector) {
        let _ss,
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

                return _ss;
            },

            nextSlide: function () {
                if ($controls[_activeSlide + 1]) {
                    _ss.setSlide(_activeSlide + 1);
                } else {
                    _ss.setSlide(0);
                    $(document).trigger('startEndLoop', this);
                }
                _ss._setAutoPlay();
            },

            prevSlide: function () {},

            _eventListeners: function () {
                this._clickControls();
            },

            _clickControls: function () {

                $root.on('click', '.js-control', function () {
                    let $this = $(this),
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

                $(_ss).trigger('start-animation', index);

                $slides.animate({
                    marginLeft: -(910 * index) + 'px'
                }, 1000, 'easeInOutExpo');

                $(_ss).trigger('end-animation', index);
            }
        };
    }

    window.SimpleSlider = SimpleSlider;
}(jQuery));
