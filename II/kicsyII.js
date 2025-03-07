/**
 * Kernel class
 */
class KicsyKernel {
    static version = "2.0.0";
    static id = 0;
    static mainSurface = document.body;
    static logStatus = "LOG|WARN|ERROR"; // LOG, WARN, ERROR
}


/**
 * Main class of the Kicsy JS library
 */
class KicsyObject {
    static get id() { return "K" + (KicsyKernel.id++); }

    log(text) {
        if (KicsyKernel.logStatus.indexOf("LOG") > 0) console.log(text);
    }
    warn(text) {
        if (KicsyKernel.logStatus.indexOf("WARN") > 0) console.warn(text);
    }
    error(text) {
        if (KicsyKernel.logStatus.indexOf("ERROR") > 0) console.error(text);
    }

}


/**
 * Main class of the Kicsy JS library used to create components
 */
class KicsyComponent extends KicsyObject {
    /** 
     * The DOM element of the component
     * @type HTMLElement
     * */
    element;


    /**
     * The main surface element in which the component is published
     */
    mainSurface = KicsyKernel.mainSurface;

    /**
     * Creates a new instance of KicsyComponent with the given tag name and type.
     * The component is published in the main surface.
     * @param {string} tagName - The tag name of the component.
     * @param {string} [type] - The type attribute of the component.
     */
    constructor(tagName, type) {
        super();
        this.element = document.createElement(tagName);
        if (type != undefined) {
            this.element.setAttribute("type", type);
        }
        this.element.setAttribute("id", KicsyComponent.id);
        this.mainSurface = KicsyKernel.mainSurface;
        this.mainSurface.appendChild(this.element);
        this.element.kicsy = this;
    }


    /**
     * Calls the provided callback function with the current instance of the KicsyComponent class as an argument.
     * 
     * @param {function} callback - The callback function to call with the current instance as an argument.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class.
     */
    getMe(callback) {
        callback(this);
        return this;
    }


    /**
     * Sets the value of the component's DOM element.
     *
     * @param {string} value - The value to set.
     * @return {KicsyComponent} - Returns the current instance for method chaining.
     */
    setValue(value) {
        this.element.value = value;
        return this;
    }

    /**
     * Gets the value of the component's DOM element.
     * If a callback function is provided, it is called with the value as an argument.
     * Otherwise, the value is returned.
     * @param {function} [callback] - The callback function to call with the value.
     * @return {any|KicsyComponent} - The value of the DOM element if no callback function is provided. Otherwise, the current instance of the KicsyComponent class.
     */
    getValue(callback) {
        if (callback) {
            callback(this.element.value);
            return this;
        }
        return this.element.value;
    }

    /**
     * Adds an event listener to the DOM element.
     * @param {string} eventName - The event to listen for.
     * @param {function} callback - The callback function to call when the event is triggered.
     * @return {KicsyComponent} - The current instance for method chaining.
     */
    addEvent(eventName, callback) {
        this.element.addEventListener(eventName, callback);
        return this;
    }

    /**
     * Sets the name attribute of the component's DOM element.
     *
     * @param {string} name - The value to set for the name attribute.
     * @return {KicsyComponent} - The current instance of the KicsyComponent class for method chaining.
     */

    setName(name) {
        this.element.setAttribute("name", name);
        return this;
    }
}




/**
 * Main class of the Kicsy JS library used to create visual components
 */
class KicsyVisualComponent extends KicsyComponent {
    /**
     * Creates a new instance of KicsyVisualComponent with the given tag name and type.
     * The component is published in the main surface.
     * @param {string} tagName - The tag name of the component.
     * @param {string} [type] - The type attribute of the component.
     */
    constructor(tagName, type) {
        super(tagName, type);
    }


    /**
     * Makes the component visible on the page.
     *
     * @return {KicsyViewComponent} - The current instance of the KicsyViewComponent class.
     */
    show() {
        this.element.style.visibility = "visible";
        return this;
    }

    /**
     * Hides the component on the page.
     *
     * @return {KicsyViewComponent} - The current instance of the KicsyViewComponent class.
     */
    hide() {
        this.element.style.visibility = "hidden";
        return this;
    }


    /**
     * Adds the provided CSS text to the CSS style of the component's DOM element.
     * Style is added to the component's DOM element.
     * @param {string} cssText - The CSS text to add to the style of the component.
     * @return {KicsyViewComponent} - The current instance of the KicsyViewComponent class.
     */
    addCssText(cssText) {
        this.element.style.cssText += ";" + cssText;
        return this;
    }

    /**
     * Sets the data list of the component.
     * If a kDataList is provided, it sets the list attribute of the component's DOM element to the id of the kDataList's DOM element.
     * If a kDataList is not provided, it removes the list attribute of the component's DOM element.
     * @param {KDataList} [kDataList] - The data list to set for the component.
     * @return {KicsyViewComponent} - The current instance of the KicsyViewComponent class.
     */
    setDataList(kDataList = undefined) {
        if (kDataList != undefined) {
            this.element.setAttribute("list", kDataList.element.id);
        } else {
            this.element.removeAttribute("list");
        }
        return this;
    }

    /**
     * Sets the width and height of the component's DOM element.
     *
     * @param {number|string} width - The width of the component. If a number is provided, it is converted to a string and appended with "px".
     * @param {number|string} height - The height of the component. If a number is provided, it is converted to a string and appended with "px".
     * @return {KicsyVisualComponent} - Returns the current instance for method chaining.
     */

    setSize(width, height) {

        if (width != undefined) {
            // If a number is provided for width, convert it to a string and append "px"
            if (!isNaN(width)) {
                width = width + "px";
            }
            this.element.style.width = width;
        }

        if (height != undefined) {
            // If a number is provided for height, convert it to a string and append "px"
            if (!isNaN(height)) {
                height = height + "px";
            }
            this.element.style.height = height;
        }

        return this;
    }
}

/**
 * Main class of the Kicsy JS library used to create visual containers like rows and columns
 */
class KicsyVisualContainerComponent extends KicsyVisualComponent {
    constructor(tagName, type) {
        super(tagName, type);
    }

    /**
     * Adds the provided components to the container.
     * Components are added to the container's DOM element.
     * @param {...KicsyVisualComponent} components - The components to be appended to the container.
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */
    add(...args) {
        for (let c of args) {
            this.element.appendChild(c.element);
        }
        return this;
    }

    /**
     * Sets the flex grow property of the container's DOM element.
     * @param {number} grow - The flex grow value to set.
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */
    setGrow(grow) {
        this.element.style.flexGrow = grow;
        return this;
    }

    /**
     * Sets the flex shrink property of the container's DOM element.
     * 
     * @param {number} shrink - The flex shrink value to set.
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */

    setShrink(shrink) {
        this.element.style.flexShrink = shrink;
        return this;
    }

    /**
     * Sets the flex basis property of the container's DOM element.
     * @param {string} basis - The flex basis value to set.
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */
    setBasis(basis) {
        this.element.style.flexBasis = basis;
        return this;
    }

    /**
     * Sets the data for all child components of the container.
     * If a child component has a setData method, it is called with the entire data object.
     * If a child component has a setValue method and a name attribute, it is called with the corresponding value from the data object.
     * @param {Object} data - The data object to set for the child components.
     * @return {KicsyVisualContainerComponent} - The current instance of the KicsyVisualContainerComponent class.
     */
    setData(data) {
        for (let child of this.element.childNodes) {
            if (child.kicsy.setData != undefined) {
                child.kicsy.setData(data);
            } else if (child.kicsy.setValue != undefined && child.name != undefined && child.name != "") {
                child.kicsy.setValue(data[child.name]);
            }
        }
        return this;
    }

    /**
     * Retrieves data from all child components of the container.
     * If a child component has a getData method, it is called recursively with the current result object.
     * If a child component has a getValue method and a valid name attribute, its value is stored in the result object using the name as the key.
     * 
     * @param {Object} [result={}] - The object to store the retrieved data from child components. If not provided, a new object is created.
     * @return {Object} - The result object containing data from all child components.
     */

    getData(result = {}) {
        for (let child of this.element.childNodes) {
            if (child.kicsy.getData != undefined) {
                result = child.kicsy.getData(result);
            } else if (child.kicsy.getValue != undefined) {
                if (child.name != undefined && child.name != "") {
                    result[child.name] = child.kicsy.getValue();
                }
            }
        }
        return result;
    }

}



/**
 * Provides a way to create and manage data lists. Fill the list with options. This is  the same as HTML datalist.
 */
class KicsyDataList extends KicsyComponent {
    constructor() {
        super("datalist");
    }

    /**
     * Adds an option to the data list.
     * 
     * @param {string|number} value - The value of the option.
     * @param {string} [label=value] - The label of the option. Defaults to the value if not provided.
     * @return {KicsyDataList} - The current instance of the KicsyDataList for method chaining.
     */

    add(value, label) {
        let option = document.createElement("option");
        option.value = value;
        if (label == undefined) label = value;
        option.label = label;
        this.element.appendChild(option);
        return this;
    }
}

/**
 * Creates a new instance of KicsyDataList. Convenience function.
 * 
 * @returns {KicsyDataList} - The newly created KicsyDataList instance.
 * 
 * 
 * @example
 * KColumn(
 *          KDataList()
 *               .bindAs("numberList")
 *               .add(1, "1")
 *               .add(2, "2")
 *               .add(3, "3")
 *               .add(4, "4")
 *               .add(5, "5")
 *               .add(6, "6")
 *               .add(7, "7")
 *               .add(8, "8")
 *               .add(9, "9")
 *               .add(10, "10"),
 *           KText().setDataList(KicsyComponent.bindings.numberList),
 *       );
 * 
 * 
 *
 */

function KDataList() {
    return new KicsyDataList();
}



/**
 * Container for a list of components that can be added using an array of data. 
 * Data is an object with key-value pairs.
 */
class KicsyList extends KicsyVisualContainerComponent {
    /**
     * Sets the callback function that will be called when a new row is added to the list
     * using the setArrayData method. The callback function will receive the row data
     * as the first parameter and should return a KicsyVisualComponent instance.
     * @param {Object} callback - The callback function.
     * @return {KicsyList} - The current instance of the KicsyList class.
     */
    setBuildRowCallback(callback = () => { }) {
        this.buildRowCallback = callback;
        return this;
    }

    /**
     * Sets the array data for the list and adds each row to the list using the buildRowCallback function.
     * 
     * @param {Array} arrayData - The array of data objects to set in the list. Each element in the array
     * is passed to the buildRowCallback function to create a corresponding visual component, which is then
     * added to the list.
     */

    setArrayData(arrayData) {
        this.arrayData = arrayData;
        this.arrayData.forEach(row => {
            this.add(this.buildRowCallback(row));
        })
        return this;
    }

    getArrayData(callback) {

        let array = [];

        for (let row of this.element.childNodes) {
            let data = row.kicsy.getData();
            array.push(data);
        }

        if (callback != undefined) { callback(array); return this } else { return array }
    }

}


/**
 * Convenience function to creates a new instance of KicsyList.
 *
 * @returns {KicsyList} - The newly created KicsyList instance.
 */
function KList() {
    return new KicsyList();
}




/**
 * Creates a new instance of KRow with the provided components.
 *
 * @param {...KicsyVisualComponent} components - The components to be appended to the row.
 * @returns {KicsyVisualContainerComponent} - The newly created KicsyVisualContainerComponent instance.
 */
function KRow(...components) {
    let obj = new KicsyVisualContainerComponent("div");
    obj.addCssText("display: flex; flex-direction: row;");
    obj.add(...components);
    return obj;
}

/**
 * Creates a new instance of KColumn with the provided components.
 *
 * @param {...KicsyVisualComponent} components - The components to be appended to the column.
 * @returns {KicsyVisualContainerComponent} - The newly created KicsyVisualContainerComponent instance.
 */
function KColumn(...components) {
    let obj = new KicsyVisualContainerComponent("div");
    obj.addCssText("display: flex; flex-direction: column;");
    obj.add(...components);
    return obj;
}

/**
 * Creates a new instance of KText with the provided initialValue.
 *
 * @param {string|number} [initialValue] - The initial value of the KText component.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KText(initialValue) {
    let obj = new KicsyVisualComponent("input", "text");
    if (initialValue) obj.setValue(initialValue);
    return obj;
}


/**
 * Creates a new instance of KButton with the provided text.
 *
 * @param {string} [text] - The text to display on the button.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KButton(text) {
    let obj = new KicsyVisualComponent("input", "button");
    if (text) obj.setValue(text);
    return obj;
}

/**
 * Creates a new instance of KLabel with the provided text.
 *
 * @param {string|number} [text] - The initial text of the KLabel component.
 * @returns {KicsyVisualComponent} - The newly created KicsyVisualComponent instance.
 */
function KLabel(text) {
    let obj = new KicsyVisualComponent("label");

    obj.setValue = function (text) {
        obj.element.innerText = text;
        return obj;
    }


    if (text) obj.setValue(text);
    return obj;
}

