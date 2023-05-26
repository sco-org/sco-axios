import Axios from './core/Axios.js';

function createInstance () {
    const context = new Axios()

    const instance = Axios.prototype.request.bind(context)

    Object.keys(context).forEach(property => {
        instance[property] = context[property]
    })

    Object.keys(Axios.prototype).forEach(method => {
        instance[method] = Axios.prototype[method]
    })

    return instance
}

const axios = createInstance()

export default axios