
const isXhrAdapterSupported = typeof window !== "undefined"

export default isXhrAdapterSupported && function (config) {
    return new Promise(function dispatchXhrAdapter(resolve, reject) {
        let request = new XMLHttpRequest()

        // request.onreadystatechange = function () {
        //     console.log(request.readyState)
        // }
        request.open(config.method, config.url, true)


        function onloadend() {
            if (!request) return

            const response = {
                data: JSON.parse(request.response),
                status: request.status,
                statusText: request.statusText,
                headers: request.getAllResponseHeaders()
            }

            if (request.status == 200) {
                resolve(response)
            }

            // clean up request 
            request = null
        }

        if ("onloadend" in request) {
            // use onloadend callback if available
            request.onloadend = onloadend
        } else {
            // if unavailable
            // use onreadystatechange to listen for readystate to emulate onloadend
            request.onreadystatechange = function () {
                if (!request && request.readystate !== 4) return

                if (request.status === 0) return
                
                setTimeout(onloadend)
            }
        }


        request.onerror = function () {
            reject("something was wrong!!!")

            // clean up request
            request = null
        }


        request.send()
    })
}