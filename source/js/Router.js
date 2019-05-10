define('Router', ['Backbone', 'jsb', 'logging', 'jquery'], function(Backbone, jsb, logging, $)
{
    "use strict";

    var Router = Backbone.Router.extend({

        initialize: function(options)
        {
            var that = this;

            logging.applyLogging(this, 'Router');

            var launchHistoryTimer = null;

            var currentPageId = null;

            jsb.on('Page::READY', function(values) {

                if (launchHistoryTimer)
                {
                    clearTimeout(launchHistoryTimer);
                    launchHistoryTimer = null;
                }

                launchHistoryTimer = setTimeout(function()
                {
                    that.logDebug('Launching Backbone history!');
                    Backbone.history.start();
                }, 750);

                that.route(
                    values.path,
                    values.id,
                    function()
                    {
                        if (currentPageId)
                        {
                            jsb.fireEvent('Page::HIDE', {"id": currentPageId});

                        }

                        currentPageId = values.id;

                        that.logDebug('Route at path', values.path, 'launches page', values.id);
                        jsb.fireEvent('Page::SHOW', {"id": values.id, "parameters": Array.prototype.slice.apply(arguments)});
                    }
                );
            });

            that.logDebug('Router is ready!');
            jsb.fireEvent('Router::READY');
        }
    });

    return function(domElement, options) {
        var router = new Router(options);
    };
});