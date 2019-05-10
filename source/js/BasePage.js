define('BasePage', ['jsb', 'logging', 'jquery', 'underscore', 'services/media',
        'services/Animations', 'services/LocalStorage'],
    function(jsb, logging, $, _, mediaService, Animations, localStorage)
{
    "use strict";

    var BasePage = function(domElement, options) {
        var that = this;
        that.domElement = $(domElement);
        that.domElement.hide();
        that.options = options || {};
        that.fox = that.domElement.find('.fox-animation');

        logging.applyLogging(that, that.loggingPrefix || 'BasePage');

        that.initializeEventListeners();
    };

    BasePage.extend = function (name) {
        var subClass = function(domElement, options)
        {
            this.loggingPrefix = name;
            BasePage.apply(this, [domElement, options]);
        };

        $.extend(subClass.prototype, BasePage.prototype);

        return subClass;
    };

    BasePage.prototype.show = function (parameters)
    {
        this.domElement.fadeIn();
//        throw new Error('The class ' + this.loggingPrefix + ' does not implement #show()!');
    };

    BasePage.prototype.hide = function ()
    {
        this.domElement.hide();
        this.clearTimer();
//        throw new Error('The class ' + this.loggingPrefix + ' does not implement #hide()!');
    };

    BasePage.prototype.foxAnimation = function(animationName, loadedCallback) {
        var that = this;
        if (typeof that.foxSprite == "undefined") {
            that.foxSprite = new Animations(that.fox,{name: animationName, complete: loadedCallback});
        } else {
            that.foxSprite.stop();
            that.foxSprite.play(animationName, loadedCallback);
        }
        return that.foxSprite;
    };

    BasePage.prototype.initializeEventListeners = function()
    {
        var that = this;

        jsb.on('Page::SHOW', {
            "id": that.options.id
        }, function(values) {
            document.title = that.options.title;
            that.show.apply(that, values.parameters);
            jsb.fireEvent('Page::SHOWED', {
                "id": that.options.id
            });
        });

        jsb.on('Page::HIDE', {
            "id": that.options.id
        }, function() {
            that.hide();
            jsb.fireEvent('Page::HIDDEN', {
                "id": that.options.id
            });
        });

        jsb.fireEvent('Page::READY', {
            'id': this.options.id,
            'path': this.options.path
        });
    };

    BasePage.prototype.playVideo = function(fileName) {
		mediaService.playbackMediaInDomElement({
			relativeMediaPath: 'media/videos/' + fileName,
			domElement: this.domElement.find('.video')[0],
			loop: false
		});
    };

    BasePage.prototype.isSoundPlaying = function() {
        return !this.domElement.find('.audio')[0].paused;
    };

    BasePage.prototype.playSound = function(fileName, completeCallback) {
        if (typeof fileName === "object") {
            fileName = _.shuffle(fileName)[0];
        }
		mediaService.playbackMediaInDomElement({
			relativeMediaPath: 'media/audios/' + fileName,
			domElement: this.domElement.find('.audio')[0],
			loop: false,
			autoStart: true,
            'completeCallback': completeCallback
		});
    };

    BasePage.prototype.playBackgroundSound = function(fileName, completeCallback, config) {
        mediaService.playbackMediaInDomElement(_.extend({
            'relativeMediaPath': 'media/audios/' + fileName,
            'loop': true,
            'autoStart': true,
            'domElement': this.domElement.find('.background-audio')[0],
            'completeCallback': completeCallback,
            'volume': 0.5
        }, config));
    };

    BasePage.prototype.changeVideoVolume = function(volume) {
        this.domElement.find('.video')[0].volume = volume;
    };

    BasePage.prototype.changeSoundVolume = function(volume) {
        this.domElement.find('.audio')[0].volume = volume;
    };

    BasePage.prototype.changeBackgroundSoundVolume = function(volume) {
        this.domElement.find('.background-audio')[0].volume = volume;
    };

    BasePage.prototype.stopSound = function() {
        this.domElement.find('.audio')[0].pause();

        try {
            this.domElement.find('.audio')[0].currentTime = 0;
        } catch (error) {

        }
    };

    BasePage.prototype.stopBackgroundSound = function() {
        this.domElement.find('.background-audio')[0].pause();

        try {
            this.domElement.find('.background-audio')[0].currentTime = 0;
        } catch (error) {

        }
    };

    BasePage.prototype.playClickSound = function(completeCallback, feedback) {
        var that = this;

        if (typeof feedback === "undefined") {
            feedback = true;
        }
        that.lastClickSoundPlayed = that.lastClickSoundPlayed  || (new Date()).getTime();

        if (that.isSoundPlaying() && (new Date()).getTime() - that.lastClickSoundPlayed > 500) {
            if (feedback) {
                that.playBusySound();
            }
        } else {
            that.lastClickSoundPlayed = (new Date()).getTime();
            that.playSound('klick.mp3', completeCallback);
        }
    };

    BasePage.prototype.playBusySound = function() {
        var that = this;
        that.playBackgroundSound('incorrect.mp3', undefined, {'loop': false});
    };

    BasePage.prototype.stopVideo = function() {
        this.domElement.find('.video')[0].pause();

        try {
            this.domElement.find('.video')[0].currentTime = 0;
        } catch (error) {

        }
    };
    /**
     *
     * @param {String} [filename] relative file path to audio
     * @param {Function} [beforeIntro] Before the intro are played call this function
     * @param {Function} [afterIntro] After the intro are played call this function
     * @param {Function} [skipIntro] The Intro already played call skipIntro function.
     * @param {Object} [config]
     * @param {Object} [config.levelId]
     */
    BasePage.prototype.playIntroSound = function(filename, beforeIntro, afterIntro, skipIntro, config) {
        config = _.extend({file: filename}, config);
        beforeIntro = beforeIntro || function(){};
        afterIntro = afterIntro || function(){};
        skipIntro = skipIntro || function(){};

        if (localStorage.isIntroActive(config)) {
            beforeIntro();
            this.playSound(filename, afterIntro);
        } else {
            skipIntro();
        }
    };


    BasePage.prototype.startInactivityTimer = function(audioFile) {
        var that = this;
        audioFile = audioFile || "inactiv_30_option.mp3";
        that.clearTimer();
        that.setTimer(function(){
            that.playSound(audioFile);
        });
    };

    BasePage.prototype.setTimer = function(callback, timeout) {
        var that = this;
        timeout = timeout || 60000;
        that.mTimeroutId = that.mTimeroutId || [];
        that.mTimeroutId.push(setInterval(function(){
            callback();
        }, timeout));

        return that.mTimeroutId;
    };

    BasePage.prototype.clearTimer = function(timerId) {
        var that = this;
        if (timerId) {
            that.mTimeroutId = clearInterval(that.mTimeroutId);
        } else {
            if (typeof that.mTimeroutId == "object") {
                _.map(that.mTimeroutId, function(val){
                    clearInterval(val);
                });
                that.mTimeroutId = [];
            } else {
                that.mTimeroutId = clearInterval(that.mTimeroutId);
            }
        }
    };

    return BasePage;
});
