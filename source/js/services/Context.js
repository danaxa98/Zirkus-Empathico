define('services/Context',
    ['jsb', 'logging', 'data/Context'],
    function(jsb, logging, contextData) {
    "use strict";

    var Context = function () {
        logging.applyLogging(this, 'Context');
    };
    Context.prototype.getContextByEmotion = function(emotion)
    {
        var context = [];

        if (contextData.length === 0)
        {
            throw new Error('We don\'t have any context');
        }

        for (var i = 0; i < context.length; i++)
        {
            if (contextData[i].emotion == emotion)
            {
                context.push(contextData[i]);
            }
        }

        if (context.length === 0)
        {
            throw new Error('We don\'t have any context with the emotion ' + emotion);
        }

        return context;
    };

    Context.prototype.getContext = function(context)
    {
        var contextDataLength = contextData.length;

        for (var i = 0; i < contextDataLength; i++)
        {
            if (context == contextData[i].context)
            {
                return contextData[i];
            }
        }

        return undefined;
    };

});