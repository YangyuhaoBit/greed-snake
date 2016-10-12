class Event {
    constructor() {
        this._event = {};
    }

    on(type, callback) {
        if (!this._event[type]) {
            this._event[type] = [];
        }
        this._event[type].push(callback);
    }

    off(type, callback) {
        if (!this._event[type]) {
            return;
        }
        this._event[type] = this._event[type].filter((item)=> {
            return item != callback;
        })
    }

    emit(type, ...params) {
        if (!this._event[type]) {
            return;
        }
        this._event[type].forEach((callback)=> {
            callback.apply(this, params);
        })
    }
}
