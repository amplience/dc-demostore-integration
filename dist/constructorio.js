const ConstructorIOClient = require('@constructor-io/constructorio-node');
var constructorio = new ConstructorIOClient({
    apiKey: 'key_qFJeU4DThqOqEtQt',
});
console.log(JSON.stringify(constructorio.catalog, undefined, 4));
