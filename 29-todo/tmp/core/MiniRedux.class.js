class MiniRedux {

    constructor () {
        console.log('MiniRedux started');
    }

    createStore (reducer, initState) {
        this.currentReducer = reducer;
        this.currentState = initState;
        this.listener = () => {};
    }

    getState () {
        return this.currentState;
    }

    dispatcher (action) {
        this.currentState = this.currentReducer(this.currentState, action);
        this.listener();
        return action;
    }

    subscribe (newListener) {
        this.listener = newListener;
    }
}
