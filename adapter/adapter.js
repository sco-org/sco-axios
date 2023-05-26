
const knownAdapters = {
    http: "",
    xhr: ""
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