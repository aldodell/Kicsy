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

    constructor() {

    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

}

/**
 * Kicsy component base
 * @extends KicsyObject
 */
class KicsyComponent extends KicsyObject {
    /** 
     * The DOM element of the component 
     * @type { HTMLElement } */
    dom;

    static id = 0;

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
        this.events = [];

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

        //setup id
        KicsyComponent.id++;
        this.dom.setAttribute("id", "K" + KicsyComponent.id);

    }

    /**
     * Creates a shallow copy of the current KicsyComponent instance.
     *
     * @param {function} [className=KicsyComponent] - The class to instantiate for the cloned object.
     * @return {KicsyComponent} - The cloned KicsyComponent instance.
     */
    clone(className = KicsyComponent) {
        // Create a new instance of the provided class
        let obj = new className();

        // Copy the properties of the current instance to the new instance
        obj = Object.assign(obj, this);

        // Create a shallow copy of the DOM element for the new instance
        obj.dom = this.dom.cloneNode(false);


        // Set the "id" attribute of the new instance's DOM element to the current instance's ID + 1
        obj.dom.setAttribute("id", "K" + KicsyComponent.id);


        // Set the "kicsy" property of the new instance's DOM element to the current instance
        obj.dom.kicsy = obj;

        // Iterate over each event in the new instance's DOM element's events array
        for (let e of obj.events) {
            // Add an event listener to the new instance's DOM element with the event's event name and callback function
            obj.dom.addEventListener(e.event, e.callback);
        }

        // Return the cloned KicsyComponent instance
        return obj;
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
        this.events.push({ "event": event, "callback": callback });

        // Return the current instance of the KicsyComponent class
        return this;
    }


    /**
     * Remove an event listener from the DOM element.
     * @todo Remove events from array
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




}

/**
 * The KicsyVisualComponent class represents a visual component that can contain other components.
 * @extends {KicsyComponent}
 */
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


    /**
     * Sets the display style of the component's DOM element to "inline-block".
     *
     * @return {KicsyVisualComponent} - The current instance of the KicsyVisualComponent class.
     */
    applyInlineBlockStyle() {
        // Set the display style of the component's DOM element to "inline-block"
        this.dom.style.display = "inline-block";

        // Return the current instance of the KicsyVisualComponent class
        return this;
    }

    /**
     * Sets the display style of the component's DOM element to "inline".
     *
     * @return {KicsyVisualComponent} - The current instance of the KicsyVisualComponent class.
     */
    applyInlineStyle() {
        // Set the display style of the component's DOM element to "inline"
        this.dom.style.display = "inline";

        // Return the current instance of the KicsyVisualComponent class
        return this;
    }


    /**
     * Used to make the component draggable
     * @param {*} pointer component that will receive the drag action from mouse
     * @param {*} movable component that will be moved. If not provided, it is the same as pointer
     * @returns itself
     */
    makeDraggable(pointer, movable) {

        if (pointer === undefined) {
            pointer = this;
        }

        if (movable === undefined) {
            movable = pointer;
        }

        pointer.dom.onmousedown = function (event) {
            let rect = pointer.dom.getBoundingClientRect();
            movable.dragX = event.clientX - rect.x;
            movable.dragY = event.clientY - rect.y;
            pointer.dom.style.cursor = "grab";


            movable.dom.onmousemove = function (event) {
                movable.dom.style.transform = null;
                movable.dom.style.left = event.clientX - movable.dragX + "px";
                movable.dom.style.top = event.clientY - movable.dragY + "px";
            }

            movable.dom.onmouseup = function () {
                movable.dom.onmousemove = null;
                movable.dom.onmouseup = null;
                pointer.dom.style.cursor = "auto";

            };

        };
    }




    /**
     * Creates a clone of the current component.
     *
     * @param {Function} [className=KicsyVisualComponent] - The class of the component to be cloned.
     * @return {KicsyVisualComponent} - The cloned component.
     */
    clone(className = KicsyVisualComponent) {
        return super.clone(className);
    }
}

/**
 * The KicsyVisualContainerComponent class represents a container component that can contain other components.
 * @extends {KicsyVisualComponent}
 */
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
     * Removes all child components from the container.
     *
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */
    clear() {
        // Iterate over each child component of the container's DOM element
        while (this.dom.firstChild) {
            // Remove the last child component from the container's DOM element
            this.dom.removeChild(this.dom.lastChild);
        }
        // Return the current instance of the KicsyVisualContainerComponent class
        return this;
    }

    /**
     * Creates a shallow clone of the current KicsyVisualContainerComponent instance.
     *
     * The clone is created by cloning the root component of the container and then cloning each of its children.
     * The children are cloned recursively, this means that if the children of the container have children of their own,
     * these children are also cloned.
     *
     * @param {function} [className=KicsyVisualContainerComponent] - The class to instantiate for the cloned object. Defaults to KicsyVisualContainerComponent.
     * @return {KicsyVisualContainerComponent} - The cloned KicsyVisualContainerComponent instance.
     */
    clone(className = KicsyVisualContainerComponent) {
        // Create a shallow clone of the root component of the container
        let obj = super.clone(className);

        // Iterate over each child component of the container's DOM element
        for (let child of this.dom.children) {
            // Clone the child component
            let cloned = child.kicsy.clone();

            // Append the cloned child component to the cloned container's DOM element
            obj.dom.appendChild(cloned.dom);
        }

        // Return the cloned container
        return obj;
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
     * Sets the data for all child components of the container.
     * If a child component has a setData method, it is called with the corresponding value.
     * If a child component has a setValue method, it is called with the corresponding value.
     * Each child must have a name attribute set. Use KicsyComponent#setName to add child components.
     *
     * @param {Object} data - An object containing the data to set for each child component.
     */
    setData(data) {
        // Get the name attribute of the current container component's DOM element
        let name = this.dom.getAttribute("name");

        // Iterate over each child component of the container's DOM element
        for (let child of this.dom.childNodes) {
            // Get the name attribute of the child component's DOM element
            let childName = child.getAttribute("name");

            // If the child component has a setData method, call it with the corresponding value
            if (child.kicsy.setData != undefined) {
                // If the current child component does not have a name attribute, call setData with the entire data object
                if (name == undefined) {
                    // Call the setData method of the child component with the entire data object
                    child.kicsy.setData(data);
                }
                // Otherwise, call setData with the corresponding value from the data object
                else {
                    // Call the setData method of the child component with the value from the data object corresponding to the name attribute of the child component
                    child.kicsy.setData(data[name]);
                }
            }
            // If the child component does not have a setData method, check if it has a setValue method
            else {
                // If the current child component does not have a name attribute, check if the data object has a value for the child component's name
                if (name == undefined) {
                    // If the data object has a value for the child component's name, call the setValue method of the child component with the corresponding value
                    if (childName != undefined && data[childName] != undefined) {
                        child.kicsy.setValue(data[childName]);
                    }
                } else {
                    // If the data object has a value for the child component's name within the sub-object corresponding to the name attribute of the current container component, call the setValue method of the child component with the corresponding value
                    if (childName != undefined && data[name] != undefined && data[name][childName] != undefined) {
                        child.kicsy.setValue(data[name][childName]);
                    }
                    // If the data object has a value for the current container component's name, call the setValue method of the child component with the corresponding value
                    else if (data[name] != undefined) {
                        child.kicsy.setValue(data[name]);
                    }
                }
            }
        }
        return this;
    }

    /**
     * Retrieves data from all child components of the container.
     * If a child component has a getData method, it is called recursively with the corresponding value.
     * If a child component has a getValue method, its value is stored in the data object.
     * Each child must have a name attribute set. Use {@link KicsyComponent#setName} to add child components.
     *
     * @param {function} [callback] - The callback function to call with the data object. If not provided, the data object is returned.
     * @param {Object} [data] - The data object to store the values in. If not provided, a new object is created.
     * @returns {KicsyVisualContainerComponent|Object} - If no callback function is provided, the data object is returned.
     * Otherwise, the current instance of the container is returned.
     */
    getData(callback = undefined, data = {}) {

        // Get the name attribute of the current container component's DOM element
        let name = this.dom.getAttribute("name");

        // Iterate over each child component of the container's DOM element
        for (let child of this.dom.childNodes) {
            // Get the name attribute of the child component's DOM element
            let childName = child.getAttribute("name");

            // If the child component has a getData method, call it recursively
            if (child.kicsy.getData != undefined) {
                if (name == undefined) {
                    // If the current container component does not have a name attribute, call getData with the entire data object
                    child.kicsy.getData(callback, data);
                } else {
                    // Otherwise, call getData with the corresponding value from the data object
                    child.kicsy.getData(callback, data[name]);
                }
            } else {
                // If the child component does not have a getData method, store its value in the data object
                if (name != undefined && childName != undefined) {
                    // Create a new object with the child component's name as the key and its value as the value
                    let childValue = {};
                    childValue[childName] = child.kicsy.getValue();
                    // If the data object does not have a value for the current container component's name, assign the child object to it
                    if (data[name] == undefined) {
                        data[name] = childValue;
                    } else {
                        // Otherwise, assign the child object to the corresponding value in the data object
                        Object.assign(data[name], childValue);
                    }
                } else {
                    // If the child component does not have a name attribute, store its value in the data object with its name as the key
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
            return data;
        }
    }
}

/**
 * Class for KDataViewerComponent.
 * This class represents a container component that can contain other components, but only one.
 * The child components are stored in the root component and could have children.
 * Is very important that children nodes will be near from this component.
 * @extends {KicsyVisualContainerComponent}
 * @example
 * 
 *      //Initial data
 *      let arrayData =
            [
                { "vehiculo": { "tipo": "carro", "marca": "ford" } },
                { "vehiculo": { "tipo": "moto", "marca": "yamaha" } },
                { "vehiculo": { "tipo": "avion", "marca": "boing" } },
                { "vehiculo": { "tipo": "barco", "marca": "Sea" } },
                { "vehiculo": { "tipo": "avion", "marca": "cessna" } },
                { "vehiculo": { "tipo": "moto", "marca": "honda" } },
                { "vehiculo": { "tipo": "moto", "marca": "BERA" } },
                { "vehiculo": { "tipo": "carro", "marca": "mazda" } },
                { "vehiculo": { "tipo": "carro", "marca": "chevrolet" } },

            ];


        // Use to get references to components
        let viewer;
        let arrayData2;

        //Note KDataViewer wrapping only ONE KLayer wich has two KText
        KDataViewer(
            KLayer(
                KText().setName("tipo"),
                KText().setName("marca")
            ).setName("vehiculo")
        )
            .getMe(me => viewer = me)
            .publish()
            .setArrayData(arrayData);


 */
class KDataViewerClass extends KicsyVisualContainerComponent {

    // The root component of the data viewer
    rootComponent;

    /**
     * Constructor for KDataViewerClass.
     * 
     * @param {...any} args - Additional arguments to pass to the constructor.
     */
    constructor(...args) {
        // Call the constructor of the parent class with the provided arguments
        super(...args);
    }


    /**
     * The add method is not supported for KDataViewerClass.
     * The correct way to add components to this object is using constructors paradigm.
     * 
     * @throws {Error} Throws an error when the add method is called.
     * @override 
     */
    add(...args) {
        // TODO: Implement add method for KDataViewerClass
        //throw new Error("The add method is not supported for KDataViewerClass.");
    }

    /**
     * Sets the data of the data viewer with the array of data objects.
     * 
     * @param {Array} arrayData - The array of data objects to set in the data viewer.
     * @returns {KDataViewerClass} - The current instance of the data viewer.
     */
    setArrayData(arrayData) {
        // For each record in the array of data objects
        for (let i = 0; i < arrayData.length; i++) {
            // Clone the root component of the data viewer
            let tree = this.rootComponent.clone();
            // Set the data of the cloned component with the current record
            tree.setData(arrayData[i]);
            // Append the cloned component to the DOM of the data viewer
            this.dom.appendChild(tree.dom);
        }
        // Return the current instance of the data viewer
        return this;
    }


    /**
     * Retrieves an array of data objects from the data viewer's child components.
     *
     * This function iterates over each child component of the data viewer's DOM and calls the `getData` method on its associated `kicsy` object.
     * The resulting data objects are collected into an array and returned.
     *
     * @param {function} [callback] - An optional callback function to call with the array of data objects. If provided, the current instance of the data viewer is also passed as the second argument to the callback function.
     * @return {Array|KDataViewerClass} - If a callback function is provided, the current instance of the data viewer is returned. Otherwise, an array of data objects is returned.
     */
    getArrayData(callback) {
        // Create an empty array to store the data objects
        let data = [];

        // Iterate over each child component of the data viewer's DOM
        for (let child of this.dom.childNodes) {
            // Call the `getData` method on the `kicsy` object of the child component and store the result in the data array
            data.push(child.kicsy.getData());
        }

        // If a callback function is provided, call it with the data array and return the current instance of the data viewer
        if (callback != undefined) {
            callback(data, this);
            return this;
        } else {
            // Otherwise, return the data array
            return data;
        }
    }

    /**
     * Creates a shallow copy of the current KDataViewerClass instance.
     *
     * This function creates a new instance of the KDataViewerClass class with the same root component as the current instance.
     *
     * @param {function} [className=KDataViewerClass] - The class to instantiate for the cloned object. Defaults to KDataViewerClass.
     * @return {KDataViewerClass} - The cloned KDataViewerClass instance.
     */
    clone(className = KDataViewerClass) {
        // Create a new instance of the provided class
        let obj = super.clone(className);

        // Clone the root component and set it for the new instance
        obj.rootComponent = this.rootComponent.clone();

        // Return the cloned instance
        return obj;
    }
}

/**
 * Creates a new instance of KDataViewerClass with the provided arguments.
 *
 * This function is a convenience wrapper around the KDataViewerClass
 * constructor. It allows the KDataViewerClass class to be instantiated
 * without having to use the "new" keyword.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KDataViewerClass} - The newly created KDataViewerClass instance.
 */
function KDataViewer(rootComponent, ...args) {

    // Create a new instance of KDataViewerClass with the provided arguments
    let dataViewer = new KDataViewerClass(...args);
    dataViewer.rootComponent = rootComponent;

    // Return the newly created KDataViewerClass instance
    return dataViewer;
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

        this.addCssText("display: block; position: relative; width: 100%;");
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
        this.addCssText("display: inline-block; position: relative; height: 100%;");
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

/************************************************************************************ */
/*                           DATA AREA FUNCTIONS                                      */
/************************************************************************************ */
class KDataUtils extends KicsyObject {

    static getDifferencesBetweenArrayData(source, target) {
        let differences = [];

        for (let i = 0; i < source.length; i++) {
            let j1 = JSON.stringify(source[i]);
            let j2 = JSON.stringify(target[i]);
            if (j1 !== j2) {
                differences.push({ key: i, source: source[i], target: target[i] });
            }

        }

        return differences;
    }
}



/************************************************************************************ */
/*                           WINDOWS FUNCTIONS                                        */
/************************************************************************************ */


class KWindowClass extends KicsyVisualContainerComponent {

    header;
    body;
    footer;
    superHeader;
    // frame;

    constructor(...args) {
        super(...args);

        this.header = new KLabel();
        this.body = new KLayer();
        this.footer = new KLayer();
        this.superHeader = new KLayer();
        //  this.frame = new KLayer();

        //Build frame with header, body and footer
        this.add(this.header, this.body, this.footer, this.superHeader);

        //Initialze styles
        this.addCssText("position: absolute;border: 1px solid #ccc; border-radius: 8px; margin: 0px; padding: 0px;");
        this.header.addCssText("display: block; position: relative; width: 100%; height: 30px;margin: 0px;text-align: center;line-height: 30px;font-weight: bold;");
        this.body.addCssText("display: block; position: relative; width: 100%;height: calc(100% - 60px);margin: 0px");
        this.footer.addCssText("display: block; position: relative; width: 100%;height: 30px;margin: 0px;");
        this.superHeader.addCssText("display: block; position: relative; margin: 0px;width: 120%; left: -10%; height: 60px; top: calc(-100% - 20px)"); //width: 120%; left: -10%; height: 60px; top: -15px; 

        //shadow
        this.addCssText("box-shadow: 5px 5px 5px gray;");

        //Background styles
        this.header.addCssText("background: lightblue;")
        this.body.addCssText("background-color: white;");
        this.footer.addCssText("background: lightblue;");

        //Make window draggable
        this.makeDraggable(this.superHeader, this);


        //Changer pointers
        this.add = this.body.add;

    }

    setTitle(text) {
        this.header.setValue(text);
        return this;
    }

}

function KWindow(title = "Kicsy Window") {
    let obj = new KWindowClass();
    obj.setTitle(title);
    return obj;
}