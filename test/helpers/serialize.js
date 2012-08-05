var assert = require('assert'),
	vows = require('vows'),
	helpers = require('../../lib/mailchimp/helpers');

var testArray  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
var testObject = {  
                  first: 1,
                  second: 2,
                  third: 3
                 }; 

vows.describe('Helpers').addBatch({
	
	'The function "serialize"': {

		'fed with an array': {
			topic: helpers.serialize(testArray),
			'returns the correct serialized representation': function (topic) {
				assert.strictEqual(topic, '0=1&1=2&2=3&3=4&4=5&5=6&6=7&7=8&8=9&9=0');
			}
		},
	
		'fed with an object': {
			topic: helpers.serialize(testObject),
			'returns the correct serialized representation': function (topic) {
				assert.strictEqual(topic, 'first=1&second=2&third=3');
			}			
		}
		
	}

}).export(module);