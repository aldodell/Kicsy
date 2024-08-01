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
    static mainSurface = document.body;
    static applications = [];
    static currentUser = null;

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


/************************************************************************************ */
/*                          Default images                                        */
/************************************************************************************ */
function KDefaultImages(id) {
    switch (id) {
        case "TERMINAL":
            return function (ctx) {

                // #g1827
                ctx.save();
                ctx.transform(0.775165, 0.000000, 0.000000, 0.775165, -16.990300, -19.259500);

                // #rect1345
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.997375)';
                ctx.strokeStyle = 'rgb(0, 0, 255)';
                ctx.lineWidth = 4.953780;
                ctx.lineJoin = 'round';
                ctx.moveTo(24.159860, 27.087230);
                ctx.lineTo(102.239860, 27.087230);
                ctx.lineTo(102.239860, 105.167230);
                ctx.lineTo(24.159860, 105.167230);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // #text1437
                ctx.save();
                ctx.transform(0.882053, 0.000000, 0.000000, 1.133720, 0.000000, 0.000000);
                ctx.fillStyle = 'rgb(0, 0, 255)';
                ctx.lineWidth = 1.651260;
                ctx.font = "italic bold 40.967px Courier";
                ctx.fillText("</>", 33.022026, 78.598145);
                ctx.restore();

                // #path1490
                ctx.beginPath();
                ctx.fillStyle = 'rgb(0, 0, 255)';
                ctx.strokeStyle = 'rgb(0, 0, 255)';
                ctx.lineWidth = 1.651260;
                ctx.lineCap = 'butt';
                ctx.lineJoin = 'miter';
                ctx.moveTo(22.879864, 44.601038);
                ctx.lineTo(103.519860, 44.601038);
                ctx.fill();
                ctx.stroke();

                // #path1820
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.997375)';
                ctx.strokeStyle = 'rgb(0, 0, 255)';
                ctx.lineWidth = 4.953780;
                ctx.lineJoin = 'round';
                ctx.moveTo(93.824593, 30.296697);
                ctx.bezierCurveTo(96.700948, 30.296697, 99.032695, 32.352681, 99.032695, 34.888866);
                ctx.bezierCurveTo(99.032695, 37.425051, 96.700948, 39.481035, 93.824593, 39.481035);
                ctx.bezierCurveTo(90.948238, 39.481035, 88.616491, 37.425051, 88.616491, 34.888866);
                ctx.bezierCurveTo(88.616491, 32.352681, 90.948238, 30.296697, 93.824593, 30.296697);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            break;
    }

}

class KicsyObject {

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
    postPublishedCallback;

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

    postPublished() {

        if (this.dom.children != undefined) {
            for (let component of this.dom.children) {
                if (component.kicsy != undefined) {
                    component.kicsy.postPublished();
                }
            }
        }


        if (this.postPublishedCallback != undefined) {
            this.postPublishedCallback(this);
        }

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

        if (surfaceElement == document.body) {
            this.postPublished();
        }

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
     * Hides the component by setting its visibility to "hidden".
     * This will make the component invisible on the page.
     * @returns {void} 
     */
    hide() {
        // Set the visibility style of the component's DOM element to "hidden".
        this.dom.style.visibility = "hidden";
    }

    /**
     * Shows the component by setting its visibility to "visible".
     * This will make the component visible on the page.
     * @returns {void} 
     */
    show() {
        // Set the visibility style of the component's DOM element to "visible".
        // This will make the component visible on the page.
        this.dom.style.visibility = "visible";
    }

    /**
     * Increases the z-index of the component, making it appear "above" other components.
     *
     * @returns {void}
     */
    climb() {
        // Increase the z-index of the component's DOM element.
        // This will make the component appear "above" other components on the page.
        this.dom.style.zIndex++;
    }

    /**
     * Decreases the z-index of the component, making it appear "below" other components.
     *
     * @returns {void}
     */
    descend() {
        // Decrease the z-index of the component's DOM element.
        // This will make the component appear "below" other components on the page.
        this.dom.style.zIndex--;
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

    isAttached(node) {
        if (node.parentNode == null) return false;
        if (node.parentNode == document.body) return true;
        this.isAttached(node.parentNode);
    }


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
            if (this.dom.parentNode != null) {
                component.postPublished();
            }
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
        return obj;
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

/**
 * Creates a new instance of KCanvas.
 *
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KCanvas(...args) {
    // Create a new KicsyVisualComponent instance with the "canvas" HTML tag and the provided arguments
    let obj = new KicsyVisualComponent("canvas", ...args);

    // Define the setValue method to set the drawCallback property of the KicsyVisualComponent instance
    obj.setValue = function (value) {
        // Set the drawCallback property of the KicsyVisualComponent instance to the provided value
        obj.drawCallback = value;
        // Return the current instance of the KicsyVisualComponent
        return this;
    }

    // Define the getValue method to get the drawCallback property of the KicsyVisualComponent instance
    obj.getValue = function () {
        // Return the drawCallback property of the KicsyVisualComponent instance
        return obj.drawCallback;
    }

    obj.setReferenceSize = function (width, height) {
        obj.dom.width = width.toString().match(/\d+/)[0];
        obj.dom.height = height.toString().match(/\d+/)[0];
        return this;
    }

    // Define the postPublished method to be called after the component is published
    obj.postPublishedCallback = function (obj) {

        // Get the 2D rendering context of the DOM element's canvas
        let ctx = obj.dom.getContext("2d");
        // Get the drawCallback property of the KicsyVisualComponent instance
        let callback = obj.drawCallback;
        // Call the drawCallback function with the 2D rendering context as the argument
        callback(ctx);
    }

    // Return the newly created KicsyVisualComponent instance
    return obj;
}


function KAppIcon(title, drawerCallback = KDefaultImages("TERMINAL"), clickEventListener = null) {
    let frame = KLayer(
        KCanvas()
            .setSize(64, 64)
            .setReferenceSize(64, 64)
            .setValue(drawerCallback)
            .addCssText("display: block; position: relative; left:32px; top: 4px;"),
        KLabel()
            .setValue(title)
            .addCssText("display: block; position: relative; margin-left:4px; margin-right:4px; margin-top:16px; text-align: center; line-height: 16px;"),
    )
        .setSize(128, 128)
        .addCssText("display: inline-block; position: relative; width: 128px; height: 128px; border: 1px solid black; border-radius: 8px; margin: 0px; padding: 0px; box-shadow: 5px 5px 5px gray;");


    if (clickEventListener) {
        frame.addEvent("click", clickEventListener);
    }
    return frame;
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
/*                           WINDOWS FUNCTIONS                                        */
/************************************************************************************ */


class KWindowClass extends KicsyVisualContainerComponent {

    header;
    body;
    footer;
    superHeader;
    // frame;

    constructor() {
        super();

        this.header = new KLabel();
        this.body = new KLayer();
        this.footer = new KLayer();
        this.superHeader = new KLayer();
        this.controlButton = KLayer();

        //Build frame with header, body and footer
        this.add(this.header, this.body, this.footer, this.superHeader, this.controlButton);


        //Initialze styles
        this.addCssText("position: absolute;border: 1px solid #ccc; border-radius: 8px; margin: 0px; padding: 0px;");
        this.header.addCssText("display: block; position: relative; width: 100%; height: 30px;margin: 0px;text-align: center;line-height: 30px;font-weight: bold;");
        this.body.addCssText("display: block; position: relative; width: 100%;height: calc(100% - 60px);margin: 0px");
        this.footer.addCssText("display: block; position: relative; width: 100%;height: 30px;margin: 0px;");
        this.superHeader.addCssText("display: block; position: relative; margin: 0px;width: 120%; left: -10%; height: 60px; top: calc(-100% - 20px)");
        this.controlButton.addCssText("display: block; position: absolute; margin: 0px;width: 20px; height: 20px; right: 0px; top: 5px; border : 1px solid gray; border-radius: 30px; background-color: red;");

        //shadow
        this.addCssText("box-shadow: 5px 5px 5px gray;");

        //Background styles
        this.header.addCssText("background: lightblue;")
        this.body.addCssText("background-color: white;");
        this.footer.addCssText("background: lightblue;");

        //Make window draggable
        this.makeDraggable(this.superHeader, this);

        //Control button wth close event
        this.controlButton.addEvent("click", () => {
            this.hide();
        })

        //pointers
        this.add = function (...args) { this.body.add(...args); return this; };

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
/*                           Messages FUNCTIONS                                        */
/************************************************************************************ */
class KMessageClass extends KicsyObject {
    /** App wich generates the message */
    source
    /** App wich receives the message */
    target
    /** User wich generated the message */
    author
    /** User wich receives the message */
    destinatary
    /** Action wich the message contains */
    action
    /** Content of the message */
    payload
    /**
     * Constructor for the KMessageClass object.
     * 
     * @param {string} [source=""] - The source app of the message.
     * @param {string} [target=""] - The target app of the message.
     * @param {string} [author=""] - The author (user)of the message.
     * @param {string} [destinatary=""] - The destinatary (user)  of the message.
     * @param {string} [action=""] - The action of the message.
     * @param {object} [payload={}] - The payload of the message.
     */
    constructor(source = "", target = "", author = "", destinatary = "", action = "", payload = {}) {
        // Call the constructor of the parent class
        super();

        // Set the source of the message
        this.source = source;

        // Set the target of the message
        this.target = target;

        // Set the author of the message
        this.author = author;

        // Set the destinatary of the message
        this.destinatary = destinatary;

        // Set the action of the message
        this.action = action;

        // Set the payload of the message
        this.payload = payload;
    }


    /**
     * Sends the message to the target application.
     * 
     * This function iterates over the applications in the Kicsy.applications array
     * and calls the processMessage method of the application with the current instance
     * of the KMessageClass as an argument. The processMessage method processes the message
     * and returns the result. If the target application is found, the processMessage method
     * is called and the result is returned.
     * 
     * @return {any} The result of the processMessage method of the target application.
     */
    send() {

        let r;

        for (let app of Kicsy.applications) {
            if (app.name === this.target) {
                r = app.processMessage(this);
                break;
            }
        }

        return r;
    }

    /**
     * Sends a message asynchronously to a specified URL.
     * 
     * @param {string} url - The URL to send the message to.
     * @param {function} callback - The callback function to call with the JSON response.
     */
    async remoteSend(url, callback) {
        // Create a new Headers object to set the Content-Type header.
        const myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Accept", "application/json");
        // myHeaders.append("Access-Control-Allow-Origin", "*");

        console.log(JSON.stringify(this));

        let form = new FormData();
        form.append("message", JSON.stringify(this));

        // Create a new Request object with the specified URL, method, body, and headers.
        const myRequest = new Request(url, {
            method: "POST", // Set the request method to POST.
            body: form, // Convert the KMessageClass instance to a JSON string and set it as the request body.
            //   headers: myHeaders, // Set the request headers to the previously created Headers object.
        });

        // Send the request asynchronously using the fetch function.
        const response = await fetch(myRequest);

        // Check if the response is successful (status code 200-299).
        if (response.ok) {
            // Call the callback function with the JSON response.
            callback(await response.text());
        }
    }


    /**
     * Broadcasts the message to all the applications registered in Kicsy.applications.
     *
     * This function iterates over the applications in the Kicsy.applications array
     * and calls the processMessage method of the application with the current instance
     * of the KMessageClass as an argument. The processMessage method processes the message
     * and returns the result. If the target application is found, the processMessage method
     * is called and the result is returned.
     *
     * @return {void} This function does not return anything.
     */
    broadcast() {
        // Iterate over the applications in the Kicsy.applications array
        Kicsy.applications.forEach(app => {
            // Call the processMessage method of the application with the current instance of the KMessageClass as an argument
            app.processMessage(this);
        });
    }

}


/**
 * Creates a new instance of KMessageClass with the provided arguments.
 *
 * @param {string} [source=""] - The source of the message.
 * @param {string} [target=""] - The target of the message.
 * @param {string} [author=""] - The author of the message.
 * @param {string} [destinatary=""] - The destinatary of the message.
 * @param {string} [action=""] - The action of the message.
 * @param {object} [payload={}] - The payload of the message.
 * @return {KMessageClass} - The newly created KMessageClass instance.
 */
function KMessage(source = "", target = "", author = "", destinatary = "", action = "", payload = {}) {
    // Create a new instance of KMessageClass with the provided arguments
    return new KMessageClass(source, target, author, destinatary, action, payload);
}



/************************************************************************************ */
/*                           USER FUNCTIONS                                        */
/************************************************************************************ */
class KUserClass extends KicsyObject {
    name;
    fingerprint;
    environments = [];
    constructor(name = "anonymous", environments = ["base"]) {
        super();
        this.name = name;
        this.environments = environments;
        this.fingerprint = name + "-" + environments; // TODO: generate fingerprint
    }
}

// Create a new instance of KUserClass with the name "anonymous" and environments "system"
Kicsy.currentUser = new KUserClass("anonymous", ["system"]);

class KApplicationClass extends KicsyObject {
    name;
    description;
    environments;
    version;
    author;
    rootView
    help;
    iconDrawer;

    constructor(
        name = "Application with no name. Change it now!",
        description = "No description",
        environments = ["system"],
        rootView = undefined,
        version = 1,
        author = "Kicsy",
        iconDrawer = KDefaultImages("TERMINAL"),
        help = "No help exists for this application") {

        super();
        this.name = name;
        this.description = description;
        this.environments = environments;
        this.version = version;
        this.author = author;
        this.rootView = rootView;
        this.iconDrawer = iconDrawer;
        this.help = help;
    }

    register() {
        if (this.rootView != undefined) {
            if (this.rootView.dom.parentNode == null) { this.rootView.publish(Kicsy.mainSurface); }
        }
        Kicsy.applications.push(this);
        return this;
    }

    run(message) {
        return message;
    }

    preProcessMessage(message) {
        switch (message.action) {
            case "run":
                let r = this.run(message);
                return r;
                break;
        }
    }

    processMessage(message) {
        let r = this.preProcessMessage(message);
        return r;
    }

}



/**
 * Function to create a desktop application.
 * 
 * @return {Object} - The desktop application object.
 */
function KDesktopApp() {
    // Create a root view layer for the desktop application.
    let rootView = KLayer();
    // Create a menu layer for the desktop application.
    let menu = KLayer();

    // Add CSS styles to the root view layer.
    rootView.addCssText("display: block; position: absolute; width: 100%; height: 100%;left: 0px; top: 0px; margin: 0px; padding: 0px; background-color: white;");
    // Add CSS styles to the menu layer.
    menu.addCssText("display: block; position: absolute; width: 100%; height: 128px; left: 0px; bottom: 0px; margin: 0px; padding: 4px; overflow-x: scroll; background-color: gray;");
    // Add the menu layer to the root view layer.
    rootView.add(menu);

    // Create a new instance of the KApplicationClass with the specified properties.
    let app = new KApplicationClass("desktop", "Desktop App", ["base"], rootView);
    // Set the menu layer of the desktop application.
    app.menu = menu;

    /**
     * Function to process messages for the desktop application.
     * 
     * @param {Object} message - The message object.
     */
    app.processMessage = function (message) {
        // Process the message using the preProcessMessage function.
        app.preProcessMessage(message);

        // Switch on the action property of the message object.
        switch (message.action) {
            // If the action is "update", update the menu of the desktop application.
            case "update":
                app.update();
                break;
        }
    }

    /**
     * Function to update the menu of the desktop application.
     */
    app.update = function () {
        // Clear the menu of the desktop application.
        app.menu.clear();

        // Iterate over each application in the Kicsy.applications array.
        Kicsy.applications.forEach(application => {
            // Iterate over each environment of the current user.
            Kicsy.currentUser.environments.forEach(environment => {

                // Check if the application's environments include the current environment and if the application has a root view.
                if (application.environments.includes(environment) && application.rootView != undefined) {
                    // Create an application icon for the application and add it to the menu of the desktop application.
                    let appIcon = KAppIcon(application.name, application.iconDrawer, application.run);
                    app.menu.add(appIcon);
                }

            })
        })
    }
    // Register the desktop application.
    app.register();
    // Return the desktop application object.
    return app;
}
KDesktopApp();


/**
 * Function to create and return a terminal application object.
 * @returns {Object} The terminal application object.
 */
function KTerminalApp() {

    // Create a window for the terminal application.
    let rootView = KWindow("Kicsy Terminal")
        .setSize(480, 240) // Set the size of the window.
        .getMe((me) => {
            me.body.addCssText("background-color: black; color: lime;"); // Set the background and text color of the window.
        });


    // Create a terminal application object.
    let app = new KApplicationClass("terminal", "Terminal App", ["system"], rootView);


    /**
     * Function to process a statement and display the result.
     * @param {string} statement - The statement to process.
     */
    app.processLine = function (statement = "") {

        let tokens = statement.trim().split("|"); // Split the statement into tokens.
        let tokensLength = tokens.length; // Get the length of the tokens array.
        let i;
        let result;

        for (i = 0; i < tokens.length; i++) {
            let line = tokens[i].trim(); // Trim the current token.
            let target = line.match(/^\s*\w*\s*/)[0]; // Get the target of the token.
            let payload = line.substring(target.length).trim(); // Get the payload of the token.
            target = target.trim(); // Trim the target.
            if (payload.length == 0 && result != undefined) { payload = result; } // Set the payload to the result if it is empty.


            try {
                payload = JSON.parse(payload); // Parse the payload as JSON.
            } catch { }


            if (target.length > 0) {
                result = KMessage("terminal", target, Kicsy.currentUser.name, Kicsy.currentUser.name, "run", payload).send(); // Send a message to the target.
                // Last token
                if (tokensLength == i + 1) {

                    if (result != undefined) {
                        if (result.length > 0) {
                            app.newAnswer(result); // Display the result.
                            result = undefined;
                        }
                    } else {
                        app.newLine(); // Create a new line.
                    }

                }
            }
        }
    }


    /**
     * Function to create a new line in the terminal.
     * @param {string} text - The text to display in the line.
     */
    app.newLine = function (text) {

        let userText = Kicsy.currentUser.name + " /:>"; // Create the user text.
        let row = KRow().addCssText("margin: 0px; padding: 0px;"); // Create the row.
        let userLabel = KLabel(userText).addCssText("margin: 4px; padding: 0px;left:0px;border-width: 0;"); // Create the user label.
        let textLine = KText(text).addCssText("margin: 0px; padding: 0px;border-width: 0;outline: none;background-color: transparent;color:inherit;"); // Create the text line.

        textLine.addEvent("keydown", function (event) {
            if (event.key == "Enter") {
                app.processLine(textLine.getValue()); // Process the line when the enter key is pressed.
            }
        });

        row.add(userLabel, textLine); // Add the user label and text line to the row.
        app.rootView.add(row); // Add the row to the terminal window.


        let w = parseInt(row.dom.getBoundingClientRect().width - userLabel.dom.getBoundingClientRect().width);// + //"calc(" + row.dom.style.width + " - " + userLabel.dom.offsetWidth + "px)";
        textLine.dom.style.width = (w - 10) + "px"; // Set the width of the text line.
        textLine.dom.focus(); // Set focus to the text line.

    }

    /**
     * Function to display an answer in the terminal.
     * @param {string} text - The text to display as an answer.
     */
    app.newAnswer = function (text) {
        let row = KRow().addCssText("margin: 0px; padding: 0px;"); // Create the row.
        let textArea = KTextarea().addCssText("margin: 0px; padding: 4px;border-width: 0;outline: none;background-color: transparent;color:inherit;width: 100%;"); // Create the text area.
        textArea.setValue(text); // Set the value of the text area.
        row.add(textArea); // Add the text area to the row.
        app.rootView.add(row); // Add the row to the terminal window.
        app.newLine(); // Create a new line.
    }

    app.rootView = rootView; // Set the root view of the terminal application.
    app.register(); // Register the terminal application.
    app.newLine(""); // Create a new line in the terminal.

    app.help = "<b>Terminal App</b><br/>"; // Set the help text of the terminal application.

    return app; // Return the terminal application object.
}
KTerminalApp();


/**
 * Function to create and return a version application object.
 * @returns {Object} The version application object.
 */
function KVersionApp() {
    // Create a new instance of the KApplicationClass with the specified properties.
    let app = new KApplicationClass(
        "version", // Name of the application.
        "Version App", // Description of the application.
        ["system"] // Environments that the application belongs to.
    );

    /**
     * Function to run the version application.
     * @param {Object} message - The message object.
     * @returns {string} The version of Kicsy.
     */
    app.run = function (message) {
        return Kicsy.version; // Return the version of Kicsy.
    }

    // Set the help text of the version application.
    app.help = "Returns Kicsy version";

    // Register the version application.
    app.register();

    // Return the version application object.
    return app;
}
KVersionApp();


/**
 * Function to create and return an alert application object.
 * The alert application displays a pop-up alert with the payload of a message.
 *
 * @returns {KApplicationClass} The alert application object.
 */
function KAlert() {
    
    // Create a new instance of the KApplicationClass with the specified properties.
    let app = new KApplicationClass(
        "alert", // Name of the application.
        "Alert App", // Description of the application.
        ["system"] // Environments that the application belongs to.
    );

    /**
     * Function to run the alert application.
     * Displays a pop-up alert with the payload of a message.
     * @param {Object} message - The message object.
     */
    app.run = function (message) {
        alert(message.payload); // Display the payload of the message as a pop-up alert.
    }

    // Register the alert application.
    app.register();

    // Return the alert application object.
    return app;
}
KAlert();


/**
 * Creates a new instance of the Eval App.
 * The Eval App is an application that evaluates the payload of a message and returns the result.
 *
 * @return {KApplicationClass} The newly created instance of the Eval App.
 */
function KEval() {
    // Create a new instance of KApplicationClass with name "eval", description "Eval App", and environments "system"
    let app = new KApplicationClass("eval", "Eval App", ["system"]);

    /**
     * Evaluates the payload of a message and returns the result.
     *
     * @param {KMessageClass} message - The message to evaluate. The payload of the message is evaluated using the eval function.
     * @return {any} The result of evaluating the payload of the message.
     */
    app.run = function (message) {
        return eval(message.payload); // Evaluate the payload of the message using the eval function
    }

    // Register the Eval App in the Kicsy.applications array
    app.register();

    // Return the newly created instance of the Eval App
    return app;
}
KEval();


KMessage("system", "desktop", "Kicsy", "system", "update").send();





