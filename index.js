var port = process.env.PORT || null;

var Hapi = require('hapi');
var server = new Hapi.Server(port);
var Joi = require('joi');

server.route({
    config: {
        description: 'This is the home page route',
        notes: 'These are my super awesome notes',
        tags: ['Home', 'a', 'b', 'tag tagerson']
    },
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!' + request.query.limit);
    },
    config: {
        validate: {
            params: {
                name: Joi.string().min(3).max(7)
            },
            query: {
                limit: Joi.number().required().min(9)
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'static'
        }
    }
});

server.pack.register([{
    plugin: require('good'),
    options: {
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', request: '*' }]
            }]
        }
    },
    {
        plugin: require('lout')
    }], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

