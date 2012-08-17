// Testing events from MailChimpOAuth requires a new instance on a new port for
// every event to be listened for. This isn't really nice but there doesn't 
// seem to be a way to test them properly and sequentially. Or is there?

var assert = require('assert'),
    vows = require('vows'),
    nock = require('nock'),
    request = require('request');

var oauthEndpoint = nock('https://login.mailchimp.com').post('/oauth2/token', 'grant_type=authorization_code&client_id=12345&client_secret=67890&code=codeFromMailChimp&redirect_uri=http%3A%2F%2Fdomain.tld%3A8003')
                                                       .reply(200, "{\"access_token\":\"accessTokenFromMailChimp\",\"expires_in\":0,\"scope\":null}")
                                                       .get('/oauth2/metadata')
                                                       .matchHeader('Authorization', 'OAuth accessTokenFromMailChimp')
                                                       .reply(200, "{\"dc\":\"dc\",\"login_url\":\"https:\/\/login.mailchimp.com\",\"api_endpoint\":\"https:\/\/us1.api.mailchimp.com\"}");

var MailChimpOAuth = require('mailchimp').MailChimpOAuth;

vows.describe('MailChimpAPI').addBatch({

	'Instantiating MailChimp OAuth': {
		
		'without any arguments': {
			topic: function () { return new MailChimpOAuth(); },
			'throws an error': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'You have to specify the client id for this to work.');
			}
		},
		
		'with a clientId': {
			topic: function () { return new MailChimpOAuth({ clientId: '12345' }); },
			'successfully creates an instance': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'You have to specify the client secret for this to work.');
			}			
		},

		'with a clientId and clientSecret': {
			topic: function () { return new MailChimpOAuth({ clientId: '12345', clientSecret: '67890' }); },
			'successfully creates an instance': function (topic) {
				assert.throws(topic, Error);
				assert.strictEqual(topic.message, 'You have to specify a uri for this server as MailChimp needs to reach it from the outside.');
			}			
		},
		
		'with mandatory arguments': {
			topic: function () { return new MailChimpOAuth({ clientId: '12345', clientSecret: '67890', serverUri: 'http://domain.tld', redirectUri: 'https://domain.tld/redirect' }); },
			'successfully creates an instance': function (topic) {
				assert.instanceOf(topic, MailChimpOAuth);
			},
		}
		
	},
		
	'MailChimpOAuth': {
		
		':8001': {
			topic: function () { return new MailChimpOAuth({ clientId: '12345', clientSecret: '67890', serverUri: 'http://domain.tld', redirectUri: 'https://domain.tld/redirect', port: 8001 }); },
			'sits and waits for things to come': function (topic) {
				assert.instanceOf(topic, MailChimpOAuth);
			},
			
			'being asked for the authorize uri': {
				topic: function (oauth) { return oauth.getAuthorizeUri(); },
				'returns the correct autorize uri': function (topic) {
					assert.strictEqual(topic, 'https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=12345&redirect_uri=http%3A%2F%2Fdomain.tld%3A8001');
				}				
			},

			'receiving something other than a GET request back from MailChimp (or elsewhere)': {
				topic: function (oauth) {
					oauth.once('error', this.callback);
					request({ uri : 'http://localhost:8001', method: 'POST'});
				},
				'emits an error': function (error, data) {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'Received something other than a GET request.');
				}
			}

		},
	
		':8002': {
			topic: function () { return new MailChimpOAuth({ clientId: '12345', clientSecret: '67890', serverUri: 'http://domain.tld', redirectUri: 'https://domain.tld/redirect', port: 8002 }); },
			'sits and waits for things to come': function (topic) {
				assert.instanceOf(topic, MailChimpOAuth);
			},

			'receiving a request back from MailChimp (or elsewhere) without a code': {
				topic: function (oauth) {
					oauth.once('error', this.callback);
					request({ uri : 'http://localhost:8002', method: 'GET'});
				},
				'emits an error': function (error, data) {
					assert.instanceOf(error, Error);
					assert.strictEqual(error.message, 'Received a request without a code.');
				}
			}

		},

		':8003': {
			topic: function () { return new MailChimpOAuth({ clientId: '12345', clientSecret: '67890', serverUri: 'http://domain.tld', redirectUri: 'https://domain.tld/redirect', port: 8003 }); },
			'sits and waits for things to come': function (topic) {
				assert.instanceOf(topic, MailChimpOAuth);
			},

			'acquiring an API key after successful authentication': {
				topic: function (oauth) {
					oauthGlobal = oauth;
					oauthGlobal.on('authed', this.callback);
					request({ uri : 'http://localhost:8003?code=codeFromMailChimp', method: 'GET'});
				},
				'returns the correct API key': function (apiKey, discard) {
					assert.strictEqual(apiKey, 'accessTokenFromMailChimp-dc');
				}
			}

		}

	}

}).export(module);