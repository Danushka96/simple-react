import { h } from 'snabbdom';

const createElement = (type, props = {}, ...children) => {
    if (type.prototype && type.prototype.isQndReactClassComponent) {
        const componentInstance = new type(props);

        // remember the current vNode instance
        componentInstance.__vNode = componentInstance.render();

        componentInstance.__vNode.data.hook = {
            create: () => {
                componentInstance.componentDidMount()
            }
        }

        return componentInstance.__vNode;
    }
    if (typeof(type) == 'function') {
        return type(props);
    }
    props = props || {};
    let dataProps = {};
    let eventProps = {};

    // This is to seperate out the text attributes and event listener attributes
    for (let propKey in props) {
        // event props always startwith on eg. onClick, onDblClick etc.
        if (propKey.startsWith('on')) {
            // onClick -> click
            const event = propKey.substring(2).toLowerCase();

            eventProps[event] = props[propKey];
        } else {
            dataProps[propKey] = props[propKey];
        }
    }
    return h(type, { props: dataProps, on: eventProps }, children);
};

class Component {
    constructor() {}

    componentDidMount() {}

    setState(partialState) {
        // update the state by adding the partial state
        this.state = {
                ...this.state,
                ...partialState
            }
            // call the __updater function that QndReactDom gave
        QndReact.__updater(this);
    }

    render() {}
}

// add a static property to differentiate between a class and a function
Component.prototype.isQndReactClassComponent = true;

// to be exported like React.createElement
const QndReact = {
    createElement,
    Component
};

export default QndReact;