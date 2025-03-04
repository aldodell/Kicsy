class KicsyObject {
    static #_id = 0;
    static get id() { return "K" + this.#_id++; }
    static get mainNode() { return document.body; }
}

var _ = new KicsyObject();

KicsyObject.prototype.component = function (html, type, parentNode = KicsyObject.mainNode) {
    let obj = new KicsyObject();
    obj.dom = document.createElement(html);
    if (type != undefined) obj.dom.setAttribute("type", type);
    obj.dom.setAttribute("id", KicsyObject.id);
    obj.parentNode = parentNode;
    obj.parentNode.appendChild(obj.dom);
    return obj;
}

KicsyObject.prototype.setValue = function (value) { this.dom.value = value; return this; }

KicsyObject.prototype.getValue = function (callback) {
    if (callback) {
        callback(this.dom.value);
        return this;
    }
    return this.dom.value;
}

KicsyObject.prototype.setName = function (name) { this.dom.setAttribute("name", name); return this; }


KicsyObject.prototype.addEvent = function (eventName, callback) {
    this.dom.addEventListener(eventName, callback);
    return this;
}

KicsyObject.prototype.removeEvent = function (eventName, callback) {
    this.dom.removeEventListener(eventName, callback);
    return this;
}

KicsyObject.prototype.getMe = function (callback) { callback(this); return this; }


Object.defineProperty(_, "Text", {
    get: () => {
        let obj = _.component("input", "text");
        return obj;
    }
});

Object.defineProperty(_, "Button", {
    get: () => {
        let obj = _.component("input", "button");
        return obj;
    }
});

Object.defineProperty(_, "Layer", {
    get: () => {
        let obj = _.component("div");
        obj.setValue = function (value) { this.dom.innerText = value; return this; }
        obj.getValue = function (callback) {
            if (callback) {
                callback(this.dom.innerText);
                return this;
            }
            return this.dom.innerText;
        }

        obj.add = function (callback) {
            let obj = this;
            obj.parentNode = this.dom;
            callback(obj);
            return this;
        }
        return obj;
    }
});
