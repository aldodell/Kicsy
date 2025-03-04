/**
 * Base class for all Kicsy components
 */
class KicsyObject {
    /**
     * Creates a new instance of the KicsyObject class or its subclasses.
     */
    static get new() { return new this(); }
}


/**
 * The kernel for Kicsy framework. Store important information and objects for the framework.
*/
class KicsyKernel extends KicsyObject {
    static applications = [];
    static version = "1.0.0";
    static async loadModules(modules, finishCallback) {

        const requestOptions = {
            method: "POST"
        };

        for (let url of modules) {
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const responseText = await response.text();
                eval(responseText);
            }
        }

        if (finishCallback) {
            finishCallback();
        }
    }
}

/**
 * Base class for all Kicsy visual components
 */
class KicsyView extends KicsyObject {

    // Static properties
    static #_id = 0; // Counter for generating unique IDs
    static get mainNode() { return document.body; } // The main node for the component
    static get id() { return "K" + this.#_id++; } // The unique ID for the component

    // The DOM element for the component
    dom;

    // The parent node for the component
    parentNode = KicsyView.mainNode;

    //static get new() { return new KicsyView(); }

    /**
     * Creates a new instance of KicsyView with the provided HTML tag and optionally a type attribute.
     *
     * @param {string} htmlTag - The HTML tag for the component.
     * @param {string} [type] - The type attribute for the component.
     * @param {Node} [parentNode] - The parent node for the component.
     * @returns {KicsyView} - The newly created KicsyView instance.
     */
    newView(htmlTag, type, parentNode) {
        let obj = new KicsyView();
        obj.dom = document.createElement(htmlTag);
        if (type != undefined) obj.dom.setAttribute("type", type);
        obj.dom.setAttribute("id", KicsyView.id);
        obj.parentNode = parentNode == undefined ? KicsyView.mainNode : parentNode;
        obj.parentNode.appendChild(obj.dom);
        return obj;
    }

    addCssText(cssText) { this.dom.style.cssText += ";" + cssText; return this; }

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
    addBorder(width = "1px", color = "black", style = "solid", radius = "1px") {
        this.dom.cssText += ";border:" + width + " " + style + " " + color + ";border-radius:" + radius;
        return this;
    }

    /**
     * Add a simple shadow to the DOM element
     * @returns {KicsyView}
     */
    addShadow(color = "black", ofsetX = "0px", ofsetY = "0px", blur = "10px", spreadBlur = "0px") { this.dom.style.cssText += `;box-shadow: ${color} ${ofsetX} ${ofsetY} ${blur} ${spreadBlur}`; return this; }

    addMargins(left = "0px", top = "0px", right = "0px", bottom = "0px") { this.dom.style.cssText += `;margin:${top} ${right} ${bottom} ${left}`; return this; }

    addMargin(size = "1px") { this.dom.style.cssText += `;margin:${size}`; return this; }

    addPadding(size = "1px") { this.dom.style.cssText += `;padding:${size}`; return this; }

    get spreadedWidth() { this.dom.style.cssText += "position:absolute;left:0px;right:0px"; return this; }

    get spreadedHeight() { this.dom.style.cssText += "position:absolute;top:0px;bottom:0px"; return this; }

    constructor() {
        super();
        return this;
    }
}



/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type text
 */
Object.defineProperty(KicsyObject.prototype, 'Text', {
    get: function () {
        return this.newView("input", "text", this.parentNode);
    }
})


/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type button
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyObject.prototype, 'Button', {
    get: function () {
        return this.newView("input", "button", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type layer (DIV)
 * 
 * @type {KicsyView}
 */
Object.defineProperty(KicsyObject.prototype, 'Layer', {
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

        obj.toRow = get function (){
            obj.dom.style.cssText += ";display:block;";
            return this;
        }

        return obj;
    }
})





/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type label
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyObject.prototype, 'Label', {
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
Object.defineProperty(KicsyObject.prototype, 'Date', {
    get: function () {
        return this.newView("input", "date", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type Email
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyObject.prototype, 'Email', {
    get: function () {
        return this.newView("input", "email", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type File
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyObject.prototype, 'File', {
    get: function () {
        return this.newView("input", "file", this.parentNode);
    }
})

/**
 * Create a property on KicsyView that returns a new instance of KicsyView of type Password
 *
 * @type {KicsyView}
 */
Object.defineProperty(KicsyObject.prototype, 'Password', {
    get: function () {
        return this.newView("input", "password", this.parentNode);
    }
})

Object.defineProperty(KicsyObject.prototype, 'Select', {
    get: function () {
        return this.newView("select", undefined, this.parentNode);
    }
})

Object.defineProperty(KicsyObject.prototype, 'Option', {
    get: function () {
        return this.newView("option", undefined, this.parentNode);
    }
})

Object.defineProperty(KicsyObject.prototype, 'TextArea', {
    get: function () {
        return this.newView("textarea", undefined, this.parentNode);
    }
})

Object.defineProperty(KicsyObject.prototype, 'Image', {
    get: function () {
        return this.newView("img", undefined, this.parentNode);
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
    method = "POST";


    /**
     * Creates a new instance of KicsyMessage with the given arguments.
     *
     * @param {string} [source=""] - The source app of the message.
     * @param {string} [target=""] - The target app of the message.
     * @param {string} [author=""] - The author of the message.
     * @param {string} [destinatary=""] - The destinatary of the message.
     * @param {string} [action=""] - The action of the message.
     * @param {object} [payload={}] - The payload of the message.
     * @return {KicsyMessage} - The newly created KicsyMessage instance.
     */
    static new(source = "", target = "", author = "", destinatary = "", action = "", payload = {}) {
        return new KicsyMessage(source, target, author, destinatary, action, payload);
    }

    constructor(source = "", target = "", author = "", destinatary = "", action = "", payload = {}) {
        super();
        this.setSource(source);
        this.setTarget(target);
        this.setAuthor(author);
        this.setDestinatary(destinatary);
        this.setAction(action);
        this.setPayload(payload);
    }


    setSource(source) { this.source = source; return this; }
    setTarget(target) { this.target = target; return this; }
    setAuthor(author) { this.author = author; return this; }
    setDestinatary(destinatary) { this.destinatary = destinatary; return this; }
    setAction(action) { this.action = action; return this; }
    setPayload(payload) { this.payload = payload; return this; }

    /**
     * Sends the message to a given URL or to the target application.
     * 
     * If the URL is "this", the message is sent to the target application.
     * If the URL is a valid URL, the message is sent to that URL using the fetch API.
     * If the callback is specified, it is called with the response text.
     * If the callback is not specified, the response text is returned.
     * 
     * @param {string} url - The URL to send the message to.
     * @param {function} callback - The callback function to call with the response text.
     * @return {KicsyMessage} The current instance of the message.
     */
    send(url = "this", callback = null) {
        if (url == "this") {
            KicsyKernel.applications.forEach(app => {
                if (app.name === this.target) {
                    let r = app.processMessage(this);
                    if (callback) { callback(r) };
                }
            })

        } else {
            const formData = new FormData();

            formData.append("message", JSON.stringify(this));

            const requestOptions = {
                method: this.method,
                body: formData
            };

            if (!window.navigator.onLine) {
                alert("No internet connection");
                return Promise.reject(0);
            }

            return async function processResponse(url, requestOptions) {
                const response = await fetch(url, requestOptions);
                if (response.ok) {
                    const responseText = await response.text();
                    if (callback) { callback(responseText) } else { return responseText; }

                } else {
                    return Promise.reject(response.status);
                }
            }(url, requestOptions);
        }
        return this;
    }
}


