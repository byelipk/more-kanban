import ListenerSupport from './listener-support';

class DataStore {
  constructor(namespace="/api/v1") {
    this.namespace = namespace;
    this.find = this.find.bind(this);
    this.query = this.query.bind(this);
    this.publish = this.publish.bind(this);
    this.request = this.request.bind(this);

    this.listeners = new Map();

    this._identityMap = new Map();
  }

  find(resource, id) {
    if (!id) throw new Error("no id :(");

    resource = resource + 's';

    var url = this.buildURL({ resource, id });

    this.request(url);

    return {};
  }

  query(resource, params) {
    resource = resource + 's';
    var queryString = "";
    var keys = Object.keys(params);

    for (let i = 0; i < keys.length; i += 1) {
      queryString += `${keys[i]}=${params[keys[i]]}`;

      if (i > 0 && i !== keys.length - 1) {
        queryString += "&";
      }
    }

    var url = this.buildURL({resource, queryString});

    this.request( url );
    
    return [];
  }

  buildURL({ resource, id, queryString }) {
    var url = "";

    url += this.namespace + "/";

    if (resource) {
      url += resource;
    }

    if (id) {
      url += "/" + id;
    }

    if (queryString) {
      url += "?" + queryString;
    }

    return url;
  }

  post(resource) {
    throw new Error("NOT YET IMPLEMENTED");
  }

  request(url) {
    return fetch(url)
      .then(response => response.json())
      .then(data => this.publish(data, url))
      .catch(console.error);
  }

  peek(resource) {
    return this._identityMap.get(resource);
  }

  publish(payload, url) {
    var { type, data } = payload;

    this.pushPayload(type, data);

    if (this.listeners.has(type)) {
      this.listeners.get(type).fire({
        url: url,
        type: type, 
        data: this._identityMap.get(type)
      });
    }
  }

  pushPayload(type, data) {
    var collection;
    var map = this._identityMap;

    if (map.has(type)) {
      collection = map.get(type);
    }
    else {
      collection = new Set();
      map.set(type, collection);
    }

    if (data.length) {
      data.forEach(item => collection.add(item));
    }
    else {
      collection.add(data);
    }
  }

  register(cacheKey, callback) {
    if (!this.listeners.has(cacheKey)) {
      this.listeners.set(cacheKey, new ListenerSupport())
      this.listeners.get(cacheKey).register(callback);
    }
  }
}

var Store = (function IFFE() {
  var instance;

  return {
    init: function initializer(cacheKey) {
      if (!instance) {
        instance = new DataStore;
      }

      return instance;
    }
  }
})();

export default Store;