import xhrAdapter from './xhr.js';
import httpAdapter from './http.js';

const knownAdapters = {
    http: httpAdapter,
    xhr: xhrAdapter
}

export default{
    getAdapter: function getAdapter(adapters) {

        let adapter

        adapters.forEach(adapter => {
            knownAdapters[adapter]
                ? adapter = knownAdapters[adapter]
                : adapter = null
        });

        return adapter
    }
}