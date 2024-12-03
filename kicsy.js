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
    static serverURL = "../Kicsy/KicsyServer.php";
    static windows = [];


    /**
     * Load and include multiple JavaScript modules.
     *
     * @param {function} callback - The callback function to call when all the modules are loaded.
     * @param {...string} modules - The URLs of the modules to load.
     * @return {KicsyClass} - The current instance of the Kicsy class.
     */
    static load(callback = null, ...modules) {
        const t = Date.now();
        var modulesCounter = modules.length;

        // Iterate over each module URL
        for (const module of modules) {
            // Create a new script element
            let script = document.createElement("script");

            // Set the source of the script to the module URL
            var sufix = "?t=" + t;
            if (module.indexOf("?") != -1) {
                sufix = "&t=" + t;
            }


            // Append the script to the document body
            document.body.appendChild(script);

            //Load script
            script.src = module + sufix;

        }

        if (callback != null) {
            window.addEventListener("load", callback);
        }

    }

    static print(text) {
        console.log(text);
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


class KCookiesClass extends KicsyObject {
    cookies;
    empty = true;
    constructor() {
        super();
        let r = {};
        let c = document.cookie;
        if (c != "") {
            c.matchAll(/([^;=]+)=([^;]*)/g).forEach(m => r[m[1]] = m[2]);
        }
        if (Object.getOwnPropertyNames(r).length > 0) {
            this.cookies = r;
            this.empty = false;
        }
    }

    get exists() {
        return !this.empty;
    }

    put(name, value, sameSite = "Lax", expires = 3600) {
        document.cookie = name + "=" + value + "; SameSite=" + sameSite + "; expires=" + new Date(Date.now() + expires * 1000).toUTCString();
        return this;
    }

    get(name) {
        return this.cookies[name];
    }

    clear() {
        document.cookie = "";
        return this;
    }
}

function KCookies() {
    return new KCookiesClass();
}


class KAnimationFrame extends KicsyObject {
    cssText;
    time;

    constructor(cssText, time) {
        super();
        this.cssText = cssText;
        this.time = time;
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

        obj.setDataList(this.getDataList());

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

        let dataList = this.getDataList();
        if (dataList) {
            value = dataList.getLabelFromValue(value);
        }
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
        let value = this.dom.value;
        let dataList = this.getDataList();
        if (dataList) {
            value = dataList.getValueFromLabel(value);
        }

        // If no callback function is provided, return the value of the DOM element
        if (callback == undefined) {
            return value;
        } else {
            // Call the provided callback function with the value of the DOM element as an argument
            callback(value);
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

    setPlaceholder(placeholder) {
        this.dom.placeholder = placeholder;
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


    get isPublished() {
        return this.dom.parentNode != null;
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



    /**
     * Sets the data list for the component.
     * If a kDataList is provided, it sets the list attribute of the DOM element to the id of the kDataList's DOM element.
     * It also adds a change event listener to handle value changes.
     * If kDataList is not provided, it removes the list attribute from the DOM element.
     * 
     * @param {KDataList} [kDataList] - The data list to set for the component.
     * @returns {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    setDataList(kDataList = undefined) {
        if (kDataList != undefined) {
            this.dom.setAttribute("list", kDataList.dom.id);
        } else {
            this.dom.removeAttribute("list");
        }
        return this;
    }

    /**
     * Retrieves the data list object associated with the component.
     * It does this by looking for the "list" attribute in the component's DOM element and getting the kicsy property of the element with the id equal to the value of the "list" attribute.
     * If a callback function is provided, it calls the callback function with the data list object as an argument and returns the current instance of the KicsyComponent class.
     * If no callback function is provided, it returns the data list object.
     * If no data list is associated with the component, it returns undefined.
     * 
     * @param {function} [callback] - The callback function to call with the data list object as an argument.
     * @return {KDataList|KicsyComponent|undefined} - The data list object, the current instance of the KicsyComponent class, or undefined depending on the situation.
     */
    getDataList(callback = undefined) {
        let dlID = this.dom.getAttribute("list");
        if (dlID != null) {
            let r = document.getElementById(dlID).kicsy;
            if (callback != undefined) {
                callback(r);
                return this;
            } else {
                return r;
            }
        }
        return undefined;
    }


}

/**
 * The KicsyVisualComponent class represents a visual component that can contain other components.
 * @extends {KicsyComponent}
 */
class KicsyVisualComponent extends KicsyComponent {
    animationSettings;


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

        if (width != undefined) {
            // If a number is provided for width, convert it to a string and append "px"
            if (!isNaN(width)) {
                width = width + "px";
            }
            this.dom.style.width = width;
        }

        if (height != undefined) {
            // If a number is provided for height, convert it to a string and append "px"
            if (!isNaN(height)) {
                height = height + "px";
            }
            this.dom.style.height = height;
        }

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
            let rect = movable.dom.getBoundingClientRect();
            movable.dragX = event.clientX - rect.x;
            movable.dragY = event.clientY - rect.y;
            pointer.dom.style.cursor = "grab";


            movable.dom.onmousemove = function (event) {
                movable.dom.style.transform = null;
                movable.dom.style.left = (event.clientX - movable.dragX) + "px";
                movable.dom.style.top = (event.clientY - movable.dragY) + "px";// + borderWidth + "px";
            }

            movable.dom.onmouseup = function () {
                movable.dom.onmousemove = null;
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
        return this;
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
        return this;
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
        return this;
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
        return this;
    }

    center() {
        this.addCssText("position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);");
        return this;
    }

    centerHorizontally() {
        this.addCssText("position: absolute; left: 50%; transform: translateX(-50%);");
        return this;
    }

    enable() {
        this.dom.disabled = false;
        return this;
    }

    disable() {
        this.dom.disabled = true;
        return this;
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


    initAnimationSettings(loop = true) {
        this.animationSettings = { "loop": loop, "frames": [], "index": 0, timer: null };
        return this;
    }
    addAnimationFrame(callback, time) {
        this.animationSettings.frames.push({ "callback": callback, "time": time });
        return this;
    }

    nextAnimationFrame(obj) {
        if (obj.animationSettings.index == obj.animationSettings.frames.length) {
            if (obj.animationSettings.loop) {
                obj.startAnimation();
            }
        } else {

            let frame = obj.animationSettings.frames[obj.animationSettings.index];

            if (frame != undefined) {
                frame.callback(obj);
                obj.animationSettings.timer = setTimeout(obj.nextAnimationFrame, frame.time, obj);
                obj.animationSettings.index++;
            }
        }
    }

    startAnimation() {
        this.animationSettings.index = 0;
        this.animationSettings.timer = null;
        this.nextAnimationFrame(this);
        return this;
    }

    stopAnimation() {
        clearTimeout(this.animationSettings.timer);
        this.animationSettings.index = 0;
        this.animationSettings.timer = null;
        return this;
    }


    setPlaceholder(text) {
        this.dom.placeholder = text;
        return this;
    }

    setHints(text) {
        this.dom.title = text;
        return this;
    }

    setInputMode(mode) {
        this.dom.inputMode = mode;
        return this;
    }

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


}

/**
 * The KicsyVisualContainerComponent class represents a container component that can contain other components.
 * @extends {KicsyVisualComponent}
 */
class KicsyVisualContainerComponent extends KicsyVisualComponent {

    isAttached(node) {
        if (node == undefined) node = this.dom;
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
        if (components.length > 0) {
            this.add(...components);
        }
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
        // let textNode = document.createTextNode(text);
        // obj.dom.appendChild(textNode);
        //obj.dom.innerHTML = textNode.innerHTML;
        //   obj.dom.innerText = text;
        obj.dom.textContent = text.toString();
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

    obj.setValue = function (value) {
        obj.dom.innerHTML = value;
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

function KCell(...args) {
    let obj = new KicsyVisualComponent("div", ...args);
    obj.addCssText("display: inline-block;");
    obj.setValue = function (value) {
        obj.dom.innerText = value;
        return this;
    }

    obj.getValue = function () {
        return obj.dom.innerText;
    }
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
function KTextArea(...args) {
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
    let obj = new KicsyVisualComponent("input", "checkbox", ...args);
    obj.setValue = function (value) {
        if (value == 1 || value == "1" || value == true) {
            obj.dom.checked = true;
        } else {
            obj.dom.checked = false;
        }

        return this;

    }

    obj.getValue = function (callback) {
        let v;
        if (obj.dom.checked) {
            v = "1";
        } else {
            v = "0";
        }

        if (callback) {
            callback(v);
            return this;
        } else {
            return v;
        }

    }
    // Create a new KicsyVisualComponent instance with the "input" HTML tag, "checkbox" type, and the provided arguments
    return obj;
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
    let obj = new KicsyVisualComponent("input", "date", ...args);
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    obj.dom.value = [year, month, day].join("-");
    return obj;
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

    let obj = new KicsyVisualComponent("img", "", ...args);

    obj.setValue = function (value) {
        obj.dom.src = value;
        return this;
    }

    return obj;
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


function KDataList() {
    let obj = new KicsyVisualComponent("datalist");
    /**
     * Finds the value of an option in the datalist with the given label.
     *
     * @param {string} label - The label of the option to find.
     * @param {function} [callback] - A callback function to call with the value.
     * @returns {KDataList} - The current instance of KDataList.
     */

    obj.entries = [];

    obj.getValueFromLabel = function (label, callback) {
        let r = obj.entries.find(function (e) {
            return e.label == label
        });
        if (r != undefined) {
            r = r.value;
        }
        if (callback) {
            callback(r);
            return obj;
        } else {
            return r;
        }
    }

    obj.getLabelFromValue = function (value) {
        let r, rs;
        try {
            r = obj.entries.find(function (e) {
                return e.value == value
            });
            rs = r.label;
            return rs;
        } catch (e) {
            console.log("ERROR [getLabelFromValue]:" + e);
            return "ERROR";
        }
    }

    obj.addOption = function (value, label = value) {
        obj.entries.push({ value: value, label: label });
        let option = new KicsyVisualComponent("option", undefined);
        obj.dom.appendChild(option.dom);
        option.dom.setAttribute("value", label);
        //option.dom.setAttribute("label", label);
        //option.dom.textContent = label;
        return obj;
    }

    /**
     * Sets the data of the datalist with the array of data objects.
     * 
     * Each element of the array can be an object with "label" and "value" properties,
     * or an array with two elements, or a single string value.
     * 
     * @param {Array} arrayData - The array of data objects to set in the datalist.
     * @returns {KDataList} - The current instance of the datalist.
     */
    obj.setArrayData = function (arrayData) {
        for (let r of arrayData) {
            let label, value;

            if (r.label != undefined) {
                label = r.label;
            } else if (Array.isArray(r) && r[0] != undefined) {
                label = r[0];
            } else {
                label = r;
            }

            if (r.value != undefined) {
                value = r.value;
            } else if (Array.isArray(r) && r[1] != undefined) {
                value = r[1];
            } else {
                value = r;
            }

            obj.addOption(value, label);

        }

    }

    return obj;

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

    let obj = new KicsyVisualComponent("input", "range", ...args);

    obj.setStep = function (value) {
        obj.dom.step = value;
        return this;
    }

    obj.setMax = function (value) {
        obj.dom.max = value;
        return this;
    }

    obj.setMin = function (value) {
        obj.dom.min = value;
        return this;
    }


    // Return the newly created KicsyVisualComponent instance
    return obj;
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

function KHorizontalRule(...args) {
    return new KicsyVisualComponent("hr", undefined, ...args);
}


class KSuperComboBoxClass extends KText {

    arrayDataCallback;
    rect;
    frameOptionsCssText = "";
    frame;

    constructor(...args) {
        super(...args);


        /**
         * Converts an array of data objects into an array of objects with label and value properties.
         *
         * If the row is a string or number, it is converted to an object with a label and value property.
         * If the row is an object, but does not have a label and value property, it is converted to an object
         * with a label and value property. If the object has one key, the key is used as the label and the value
         * is used as the value. If the object has two keys, the keys are used as the label and value.
         * @param {Array} arrayData - The array of data objects to convert.
         * @returns {Array} - The array of objects with label and value properties.
         */
        this.conformData = function (arrayData) {
            let result = [];
            for (let row of arrayData) {
                if (typeof row == "string" || typeof row == "number") {
                    result.push({ label: row, value: row });
                } else if (typeof row == "object") {

                    if (row.label != undefined && row.value != undefined) {
                        result.push(row);
                    } else if (Object.keys(row).length == 2) {
                        result.push({ label: Object.values(row)[0], value: Object.values(row)[1] });
                    } else if (Object.keys(row).length == 1) {
                        result.push({ label: Object.values(row)[0], value: Object.values(row)[0] });
                    }
                }

            }
            return result;
        }


        this.setArrayDataCallback = function (callback) {
            this.arrayDataCallback = callback;
            return this;
        }

        this.setValue = function (value) {
            let options = this.conformData(this.arrayDataCallback());
            let e = options.find(x => x.value == value);
            if (e) {
                this.dom.value = e.label;
                this.value = e.value;
            } else {
                this.dom.value = value;
                this.value = value;
            }
            return this;
        }

        this.getValue = function (callback) {
            if (callback != undefined) {
                callback(this.value);
                return this;
            } else {
                return this.value;
            }
        }

        this.showOptionsFrame = function (text = null) {
            let rect = this.dom.getBoundingClientRect();
            let w = rect.width;
            let l = this.dom.offsetLeft;
            let h = rect.height;
            let b = parseInt(getComputedStyle(this.dom).borderBottomWidth.match(/\d+/g)[0]);
            let partialArrayData = this.arrayDataCallback();

            //Filter the array to get values that start with the text
            if (text != null) {
                try {
                    text = text.trim().toLowerCase();
                    partialArrayData = partialArrayData.filter(x => x.label.toString().toLowerCase().indexOf(text) > -1);
                } catch (error) {
                    console.log(error);
                }
            }

            //Comform the array to put label and value in an object
            let options = this.conformData(partialArrayData);

            this.frame = KLayer()
                .addCssText(`display: block; position: absolute; width: fit-content; height: 200px; left: ${l}px; top: ${h + b}px; margin: 0px; padding: 4px; background-color: white;overflow-y: scroll; z-index: 100;` + this.frameOptionsCssText)
                .publish(this.dom.parentNode);


            for (let option of options) {
                let o = KLayer();
                o.comboBox = this;
                o.option = option;
                o.addCssText(`display: block; position: relative; width: 100%; height: 20px; margin: 0px; padding: 0px; background-color: white;`);
                o.setValue(option.label);

                o.addEvent("click", function (e) {
                    let me = e.target.kicsy;
                    me.comboBox.setValue(me.option.value);
                    me.comboBox.hideFrameOptions();
                })


                this.frame.add(o);
            }


        }


        this.hideFrameOptions = function () {
            window.setTimeout(function (f) {
                f.clear();
                f.dom.remove();
            }, 300, this.frame);
        }


        this.addEvent("focus", function (e) {
            let me = e.target.kicsy;
            me.showOptionsFrame();

        })

        this.addEvent("blur", function (e) {
            let me = e.target.kicsy;
            me.hideFrameOptions();
        })

        this.addEvent("input", function (e) {
            let me = e.target.kicsy;
            let text = e.target.value;

            if (text.length > 2) {
                me.hideFrameOptions();
                me.showOptionsFrame(text);
            }
        })


    }

    clone(className = KSuperComboBoxClass) {
        let obj = super.clone(className);
        obj.arrayDataCallback = this.arrayDataCallback;
        return obj;
    }


}

function KSuperComboBox(...args) {
    let obj = new KSuperComboBoxClass(...args);
    return obj;
}

function KSelect(...args) {
    let obj = new KicsyVisualComponent("select", undefined, ...args);

    obj.addOption = function (value, label = value, selected = false, disabled = false) {
        let option = new KicsyVisualComponent("option", undefined);
        obj.dom.appendChild(option.dom);
        option.dom.setAttribute("value", value);
        option.dom.setAttribute("label", label);

        if (selected) {
            option.dom.setAttribute("selected", true);
        }


        if (disabled) {
            option.dom.setAttribute("disabled", true);
        }

        return obj;
    }

    obj.setValue = function (value) {

        if (obj.dom.childNodes.length == 0) {
            obj.setArrayData(obj.arrayDataCallback());
        }

        for (let option of obj.dom.childNodes) {
            if (option.value == value) {
                option.selected = true;
            }
        }
        return obj;
    }


    obj.getValue = function (callback) {
        let value;
        for (let option of obj.dom.childNodes) {
            if (option.selected) {
                value = option.value;
                break;
            }
        }
        if (callback) {
            callback(value);
            return obj;
        } else {
            return value;
        }
    }


    obj.arrayDataCallback = function () {
        return [{ "label": "Option 1", "value": 1 }, { "label": "Option 2", "value": 2 }, { "label": "Option 3", "value": 3 }];
    }


    obj.setArrayDataCallback = function (callback) {
        obj.arrayDataCallback = callback;
        return obj;
    }

    /**
     * Sets the array data for the select.
     * The array can be structured in different ways.
     * The first way is to provide an array of objects where the key is the value and the value is the label.
     * If the key is not provided, the value is used as the label.
     * The second way is to provide an array of objects with the properties "value", "label", "selected", and "disabled".
     * If any of these properties are not provided, they are set to default values.
     * @param {Object[]} arrayData the array data for the select
     * @returns {KSelect} this
     */
    obj.setArrayData = function (arrayData) {

        for (let row of arrayData) {
            let value, label, selected = false, disabled = false;

            if (Array.isArray(row)) {
                if (row[0]) {
                    value = row[0];
                }

                if (row[1]) {
                    label = row[1];
                } else {
                    label = value;
                }
            } else {
                if (row.value) {
                    value = row.value;
                } else {
                    value = row;
                }
                if (row.label) {
                    label = row.label;
                } else {
                    label = row;
                }
                if (row.selected) {
                    selected = row.selected;
                }
                if (row.disabled) {
                    disabled = row.disabled;
                }
            }


            obj.addOption(value, label, selected, disabled);
        }
    }


    /**
     * Called after the select object is published.
     * Sets the array data of the select object from the array data callback.
     * @param {KSelect} obj - The select object.
     * @returns {KSelect} The select object.
     */
    obj.postPublishedCallback = function (obj) {
        if (obj.dom.childNodes.length == 0) {
            obj.setArrayData(obj.arrayDataCallback());
        }
        return obj;
    }

    obj.clone = function (className = KSelect) {
        let obj2 = new className();
        obj2.arrayDataCallback = obj.arrayDataCallback;
        return obj2;
    }

    obj.clear = function () {
        while (obj.dom.length > 0) {
            obj.dom.remove(0);
        }
        return obj;
    }

    return obj;
}


/**
 * Creates a new instance of the KCanvas class, which is a visual component that represents a canvas element.
 * Must be implement a draw function that will be called after the canvas is rendered.
 * This function callback will be passed through  {@link KicsyVisualComponent#setValue} method.
 * Must use setReferenceSize}
 * 
 * @param {...any} args - Additional arguments to pass to the constructor.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KCanvas(...args) {
    // Create a new instance of the KicsyVisualComponent class with the "canvas" HTML tag and the provided arguments.
    let obj = new KicsyVisualComponent("canvas", ...args);

    /**
     * Sets the value of the drawCallback property of the KicsyVisualComponent instance.
     * The drawCallback is a function that will be called after the canvas is rendered.
     * It is mandatory to call  method to setReferenceSize mothod before setting the drawCallback.
     * x
     *
     * @param {Function} value - The function to be set as the drawCallback.
     * @return {Object} The current instance of the KicsyVisualComponent.
     */
    obj.setValue = function (value) {
        // Set the drawCallback property of the KicsyVisualComponent instance to the provided value.
        obj.drawCallback = value;
        // Return the current instance of the KicsyVisualComponent.
        return this;
    }

    /**
     * Get the value of the drawCallback property of the KicsyVisualComponent instance.
     *
     * @returns {Function} The drawCallback function.
     */
    obj.getValue = function () {
        // Return the drawCallback property of the KicsyVisualComponent instance.
        return obj.drawCallback;
    }

    /**
     * Sets the reference size of the canvas DOM element.
     * The reference size is the size that the canvas will be rendered at.
     *
     * @param {number|string} width - The width of the canvas. If a number is provided, it is converted to a string and appended with "px".
     * @param {number|string} height - The height of the canvas. If a number is provided, it is converted to a string and appended with "px".
     * @return {KicsyVisualComponent} - The current instance of the KicsyVisualComponent class.
     */
    obj.setReferenceSize = function (width, height) {
        // Convert the width and height to strings and remove any non-digit characters.
        let widthStr = width.toString().match(/\d+/)[0];
        let heightStr = height.toString().match(/\d+/)[0];

        // Set the width and height of the canvas DOM element.
        obj.dom.width = widthStr;
        obj.dom.height = heightStr;

        // Return the current instance of the KicsyVisualComponent class.
        return this;
    }

    // Define the postPublished method to be called after the component is published.
    obj.postPublishedCallback = function (obj) {
        // Get the 2D rendering context of the DOM element's canvas.
        let ctx = obj.dom.getContext("2d");
        // Get the drawCallback property of the KicsyVisualComponent instance.
        let callback = obj.drawCallback;
        // Call the drawCallback function with the 2D rendering context as the argument.
        callback(ctx);
    }

    // Return the newly created KicsyVisualComponent instance.
    return obj;
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

    add(...components) {
        super.add(...components);
        components.forEach(c => c.addCssText("display: block;"));
        return this;
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



class KDataTableViewClass extends KicsyVisualContainerComponent {

    rowCssText = "";
    arrayData = [];
    columns = [];
    cssTextNormalRow = "background-color: white; color: black;";
    cssTextDeletedRow = "background-color: red; color: white;";
    rowIndex;
    captions;
    body;
    captionAdjustment = 8;

    addRowCssText(cssText) {
        this.rowCssText = cssText;
        return this;
    }

    addColumn(component, name, description = "", width = 80) {
        component.addEvent("focus",
            function (e) {
                let row = e.target.parentNode.kicsy;
                let dateTable = e.target.parentNode.parentNode.parentNode.kicsy;
                if (row.rowIndex == (dateTable.rowIndex - 1)) {
                    dateTable.newRow();
                }
            }
        );

        this.columns.push({ "component": component, "name": name, "description": description, "width": width });
        return this;
    }

    clear() {

        this.body.clear();
        this.rowIndex = 0;
        return this;
    }

    newRow() {

        //create row
        let row = KRow();
        row.cssTextNormalRow = this.cssTextNormalRow;
        row.cssTextDeletedRow = this.cssTextDeletedRow;
        row.status = "normal";
        row.rowIndex = this.rowIndex;

        //Add cursor to row
        row.add(
            KButton("X")
                .addCssText("width:20px;")
                .addEvent("click", () => {
                    if (row.status == "normal") {
                        row.status = "deleted";
                        row.addCssTextToChildren(row.cssTextDeletedRow);
                    } else {
                        row.status = "normal";
                        row.addCssTextToChildren(row.cssTextNormalRow);
                    }
                })
        )
            .addCssText(this.rowCssText);

        //Add other columns
        for (let colIndex = 0; colIndex < this.columns.length; colIndex++) {
            let col = this.columns[colIndex];
            let component = col.component.clone();
            component
                .setName(col.name)
                //.addCssText("width: " + col.width + "px;");
                .setSize(col.width);
            if (this.rowIndex < this.arrayData.length) {
                component.setValue(this.arrayData[this.rowIndex][col.name]);
            }
            row.add(component);
        }
        this.rowIndex++;
        this.body.add(row);


    }

    configureCaptions() {
        this.captions.clear();
        this.buttonsBar.clear();

        let x = 0;
        for (let colIndex = 0; colIndex < this.columns.length; colIndex++) {
            let col = this.columns[colIndex];
            let w = col.width + this.captionAdjustment;
            x = x + w;
            let component = KLayer().setValue(col.description).setSize(w).addCssText("display: inline-block; text-align: center;margin:4px;");
            this.captions.add(component);
            let buttonUp = KButton(String.fromCodePoint(0x25B2))
                .addCssText("position:absolute;display: inline-block;width:20px;height:20px;left:" + (x - 20) + "px;")
                .addEvent("click", () => {
                    this.clear();
                    let t = this.arrayData.sort(function (a, b) { return a[col.name] > b[col.name] });;
                    this.setArrayData(t);

                })


            let buttonDown = KButton(String.fromCodePoint(0x25BC))
                .addCssText("position:absolute;display: inline-block;width:20px;height:20px;left:" + x + "px;")
                .addEvent("click", () => {
                    this.clear();
                    let t = this.arrayData.sort((a, b) => a[col.name] < b[col.name]);
                    this.setArrayData(t);
                })

            this.buttonsBar.add(buttonUp, buttonDown);
        }
        return this;
    }



    setArrayData(arrayData) {
        this.rowIndex = 0;
        this.arrayData = arrayData;
        for (let rowIndex = 0; rowIndex < this.arrayData.length; rowIndex++) {
            this.newRow();
        }

        if (this.captions.dom.childNodes.length == 0) {
            this.configureCaptions();
        }

        return this;
    }


    getArrayData(callback) {
        let result = [];

        for (let iRow = 0; iRow < this.body.dom.childNodes.length; iRow++) {
            let row = this.body.dom.childNodes[iRow].kicsy.getData();
            result.push(row);
        }
        if (callback != undefined) {
            callback(result);
            return this;
        } else {
            return result;
        }
    }

    /**
     * Returns an array of objects containing the status of each row of the data table.
     * The status can be "insert", "delete" or "update".
     * The data property contains the data of the row.
     * @param {function} [callback] - An optional callback function to call with the array of objects.
     * @return {Array|KDataTableView} - If a callback function is provided, the current instance of the data table is returned. Otherwise, an array of objects is returned.
     */
    getStructuredArrayData(callback) {
        let source = this.arrayData;
        let target = this.getArrayData();
        let columnsNames = this.columns.map((col) => col.name);
        let result = [];

        for (let iRow = 0; iRow < target.length; iRow++) {

            //detect new rows
            if (iRow >= source.length) {

                for (let columnName of columnsNames) {
                    let r0 = target[iRow][columnName].toString().trim();
                    if (r0 != "") {
                        result.push({ "status": "insert", "data": target[iRow] });
                        break;
                    }
                }

                continue;
            }


            //detect deleted rows
            let row = this.body.dom.childNodes[iRow].kicsy;
            if (row.status == "deleted") {
                result.push({ "status": "delete", "data": row.getData() });
                continue;
            }

            //detect changed rows
            for (let columnName of columnsNames) {
                let r0 = target[iRow][columnName].toString().trim();
                let r1 = source[iRow][columnName].toString().trim();

                if (r0 != r1) {
                    result.push({ "status": "update", "data": target[iRow] });
                    continue;
                }
            }


        }

        if (callback != undefined) {
            callback(result);
            return this;
        } else {
            return result;
        }

    }


    constructor() {
        super();

        this.captions = KRow();
        this.buttonsBar = KRow();
        this.body = KRow();

        this.addCssText("display: block;  background-color: silver; border: 1px solid #ccc; border-radius: 8px; margin: 0px; padding: 0px; left: 0px; top: 0px;");
        this.captions.addCssText("display: block;  margin: 4px; padding: 0px; height: 20px; width: fit-content;");
        this.buttonsBar.addCssText("display: block; margin: 4px; padding: 0px; height: 20px; width: fit-content;");
        this.body.addCssText("display: block;  margin: 4px; padding: 0px; height: calc(100% - 68px); overflow-y: scroll;");
        this.add(this.captions, this.buttonsBar, this.body);


    }
}

function KDataTableView() {
    let obj = new KDataTableViewClass();
    return obj;
}


/**
 * KDataTableViewProRowClass
 
Sure, here's a succinct explanation of what each method does in the `KDataTableViewProRowClass`:
 
- `getStructuredArrayData()`: This method returns an object containing the data from the row and its status. It loops through each child node of the row's DOM element and compares its value to the corresponding value in the `arrayData`. If the values are different, it sets the status to "update".
 
- `constructor(table, arrayData)`: This is the constructor method for the `KDataTableViewProRowClass`. It sets the `table` and `arrayData` properties, adds the CSS text for the row, increments the `mainRowIndex` of the table, adds a cursor button, and adds each column to the row.
 
Here's a list format for each method:
 
- `getStructuredArrayData()`:
  - Returns an object containing the data from the row and its status.
 
- `constructor(table, arrayData)`:
  - Sets the `table` and `arrayData` properties.
  - Adds the CSS text for the row.
  - Increments the `mainRowIndex` of the table.
  - Adds a cursor button.
  - Adds each column to the row.
 
 */
class KDataTableViewProRowClass extends KRowClass {

    /** @type {string} 
     * @description The status of the row. It can be "insert", "update" or "delete". Must be empty or "" when the row is created from data source
     */
    status;
    /**
     * @type {number}
     * @description The index of the row in the table.
     */
    rowIndex = 0;

    /**
     * @type {object}
     * @description The array data of the row.
     */
    arrayData;

    /**
     * @type {KDataTableViewProClass}
     * @description The table that the row belongs to.
     */
    table;

    height = "20px";

    /**
     * Returns an object containing the data from the row and its status.
     * 
     * The returned object has the following properties:
     * - `data`: The data from the row as an object where the keys are the names of the columns and the values are the values of the columns.
     * - `status`: The status of the row. It can be "insert", "update",  "delete",  "source" or "discard".
     * 
     * @returns {object} - The object containing the data and status of the row.
     */


    newRowWasCreated = false;

    getStructuredArrayData() {

        let result = {};
        result.data = this.arrayData || {};
        result.status = this.status;

        for (let i = 1; i < this.dom.childNodes.length; i++) {
            let comp = this.dom.childNodes[i];
            let name = comp.kicsy.dom.name;
            let value = comp.kicsy.getValue();

            if (value == undefined) {
                result.status = "discard";
                this.status = result.status;
                return result;
            }

            if (this.status == "source" || this.status == "update") {
                if (value.toString() != this.arrayData[name].toString()) {
                    result.status = "update";
                }
            }
            else if (this.status == "insert") {
                result.status = "insert";
            }


            if (!Number.isNaN(value)) {
                value = Number(value);
            }
            result.data[name] = value;
        }

        this.status = result.status;
        return result;
    }

    constructor(table, arrayData) {
        super();

        this.table = table;
        this.arrayData = arrayData;
        this.addCssText(this.table.rowCssText);
        this.rowIndex = this.table.mainRowIndex++;


        //Add cursor
        let cursor = KButton("X")
            .addCssText(this.table.cursorCssText)
            .addEvent("click", () => {

                switch (this.status) {
                    case "source":
                    case "update":
                        this.status = "delete";
                        this.addCssTextToChildren(this.table.rowDeletedCssText);
                        break;

                    case "delete":
                        this.status = "source";
                        this.addCssTextToChildren(this.table.rowSourceCssText);
                        break;

                    case "insert": //discard
                        this.status = "discard";
                        this.addCssTextToChildren(this.table.rowDeletedCssText);
                        break;

                    case "discard":
                        this.status = "insert";
                        this.addCssTextToChildren(this.table.rowSourceCssText);
                        break;

                }
            })

        this.add(cursor);


        //Add each columns
        for (let col of this.table.columns) {
            let component = col.component.clone();
            component.dom.style.verticalAlign = "top";
            this.add(component);
            component.setSize(col.width, this.height);
            component.setName(col.name);
            component.dataTableProRow = this;
            component.addEvent("focus", function (e) {
                e.target.kicsy.dataTableProRow.newRow(e.target);
            })


        }
    }

    setup() {
        let indexNode = 1;
        for (let col of this.table.columns) {
            if (this.arrayData != undefined) {
                let component = this.dom.childNodes[indexNode].kicsy;
                console.log(component.id, component.dom.id);
                component.setValue(this.arrayData[col.name]);
                indexNode++;
            }
        }
    }

    newRow(component) {
        let row = component.kicsy.dataTableProRow;

        if (row.dom.parentNode.lastChild == row.dom) {
            row.table.newRow();
        }

    }
}



/**
 * 
 
This class definition is for `KDataTableViewProColumnClass`, which represents a column in a data table view. Here's a brief explanation of its methods:
 
* `constructor(component, name, description = "", width = 80)`: Initializes a new column instance with the provided component, name, description, and width. The description and width have default values if not provided.
 
Note that this class only has a constructor method, which sets up the initial state of the column instance. It does not have any other methods.
 */
class KDataTableViewProColumnClass {
    constructor(component, name, description = "", width = 80) {
        this.component = component;
        this.name = name;
        this.description = description;
        this.width = width;

    }
}

class KDataTableViewProClass extends KDataTableViewClass {

    tableCssText = "display: block; position: absolute; background-color: silver; border: 1px solid magenta; border-radius: 8px; margin: 0px; padding: 0px; left: 0px; top: 0px;";
    captionsBarCssText = "display: block; position: absolute; margin: 0px; padding: 0px; height: 2rem; width: 100%; top:0px; left:0px; border: none;";
    captionCssText = "display: inline-block; margin:0px; padding: 4px;border: none; text-align: center;";
    bodyCssText = "display: block; position: absolute; left: 0px; top: 2rem;  margin: 0px; padding: 0px; height: calc(100% - 2rem); overflow-y: scroll;";
    rowCssText = "display: block;  margin: 0px; padding: 2px; height: 20px; width: fit-content;";

    rowSourceCssText = "background-color: white;";
    rowDeletedCssText = "background-color: red;";

    cursorCssText = "display: inline-block; margin:0px; padding: 0px;border: none; text-align: center; width: 20px; height: 20px; vertical-align: top;";

    cursorWidth = 20;
    captionsBarHeight = 20;
    captionsBar;
    buttonsBarHeight = 20;
    buttonsBarWidth = 20;
    columns = [];
    body;

    mainRowIndex = -1;


    constructor() {
        super();
        this.addCssText(this.tableCssText);

        //configure captions bar
        this.captionsBar = KRow().addCssText(this.captionsBarCssText);
        this.add(this.captionsBar);

        //configure body
        this.body = KRow().addCssText(this.bodyCssText);
        this.add(this.body);

    }


    addColumn(component, name, description = "", width = 80) {

        this.columns.push(new KDataTableViewProColumnClass(component, name, description, width));

        let caption = KLayer()
            .setValue(description)
            .setSize(width - (this.buttonsBarWidth * 2), this.captionsBarHeight)
            .addCssText(this.captionCssText);

        if (this.captionsBar.dom.children.length == 0) {
            caption.addCssText("margin-left:" + this.buttonsBarWidth + "px;");
        }

        this.captionsBar.add(caption);
        let buttonUp = KButton("▲").setSize(this.buttonsBarWidth, this.buttonsBarHeight);
        let buttonDown = KButton("▼").setSize(this.buttonsBarWidth, this.buttonsBarHeight);


        buttonUp.addEvent("click", () => {
            this.sortByColumn(name, false);
        })

        buttonDown.addEvent("click", () => {
            this.sortByColumn(name, true);
        })

        this.captionsBar.add(buttonUp, buttonDown);

        return this;
    }

    /**
     * Sorts the array data by the column with the given name. If inverse is true,
     * the sort order is reversed.
     *
     * @param {string} name The name of the column to sort by.
     * @param {boolean} [inverse=false] If true, the sort order is reversed.
     * @returns {KDataTableView} The current object.
     */
    sortByColumn(name, inverse = false) {
        let t;

        if (inverse) {
            t = this.arrayData.sort(function (a, b) { return a[name] < b[name] });
        } else {
            t = this.arrayData.sort(function (a, b) { return a[name] > b[name] });
        }

        this.setArrayData(t);
        return this;
    }

    /**
     * Sets the array data to the given array of objects.
     *
     * @param {Array} arrayData The array of objects to set in the data table.
     * @returns {KDataTableView} The current object.
     */
    setArrayData(arrayData) {
        this.mainRowIndex = -1;
        this.arrayData = arrayData;
        this.body.clear();
        let r;
        for (r of arrayData) {
            this.newRow(r);
        }
        return this;
    }

    /**
     * Creates a new row with the given data.
     * If the data is undefined, the row is created with the status set to "insert".
     * Otherwise, the row is created with the status set to "source".
     * The row is added to the body of the data table.
     * @param {object} [data] - The data object to set for the new row.
     * @return {KDataTableViewProClass} - The current instance of the data table.
     */
    newRow(data) {
        let row = new KDataTableViewProRowClass(this, data);
        if (data == undefined) {
            row.status = "insert";
        } else {
            row.status = "source";
        }
        this.body.add(row);
        row.setup();
        return this;

    }

    /**
     * Retrieves an array of structured data objects from the data viewer's child components.
     * The structured data object is a dictionary with the following keys:
     * - status: the status of the row ("normal", "insert", "update", or "delete").
     * - data: the data object for the row.
     * If a callback function is provided, the array of structured data objects is passed to the callback function, and the current instance of the data viewer is also passed as the second argument to the callback function.
     * @param {function} [callback] - An optional callback function to call with the array of structured data objects. If provided, the current instance of the data viewer is also passed as the second argument to the callback function.
     * @return {Array|KDataViewerClass} - If a callback function is provided, the current instance of the data viewer is returned. Otherwise, an array of structured data objects is returned.
     */
    getStructuredArrayData(callback) {

        let result = [];
        for (let r of this.body.dom.children) {
            let row = r.kicsy.getStructuredArrayData();
            if (row.data != undefined) {
                if (row.status == "insert" || row.status == "update" || row.status == "delete") {
                    result.push(row);
                }
            }
        }

        if (callback != undefined) {
            callback(result);
            return this;
        } else {
            return result;
        }
    }

    /**
     * Adds the provided CSS text to the CSS style of the captions bar.
     * Style is added to the captions bar's DOM element.
     * Must be used after the captions bar has been added to the data viewer.
     * @param {string} cssText - The CSS text to add to the style of the captions bar.
     * @return {KDataViewerClass} - The current instance of the KDataViewerClass class.
     */
    addCaptionCssText(cssText) {
        this.captionCssText += ";" + cssText;
        this.captionsBar.addCssText(this.captionCssText);
        return this;
    }


    /**
     * Adds the provided CSS text to the CSS style of all rows of the data viewer.
     * Style is added to each row's DOM element.
     * Must be used after the rows have been added to the data viewer.
     * @param {string} cssText - The CSS text to add to the style of the rows.
     * @return {KDataViewerClass} - The current instance of the KDataViewerClass class.
     */
    addRowCssText(cssText) {
        this.rowCssText += ";" + cssText;
        return this;
    }

    /**
     * Adds the provided CSS text to the CSS style of the captions bar.
     * Style is added to the captions bar's DOM element.
     * Must be used after the captions bar has been added to the data viewer.
     * @param {string} cssText - The CSS text to add to the style of the captions bar.
     * @return {KDataViewerClass} - The current instance of the KDataViewerClass class.
     */
    addCaptionsBarCssText(cssText) {
        this.captionsBar.addCssText(cssText);
        return this;
    }

    /**
     * Adds the provided CSS text to the CSS style of the body of the data viewer.
     * Style is added to the body's DOM element.
     * Must be used after the body has been added to the data viewer.
     * @param {string} cssText - The CSS text to add to the style of the body.
     * @return {KDataViewerClass} - The current instance of the KDataViewerClass class.
     */
    addBodyCssText(cssText) {
        this.body.addCssText(cssText);
        return this;
    }



}


function KDataTableViewPro() {
    let obj = new KDataTableViewProClass();
    return obj;
}


class KDataTableView2Class extends KicsyVisualContainerComponent {

    arrayData = [];
    newRowCallback = () => { };
    rowCssText = "height: 22px;padding: 4px; border: 1px solid #ccc;";
    oddRowCssText = "background-color: #ccc;";
    evenRowCssText = "background-color: white;";
    cellsCssText = "text-align: center; padding: 4px;";
    headCellsCssText = "";
    contentCellsCssText = "";
    head;
    body;
    columns = [];


    constructor() {
        super();
        this.addCssText("display: block; position: relative; border: 1px solid #ccc; border-radius: 8px; margin: 0px; padding: 0px;");
        this.head = KRow().addCssText("display: block; margin: 0px; padding: 0px; width: 100%; height: fit-content; background-color: #ccc;");
        this.body = KRow().addCssText("display: block; margin: 0px; padding: 0px; height: 100%; overflow-y: scroll;");
        this.add(this.head, this.body);
    }


    setupHead() {
        for (let column of this.columns) {
            let columnHead = KCell()
                .addCssText(this.cellsCssText)
                .addCssText(this.headCellsCssText)
                .setValue(column.description)
                .addCssText("width: " + column.width + ";");
            this.head.add(columnHead);
        }
    }

    /**
     * Sets the array data of the data table view.
     * 
     * If the data table view is published, the existing rows are cleared and new rows are added for each element in the array of data objects.
     * @param {any[]} arrayData - The array of data objects to set in the data table view.
     * @returns {KDataTableView2Class} - The current instance of the KDataTableView2Class class.
     */
    setArrayData(arrayData, clear = true) {
        this.arrayData = arrayData;

        this.head.clear();
        this.setupHead();

        if (clear) {
            this.body.clear();

        }
        if (this.isPublished) {

            // Check if the number of rows in the body is greater than the number of rows in the array of data
            let rowsCount = this.body.dom.childNodes.length;

            // Remove rows from the body if the number of rows in the body is greater than the number of rows in the array of data
            if (rowsCount > this.arrayData.length) {
                for (let i = this.arrayData.length; i < rowsCount; i++) {
                    this.body.dom.childNodes[i].remove();
                }
                // Add rows to the body if the number of rows in the body is less than the number of rows in the array of data
            } else if (rowsCount < this.arrayData.length) {
                for (let i = rowsCount; i < this.arrayData.length; i++) {
                    this.newRow(this.arrayData[i]);
                }
                // Update the data of the rows in the body
            } else {

                for (let i = 0; i < rowsCount; i++) {
                    this.body.dom.childNodes[i].kicsy.setData(this.arrayData[i]);
                }
            }

        }
        return this;
    }


    /**
     * Adds a column to the data table view.
     * @param {function} cellBilderCallback - A callback function that is called for each row of the data table view.
     * The callback function is given the row and data as an arguments and must return a cell component.
     * @param {string} name - The name of the column. This is used to identify the column in the row data.
     * @param {string} [description] - The description of the column. This is displayed in the header of the data table view.
     * @param {number} [width] - The width of the column in pixels.
     * @returns {KDataTableView2Class} - The current instance of the KDataTableView2Class class.
     */
    addColumn(cellBilderCallback, name, description = "", width = "80px") {
        this.columns.push({ "cellBilderCallback": cellBilderCallback, "name": name, "description": description, "width": width });
        return this;
    }



    /**
     * Creates a new row with the given data.
     * @param {object} [rowData] - The data object to set for the new row.
     * @returns {KDataTableView2Class} - The current instance of the KDataTableView2Class class.
     */
    newRow(rowData) {
        let rowsCount = this.body.dom.childNodes.length;
        let row = KRow()
            .addCssText(this.rowCssText)
            .addCssText(rowsCount % 2 == 0 ? this.oddRowCssText : this.evenRowCssText)

        for (let column of this.columns) {
            let cell = column
                // Call the cellBilderCallback function to get the cell component. It has two arguments: the row and the row data
                .cellBilderCallback(row, rowData)
                .addCssText("width: " + column.width + ";")
                .addCssText(this.cellsCssText)
                .addCssText(this.contentCellsCssText)
                .setName(column.name);
            row.add(cell);
        }
        row.setData(rowData);
        this.body.add(row);
        return this;

    }


}

function KDataTableView2() {
    let obj = new KDataTableView2Class();
    return obj;
}



/************************************************************************************ */
/*                           WINDOWS FUNCTIONS                                        */
/************************************************************************************ */


class KWindowsManagerClass extends KicsyObject {

    windows = [];
    constructor() {
        super();
    }

    registerWindow(window) {
        this.windows.push(window);
    }

    descendAllWindows() {
        this.windows.forEach(function (w) {
            //if (w.dom.style.zIndex > 1) { w.dom.style.zIndex--; }
            w.dom.style.zIndex = 1;
        });
    }
}

const KWindowsManager = new KWindowsManagerClass();

class KWindowClass extends KicsyVisualContainerComponent {

    header;
    body;
    footer;
    superHeader;
    superBody;
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
        this.addCssText("position: absolute;border: 4px solid #aaaaaa; border-radius: 8px; margin: 0px; padding: 0px;");
        this.header.addCssText("display: block; position: relative; width: 100%; height: 30px;margin: 0px;text-align: center;line-height: 30px;font-weight: bold;color:white; text-shadow: black 1px 0px 4px;");
        this.body.addCssText("display: block; position: relative; width: 100%;height: calc(100% - 60px);margin: 0px; overflow: scroll;");
        this.footer.addCssText("display: block; position: relative; width: 100%;height: 30px;margin: 0px;");
        this.superHeader.addCssText("display: block; position: relative; margin: 0px;width: 120%; left: -10%; height: 60px; top: calc(-100% - 20px)");
        this.controlButton.addCssText("display: block; position: absolute; margin: 0px;width: 20px; height: 20px; right: 0px; top: 5px; border : 1px solid gray; border-radius: 30px; background-color: red;");

        //shadow
        this.addCssText("box-shadow: 5px 5px 5px gray;");

        //Background styles
        this.header.addCssText("background: linear-gradient(to right,navy 0%, aqua 90%);")
        this.body.addCssText("background-color: white;");
        this.footer.addCssText("background: linear-gradient(to right,navy 0%, white 90%);");

        //Make window draggable
        this.makeDraggable(this.superHeader, this);

        //Control button wth close event
        this.controlButton.addEvent("click", () => {
            this.hide();
        })

        //Add super header click event to climb up
        this.superHeader.addEvent("click", () => {
            KWindowsManager.descendAllWindows();
            this.climb();
        })


        //Add super body
        this.superBody = this.body.clone()
            .addCssText("display: block; position: absolute; width: 100%; height: 100%; margin: 0px; padding: 0px; background-color: black; opacity: 0.5; z-index: 255; visibility: hidden;");
        this.body.add(this.superBody);


        /**
         * Makes the window block the screen by displaying the super body layer.
         *
         * @return {KWindowClass} The current window instance.
         */
        this.block = function () {
            this.superBody.show();
            return this;
        }

        /**
         * Makes the window unblocking the screen
         *
         * @return {KWindowClass} This window
         */
        this.unblock = function () {
            this.superBody.hide();
            return this;
        }



        //pointers
        this.add = function (...args) { this.body.add(...args); return this; };
        this.addToFooter = function (...args) { this.footer.add(...args); return this; };
        this.addCssTextToBody = function (...args) { this.body.addCssText(...args); return this; };


        //Center this window
        this.center();

        //Register to Window's manager
        KWindowsManager.registerWindow(this);


    }

    show() {
        KWindowsManager.descendAllWindows();
        this.dom.style.visibility = "visible";
        this.climb();
        return this;
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


class KNavigationManagerClass extends KicsyObject {
    queue = [];
    //index = 0;
    constructor() {
        super();
    }

    hideAll() {
        for (let i = 0; i < this.queue.length; i++) {
            this.queue[i].hide();
        }
    }
    navigateTo(view) {
        this.hideAll();
        this.push(view);
        view.show();
        return this;
    }

    push(view) {
        if (!view.isPublished) view.publish();
        this.queue.push(view);
        return view;
    }

    back() {
        this.hideAll();
        this.queue.pop();
        this.queue[this.queue.length - 1].show();
    }

    get top() {
        return this.queue[this.queue.length - 1];
    }


    /*
    add(view) {
        this.queue.push(view);
        return this;
    }

    hideAll() {
        for (let i = 0; i < this.queue.length; i++) {
            this.queue[i].hide();
        }
    }

    showTop() {
        this.hideAll();
        this.index = this.queue.length - 1;
        this.queue[this.index].show();

    }

    back() {
        this.hideAll();
        this.index--;
        this.queue[this.index].show();
    }
        */
}

function KNavigationManager() { return new KNavigationManagerClass(); }


class KScreenClass extends KicsyVisualContainerComponent {

    head;
    body;
    backButton;
    title;

    screenCssText = "display: block; position: absolute; width: calc(100% - 16px); height: 100%; margin: 8px; padding: 0px;overflow: hidden;";
    headCssText = "display: block; height: auto; margin: 0px; padding: 8px; background-color: lightblue; border: 1px solid gray;  border-top-left-radius: 8px; border-top-right-radius: 8px;";
    backButtonCssText = "display: inline-block; margin:0px; padding: 0px;border: none; text-align: center; width: 40px; height: 20px; vertical-align: top;";
    titleCssText = "display: inline-block; margin:0px; padding: 0px;border: none; text-align: center; width: calc(100% - 40px); height: 20px; vertical-align: top; font-weight: bold; font-size: 20px;";
    bodyCssText = "display: block; position: relative; margin: 0px; padding: 0px; height: calc(100% - 64px); width: calc(100% - 3px); background-color: lightyellow; border : 1px solid gray; ";
    constructor(kNavigationManager = null) {
        super();

        this.backButton = KButton("↩")
        this.head = new KLayer();
        this.body = new KLayer();
        this.title = KLabel("Kicsy Screen")

        this.head.add(this.backButton, this.title);
        this.add(this.head, this.body);
        this.add = function (...args) { this.body.add(...args); return this; };


        this.addCssText(this.screenCssText);
        this.head.addCssText(this.headCssText);
        this.backButton.addCssText(this.backButtonCssText);
        this.title.addCssText(this.titleCssText);
        this.body.addCssText(this.bodyCssText);


        if (kNavigationManager != null) {
            this.backButton.addEvent("click", () => {
                kNavigationManager.back();
            });
        }

    }



    /*
        constructor(kNavigationManager = null) {
            super();
    
            this.addCssText("display: block; position: absolute; width: 100%; height: 100%; margin: 0px; padding: 0px;");
    
            this.head = new KLayer()
                .addCssText("display: block; height: 40px; margin: 4px; padding: 8px; background-color: lightblue;  border-top-left-radius: 8px; border-top-right-radius: 8px;");
    
            this.body = new KLayer()
                .addCssText("display: block; height: calc(100% - 40px); margin: 0px; padding: 8px; ")
                .addCssText("background-color: lightyellow;")
                .addCssText("border : 1px solid gray;");
    
            //Add back navigation button
            this.backButton = KButton("<-")
                .addCssText("position: absolute; left: 8px; top: 8px;")
                .addCssText("width: 30px; height: 30px;")
                .addCssText("font-size: 20px;");
    
            if (kNavigationManager != null) {
                this.backButton.addEvent("click", () => {
                    kNavigationManager.back();
                });
            }
    
            //Add title
            this.title = KLabel("Kicsy Screen")
                .addCssText("position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);")
                .addCssText("font-size: 20px;")
                .addCssText("font-weight: bold;");
    
            this.head.add(this.backButton, this.title);
            this.add(this.head, this.body);
    
            this.add = function (...args) { this.body.add(...args); return this; };
        }
        */


}

function KScreen(kNavigationManager = null) {
    let obj = new KScreenClass(kNavigationManager);
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
/*                           CRYPTO AREA FUNCTIONS                                    */
/************************************************************************************ */

class KCryptoUtils extends KicsyObject {
    constructor() {
        super();
    }
    // This function generates a hash of the input text using a given size.
    // The hash is an array of integers that represents the input text.
    // The size parameter determines the length of the hash array.
    static hash(text, size = 8) {
        // Initialize an empty array to hold the hash.
        let result = [];

        // Initialize an array of prime numbers.
        let primes = [2];

        // Load primes
        // Start from 3 and increment by 2 until we reach 1000.
        for (let i = 3; i < 1000; i += 2) {
            // Check if the current number is divisible by any of the primes in the array.
            // If it is not divisible by any of the primes, add it to the primes array.
            if (primes.find(x => i % x == 0) === undefined) {
                primes.push(i);
            }
        }

        // Initialize the hash array with zeros.
        // The length of the hash array is determined by the size parameter.
        for (let j = 0; j < size; j++) {
            result.push(0);
        }

        // Initialize variables for the loop.
        let k = 0;  // index for the primes array
        let t = 0;  // temporary variable for calculations

        // Loop through each character in the input text.
        for (let i = 0; i < text.length; i++) {

            // Loop through each element in the hash array.
            for (let j = 0; j < size; j++) {
                // Calculate the new value for the current element in the hash array.
                // Multiply the current element by the prime number at the current index in the primes array.
                // Add the code point of the current character in the text.
                // Take the remainder when dividing by 255.
                // Assign the result to the current element in the hash array.
                t = (result[j] + t + (primes[k] * text.codePointAt(i))) % 255;
                result[j] = t;
            }

            // Increment the index for the primes array.
            // If the index is equal to the length of the primes array, reset it to 0.
            k++;
            if (k == primes.length) {
                k = 0;
            }
        }

        // Return the hash array.
        return result;
    }

    static hashToString(hash) {
        return hash.map(x => x.toString(16).padStart(2, "0")).join("");
    }




    static encrypt(text, hash) {

        let i = 0;

        //Size of output encrypted
        let size = hash.length * (1 + parseInt(text.length / hash.length));

        //Convert text to array of integers
        let textArray = text.split("").map(x => x.charCodeAt(0));


        //Position's array
        let positions = Array(size).fill(0).map(x => x + i++);

        //Initialize vector repiting hash values
        let vector = Object.assign([], positions);

        //Convert poisition indexes to hash on hash arguent
        vector = vector.map(x => hash[x % hash.length]);

        //Sort positions array using vector hashes
        positions.sort(function (a, b) {
            return vector[a] - vector[b];
        })

        //Fill encrypted array with text integers 
        positions.forEach(function (c, index) {
            if (index < textArray.length) {
                vector[c] = textArray[index] ^ vector[c];
            }
        })

        return vector.map(x => x.toString(16).padStart(2, "0")).join("");
    }


    // This function decrypts a given ciphertext using a given hash.
    // It takes in two parameters:
    // - data: the ciphertext to be decrypted, as a string of hexadecimal characters.
    // - hash: the hash to be used for decryption, as an array of integers.
    // It returns the decrypted plaintext, as a string.
    static decrypt(data, hash) {

        // Convert the ciphertext from a string of hexadecimal characters to an array of integers.
        let textArray = data.match(/\w{2}/g).map(x => parseInt(x, 16));

        // Get the length of the ciphertext array.
        let size = textArray.length;

        // Create an empty vector array.
        let vector = [];

        // Repeat the hash values to fill the vector array.
        // The number of repetitions is determined by the size of the vector divided by the size of the hash.
        for (let i = 0; i < size / hash.length; i++) {
            vector = vector.concat(hash);
        }

        // Create an array of position indexes.
        // The length of the positions array is equal to the length of the ciphertext array.
        let i = 0;
        let positions = Array(size).fill(0).map(x => x + i++);

        // Sort the positions array using the values in the vector array as the sorting criteria.
        positions.sort(function (a, b) {
            return vector[a] - vector[b];
        });

        // Reverse the order of the positions array.
        positions = positions.reverse();

        // Create an empty result array.
        let result = [];

        // Fill the result array with the decrypted values.
        // The decrypted value is obtained by XORing the value in the ciphertext array with the corresponding value in the vector array.
        // The values are obtained by accessing the ciphertext array using the positions array.
        positions.forEach(function (c, index) {
            result[index] = textArray[c] ^ vector[c];
        })

        // Reverse the order of the result array.
        result = result.reverse();

        // Convert the decrypted values from integers to characters and join them into a string.
        result = result.map(x => String.fromCharCode(x).split(/\u0000*$/g)[0]).join("");

        // Return the decrypted plaintext.
        return result;
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
                return r;
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
     * @returns {Promise} A promise that resolves with the JSON response or rejects with the HTTP status code.
     */
    remoteSend(url, callback) {
        const formData = new FormData();

        formData.append("message", JSON.stringify(this));

        const requestOptions = {
            method: "POST",
            body: formData
        };

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
        let result = [];
        // Iterate over the applications in the Kicsy.applications array
        Kicsy.applications.forEach(app => {
            // Call the processMessage method of the application with the current instance of the KMessageClass as an argument
            let r = app.processMessage(this);
            if (r != undefined) {
                result.push(r);
            }
        });
        return result;
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

    /**
     * Constructor function for the KApplicationClass.
     *
     * @param {string} [name="Application with no name. Change it now!"] - The name of the application.
     * @param {string} [description="No description"] - The description of the application.
     * @param {Array} [environments=["system"]] - The environments that the application belongs to.
     * @param {HTMLElement} [rootView=undefined] - The root view of the application.
     * @param {number} [version=1] - The version of the application.
     * @param {string} [author="Kicsy"] - The author of the application.
     * @param {Function} [iconDrawer=KDefaultImages("TERMINAL")] - The icon drawer for the application.
     * @param {string} [help="No help exists for this application"] - The help text for the application.
     */
    constructor(
        name = "Application with no name. Change it now!",
        description = "No description",
        environments = ["system"],
        rootView = undefined,
        version = 1,
        author = "Kicsy",
        iconDrawer = function () { return "/Kicsy/media/icons/terminal.png" }, //KDefaultImages("TERMINAL"),
        iconPath = "/Kicsy/media/icons/terminal.png",
        help = "No help exists for this application",
        navigationManager = null) {

        // Call the constructor of the parent class (KicsyObject)
        super();

        // Assign the provided arguments to the corresponding properties of the class instance
        this.name = name;
        this.description = description;
        this.environments = environments;
        this.version = version;
        this.author = author;
        this.rootView = rootView;
        this.iconDrawer = iconDrawer;
        this.iconPath = iconPath;
        this.help = help;
        this.navigationManager = navigationManager;
    }

    /**
     * Registers the application.
     * 
     * @return {KApplicationClass} - The current instance of the KApplicationClass.
     */
    register() {
        // If the root view is defined and it is not already added to the DOM, add it to the main surface.
        if (this.rootView != undefined) {
            if (this.rootView.dom.parentNode == null) {
                this.rootView.publish(Kicsy.mainSurface);
            }
            this.rootView.hide();
        }
        // Add the current instance of the KApplicationClass to the applications array of the Kicsy class.
        Kicsy.applications.push(this);
        // Return the current instance of the KApplicationClass.
        return this;
    }

    /**
     * The run method is called when a message with the action "run" is processed by the application.
     * 
     * @param {Object} message - The message object containing the information needed to run the application.
     * @return {Object} - The message object that was passed as a parameter.
     */
    run(message) {
        // Call the run method and pass the message object as a parameter.
        // Return the message object that was passed as a parameter.
        return message;
    }

    /**
     * Pre-processes the message before it is processed by the application.
     * 
     * @param {Object} message - The message object to be processed.
     * @return {Object} - The processed message object.
     */
    preProcessMessage(message) {
        // Switch on the action property of the message object.
        switch (message.action) {
            // If the action is "run", show the root view and call the run method with the message object as a parameter.
            case "run":
                // If the root view is defined, show it.
                if (this.rootView != undefined) {
                    this.rootView.show();
                }
                // Call the run method and pass the message object as a parameter.
                let r = this.run(message);
                // Return the processed message object.
                return r;
                // Break out of the switch statement.
                break;

            case "getMe_rootView":
                return this.rootView;
                break;

            // If the action is "help", return the help property of the application.
            case "help":
                // Return the help property of the application.
                return this.help;
                // Break out of the switch statement.
                break;

            case "hide":
                this.rootView.hide();
                break;
        }
    }

    /**
     * Processes the message by calling the preProcessMessage method and returning its result.
     * 
     * @param {Object} message - The message object to be processed.
     * @return {Object} - The processed message object.
     */
    processMessage(message) {
        // Call the preProcessMessage method and pass the message object as a parameter.
        // The preProcessMessage method processes the message and returns the result.
        let r = this.preProcessMessage(message);

        // Return the processed message object.
        return r;
    }

}

class KDesktopClass extends KApplicationClass {

    menu;


    constructor() {
        super();

        this.name = "desktop";
        this.description = "Kicsy Desktop Application";
        this.version = "0.0.1";
        this.author = "Kicsy";
        this.help = "Desktop application for Kicsy.";

        //Building the desktop surface
        document.body.style.cssText = "margin: 0px; padding: 0px; overflow: hidden;"

        this.rootView = KRow();
        this.rootView
            .addCssText("display:block; position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; margin: 0px; padding: 0px; overflow: hidden;")
            .addCssText("z-index: 0;");


        this.wallpaper = KRow();
        this.wallpaper.addCssText("display:block; position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px; margin: 0px; padding: 0px; overflow: hidden;")
            .addCssText("background: rgb(255,255,255);")
            .addCssText("background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(128,191,255,1) 5%, rgba(128,191,255,1) 95%, rgba(255,255,255,1) 100%);")
            .addCssText("z-index: 0;");


        //Building the menu
        this.menu = KRow()
            .addCssText("display:block; position: absolute; bottom: 16px; margin:0 50%; transform: translateX(-50%);")
            .addCssText("width: fit-content; max-width: 80%; height: 160px; padding: 0px; overflow-x: scroll; overflow-y: hidden; white-space: nowrap;")
            .addCssText("background-color: rgba(1, 1, 1, 0.1); border-radius: 32px;")
            .addCssText("box-shadow: 5px 5px 5px gray;")
            .addCssText("color: navy; font-family: system-ui;text-shadow: 2px 2px 1px white;font-size: 1em;")


        this.rootView.add(this.menu);

        //publish wallpaper and rootView
        document.body.appendChild(this.wallpaper.dom);
        document.body.appendChild(this.rootView.dom);
        // Set the main surface of the desktop application
        Kicsy.mainSurface = this.rootView.dom;

    }

    addMenuBarCssText(cssText) {
        this.menu.addCssText(cssText);
        return this;

    }

    addRootViewCssText(cssText) {
        this.rootView.addCssText(cssText);
        return this;
    }

    addWallpaperCssText(cssText) {
        this.wallpaper.addCssText(cssText);
        return this;
    }

    processMessage = function (message) {
        // Process the message using the preProcessMessage method.
        this.preProcessMessage(message);

        // Switch on the action property of the message object.
        switch (message.action) {
            // If the action is "update", call the update method to update the menu of the desktop application.
            case "update":
                this.update();
                break;

            case "hide":
                this.rootView.hide();
                this.wallpaper.hide();
                break;

                

            // If the action is "get_rootView", return the rootView of the desktop application.
            case "get_rootView":
                return this.rootView;

        }
        return this;
    }

    /**
     * Function to update the menu of the desktop application.
     * 
     * Updates the menu of the desktop application by iterating over the Kicsy.applications array and adding an icon for each application
     * that is not the desktop application and has a rootView property that is not undefined and is included in the current user's environments.
     * 
     * @returns {this} - The desktop application object.
     */
    update() {
        // Get the name of the desktop application
        let desktopAppName = this.name;

        // Clear the menu of the desktop application
        this.menu.clear();
        let apps = [];
        // Iterate over each application in the Kicsy.applications array
        for (let app of Kicsy.applications) {
            // Check if the application has a rootView property that is not undefined and is included in the current user's environments
            if (app.rootView != undefined && app.name != desktopAppName) {
                // Add the application to the apps array
                for (let env of Kicsy.currentUser.environments) {
                    // Check if the application is included in the current user's environments
                    if (app.environments.includes(env)) {
                        // Add the application to the apps array
                        if (!apps.includes(app)) {
                            apps.push(app);
                        }
                    }
                }
            }
        }


        apps.sort((a, b) => a.name > b.name);


        for (let app of apps) {

            //Application Icon structure
            let appIcon = KRow()
                .addCssText("display:inline-block; position: relative;")
                .addCssText("top: 0px; width: 128px; height: 128px; margin: 16px; padding: 0px;")
                .add(
                    KImage()
                        .setValue(app.iconPath)
                        .addCssText("display:block; position: absolute; top: 0px; left: 0px; margin: 0 auto; transform: translateX(50%); padding: 0px; width: 64px; height: 64px;"),

                    KLayer()
                        .setValue(app.description)
                        .addCssText("display:block; position: absolute; top: 64px; left: 0px; margin: 2px; padding: 0px;")
                        .addCssText("width: 128px; height: max-coontent; white-space: wrap; text-align: center;"),
                )
                .addEvent("click", function (e) {
                    KMessage(desktopAppName, app.name, Kicsy.currentUser.name, Kicsy.currentUser.name, "run").send();
                })
                .addEvent("mouseenter", function (e) {
                    let o = e.target.kicsy;
                    o.addCssText("background-color: rgba(1, 1, 1, 0.25); border-radius: 16px;box-shadow: 5px 5px 5px gray;")
                })
                .addEvent("mouseleave", function (e) {
                    let o = e.target.kicsy;
                    o.addCssText("background: none;box-shadow: none;")
                });

            this.menu.add(appIcon);

        }

        this.rootView.show();

        return this;
    }

};

const KDesktopApp = new KDesktopClass().register().update();




/**
 * Function to create and return a terminal application object.
 * @returns {Object} The terminal application object.
 */
function KTerminalApp() {

    // Create a window for the terminal application.
    let rootView = KWindow("Kicsy Terminal")
        .setSize(480, 240) // Set the size of the window.
        .getMe((me) => {
            me.body.addCssText("background-color: black; color: lime;overflow-y: scroll;"); // Set the background and text color of the window.
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
        let action = "run";

        for (i = 0; i < tokens.length; i++) {
            let line = tokens[i].trim(); // Trim the current token.
            let target = line.match(/^\s*\w*\s*/)[0]; // Get the target of the token.
            let payload = line.substring(target.length).trim(); // Get the payload of the token.
            target = target.trim(); // Trim the target.
            if (payload.length == 0 && result != undefined) { payload = result; } // Set the payload to the result if it is empty.

            payload = payload.toString().trim();

            if (payload.startsWith("--")) {
                if (payload.indexOf(" ") > 0) {
                    action = payload.toString().trim().substring(2, payload.indexOf(" "));
                    payload = payload.substring(payload.indexOf(" ") + 1).trim();
                } else {
                    action = payload.toString().trim().substring(2);
                    payload = "";
                }
            } else {
                action = "run";
            }

            try {
                payload = JSON.parse(payload); // Parse the payload as JSON.
            } catch { }

            if (target.length > 0) {
                result = KMessage("terminal", target, Kicsy.currentUser.name, Kicsy.currentUser.name, action, payload).send(); // Send a message to the target.
                // Last token
                if (tokensLength == i + 1) {

                    if (result != undefined) {
                        if (result.toString().length > 0) {
                            app.newAnswer(result); // Display the result.
                            result = undefined;
                        }
                    } else {
                        if (result != null) app.newLine(); // Create a new line.

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
        let answer = KLayer().addCssText("margin: 0px; padding: 4px;border-width: 0;outline: none;background-color: transparent;color:inherit;width: 100%;"); // Create the text area.
        answer.setValue(text); // Set the value of the text area.
        row.add(answer); // Add the text area to the row.
        app.rootView.add(row); // Add the row to the terminal window.
        app.newLine(); // Create a new line.
    }

    app.processMessage = function (msg) {
        app.preProcessMessage(msg);

        switch (msg.action) {
            case "print":
                app.newAnswer(msg.payload);
                break;
        }
    }

    app.rootView = rootView; // Set the root view of the terminal application.
    app.register(); // Register the terminal application.
    app.newLine(""); // Create a new line in the terminal.
    app.help = "<b>Terminal App</b><br/>"; // Set the help text of the terminal application.
    app.rootView.hide(); // Hide the root view of the terminal application.


    //redirect stdout

    Kicsy.print = function (text) {
        KMessage("terminal", "terminal", "system", "system", "print", text).send();
    }


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

    app.help = "Displays a pop-up alert with the payload of a message.";

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

    app.help = "<b>eval</b> <i>parameters</i><br/>Evaluates the payload of a message and returns the result.<br/>Example:<br/><code>eval 2+2</code>";

    app.run = function (message) {
        return eval(message.payload); // Evaluate the payload of the message using the eval function
    }

    // Register the Eval App in the Kicsy.applications array
    app.register();

    // Return the newly created instance of the Eval App
    return app;
}
KEval();

function KUserApp() {
    let app = new KApplicationClass("user", "User App", ["system"]);
    app.help = "Manage users.";
    app.run = function (message) {
        return Kicsy.user;
    }

    app.processMessage = function (message) {
        let tokens, name, password, environments, payload;

        result = app.preProcessMessage(message);
        if (result) { return result; }

        switch (message.action) {
            case "create":

                tokens = message.payload.split(/\s+/g);
                name = tokens[0];
                password = tokens[1];
                environments = [...tokens.slice(2)];
                payload = {};
                payload.name = name;
                payload.password = password;
                payload.environments = environments;

                KMessage("system", "user", "Kicsy", "system", "user_create", payload)
                    .remoteSend(Kicsy.serverURL, function (response) {
                        Kicsy.print(response);
                    });

                break;

            case "delete":
                tokens = message.payload.split(/\s+/g);
                name = tokens[0];
                password = tokens[1];
                payload = {};
                payload.name = name;
                payload.password = password;
                KMessage("system", "user", "Kicsy", "system", "user_delete", payload)
                    .remoteSend(Kicsy.serverURL, function (response) {
                        Kicsy.print(response);
                    });
                break;

            case "list":
                KMessage("system", "user", "Kicsy", "system", "user_list")
                    .remoteSend(Kicsy.serverURL, async function (response) {
                        let users = await JSON.parse(response);
                        let result = "<b>Users</b><br/>";
                        users.forEach(user => {
                            result += user + "<br/>";
                        })

                        Kicsy.print(result);
                    });
                break;

            case "login":
                tokens = message.payload.split(/\s+/g);
                name = tokens[0];
                password = tokens[1];
                payload = {};
                payload.name = name;
                payload.password = password;
                KMessage("system", "user", "Kicsy", "system", "user_login", payload)
                    .remoteSend(Kicsy.serverURL, function (response) {

                        let message = JSON.parse(response);

                        switch (message.action) {
                            case "user_authenticated":
                                let data = JSON.parse(message.payload);
                                let user = new KUserClass(data.name, data.environments);
                                user.fingerprint = data.fingerprint;
                                Kicsy.currentUser = user;
                                KMessage("system", "desktop", "Selva", "Selva", "update").send();
                                Kicsy.print("Welcome " + data.name);
                                break;

                            case "user_authentication_failed":
                                Kicsy.print(message.payload);
                                break;

                            case "user_not_found":
                                Kicsy.print(message.payload);
                                break;
                        }

                    });
                break;


        }
        return null;
    }

    app.register();
    return app;
}
KUserApp();
KMessage("system", "desktop", "Kicsy", "system", "update").send();


class KNotificationObject extends KicsyObject {
    rootView;
    message;
    timeToDimiss;

    constructor(rootView, message = "Hi", timeToDimiss = 0) {
        super();
        this.rootView = rootView;
        this.message = message;
        this.timeToDimiss = timeToDimiss;

        if (rootView == undefined) {
            this.rootView = KColumn()
                .addCssText("display: block; position: absolute; width: 100%; height:fit-content;left: 0px; top: 0px; margin: 8px; padding: 8px;")
                .addCssText("background-color: lightyellow; border: 1px solid white; border-radius: 8px; box-shadow: 0px 0px 8px black;")
                .add(
                    KLabel()
                        .setValue(this.message),
                    KButton()
                        .setValue("X")
                        .addEvent("click", () => {
                            this.rootView.remove();
                        })
                )

        }
    }

}
function KNotificationApp() {
    let app = new KApplicationClass("notification", "Notification", ["system"]);
    app.help = "Shows notificatation to user";
    app.queue = [];

    app.processMessage = function (message) {
        let result = app.preProcessMessage(message);
        if (result) { return result; }

        switch (message.action) {
            case "add":
                app.queue.push(message.payload);
                break;

        }
    }

    app.register();
}

KNotificationApp();
