(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http')) :
    typeof define === 'function' && define.amd ? define(['http'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.axios = factory(global.http));
})(this, (function (http) { 'use strict';

    const isXhrAdapterSupported = typeof window !== "undefined";

    var xhrAdapter = isXhrAdapterSupported && function (config) {
        return new Promise(function dispatchXhrAdapter(resolve, reject) {
            let request = new XMLHttpRequest();

            // request.onreadystatechange = function () {
            //     console.log(request.readyState)
            // }
            request.open(config.method, config.url, true);


            function onloadend() {
                if (!request) return

                const response = {
                    data: JSON.parse(request.response),
                    status: request.status,
                    statusText: request.statusText,
                    headers: request.getAllResponseHeaders()
                };

                if (request.status == 200) {
                    resolve(response);
                }

                // clean up request 
                request = null;
            }

            if ("onloadend" in request) {
                // use onloadend callback if available
                request.onloadend = onloadend;
            } else {
                // if unavailable
                // use onreadystatechange to listen for readystate to emulate onloadend
                request.onreadystatechange = function () {
                    if (!request && request.readystate !== 4) return

                    if (request.status === 0) return
                    
                    setTimeout(onloadend);
                };
            }


            request.onerror = function () {
                reject("something was wrong!!!");

                // clean up request
                request = null;
            };


            request.send();
        })
    };

    const isHttpAdapterSupported = typeof process !== "undefined";

    var httpAdapter = isHttpAdapterSupported && function httpAdapter(config) {

        return new Promise(function (resolve, reject) {
            const url = new URL(config.url);

            const request = http.request(url, function (res) {

                res.setEncoding("utf-8");

                res.on("data", function (data) {
                    resolve(data);
                });

                ares.on("error", function(error){
                    reject(error);
                });

            });

            request.end();
        })

    };

    const knownAdapters = {
        xhr: xhrAdapter,
        http: httpAdapter
    };

    var adapters = {
        getAdapter: function getAdapter(adapters) {

            let adapterSelected;

            adapters.forEach(adapter => {
                knownAdapters[adapter]
                    ? adapterSelected = knownAdapters[adapter]
                    : undefined;
            });

            console.log(adapterSelected);

            return adapterSelected
        }
    };

    function dispatchRequest(config) {

        const adapter = adapters.getAdapter(["xhr", "http"]);

        return adapter(config).then(function onAdapterResolution(response) {

            return response
        }, function onAdapterRejection(reason) {

            return Promise.reject(reason)
        })
    }

    function Axios () {
        this.interceptor = {
            request: "request handler",
            response: "response handler"
        };
    }

    Axios.prototype.request = function (config) {
        let chain = [dispatchRequest, undefined];

        const promise = new Promise(function (resolve, reject) {
            resolve(config);
        }); 

        // because this promise is fulfilled, so onFulfilled is called. --> dispatchRequest, and config is its parameter
        return promise.then(chain.shift(), chain.shift())
    };

    const aliasMethod = ["get", "delete", "head", "options"];
    const aliasMethodWithData = ["post", "put", "patch"];

    aliasMethod.forEach(item => {
        Axios.prototype[item] = function (url, config) {
            return this.request()
        };
    });

    aliasMethodWithData.forEach(item => {
        Axios.prototype[item] = function (url, data, config) {
            return this.request()
        };
    });

    function createInstance () {
        const context = new Axios();

        const instance = Axios.prototype.request.bind(context);

        Object.keys(context).forEach(property => {
            instance[property] = context[property];
        });

        Object.keys(Axios.prototype).forEach(method => {
            instance[method] = Axios.prototype[method];
        });

        return instance
    }

    const axios = createInstance();

    return axios;

}));
