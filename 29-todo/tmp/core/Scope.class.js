class Scope {
    constructor () {
        this._watchers = [];
        this._asyncQueue = [];
        this._postDigestQueue = [];
        this._phase = null;
    }

    watch (watchFn, listenerFn = () => {}, valueEq = false) {
        let _self = this,
            watcher = {
                watchFn: watchFn,
                listenerFn: listenerFn,
                valueEq: valueEq
            };

        this._watchers.push(watcher);

        return () => {
            let index = this._watchers.indexOf(watcher);
            if (index >= 0) {
                _self._watchers.splice(index, 1);
            }
        }
    }

    digest () {
        const TTL = 10;
        let dirty = false, i = 0;

        this.beginPhase("digest");

        do {

            while (this._asyncQueue.length) {
                try {
                    let asyncTask = this._asyncQueue.shift();
                    this.eval(asyncTask.expression);
                } catch (e) {
                    (console.error || console.log)(e);
                }
            }

            dirty = this._digestOnce();
            i += 1;
            if (dirty && i >= TTL) {
                this.clearPhase();
                throw `${TTL} digest iterations reached`;
            }
        } while (dirty);

        this.clearPhase();

        while (this._postDigestQueue.length) {
            try {
                this._postDigestQueue.shift()();
            } catch (e) {
                (console.error || console.log)(e);
            }
        }
    }

    _postDigest (fn) {
        this._postDigestQueue.push(fn);
    }

    eval (expr, locals) {
        return expr(this, locals);
    }

    evalAsync (expr) {
        let _self = this;

        if (!this._phase && !this._asyncQueue.length) {
            setTimeout(() => {
                if (_self._asyncQueue.length) {
                    _self.digest();
                }
            }, 0);
        }

        this._asyncQueue.push({
            scope: this,
            expression: expr
        });
    }

    apply (expr) {
        try {
            this.beginPhase("apply");
            return this.eval(expr);
        } finally {
            this.clearPhase();
            this.digest();
        }
    }

    beginPhase (phase) {
        if (this._phase) {
            throw `${this._phase} already in progress`
        }
        this._phase = phase;
    }

    clearPhase () {
        this._phase = null;
    }

    _digestOnce () {
        let _self = this,
            dirty = false;
        _.forEach(this._watchers, watch => {
            try {
                let newValue = watch.watchFn(_self),
                    oldValue = watch.last;

                if (!_self._areEqual(newValue, oldValue, watch.valueEq)) {
                    watch.listenerFn(newValue, oldValue, _self);
                    dirty = true;
                }

                watch.last = (watch.valueEq ? _.cloneDeep(newValue) : newValue);
            } catch (e) {
                (console.error || console.log)(e)
            }
        });
        return dirty;
    }

    _areEqual (newValue, oldValue, valueEq) {
        if (valueEq) {
            return _.isEqual(newValue, oldValue);
        } else {
            return newValue === oldValue
                || (typeof newValue === "number" && oldValue === "number" && isNaN(newValue) && isNaN(oldValue));
        }
    }
}
