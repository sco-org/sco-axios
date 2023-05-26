export function Axios () {
    this.interceptor = {
        request: "request handler",
        response: "response handler"
    }
}

Axios.prototype.request = function (config) {
    let chain = [dispathRequest, undefined]

    const promise = new Promise(function (resolve, reject) {
        resolve(config)
    }) 

    // because this promise is fulfilled, so onFulfilled is called. --> dispatchRequest, and config is its parameter
    promise.then(chain.shift(), chain.shift())
}

const aliasMethod = ["get", "delete", "head", "options"]
const aliasMethodWithData = ["post", "put", "patch"]

aliasMethod.forEach(item => {
    Axios.prototype[item] = function (url, config) {
        return this.request()
    }
})

aliasMethodWithData.forEach(item => {
    Axios.prototype[item] = function (url, data, config) {
        return this.request()
    }
})

