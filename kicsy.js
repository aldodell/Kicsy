/**
 * Kicsy class base
 */
class Kicsy {

    static version = "0.0.1";
    static id = 0;
    /**
     * Generate the next unique ID.
     *
     * @return {number} The next unique ID.
     */
    static nextId() {
        // Increment the ID by 1 and return the new value.
        return "kicsy-" + ++Kicsy.id;
    }


    /**
     * Load and include multiple JavaScript modules.
     *
     * @param {...string} modules - The URLs of the modules to load.
     * @return {KicsyClass} - The current instance of the Kicsy class.
     */
    static load(...modules) {
        // Iterate over each module URL
        for (const module of modules) {
            // Create a new script element
            let script = document.createElement("script");

            // Set the source of the script to the module URL
            script.src = module;

            // Append the script to the document body
            document.body.appendChild(script);
        }

    }

}



class KicsyObject {

    _id;

    /**
     * KicsyObject constructor
     * 
     * This is the constructor of the KicsyObject class.
     * It generates a unique ID using Kicsy.nextId and assigns it to the #myId property.
     */
    constructor() {
        this.id = Kicsy.nextId();
    }

    get id() {
        return this._id;
    }
    /**
        * @param {string} str
        */
    set id(str) {
        this._id = str;
        if (this.dom != undefined) {
            this.dom.setAttribute("id", str);
        }
    }



    clone(className = KicsyObject) {
        let newObject = new className();
        let idNew = newObject.id;
        Object.assign(newObject, this);
        newObject.id = idNew;
        return newObject;
    }


}


class KicsyComponent extends KicsyObject {
    /** @type { HTMLElement } The DOM element of the component */
    dom;
    /**
     * Constructor for KicsyComponent class.
     *
     * @param {string} html - The HTML tag for the component.
     * @param {string} [type] - The type attribute for the component.
     * @param {...any} args - Additional arguments to pass to the constructor.
     * If any of the arguments is a function, it is called with the current instance as an argument.
     */
    constructor(html, type, ...args) {
        super(); // Call the constructor of the parent class

        try {
            // Create the DOM element for the component
            this.dom = document.createElement(html);
        } catch (e) {
            console.log(e);
        }

        // If a type attribute is provided, set it for the DOM element
        if (type != undefined) {
            this.dom.setAttribute("type", type);
        }

        this.dom.setAttribute("id", this.id);

        // If any of the additional arguments is a function, call it with the current instance as an argument
        for (const arg of args) {
            if (typeof arg == "function") {
                arg(this);
            }
        }

        // If the first argument is a string or a number, set the value of the DOM element
        if (typeof args[0] === "string"
            || typeof args[0] === "number"
        ) {
            this.setValue(args[0]);
        }

        // Set the kicsy property of the DOM element to the current instance
        this.dom.kicsyReference = this;
    }

    static build(html, type) {
        return new KicsyComponent(html, type)
    }


    /**
     * Set the value of the DOM element to the provided value.
     *
     * @param {string} value - The value to set.
     */
    setValue(value) {
        // Set the value of the DOM element to the provided value
        this.dom.value = value;
        return this;
    }

    /**
     * Get the value of the DOM element and call the provided callback function with the value as an argument.
     *
     * @param {function} callback - The callback function to call with the value.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    getValue(callback) {
        // Call the provided callback function with the value of the DOM element as an argument
        callback(this.dom.value);

        // Return the current instance of the KicsyComponent class
        return this;
    }

    /**
     * Add an event listener to the DOM element.
     *
     * @param {string} event - The event to listen for.
     * @param {function} callback - The callback function to call when the event is triggered.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    addEvent(event, callback) {
        // Add an event listener to the DOM element
        this.dom.addEventListener(event, callback);

        // Return the current instance of the KicsyComponent class
        return this;
    }


    /**
     * Remove an event listener from the DOM element.
     *
     * @param {string} event - The event to stop listening for.
     * @param {function} callback - The callback function to remove.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    removeEvent(event, callback) {
        // Remove the specified event listener from the DOM element
        this.dom.removeEventListener(event, callback);

        // Return the current instance of the KicsyComponent class
        return this;
    }

    /**
     * Adds a class to the DOM element.
     *
     * @param {string} className - The name of the class to add.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    addClass(className) {
        // Add the specified class to the DOM element
        this.dom.classList.add(className);

        // Return the current instance of the KicsyComponent class
        return this;
    }

    /**
     * Removes a class from the DOM element.
     *
     * @param {string} className - The name of the class to remove.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    removeClass(className) {
        // Remove the specified class from the DOM element
        this.dom.classList.remove(className);

        // Return the current instance of the KicsyComponent class
        return this;
    }

    /**
     * Sets the name attribute of the DOM element.
     * 
     * @param {string} name - The value of the name attribute.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    setName(name) {
        // Set the name attribute of the DOM element
        this.dom.setAttribute("name", name);

        // Return the current instance of the KicsyComponent class
        return this;
    }

    /**
     * Publishes the component to a specified surface element.
     * If no surface element is provided, it defaults to the body element.
     *
     * @param {HTMLElement} [surfaceElement] - The element to which the component will be appended.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    publish(surfaceElement) {
        // If no surface element is provided, default to the body element
        if (surfaceElement == undefined) {
            surfaceElement = document.body;
        }

        // Append the component's DOM element to the surface element
        surfaceElement.appendChild(this.dom);

        // Return the current instance of the KicsyComponent class
        return this;
    }

    /**
     * Calls the provided callback function with the current instance of the KicsyComponent class.
     *
     * @param {function} callback - The callback function to call with the current instance as an argument.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    getMe(callback) {

        // Call the provided callback function with the current instance as an argument
        callback(this);

        // Return the current instance of the KicsyComponent class
        return this;
    }


    clone(className = KicsyComponent) {
        let obj = super.clone(className);
        obj.dom = obj.dom.cloneNode(true);
        obj.dom.kicsyReference = obj;
        return obj;

    }

}


class KicsyVisualComponent extends KicsyComponent {

    /**
     * Constructor for KicsyVisualComponent class.
     *
     * @param {string} html - The HTML tag for the component.
     * @param {string} [type] - The type attribute for the component.
     * @param {...any} args - Additional arguments to pass to the KicsyComponent constructor.
     */
    constructor(html, type, ...args) {
        // Call the constructor of the parent class with the provided arguments
        super(html, type, ...args);
    }

    /**
     * Creates a new instance of KicsyVisualComponent with the provided arguments.
     *
     * @param {string} html - The HTML tag for the component.
     * @param {string} [type] - The type attribute for the component.
     * @param {...any} args - Additional arguments to pass to the constructor.
     * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
     */
    static build(html, type, ...args) {
        // Create a new instance of KicsyVisualComponent with the provided arguments
        return new KicsyVisualComponent(html, type, ...args);
    }

    /**
     * Adds the provided CSS text to the CSS style of the component's DOM element.
     *
     * @param {string} cssText - The CSS text to add to the style of the component.
     * @return {KicsyVisualComponent} - The current instance of the KicsyVisualComponent class.
     */
    addCssText(cssText) {
        // Concatenate the provided CSS text with the existing CSS text of the component's DOM element
        // and update the style of the component
        this.dom.style.cssText += ";" + cssText;

        // Return the current instance of the KicsyVisualComponent class
        return this;
    }

    /**
     * Sets the width and height of the component's DOM element.
     *
     * @param {number|string} width - The width of the component. If a number is provided, it is converted to a string and appended with "px".
     * @param {number|string} height - The height of the component. If a number is provided, it is converted to a string and appended with "px".
     * @return {KicsyVisualComponent} - The current instance of the KicsyVisualComponent class.
     */
    setSize(width, height) {

        // If a number is provided for width, convert it to a string and append "px"
        if (!isNaN(width)) {
            width = width + "px";
        }

        // If a number is provided for height, convert it to a string and append "px"
        if (!isNaN(height)) {
            height = height + "px";
        }

        // Set the width and height of the component's DOM element
        this.dom.style.width = width;
        this.dom.style.height = height;

        // Return the current instance of the KicsyVisualComponent class
        return this;

    }


    applyInlineBlockStyle() {
        this.dom.style.display = "inline-block";
        return this;
    }

    applyInlineStyle() {
        this.dom.style.display = "inline";
        return this;
    }

    clone(className = KicsyVisualComponent) {
        return super.clone(className);
    }

}

class KicsyVisualContainerComponent extends KicsyVisualComponent {

    /**
     * Appends the provided components to the container.
     *
     * @param {...KicsyVisualComponent} components - The components to be appended to the container.
     */
    add(...components) {
        // Iterate over each component
        for (const component of components) {
            // Append the component's DOM element to the container's DOM element
            this.dom.appendChild(component.dom);
        }
    }

    /**
     * Adds the provided CSS text to the CSS style of all children of the container.
     * Style is added to each child individually, wich are contained in the container's DOM element.
     *
     * @param {string} cssText - The CSS text to add to the style of the children.
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */
    addCssTextToChildren(cssText) {
        // Iterate over each child of the container's DOM element
        for (const child of this.dom.children) {
            // Concatenate the provided CSS text with the existing CSS text of the child and update the style of the child
            child.style.cssText += ";" + cssText;
        }
        // Return the current instance of the KicsyVisualContainerComponent class
        return this;
    }


    /**
     * Constructor for KicsyVisualContainerComponent class.
     *
     * @param {...KicsyVisualComponent} components - The components to be appended to the container.
     */
    constructor(...components) {
        // Call the constructor of the parent class with the "div" HTML tag
        super("div");

        // Append each component's DOM element to the container's DOM element
        this.add(...components);
    }



    clone(className = KicsyVisualContainerComponent) {
        let obj = super.clone(className);
        obj.dom = this.dom.cloneNode(false);
        for (let child of this.dom.children) {
            let c = child.kicsyReference.clone();
            obj.dom.appendChild(c.dom);
        }
        return obj;
    }
}

function KLayer(...args) {
    return new KicsyVisualContainerComponent(...args);
}


function KButton(...args) {
    return new KicsyVisualComponent("input", "button", ...args);
}

function KTextarea(...args) {
    return new KicsyVisualComponent("textarea", undefined, ...args);
}

function KCheckbox(...args) {
    return new KicsyVisualComponent("input", "checkbox", ...args);
}

function KColorPicker(...args) {
    return new KicsyVisualComponent("input", "color", ...args);
}

function KDate(...args) {
    return new KicsyVisualComponent("input", "date", ...args);
}

function KEmail(...args) {
    return new KicsyVisualComponent("input", "email", ...args);
}

function KFile(...args) {
    return new KicsyVisualComponent("input", "file", ...args);
}

function KHidden(...args) {
    return new KicsyVisualComponent("input", "hidden", ...args);
}

function KImage(...args) {
    return new KicsyVisualComponent("input", "image", ...args);
}

function KMonth(...args) {
    return new KicsyVisualComponent("input", "month", ...args);
}

function KNumber(...args) {
    return new KicsyVisualComponent("input", "number", ...args);
}

function KPassword(...args) {
    return new KicsyVisualComponent("input", "password", ...args);
}

function KRadio(...args) {
    return new KicsyVisualComponent("input", "radio", ...args);
}

function KRange(...args) {
    return new KicsyVisualComponent("input", "range", ...args);
}

function KReset(...args) {
    return new KicsyVisualComponent("input", "reset", ...args);
}

function KSearch(...args) {
    return new KicsyVisualComponent("input", "search", ...args);
}

function KSubmit(...args) {
    return new KicsyVisualComponent("input", "submit", ...args);
}

function KTel(...args) {
    return new KicsyVisualComponent("input", "tel", ...args);
}

function KText(...args) {
    return new KicsyVisualComponent("input", "text", ...args);
}

function KTime(...args) {
    return new KicsyVisualComponent("input", "time", ...args);
}

function KUrl(...args) {
    return new KicsyVisualComponent("input", "url", ...args);
}


function KDateTimeLocal(...args) {
    return new KicsyVisualComponent("input", "datetime-local", ...args);
}

