const http = require('http');
const url = require('url');
const jsonHandler = require('./jsonResponses.js');
const HTMLHandler = require('./htmlResponses.js');
const query = require('querystring'); 

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    'GET': {
      '/': HTMLHandler.getIndex,
      '/style.css': HTMLHandler.getCSS,
      '/getUsers': jsonHandler.getUsers,
      '/notReal': jsonHandler.notFound,
      '/updateUser': jsonHandler.updateUser,
      notFound: jsonHandler.notFound,
    },
    'HEAD': {
      '/getUsers': jsonHandler.getUsersMeta,
      '/notReal': jsonHandler.notFoundMeta,
      notFound: jsonHandler.notFoundMeta,
    },
  };


  const handlePost = (request, response, parsedUrl) => {
    if(parsedUrl.pathname === '/addUser') {
      parseBody(request, response, jsonHandler.addUser);
    }
  };
  
  const parseBody = (request, response, handler) => {
    const body = [];
  
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
  
    request.on('data', (chunk) => {
      body.push(chunk);
    });
  
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      handler(request, response, bodyParams);
    });
  };
  
  const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/style.css') {
      HTMLHandler.getCSS(request, response);
    } else if (parsedUrl.pathname === '/getUsers') {
      jsonHandler.getUsers(request, response);
    } else if (parsedUrl.pathname === '/') {
      HTMLHandler.getIndex(request, response);
    }else {
      jsonHandler.notFound(request, response);
    }
  };

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
  
    //if(!urlStruct[request.method]) {
    //  return urlStruct['HEAD'].notFound(request, response);
    //}
    
    if (request.method === 'POST') {
      handlePost(request, response, parsedUrl);
    } else {
      handleGet(request, response, parsedUrl);
    }

  };

http.createServer(onRequest).listen(port, () => {
    console.log(`Server running at 127.0.0.1:${port}`);
});