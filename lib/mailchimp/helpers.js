/***
 * Recursively encode an object as application/x-www-form-urlencoded.
 *
 * @param value Value to encode
 * @param key Key to encode (not required for top-level objects)
 * @return Encoded object
 */
var serialize = module.exports.serialize = function (value, key) {
    
	var output;
    key || (key = '');
    
    if (Array.isArray(value)) {
        output = [];
        value.forEach(function(val, index) {
            if (key != '') index = key + '[' + index + ']';
            output.push(serialize(val, index));
        }, this);
        return output.join('&');  
    } else if (typeof(value) == 'object') {
        output = [];
        for (var name in value) {
            if (value[name] && value.hasOwnProperty(name)) {
                output.push(serialize(value[name], key != '' ? key + '[' + name + ']' : name));
            }
        }
        return output.join('&');  
    } else {
        return key + '=' + encodeURIComponent(value);
    }
    
}