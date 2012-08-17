# node-mailchimp

A node.js wrapper for the MailChimp API.

_node-mailchimp_ exposes the following features of the MailChimp API to your node.js application:
 
 * MailChimp API (Versions 1.3, 1.2 and 1.1)
 * MailChimp Export API (Version 1.0)
 * MailChimp Webhooks
 * MailChimp STS API (Version 1.0)
 * MailChimp OAuth2 authorization
 * Mandrill API (Version 1.0)

Further information on the MailChimp API and its features is available at [http://apidocs.mailchimp.com](http://apidocs.mailchimp.com)

## Attention: API changes in 0.9.0

Version 0.9.0 of _node-mailchimp_ changed the API so that your existing applications developed with earlier versions will most probably break. The reason for the changes is being more compliant to node.js code conventions regarding error handling. Please make sure that your applications are refactored to use the new API when updating.

The two important changes are:

1. When throwing errors an error object is now thrown instead of a string like in earlier versions.
2. Every callback now receives two arguments: The first one is an error object which is null when no error occured, the second one the actual data.

The following documentation is using the new API, please refer to it for examples. 

## Installation

Installing using npm (node package manager):

    npm install mailchimp
    
If you don't have npm installed or don't want to use it:

    cd ~/.node_libraries
    git clone git://github.com/gomfunkel/node-mailchimp.git mailchimp

Please note that parts of _node-mailchimp_ depend on [request](http://github.com/mikeal/request) by [Mikeal Rogers](http://github.com/mikeal). This library needs to be installed for the API and Export API to work. Additionally [node-querystring](http://github.com/visionmedia/node-querystring) is needed for the Webhooks to work. If you are using npm all dependencies should be automagically resolved for you.

## Usage

Information on how to use the MailChimp APIs can be found below. Further information on the API methods available can be found at [http://apidocs.mailchimp.com](http://apidocs.mailchimp.com). You can also find further information on how to obtain an API key, how to set up Webhooks and/or OAuth2 in your MailChimp account and much more on the MailChimp API pages.

### MailChimp API

_MailChimpAPI_ takes two arguments. The first argument is your API key, which you can find in your MailChimp Account. The second argument is an options object which can contain the following options:

 * `version` The API version to use (1.1, 1.2 or 1.3). Defaults to 1.3.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.
 
The callback function for each API method gets two arguments. The first one is an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

Example:

```javascript
var MailChimpAPI = require('mailchimp').MailChimpAPI;

var apiKey = 'Your MailChimp API Key';

try { 
    var api = new MailChimpAPI(apiKey, { version : '1.3', secure : false });
} catch (error) {
    console.log(error.message);
}

api.campaigns({ start: 0, limit: 25 }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});

api.campaignStats({ cid : '/* CAMPAIGN ID */' }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```
    
### MailChimp Export API

_MailChimpExportAPI_ takes two arguments. The first argument is your API key, which you can find in your MailChimp Account. The second argument is an options object which can contain the following options:

 * `version` The Export API version to use, currently only 1.0 is available and supported. Defaults to 1.0.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.
 
The callback function for each API method gets two arguments. The first one is an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured. 

Example:

```javascript
var MailChimpExportAPI = require('mailchimp').MailChimpExportAPI;

var apiKey = 'Your MailChimp API Key';

try { 
    var exportApi = new MailChimpExportAPI(apiKey, { version : '1.0', secure: false });
} catch (error) {
    console.log(error.message);
}

exportApi.list({ id : '/* LIST ID */'  }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```
    
### MailChimp Webhooks

_MailChimpWebhook_ takes one argument, an options object which can contain the following options:

 * `port` The port the server is going to listen on. Defaults to 8100.
 * `secret` Secret key as suggested on the Webhook page which is then simply added as a pathname to the Webhook URL in your MailChimp account and checked for. Nothing too fancy but a small enhancement to security. Leave empty (default setting) if you don't want to use a secret key. Example: If you set the secret to 'ChimpSecret' you need to enter the Webhook URL http://www.yourdomain.com/ChimpSecret in the MailChimp Webhook settings.
 * `secure` Credentials as generated by the crypto module. If present HTTPS support is enabled for the server. Defaults to false. 

You can register the following events. The callback function for each of these events receive two arguments. The first argument is an object with the information retrieved, the second argument contains metadata like when the event occurred.

 * `subscribe` Emitted when someone subscribes to your list.
 * `unsubscribe` Emitted when someone unsubscribes from your list.
 * `profile` Emitted when someone updates his profile.
 * `upemail` Emitted when someone changes his email address. Please note that you will receive a `profile` event at the same time.
 * `cleaned` Emitted when an email address is cleaned from you list.
  
Example:

```javascript
var MailChimpWebhook = require('mailchimp').MailChimpWebhook;

var webhook = new MailChimpWebhook();

webhook.on('error', function (error) {
    console.log(error.message);
});

webhook.on('subscribe', function (data, meta) {
    console.log(data.email+' subscribed to your newsletter!'); // Do something with your data!
});

webhook.on('unsubscribe', function (data, meta) {
    console.log(data.email+' unsubscribed from your newsletter!'); // Do something with your data!
});
```

### MailChimp STS API

_MailChimpSTSAPI_ takes two arguments. The first argument is your API key, which you can find in your MailChimp Account. The second argument is an options object which can contain the following options:

 * `version` The STS API version to use, currently only 1.0 is available and supported. Defaults to 1.0.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.
 
The callback function for each API method gets two arguments. The first one is an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured. 

Example:

```javascript
var MailChimpSTSAPI = require('mailchimp').MailChimpSTSAPI;

var apiKey = 'Your MailChimp API Key';

try { 
    var stsApi = new MailChimpSTSAPI(apiKey, { version : '1.0', secure: false });
} catch (error) {
    console.log(error.message);
}

stsApi.VerifyEmailAdress({ email : '/* E-MAIL ADDRESS */'  }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```
    
### MailChimp OAuth2

_MailChimpOAuth_ takes one argument, an options object which can contain the following options:

 * `clientId` The clientId can be obtained from MailChimp, please refer to the API docs on how to do this. The clientId is a required parameter.
 * `clientSecret` The clientSecret can be obtained from MailChimp, please refer to the API docs on how to do this. The clientSecret is a required parameter. 
 * `serverUri` The URI to reach this server from the internet. This URI is required as MailChimp sends a request upon successful authorization of a user.
 * `redirectUri` After a successful authorization on the MailChimp website the user is redirected to this URI, if any. 
 * `port` The port the server is going to listen on. Defaults to 8100.
 * `secure` Credentials as generated by the crypto module. If present HTTPS support is enabled for the server. Defaults to false. 

You can register the following events:

 * `error` This event is emitted when an error occured and receives one argument that contains the error message.
 * `authed` Emitted when the OAuth was completed successfully. Receives one argument which represents the API key that can be passed on to other API functionality.
  
Example:

```javascript
var MailChimpOAuth = require('mailchimp').MailChimpOAuth;
var MailChimpAPI = require('mailchimp').MailChimpAPI;

var options = {
	clientId: 'Your MailChimp client id',
	clientSecret: 'Your MailChimp client secret',
	serverUri: 'http://www.example.com',
	redirectUri: 'http://www.example.com/successfulLogin.html'
};

var oauth = new MailChimpOAuth(options);

console.log(oauth.getAuthorizeUri()); // The MailChimp login URI the user needs to be sent to

oauth.on('error', function (error) {
    console.log(error.message);
});

oauth.on('authed', function (apiKey) {
	
	try { 
	    var api = new MailChimpAPI(apiKey, { version : '1.3', secure : false });
	} catch (error) {
	    console.log(error.message);
	}
	
    api.campaigns({ start: 0, limit: 25 }, function (error, data) {
        if (error)
            console.log(error.message);
        else
            console.log(JSON.stringify(data)); // Do something with your data!
    });
	
});
```
	
### Mandrill API

_MandrillAPI_ takes two arguments. The first argument is your API key, which you can find in your Mandrill Account. The second argument is an options object which can contain the following options:

 * `version` The Mandrill API version to use, currently only 1.0 is available and supported. Defaults to 1.0.
 * `secure` Whether or not to use secure connections over HTTPS (true/false). Defaults to false.
 * `userAgent` Custom User-Agent description to use in the request header.

All of the API categories and methods described in the Mandrill API Documentation ([http://apidocs.mailchimp.com](http://apidocs.mailchimp.com)) are available in this wrapper. The method names in this wrapper reflect the method names of the API and are named `category`\_`method` with dashes (-) in method names being replaced by underscores (\_).

The callback function for each API method gets two arguments. The first one is an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.
 
Example:

```javascript
var MandrillAPI = require('mailchimp').MandrillAPI;

var apiKey = 'Your Mandrill API Key';

try { 
    var mandrill = new MandrillAPI(apiKey, { version : '1.0', secure: false });
} catch (error) {
    console.log(error.message);
}

mandrill.tags_time_series({ tag : '/* TAGNAME */'  }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```
    
A second way to use the Mandrill API is by using the `call` method. This method differentiates between the categories and methods of the Mandrill API more clearly and automatically converts dashes to underscores. The example above using the `call` method looks like the this:

```javascript
var MandrillAPI = require('mailchimp').MandrillAPI;

var apiKey = 'Your Mandrill API Key';

try { 
    var mandrill = new MandrillAPI(apiKey, { version : '1.0', secure: false });
} catch (error) {
    console.log(error.message);
}

mandrill.call('tags', 'time-series', { tag : '/* TAGNAME */'  }, function (error, data) {
    if (error)
        console.log(error.message);
    else
        console.log(JSON.stringify(data)); // Do something with your data!
});
```
	
## License

_node-mailchimp_ is licensed under the MIT License. (See LICENSE) 