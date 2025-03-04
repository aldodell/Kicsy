class KObject {

}


class KComponent extends KObject {
    constructor(...args) {
        super(...args);
    }
    get value() {
        return this.dom.value;
    }
    set value(value) {
        this.dom.value = value;
    }
}

class KVisualComponent extends KComponent {
    constructor(...args) {
        super(...args);
    }
}

class KVisualContainerComponent extends KComponent {
    constructor(...args) {
        super(...args);
    }
}