define('task-page/BaseTaskPageState', ['jsb', 'logging', 'jquery', 'services/media',
        'services/Animations', 'services/LocalStorage'],
    function(jsb, logging, $, mediaService, Animations, localStorage)
{
    "use strict";

    /**
     * @param {Object} [options]
     * @param {Function} [options.completeCallback] go to next state
     * @param {Boolean} [options.hintState] is the current state a hint level
     * @param {Object} [options.level] All settings about the current level
     */
    var BaseTaskPageState = function(domElement, options) {
        var that = this;
        that.domElement = $(domElement);
        that.fox = domElement.find('.fox-animation');
        that.options = options || {};

        //Hook the callback function
        that.options.hookCompleteCallback = that.options.completeCallback;
        that.options.completeCallback = function(){
            return that.nextState.apply(that, arguments);
        };

        logging.applyLogging(this, this.loggingPrefix || 'BaseTaskPageState');

//        this.initializeEventListeners();
    };

    BaseTaskPageState.extend = function (name) {
        var subClass = function(domElement, options)
        {
            this.loggingPrefix = name;
            BaseTaskPageState.apply(this, [domElement, options]);
        };

        $.extend(subClass.prototype, BaseTaskPageState.prototype);

        return subClass;
    };

    BaseTaskPageState.prototype.foxAnimation = function(animationName, loadedCallback) {
        if (typeof this.foxSprite == "undefined") {
            this.foxSprite = new Animations(this.fox,{name: animationName, complete: loadedCallback});
        } else {
            this.foxSprite.stop();
            this.foxSprite.play(animationName, loadedCallback);
        }
        return this.foxSprite;
    };

    BaseTaskPageState.prototype.loadLevelVideo = function(loadedCallback) {
        this.loadVideo(this.options.level.file, true, null, loadedCallback);
    };

    BaseTaskPageState.prototype.playLevelVideo = function() {
        this.playVideo(this.options.level.file, true);
    };

    BaseTaskPageState.prototype.loadVideo = function(fileName, loop, completeCallback, loadedCallback) {
		mediaService.playbackMediaInDomElement({
			'relativeMediaPath': 'media/videos/' + fileName,
            'placeholder': ((typeof fileName == "undefined") ? "" : fileName.match('^.*/(.*)\\.(.*$)')[1] + '.png'),
			'loop': loop,
			'domElement': this.domElement.find('.video')[0],
			'completeCallback': completeCallback,
			'autoStart': false,
			'loadedCallback': loadedCallback
		});
    };

    BaseTaskPageState.prototype.startVideo = function() {
        this.domElement.find('.video')[0].play();
    };

    BaseTaskPageState.prototype.playVideo = function(fileName, loop, completeCallback) {
        this.loadVideo(fileName, loop, completeCallback);
        this.startVideo();
    };

    BaseTaskPageState.prototype.startSound = function() {
        this.domElement.find('.audio')[0].play();
    };

    BaseTaskPageState.prototype.playSound = function(fileName, completeCallback) {
		mediaService.playbackMediaInDomElement({
			'relativeMediaPath': 'media/audios/' + fileName,
            'loop': false,
			'autoStart': true,
			'domElement': this.domElement.find('.audio')[0],
			'completeCallback': completeCallback
		});
    };

    BaseTaskPageState.prototype.playBackgroundSound = function(fileName, completeCallback, config) {
        mediaService.playbackMediaInDomElement(_.extend({
            'relativeMediaPath': 'media/audios/' + fileName,
            'loop': true,
            'autoStart': true,
            'domElement': this.domElement.find('.background-audio')[0],
            'completeCallback': completeCallback,
            'volume': 0.5
        }, config));
    };

    BaseTaskPageState.prototype.stopSound = function() {
        this.domElement.find('.audio')[0].pause();
        this.domElement.find('.audio').off('ended');
        this.domElement.find('.audio').off('error');

        try {
            this.domElement.find('.audio')[0].currentTime = 0;
        } catch (error) {

        }
    };

    BaseTaskPageState.prototype.stopVideo = function() {
        this.domElement.find('.video')[0].pause();

        try {
            this.domElement.find('.video')[0].currentTime = 0;
        } catch (error) {

        }
    };

    BaseTaskPageState.prototype.isSoundPlaying = function() {
        return !this.domElement.find('.audio')[0].paused;
    };

    BaseTaskPageState.prototype.changeVideoVolume = function(volume) {
        this.domElement.find('.video')[0].volume = volume;
    };

    BaseTaskPageState.prototype.changeSoundVolume = function(volume) {
        this.domElement.find('.audio')[0].volume = volume;
    };

    BaseTaskPageState.prototype.showVideo = function() {
        this.domElement.find('.video').show();
    };

    BaseTaskPageState.prototype.hideVideo = function() {
        this.domElement.find('.video').hide();
    };
    /**
     * This function get called before a stage will leaved
     */
    BaseTaskPageState.prototype.resetStage = function() {
        var that = this;
        that.showElements(['.curtain']);
        that.hideElements(['.manikin', '.library-card', '.backgroundstory', '.hint-video-container',
                            '.fox-animation', '.first-option', '.second-option', '.third-option', '.fourth-option', '.fifth-option', '.sixth-option', '.second-hint',
                            '.emotion-list']);
    };

    BaseTaskPageState.prototype.hideFaceOptions = function() {
        this.domElement.find('button').removeClass('is-correct is-incorrect is-used');
        this.hideElements(['.first-option', '.second-option', '.third-option', '.fourth-option', '.fifth-option', '.sixth-option']);
    };

    BaseTaskPageState.prototype.showFaceOptions = function() {
        var optionSelectors = ['.first-option', '.second-option', '.third-option','.fourth-option', '.fifth-option', '.sixth-option'];

        var faceOptionsToShow = [];
        
        for (var i = 0; i <  localStorage.getNumberOfChoicesForCurrentTask(); i++){
            faceOptionsToShow.push(optionSelectors[i]);
            
        }

        this.showElements(faceOptionsToShow);

        //this.showElements(['.first-option', '.second-option', '.third-option', '.fourth-option', '.fifth-option', '.sixth-option']);
    };

    BaseTaskPageState.prototype.hideElements = function(aryCss) {
        var that = this;
        _.each(aryCss, function(className) {
            that.domElement.find(className).hide();
        });
    };

    BaseTaskPageState.prototype.showElements = function(aryCss) {
        var that = this;
        _.each(aryCss, function(className) {
            that.domElement.find(className).show();
        });
    };

    /**
     * Hook function for all callbacks between states.
     */
    BaseTaskPageState.prototype.nextState = function() {
        var that = this;
        if (typeof that.options.hookCompleteCallback === "function") {
            that.resetStage();

            that.options.hookCompleteCallback.apply(that, arguments);
        }
    };

    /**
     * Hook function before skip the current State.
     */
    BaseTaskPageState.prototype.skipState = function() {
        this.nextState();
    };

    /**
     * The Path Builder on the Android device needed more information.
     * Therefore, this helper Function.
     * @returns {string}
     */
    BaseTaskPageState.prototype.getRootPath = function(filename) {
        return localStorage.getAbsolutePathForRelativeMediaPath(filename || "");
    };

    /**
     *Get context image file.
     * @param {String} [type] self or other is possible
     * @returns {string} path without host to context Image
     */
    BaseTaskPageState.prototype.getContextImageUrl = function(type) {
        var that = this;
        if (typeof type == "undefined") {
            if (that.options.level.miniGameId == 1) {
                type  = "self";
            } else {
                type  = "other";
            }
        }
        return that.getRootPath("media/images/context_illustrations/context_"
            + that.options.level.correct + "_"
            + that.options.level.context + "_" + type + ".svg");
    };

    /**
     * Get context audio file.
     * @param {String} [type] self or other is possible
     * @returns {string} mp3 file name
     */
    BaseTaskPageState.prototype.getContextAudioUrl = function(type) {
        var that = this;
        if (typeof type == "undefined") {
            if (that.options.level.miniGameId == 1) {
                type  = "self";
            } else {
                type  = "other";
            }
        }
        return "story_"
            + that.options.level.correct + "_"
            + that.options.level.context
            + "_" + type + ".mp3";
    };
    /**
     * Get Context Hint Audio.
     * @returns {string} Path to context hint audio file.
     */
    BaseTaskPageState.prototype.getContextHintAudioUrl = function() {
        var that = this;
        return "context_hint_"
            + that.options.level.correct + "_"
            + that.options.level.context + ".mp3";
    };

    /**
     * Get context poster for HTML video tag.
     * @returns {string} path to poster file
     */
    BaseTaskPageState.prototype.getContextPosterUrl = function() {
        var that = this;
        return that.getRootPath('media/images/video_posters/context_'
            + that.options.level.correct + '_'
            + that.options.level.context + '.png');
    };
    /**
     * Get the Context Video Url.
     * @returns {string} Path to context video file.
     */
    BaseTaskPageState.prototype.getContextVideoUrl = function(){
        var that = this;
        return "context/"
            + that.options.level.correct + "/"
            + "context_"
            + that.options.level.correct + "_"
            + that.options.level.context +
            ((that.options.level.correct === "neutral" || that.options.level.miniGameId === 1) ? "" :
                ((that.options.level.contextFileExtension !== "") ? "_" + that.options.level.contextFileExtension : ""))
            + ".mp4";
    };

    BaseTaskPageState.prototype.getPersonImage = function() {
        var that = this;
        return that.getRootPath('media/images/faces/' + that.options.level.person.fileName);
    };

    BaseTaskPageState.prototype.clearClickPrevention = function() {
        this.domElement.find('.bottom-bar button').removeClass('click-event-in-progress');
    };

    BaseTaskPageState.prototype.addClickPrevention = function() {
        this.domElement.find('.bottom-bar button').addClass('click-event-in-progress');
    };

    /**
     * double see BasePage.js
     */
    BaseTaskPageState.prototype.playIntroSound = function(filename, beforeIntro, afterIntro, skipIntro, config) {
        config = _.extend({file: filename}, config);
        beforeIntro = beforeIntro || function () { };
        afterIntro = afterIntro || function () { };
        skipIntro = skipIntro || function () { };

        if (localStorage.isIntroActive(config)) {
            beforeIntro();
            this.playSound(filename, afterIntro);
        } else {
            skipIntro();
        }
    };

    BaseTaskPageState.prototype.startInactivityTimer = function(audioFile) {
        var that = this;
        audioFile = audioFile || "inactiv_30_option.mp3";
        that.clearTimer();
        that.setTimer(function(){
            that.playSound(audioFile);
        });
    };

    BaseTaskPageState.prototype.setTimer = function(callback, timeout) {
        var that = this;
        var offsetTime = 5 * 60 * 1000;
        if (that.options.level.miniGameId == 1 || that.options.level.miniGameId == 4) {
            offsetTime =  2 * 60 * 1000;
        }
        timeout = timeout || offsetTime;
        that.mTimeroutId = that.mTimeroutId || [];
        that.mTimeroutId.push(setInterval(function(){
            callback();
        }, timeout));

        return that.mTimeroutId;
    };

    BaseTaskPageState.prototype.setTimerWithBlinkingNextBtn = function() {
        var that = this;
        var nextBtn = that.domElement.find('.next-button');
        var offsetTime = 5 * 60 * 1000;
        if (that.options.level.miniGameId == 1 || that.options.level.miniGameId == 4) {
            offsetTime =  2 * 60 * 1000;
        }

        that.clearTimer();
        that.setTimer(function() {
            that.playSound('inactiv_10_weiter.mp3');

            setTimeout(function() {
                nextBtn.fadeOut(500, function() {
                    setTimeout(function() {
                        nextBtn.fadeIn(500);
                    }, 250);
                });
            }, 2500);
        }, offsetTime); //30000

    };

    BaseTaskPageState.prototype.clearTimer = function(timerId) {
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

    return BaseTaskPageState;
});
