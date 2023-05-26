import adapters from '../adapter/adapters.js';

export function dispatchRequest(config) {

    const adapter = adapters.getAdapter(["xhr", "http"])

    return adapter(config).then(function onAdapterResolution(response) {

        return response
    }, function onAdapterRejection(reason) {

        return Promise.reject(reason)
    })
}