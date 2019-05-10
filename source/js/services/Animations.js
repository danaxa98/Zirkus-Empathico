define('services/Animations', ['jsb', 'logging', 'data/Animations', 'underscore'], function(jsb, logging, animationsData, _)
{
    "use strict";
    /**
     *
     * @param {Object} [domElement]
     * @param {Object} [config]
     * @param {String} [config.name]
     * @param {String} [config.defaultCss]
     * @param {Function} [config.complete]
     * @param {Boolean} [config.loop]
     * @constructor
     */
    var Animations = function(domElement, config) {
        logging.applyLogging(this, _.uniqueId('Animations#'), ['setFrame', 'draw',
            'setConfigByAnimation', 'getAnimationByName']);
        this.change(domElement, config);
    };

    /**
     * Play different animation
     * @param {String} [name] Label for an stored animation
     * @param {Function} [callback] Call function after finishing animation
     */
    Animations.prototype.play = function(name, callback){
        var that = this;
        that.change(this.domElement, _.extend(this.config, {'name': name, 'complete': callback}), true);
    };

    /**
     * Init. animation and run if set so.
     * @param {Object} [domElement]
     * @param {Object} [config]
     * @param {Boolean} [forceRun]
     */
    Animations.prototype.change = function(domElement, config, forceRun) {
        var that = this;

        that.domElement = domElement;
        that.setConfigByAnimation(config);

        that.stopAtFirstFrame();
        that.domElement.attr('class',  that.config.defaultCss + ' ' + that.config.name + ' animation-sprite');
        that.domElement.css('background-position', '0px 0px');

        that.domElement.sprite = that;

        if (typeof that.config.size != "undefined") {
            that.domElement.css('width', that.config.size[0] + 'px');
            that.domElement.css('height', that.config.size[1] + 'px');
        }
        if (typeof that.config.margin != "undefined") {
            that.domElement.css('margin',
                that.config.margin[0] + '% ' +
                that.config.margin[1] + '% ' +
                that.config.margin[2] + '% ' +
                that.config.margin[3] + '% ');
        } else {
            that.domElement.css('margin', '0');
        }


        forceRun = forceRun || false;
        if (forceRun || that.config.autoplay) {
            that.start();
        }
    };

    /**
     * Get custom configuration by label.
     * @param name Label of the animation given by data/Animations.js
     * @returns {*}
     */
    Animations.prototype.getAnimationByName = function(name)
    {
        if (animationsData.length === 0) {
            throw new Error('We don\'t have any animations');
        }

        for (var i = 0; i < animationsData.length; i++) {
            if (animationsData[i].name == name) {
                return animationsData[i];
            }
        }

        throw new Error('Animation ' + name + ' not found.');
    };

    /**
     * Create config object based on the selected animation name.

     * @param {function} [config] Config Object
     * @param {function} [config.name] Label of Animation. Is nesseracy attribute.
     * @returns {Object}
     */
    Animations.prototype.setConfigByAnimation = function(config) {
        if (typeof config.name == "undefined") {
            throw Error("You have to provide an animation name!");
        }
        var that = this;

        //Set default values
        if (typeof that.config == "undefined") {
            that.config = {
                fps: 12,
                loop: false,
                currentFrame: 0,
                autoplay: true,
                defaultCss: "fox-animation",
                complete: function(){
                    that.logDebug("Animation " + params.name + " end");
                }
            };

        }

        var params = that.getAnimationByName(config.name);

        config.complete = config.complete || function(){
            that.logDebug("Animation " + params.name + " end");
        };

        that.config = _.extend(that.config, config, params, params.config);
        that.config.interval    = Math.ceil(1000/that.config.fps);
    };
    /**
     * Start sprite animation
     * @returns {Animations}
     */
    Animations.prototype.start = function() {
        var that = this;
        that.stop();
        if (typeof that.intervalID == "undefined") {
            that.timeoutID = setTimeout(function() {
                that.run();
            }, 0);
        }
        return that;
    };
    /**
     * Run sprite animation
     * @returns {Animations}
     */
    Animations.prototype.run = function() {
        var that = this;
        that.config.currentFrame = 0;
        if (typeof that.intervalID == "undefined") {
            that.intervalID = setInterval(function() {
                //console.log("draw ping");
                that.draw();
            }, that.config.interval);
        }
        return that;
    };

    /**
     * Draw current Frame, this function get called by setTimeout each time step.
     * @returns {Animations}
     */
    Animations.prototype.draw = function() {
        var that = this;
        if (that.config.currentFrame >= that.config.animations.run.length) {
            if (that.config.loop) {
                that.config.currentFrame = 0;
            } else {
                that.stop();
                that.config.complete();
                return that;
            }
        }

        //reduce the stack
        //that.setFrame(that.config.currentFrame);
        var frame = that.config.currentFrame;
        var w = 0; var h = 0;
        if (frame !== 0) {
            w = (this.config.size[0] * (frame % this.config.columns)) * - 1;
            h = (this.config.size[1] *
                Math.floor(frame / this.config.columns)) * - 1;
        }

        //this.domElement.css('background-position', w + 'px ' + h + 'px');
        this.domElement[0].style['background-position'] =  w + 'px ' + h + 'px';

        that.config.currentFrame++;
        return that;
    };
    /**
     * Display frame
     * @param frame Number of the frame to display
     */
    Animations.prototype.setFrame = function(frame) {
        var w = 0; var h = 0;
        if (frame !== 0) {
            w = (this.config.size[0] * (frame % this.config.columns)) * - 1;
            h = (this.config.size[1] *
                Math.floor(frame / this.config.columns)) * - 1;
        }

        //this.domElement.css('background-position', w + 'px ' + h + 'px');
        this.domElement[0].style['background-position'] =  w + 'px ' + h + 'px';
    };
    /**
     * Stop sprite animation and set to last Frame
     * @returns {Animations}
     */
    Animations.prototype.stop = function() {
        var that = this;
        that.intervalID = clearInterval(that.intervalID);
        that.timeoutID =  clearTimeout(that.timeoutID);
        if (typeof that.config != "undefined") {
            that.setFrame(that.config.animations.run.length);
        }
        return that;
    };

    /**
     * Stop sprite animation and set to first Frame
     * @returns {Animations}
     */
    Animations.prototype.stopAtFirstFrame = function() {
        var that = this;
        that.intervalID = clearInterval(that.intervalID);
        that.timeoutID =  clearTimeout(this.timeoutID);
        if (typeof that.config != "undefined") {
            that.setFrame(0);
        }
        return that;
    };

    Animations.prototype.getAnimationName = function() {
        var that = this;
        return that.config.name;
    };

    return Animations;
});
