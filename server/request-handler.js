/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var querystring = require('querystring');
var messages = {
  results: []
}

exports.requestHandler = function(request, response) {

var statusCode;
var headers = defaultCorsHeaders;
headers['Content-Type'] = 'application/json';



/*
if post && classes/messages
  process the data
  push to messages.results

*/

if (request.method === 'POST') {

    if (request.url === '/classes/messages' || request.url === '/classes/room') {
      statusCode = 201;

      var body ='';

      request.on('data', function(data) {
        body += data;
      });

      request.on('end', function() {
        // var post = querystring.parse(body);
        var post = JSON.parse(body);
        console.log('typeof post:', typeof post);

        console.log('THIS IS THE POST', post.username);

        messages.results.push(post); 

        response.writeHead(statusCode, headers);
        response.end();
      });

    } else {
      statusCode = 404;
    }

} else if (request.method === 'GET') { //404 test is not working because the no endpoint test is logging as a get request 
  
    if (request.url === '/classes/messages' || request.url === '/classes/room') {
      statusCode = 200;

      // console.log(messages.results);  
    } else {
      statusCode = 404;
    }
      response.writeHead(statusCode, headers);
      
      // console.log('messages:', messages);
      // console.log(typeof messages);
      // console.log('stringified:', JSON.stringify(messages));
      // console.log(typeof JSON.stringify(messages));
      // console.log('parsed:', JSON.parse(messages).results);
      // console.log(typeof JSON.parse(messages.results));



      // console.log('MESSAGEEEE', messages.results[0]);
      // console.log('typeof message.results[0]:', typeof messages.results[0]);
      response.end(JSON.stringify(messages));


} else {
  statusCode = 404; 
  response.writeHead(statusCode, headers);
  response.write('404 Not Found');
  response.end();
}

 
console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.


  // See the note below about CORS headers.
  

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.   


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};






// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

