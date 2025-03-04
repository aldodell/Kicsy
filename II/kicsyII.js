/**
 * Kernel class
 */
class KicsyKernel {
    static version = "2.0.0";
    static id = 0;
    static mainSurface = document.body;

}


/**
 * Main class of the Kicsy JS library
 */
class KicsyObject {
    static get id() { return "K" + (KicsyKernel.id++); }
    constructor() {

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
        this.mainSurface = KicsyKernel.mainSurface;
        this.element = document.createElement(tagName);
        if (type != undefined) {
            this.element.setAttribute("type", type);
        }
        this.element.setAttribute("id", KicsyComponent.id);
        this.mainSurface.appendChild(this.element);
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