define('task-page/ShowFullScreenVideo', ['jsb', 'jquery', 'task-page/BaseTaskPageState', 'services/LocalStorage'],
    function(jsb, $, BaseTaskPageState, localStorage) {
    "use strict";
    var ShowFullScreenVideo = BaseTaskPageState.extend('ShowFullScreenVideo');

    ShowFullScreenVideo.prototype.show = function() {
        var that = this;
        that.hideElements(['.fox', '.bottom-bar',
            '.curtain', '.fox', '.fox-animation', '.hint-video-container']);
        that.showElements(['.stage', '.video-container']);

        that.domElement.addClass('video-background-blackout');

        /*
        var videoWrapper = that.domElement.find('.video-container');
        videoWrapper.addClass('video-full-screen');
        videoWrapper.css('background-image', 'url(\'' + that.getContextPosterUrl() + '\')');
        */

        that.domElement.find('.video-container video').attr('poster', localStorage.getAbsolutePathForRelativeMediaPath('media/images/black.png'));

        that.options.hintState = that.options.hintState  || false;


        var divVideo = that.domElement.find('video');
        var videoPath = that.getContextVideoUrl();

        that.loadVideo(videoPath , false, that.options.completeCallback, function(){
            if (that.options.hintState  === true) {
                that.setTimer();
            }

			jsb.fireEvent('Tracking::ACTIVITY', {
				"actor": {
					"objectType": "level-system",
					"minigame": that.options.level.miniGameId
				},
				"object": {
					"id": that.options.level.correct + '-' + that.options.level.context,
					"emotion": that.options.level.correct,
					"objectType": "background-video"
				},
				"verb": "show-background-video"
			});

            divVideo.show();
            that.startVideo();
        });
    };


    ShowFullScreenVideo.prototype.setTimer = function() {
        var that = this;

        //Set hint Pic
        var hint = that.domElement.find('.hint-video-container');
        hint.css('background-image','url(\'' + that.getPersonImage() + '\')');
        that.timerHintPicture = setTimeout(function() {
            hint.show();
        }, that.options.level.timeVideo * 1000);

        that.timerHintPictureFadeOut = setTimeout(function() {
            hint.fadeOut();
        }, that.options.level.timeVideoFadeOut * 1000);

        //Set hint sound
        if (that.options.level.miniGameId == 3) {
            that.timerHintAudio = setTimeout(function() {
                that.changeVideoVolume(0.2);
                that.playSound(that.getContextHintAudioUrl(), function () {
                    that.changeVideoVolume(1);
                });
            }, that.options.level.timeAudio * 1000);
        }
    };

    ShowFullScreenVideo.prototype.hide = function() {
        var that = this;

        that.clearTimer();

        that.domElement.removeClass('video-background-blackout');

        that.stopVideo();

        if (that.options.hintState  === true) {
            clearTimeout(that.timerHintPicture);
            clearTimeout(that.timerHintPictureFadeOut);
            clearTimeout(that.timerHintAudio);
            that.stopSound();
        }

        that.domElement.find('.video-container').removeClass('video-full-screen');
        that.hideElements(['.hint-video-container']);
        that.showElements(['.stage', '.fox', '.bottom-bar', '.curtain']);
    };

    return ShowFullScreenVideo;
});