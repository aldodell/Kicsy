/**
 * Base class for all Kicsy components
 */
class KicsyObject {
    static #_id = 0;
    static get mainNode() { return document.body; }
    static get id() { return "K" + this.#_id++; }
}

/**
 * Base class for all Kicsy visual components
 */
class KicsyView extends KicsyObject {
    // The DOM element for the component
    dom;
    parentNode;

    newView(htmlTag, type, parentNode) {
        let obj = new KicsyView();
        obj.dom = document.createElement(htmlTag);
        if (type != undefined) obj.dom.setAttribute("type", type);
        obj.dom.setAttribute("id", KicsyObject.id);
        obj.parentNode = parentNode == undefined ? KicsyObject.mainNode : parentNode;
        obj.parentNode.appendChild(obj.dom);
        return obj;

    }

    /**
     * Sets the value of the DOM element to the provided value.
     * 
     * @param {string} value - The value to set.
     * @return {KicsyView} - The current instance of the KicsyView class.
     */
    setValue(value) {
        this.dom.value = value; return this;
    }

    /**
     * Gets the value of the DOM element and calls the provided callback function with the value.
     * If no callback function is provided, it returns the value instead.
     * 
     * @param {function} [callback] - The callback function to call with the value. If not provided, the value is returned.
     * @return {any|KicsyView} - The value of the DOM element if no callback function is provided. Otherwise, the current instance of the KicsyView class.
     */
    getValue(callback) {
        if (callback) {
            callback(this.dom.value);
            return this;
        }
        return this.dom.value;
    }

    /**
     * Adds an event listener to the DOM element.
     * 
     * @param {string} event - The event to listen for.
     * @param {function} callback - The callback function to call when the event occurs.
     * @return {KicsyView} - The current instance of the KicsyView class.
     */
    addEvent(event, callback) { this.dom.addEventListener(event, callback); return this; }

    /**
     * Removes an event listener from the DOM element.
     * 
     * @param {string} event - The event to remove.
     * @param {function} callback - The callback function to remove.
     * @return {KicsyView} - The current instance of the KicsyView class.
     */
    removeEvent(event, callback) { this.dom.removeEventListener(event, callback); return this; }

    /**
     * Add css style to the DOM element
     */
    addCssText(cssText) { this.dom.style.cssText += ";" + cssText; return this; }

    /**
     * Add a simple border to the DOM element
     * @returns {KicsyView}
     */
    get bordered() { this.dom.style.border = "1px solid black"; return this; }

    /**
     * Add a simple shadow to the DOM element
     * @returns {KicsyView}
     */
    get shadowed() { this.dom.style.boxShadow = "0 0 5px black"; return this; }


}

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type text
 */
Object.defineProperty(KicsyView.prototype, 'Text', {
    get: function () {
        return this.newView("input", "text", this.parentNode);
    }
})


/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type button
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyView.prototype, 'Button', {
    get: function () {
        return this.newView("input", "button", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type layer (DIV)
 * 
 * @type {KicsyView}
 */
Object.defineProperty(KicsyView.prototype, 'Layer', {
    get: function () {
        let obj = this.newView("div", undefined, this.parentNode);
        obj.setValue = function (value) {
            obj.dom.innerHTML = value;
            return obj;
        }
        obj.getValue = function (callback) {
            if (callback) {
                callback(obj.dom.innerHTML);
                return obj;
            } else {
                return obj.dom.innerHTML;
            }
        }

        obj.add = function (callback) {
            let temp = obj.parentNode;
            obj.parentNode = this.dom;
            callback(obj);
            obj.parentNode = temp;
            return obj;
        }

        return obj;
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type label
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyView.prototype, 'Label', {
    get: function () {
        let obj = this.newView("label", undefined, this.parentNode);
        obj.setValue = function (value) {
            obj.dom.innerText = value;
            return obj;
        }
        obj.getValue = function (callback) {
            if (callback) {
                callback(obj.dom.innerText);
                return obj;
            } else {
                return obj.dom.innerText;
            }
        }

        return obj;
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type Date
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyView.prototype, 'Date', {
    get: function () {
        return this.newView("input", "date", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type Email
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyView.prototype, 'Email', {
    get: function () {
        return this.newView("input", "email", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type File
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyView.prototype, 'File', {
    get: function () {
        return this.newView("input", "file", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type Password
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyView.prototype, 'Password', {
    get: function () {
        return this.newView("input", "password", this.parentNode);
    }
})


/********************  MESSAGES ********************/



/**
 * Base class for all Kicsy messages
 */
class KicsyMessage extends KicsyObject {
    source;
    detination;
    author;
    destinatary;
    action;
    payload;
    server = false;

    send(server = false) {

    }
}


