export function dispatchRequest(config) {

    const adapter = ""

    return adapter(config).then(function onAdapterResolution(response) {

        return response
    }, function onAdapterRejection(reason) {

        return Promise.reject(reason)
    })
}