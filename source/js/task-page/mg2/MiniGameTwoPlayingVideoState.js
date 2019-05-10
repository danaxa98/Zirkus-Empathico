define('task-page/mg2/MiniGameTwoPlayingVideoState', ['jsb', 'jquery', 'task-page/BaseTaskPageState'],
    function(jsb, $, BaseTaskPageState)
{
    "use strict";

    var MiniGameTwoPlayingVideoState = BaseTaskPageState.extend('MiniGameTwoPlayingVideoState');

    MiniGameTwoPlayingVideoState.prototype.show = function()
    {
        var that = this;
        that.showElements(['.fox-animation', '.video-container', '.stage']);
        that.hideElements(['.hint-video-container', '.second-hint']);

        that.foxAnimation("fox-attention").stop();

        that.hideFaceOptions();

        that.playIntroSound('explanation_mini' + that.options.level.miniGameId + '.mp3', function() {
            that.hideVideo();
            that.foxAnimation("fox-attention");
        }, function() {
            that.initGame();
        }, function() {
            that.initGame();
        });

    };

    MiniGameTwoPlayingVideoState.prototype.initGame = function() {
        var that = this;
        that.showVideo();
        that.loadLevelVideo(function() {

			jsb.fireEvent('Tracking::ACTIVITY', {
				"actor": {
					"objectType": "level-system",
					"minigame": that.options.level.miniGameId
				},
				"object": {
					"id": that.options.level.file,
					"objectType": "video"
				},
				"verb": "show-video"
			});

            that.logDebug('video loaded');
            that.soundFirstPlayClickHandler = function()
            {
                that.startSound();
            };

            that.domElement.find('.video').one('click', that.soundFirstPlayClickHandler);

            that.foxAnimation("fox-attention");
            that.playSound(_.shuffle(['losgehts.mp3', 'aufgepasst.mp3'])[0], function()
            {
                that.domElement.find('.video').off('click', that.soundFirstPlayClickHandler);
                //that.domElement.find('.no-hint-fox').attr('src', 'img/minigame2_fox_presenting.gif');
                //that.restartAnimation('.no-hint-fox');
                that.startVideo();
            });

            that.currentTimeout = setTimeout(that.options.completeCallback, 4000);
        });
    };
    MiniGameTwoPlayingVideoState.prototype.hide = function()
    {
        var that = this;

        that.clearTimer();

        that.hideElements(['.fox-animation', '.video-container']);

        that.domElement.find('.video').off('click', that.soundFirstPlayClickHandler);
        clearTimeout(this.currentTimeout);
        that.stopSound();
    };

    return MiniGameTwoPlayingVideoState;
});
