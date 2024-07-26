/**
 * @file Kicsy JS library
 * This is the main library of the Kicsy JS library. It contains the Kicsy class and the KicsyObject class.
 * This framework was developed intended to be used in Kicsy projects and increase 
 * the productivity of the developers.
 * Was developed with functional and lamda paradigm.
 * 
 * @author Aldo Dell Uomini <aldodell@gmail.com>
 * @version 0.0.1
 */





/**
 * Kicsy class base
 */
class Kicsy {

    static version = "0.0.1";


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


    /**
     * Creates a shallow clone of the current object.
     *
     * @param {KicsyObject} [className=KicsyObject] - The class of the object to clone. Defaults to the class of the current object.
     * @return {KicsyObject} - The cloned object.
     */
    clone(className = KicsyObject) {
        // Create a new object with the same prototype as the provided class
        let obj = Object.create(className.prototype);

        // Copy the properties of the current object to the new object
        Object.assign(obj, this);

        // Return the cloned object
        return obj;
    }


}


class KicsyComponent extends KicsyObject {
    /** 
     * The DOM element of the component 
     * @type { HTMLElement } */
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

        //Save reference for clone
        this.dom.events = [];

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


        //Set autoreference
        this.dom.kicsy = this;

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
     * If no callback function is provided, it returns the value instead.
     *
     * @param {function} [callback] - The callback function to call with the value.
     * @return {any|KicsyComponent} - If no callback function is provided, it returns the value of the DOM element.
     * Otherwise, it returns the current instance of the KicsyComponent class.
     */
    getValue(callback) {

        // If no callback function is provided, return the value of the DOM element
        if (callback == undefined) {
            return this.dom.value;
        } else {
            // Call the provided callback function with the value of the DOM element as an argument
            callback(this.dom.value);

            // Return the current instance of the KicsyComponent class
            return this;
        }
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

        //Save reference for clone
        this.dom.events.push({ "event": event, "callback": callback });

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

    clone(className = KicsyVisualComponent) {
        let obj = super.clone(className);
        obj.dom = this.dom.cloneNode(true);
        for (let e of this.dom.events) {
            obj.dom.addEventListener(e.event, e.callback);
        }
        obj.dom.kicsy = obj;
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
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */
    add(...components) {
        // Iterate over each component
        for (const component of components) {
            // Append the component's DOM element to the container's DOM element
            this.dom.appendChild(component.dom);
        }
        return this;
    }

    /**
     * Adds the provided CSS text to the CSS style of all children of the container.
     * Style is added to each child individually, wich are contained in the container's DOM element.
     * Must be used after children have been appended to the container.
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


    /**
     * Creates a deep clone of the container, including all child components.
     *
     * @param {KicsyVisualContainerComponent} [className=KicsyVisualContainerComponent] - The class of the object to clone. Defaults to KicsyVisualContainerComponent.
     * @return {KicsyVisualContainerComponent} - The cloned container.
     */
    clone(className = KicsyVisualContainerComponent) {

        /**
         * Recursively clones the DOM structure of the source element and appends the clones to the target element.
         *
         * @param {HTMLElement} source - The element to clone.
         * @param {HTMLElement} target - The element to append the clones to.
         */
        function deepClone(source, target) {
            for (let child of source.childNodes) {
                let cloneChild = child.cloneNode(false);
                cloneChild.kicsy = child.kicsy;

                // Copy events from source to clone
                if (child.events != undefined) {
                    cloneChild.events = child.events;

                    for (let e of child.events) {
                        cloneChild.addEventListener(e.event, e.callback);
                    }
                }

                target.appendChild(cloneChild);
                deepClone(child, cloneChild);
            }
        }

        let domClone = this.dom.cloneNode(false);
        deepClone(this.dom, domClone);

        let obj = super.clone(className);
        obj.dom = domClone;
        obj.dom.kicsy = obj;

        return obj;
    }






    /**
     * Sets the data for all child components of the container.
     * If a child component has a setData method, it is called with the corresponding value.
     * If a child component has a setValue method, it is called with the corresponding value.
     * Each child must have a name attribute set. Use {@link KicsyComponent#setName} to add child components.
     *
     * @param {Object} data - The data object containing the values to set.
     * @return {KicsyVisualContainerComponent} - The current instance of the container.
     */
    setData(data) {

        // Get the name attribute of the child component's DOM element
        let name = this.dom.getAttribute("name");

        if (name == undefined) {
            for (let child of this.dom.childNodes) {
                if (child.kicsy.setData != undefined) {
                    child.kicsy.setData(data);
                } else {
                    let childName = child.getAttribute("name");
                    if (data[childName] != undefined) {
                        child.kicsy.setValue(data[childName]);
                    }
                }
            }
        } else {


            // Iterate over each child component of the container's DOM element
            for (let child of this.dom.childNodes) {

                // Get the name attribute of the child component's DOM element
                let childName = child.getAttribute("name");


                // If the data object contains a value for the current child component's name
                if (data[name] != undefined) {
                    // If the child component has a setData method, call it with the corresponding value
                    if (child.kicsy.setData != undefined) {
                        child.kicsy.setData(data[name]);
                    }
                    // Otherwise, call the setValue method with the corresponding value
                    else {
                        if (childName != undefined && name != undefined) {
                            child.kicsy.setValue(data[name][childName]);
                        }
                    }
                } else {
                    // If the child component has a setData method, call it with the corresponding value
                    if (child.kicsy.setData != undefined) {
                        child.kicsy.setData(data);
                    }
                }
            }
        }
        // Return the current instance of the container
        return this;
    }


    /**
     * Retrieves data from all child components of the container.
     * If a child component has a getData method, it is called recursively with the corresponding value.
     * If a child component has a getValue method, its value is stored in the data object.
     * Each child must have a name attribute set. Use {@link KicsyComponent#setName} to add child components.
     *
     * @param {Object} [data] - The data object to store the values in. If not provided, a new object is created.
     * @param {function} [callback] - The callback function to call with the data object. If not provided, the data object is returned.
     * @returns {KicsyVisualContainerComponent|Object} - If no callback function is provided, the data object is returned.
     * Otherwise, the current instance of the container is returned.
     */
    getData(data, callback) {

        // If no data object is provided, create a new one
        if (data == undefined) {
            data = {};
        }

        // Get the name attribute of the container's DOM element
        let name = this.dom.getAttribute("name");

        // Iterate over each child component of the container's DOM element
        for (let child of this.dom.childNodes) {

            // Get the name attribute of the child component's DOM element
            let childName = child.getAttribute("name");

            // If the child component has a getData method, call it recursively
            if (child.kicsy.getData != undefined) {
                if (name == undefined) {
                    child.kicsy.getData(data, callback);
                } else {
                    child.kicsy.getData(data[name], callback);
                }
            } else {
                // If the child component has a getValue method, store its value in the data object
                if (name != undefined && childName != undefined) {
                    let childValue = {};
                    childValue[childName] = child.kicsy.getValue();
                    if (data[name] == undefined) {
                        data[name] = childValue;
                    } else {
                        Object.assign(data[name], childValue);
                    }

                } else {
                    if (childName != undefined) {
                        let childValue = child.kicsy.getValue();
                        data[childName] = childValue;
                    }
                }
            }
        }

        // If a callback function is provided, call it with the data object and return the current instance of the container
        if (callback != undefined) {
            callback(data);
            return this;
        } else {
            // Otherwise, return the data object
            return data;
        }

    }


    /**
     * Sets the data of the container and its child components with the data from the array at the specified index.
     * If there are more records in the array, clones the container and calls itself recursively with the next record.
     *
     * @param {Array} arrayData - The array of data to set in the container.
     * @param {number} [index=0] - The index of the record to set in the container. Defaults to 0.
     * @param {KicsyVisualComponent} [template=this] - The template to use for cloning the container. Defaults to the current instance of the container.
     * @returns {KicsyVisualContainerComponent} - The current instance of the container.
     */
    setArrayData(arrayData, index = 0, template = this) {

        // Get the data from the current record
        let data = arrayData[index];

        // Set the data for the current instance of the container
        this.setData(data);

        // Increment the index and check if there are more records in the array
        index++;
        if (index == arrayData.length) { return this; }

        // Clone the container
        let nextRecord = template.clone();

        // Insert the cloned container before the current container
        this.dom.parentNode.insertBefore(nextRecord.dom, this.dom.parentNode.lastChild);

        // Call setArrayData recursively with the next record
        nextRecord.setArrayData(arrayData, index, template);

        return this;

    }

}

/**
 * Creates a new instance of KLabel with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KLabel(...args) {
    // Create a new KicsyVisualComponent instance with the "label" HTML tag and undefined type
    let obj = new KicsyVisualComponent("label", undefined, ...args);

    // Define a setValue method for the object that sets the innerText of the DOM element to the provided text
    obj.setValue = function (text) {
        obj.dom.innerText = text;
    }

    // If the first argument is a string or a number, call the setValue method with the first argument
    if (typeof args[0] == "string" || typeof args[0] == "number") {
        obj.setValue(args[0]);
    }

    // Return the newly created KicsyVisualComponent instance
    return obj;
}


/**
 * Creates a new instance of KLayer with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualContainerComponent} - The newly created KicsyVisualContainerComponent instance.
 */
function KLayer(...args) {
    // Create a new KicsyVisualContainerComponent instance with the provided arguments
    let obj = new KicsyVisualContainerComponent(...args);

    /**
     * Sets the value of the KLayer.
     *
     * This method is not implemented on KLayer and logs a message to the console.
     *
     * @param {string} text - The value to set
     * @returns {KLayer} - The current instance of KLayer
     */
    obj.setValue = function (text) {
        console.log("KLayer.setValue is not implemented on KLayer");
        return this;
    }

    /**
     * Gets the value of the KLayer.
     *
     * This method is not implemented on KLayer and logs a message to the console.
     *
     * @returns {KLayer} - The current instance of KLayer
     */
    obj.getValue = function () {
        console.log("KLayer.getValue is not implemented on KLayer");
        return this;
    }

    // Return the newly created KicsyVisualContainerComponent instance
    return obj;
}


/**
 * Creates a new instance of KButton with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KButton(...args) {

    let obj = new KicsyVisualComponent("input", "button", ...args);

    if (typeof args[0] == "string" || typeof args[0] == "number") {
        obj.dom.value = args[0];
    }

    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "button" type, and the provided arguments
    return obj;
}

/**
 * Creates a new instance of KTextarea with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KTextarea(...args) {
    // Create a new KicsyVisualComponent instance with the "textarea" HTML tag and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type
    return new KicsyVisualComponent("textarea", undefined, ...args);
}

/**
 * Creates a new instance of KCheckbox with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KCheckbox(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "checkbox" type, and the provided arguments
    return new KicsyVisualComponent("input", "checkbox", ...args);
}


/**
 * Creates a new instance of KColorPicker with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KColorPicker(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "color" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type
    return new KicsyVisualComponent("input", "color", ...args);
}

/**
 * Creates a new instance of KDate with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KDate(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "date" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type
    return new KicsyVisualComponent("input", "date", ...args);
}


/**
 * Creates a new instance of KEmail with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KEmail(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "email" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type
    return new KicsyVisualComponent("input", "email", ...args);
}

/**
 * Creates a new instance of KFile with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KFile(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "file" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "file", ...args);
}

/**
 * Creates a new instance of KHidden with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KHidden(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "hidden" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type
    return new KicsyVisualComponent("input", "hidden", ...args);
}

/**
 * Creates a new instance of KImage with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KImage(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "image" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "image", ...args);
}


/**
 * Creates a new instance of KMonth with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KMonth(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "month" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "month", ...args);
}

/**
 * Creates a new instance of KNumber with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KNumber(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "number" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "number", ...args);
}

/**
 * Creates a new instance of KPassword with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KPassword(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "password" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "password", ...args);
}

/**
 * Creates a new instance of KRadio with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KRadio(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "radio" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "radio", ...args);
}

/**
 * Creates a new instance of KRange with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KRange(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "range" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "range", ...args);
}

/**
 * Creates a new instance of KReset with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KReset(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "reset" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "reset", ...args);
}

/**
 * Creates a new instance of KSearch with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KSearch(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "search" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "search", ...args);
}

/**
 * Creates a new instance of KSubmit with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KSubmit(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "submit" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "submit", ...args);
}

/**
 * Creates a new instance of KTel with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KTel(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "tel" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "tel", ...args);
}


/**
 * Creates a new instance of KText with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KText(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "text" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "text", ...args);
}

/**
 * Creates a new instance of KTime with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KTime(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "time" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "time", ...args);
}


/**
 * Creates a new instance of KUrl with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KUrl(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "url" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "url", ...args);
}


/**
 * Creates a new instance of KDateTimeLocal with the provided arguments.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KDateTimeLocal(...args) {
    // Create a new KicsyVisualComponent instance with the "input" HTML tag,
    // "datetime-local" type, and the provided arguments
    // The second argument is set to undefined to allow the constructor to determine the correct type

    // Return the newly created KicsyVisualComponent instance
    return new KicsyVisualComponent("input", "datetime-local", ...args);
}



class KRowClass extends KicsyVisualContainerComponent {
    /**
     * Creates a new instance of KRowClass with the provided components.
     *
     * @param {...KicsyVisualComponent} components - The components to be appended to the row.
     */
    constructor(...components) {
        super(...components);

        /**
         * Change the display style of each child component to "inline-block"
         * to make them appear in a single row.
         */
        for (let child of this.dom.childNodes) {
            child.style.display = "inline-block";
        }
    }
}

/**
 * Creates a new instance of KRow with the provided components.
 *
 * @param {...KicsyVisualComponent} components - The components to be appended to the row.
 * @returns {KicsyVisualContainerComponent} - The newly created KicsyVisualContainerComponent instance.
 */
function KRow(...components) {
    // Create a new instance of KRowClass with the provided components
    let obj = new KRowClass(...components);

    // Return the newly created KicsyVisualContainerComponent instance
    return obj;
}


class KColumnClass extends KicsyVisualContainerComponent {
    /**
     * Creates a new instance of KColumnClass with the provided components.
     *
     * @param {...KicsyVisualComponent} components - The components to be appended to the column.
     */
    constructor(...components) {
        super(...components);

        /**
         * Change the display style of each child component to "block"
         * to make them appear in a single column.
         */
        for (let child of this.dom.childNodes) {
            // Set the display style of each child to "block"
            child.style.display = "block";
        }
    }
}

/**
 * Creates a new instance of KColumn with the provided components.
 *
 * @param {...KicsyVisualComponent} components - The components to be appended to the column.
 * @returns {KicsyVisualContainerComponent} - The newly created KicsyVisualContainerComponent instance.
 */
function KColumn(...components) {
    // Create a new instance of KColumnClass with the provided components
    let obj = new KColumnClass(...components);

    // Return the newly created KicsyVisualContainerComponent instance
    return obj;
}
