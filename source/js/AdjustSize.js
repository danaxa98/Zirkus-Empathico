define('AdjustSize', ['jsb', 'logging', 'jquery'], function(jsb, logging, $)
{
    "use strict";

    var AdjustSize = function(domElement, options)
    {
        var that = this;
        this.domElement = $(domElement);
        this.options = options || {};
        this.options.height = parseInt(this.options.height, 10);
        this.options.width = parseInt(this.options.width, 10);

        logging.applyLogging(this, 'AdjustSize');
        this.resize();

        $(window).on('resize', function()
        {
           that.resize();
        });

        jsb.on('Page::SHOW', function()
        {
            that.resize();

            setTimeout(function()
            {
                that.resize();
            }, 200);
        });

        setTimeout(function()
        {
            that.resize();
        }, 200);
    };

    AdjustSize.prototype.resize = function()
    {
        var heightOffset = window.innerHeight - this.options.height;
        var widthOffset = window.innerWidth - this.options.width;

        if (window.innerHeight < 1)
        {
            return ;
        }

        if (heightOffset > 0)
        {
            this.domElement.css('marginTop', Math.floor(heightOffset / 2) + 'px');
        }
        else if (heightOffset < 1)
        {
            this.domElement.css('marginTop', 0);
        }

        if (widthOffset > 0)
        {
            this.domElement.css('marginLeft', Math.floor(widthOffset / 2) + 'px');
        }
        else if (widthOffset < 1)
        {
            this.domElement.css('marginLeft', 0);
        }
    };

    return AdjustSize;
});
