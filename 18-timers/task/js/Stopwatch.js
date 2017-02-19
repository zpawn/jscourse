(function () {
    'use strict';

    var KEYCODE_LAP = 76;
    var KEYCODE_RESET = 82;
    var KEYCODE_START_STOP = 83;

    function Stopwatch (node) {
        this.root = document.querySelector(node);
        this.isStart = false;
        this.startPoint = 0;
        this.stopDelay = 0;

        this._init();
    }

    Stopwatch.prototype._init = function () {
        this._generateControls();
        this._generateTimerBoard();
        this._generateLaps();
        this._eventHandler();
    };

    Stopwatch.prototype._generateControls = function () {
        this.controls = document.createElement('div');
        this.controls.className = 'stopwatch-controls btn-group btn-group-justified';

        this.controls.appendChild(this._generateControlBtn('success', 'toggle', 'Start'));
        this.controls.appendChild(this._generateControlBtn('info', 'lap', 'Lap'));
        this.controls.appendChild(this._generateControlBtn('danger', 'reset', 'Reset'));

        this.root.appendChild(this.controls);
    };

    Stopwatch.prototype._generateControlBtn = function (color, action, text) {
        var btnWrap = document.createElement('div');
        var btn = document.createElement('button');
        btnWrap.className = 'btn-group btn-group-lg';
        btn.className = 'btn btn-' + color;
        btn.setAttribute('data-action', action);
        btn.innerText = text;
        btnWrap.appendChild(btn);
        return btnWrap;
    };

    Stopwatch.prototype._generateTimerBoard = function () {
        this.timerBoard = document.createElement('h1');
        this.timerBoard.className = 'stopwatch-current text-center';
        this.timerBoard.innerText = '00:00:00:000';
        this.root.appendChild(this.timerBoard);
    };

    Stopwatch.prototype._generateLaps = function () {
        this.laps = document.createElement('div');
        this.laps.className = 'stopwatch-laps';
        this.root.appendChild(this.laps);
    };

    Stopwatch.prototype._generateLap = function () {
        var now = Date.now() - this.startPoint;

        if (!this.isStart) {
            now = this.stopDelay - this.startPoint;
        }

        var nowText = (this.startPoint === 0)
            ? '00:00:00:000'
            : getDate(now).hour() + ':' +
                getDate(now).minutes() + ':' +
                getDate(now).seconds() + ':' +
                getDate(now).ms();
        var lap = document.createElement('div');
        lap.className = 'alert alert-info';
        lap.innerText = nowText;
        var lapBtn = document.createElement('button');
        lapBtn.className = 'close';
        lapBtn.innerHTML = '&times;';
        lap.appendChild(lapBtn);
        return lap;
    };

    Stopwatch.prototype._eventHandler = function () {
        var self = this;

        this.controls.addEventListener('click', function (event) {
            var action = event.target.getAttribute('data-action');
            if (action && self[action]) {
                self[action](event.target);
            }
        }, false);

        this.laps.addEventListener('click', function (event) {
            if (event.target.classList.contains('close')) {
                event.target.parentNode.remove();
            }
        }, false);

        document.documentElement.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case KEYCODE_LAP:           self.lap();     break;
                case KEYCODE_RESET:         self.reset();   break;
                case KEYCODE_START_STOP:    self.toggle();  break;
            }
        }, false);
    };

    Stopwatch.prototype.toggle = function () {
        if (this.isStart) {
            this.stop();
        } else {
            this.start();
        }
    };

    Stopwatch.prototype.start = function () {

        var btn = this.controls.querySelector('[data-action=toggle]');
        btn.innerText = 'Stop';
        btn.classList.add('stop');

        this.isStart = true;
        var currentTimestamp = Date.now();

        if (this.startPoint === 0) {
            this.startPoint = currentTimestamp;
        }

        if (this.stopDelay !== 0) {
            this.startPoint = this.startPoint + (currentTimestamp - this.stopDelay);
            this.stopDelay = 0;
        }

        this.intervalIndex = setInterval(function () {
            var now = Date.now() - this.startPoint;
            this.timerBoard.innerText = getDate(now).hour() + ':' +
                getDate(now).minutes() + ':' +
                getDate(now).seconds() + ':' +
                getDate(now).ms();
        }.bind(this), 16);
    };

    Stopwatch.prototype.stop = function () {
        var btn = this.controls.querySelector('[data-action=toggle]');
        btn.innerText = 'Start';
        btn.classList.remove('stop');
        this.isStart = false;
        this.stopDelay = Date.now();
        clearInterval(this.intervalIndex);
    };

    Stopwatch.prototype.lap = function () {
        this.laps.insertBefore(this._generateLap(), this.laps.firstChild);
    };

    Stopwatch.prototype.reset = function () {
        clearInterval(this.intervalIndex);
        this.stop();
        this.startPoint = 0;
        this.stopDelay = 0;
        while (this.laps.hasChildNodes()) {
            this.laps.removeChild(this.laps.firstChild);
        }
        this.timerBoard.innerText = '00:00:00:000';
    };

    window.Stopwatch = Stopwatch;
}());