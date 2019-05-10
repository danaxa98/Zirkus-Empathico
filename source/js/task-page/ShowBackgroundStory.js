define('task-page/ShowBackgroundStory', ['jsb', 'jquery', 'task-page/BaseTaskPageState'], function(jsb, $, BaseTaskPageState) {
    "use strict";

    var ShowBackgroundStory = BaseTaskPageState.extend('ShowBackgroundStory');

    ShowBackgroundStory.prototype.show = function () {
        var that = this;

        that.hideElements(['.hint-video-container', '.fox', '.bottom-bar', '.video-container']);
        that.showElements(['.stage', '.fox-animation']);

        that.domElement.addClass('show-background-story');

        that.playIntroSound('explanation_mini' + that.options.level.miniGameId + '.mp3', function () {
            that.foxAnimation('fox-attention');
        }, function() {
            that.foxAnimation('fox-attention');
            that.playSound(_.shuffle(['losgehts.mp3', 'aufgepasst.mp3'])[0], function() {
                that.initStage();
            });
        }, function () {
            that.initStage();
        });
    };

    ShowBackgroundStory.prototype.foxAnimation = function(name, callback) {
        var that = this;
        var val = BaseTaskPageState.prototype.foxAnimation.apply(that, [name, callback]);
        that.domElement.find('.fox-animation').css({'margin-bottom': '-9%',
            'margin-left': '-3%'});
        return val;
    };

    ShowBackgroundStory.prototype.initStage = function() {
        var that = this;
        var bgStory = that.domElement.find('.backgroundstory');
        var url = "url('" + that.getContextImageUrl() + "')";
        bgStory.css("background-image", url);
        bgStory.show();

		jsb.fireEvent('Tracking::ACTIVITY', {
			"actor": {
				"objectType": "level-system",
				"minigame": that.options.level.miniGameId
			},
			"object": {
				"id": that.options.level.correct + '-' + that.options.level.context,
				"emotion": that.options.level.correct,
				"objectType": "background-story"
			},
			"verb": "show-background-story"
		});

		that.foxAnimation('fox-pointing');
        that.playSound(that.getContextAudioUrl() , that.options.completeCallback);
    };

    ShowBackgroundStory.prototype.hide = function() {
        var that = this;

        that.clearTimer();

        that.hideElements(['.stage', '.fox-animation']);

        that.stopSound();

        that.domElement.removeClass('show-background-story');
        that.domElement.find('.fox-animation').css({'margin-bottom': '0',
            'margin-left': '0'});
        that.domElement.find('.stage .fox').show();
        that.domElement.find('.bottom-bar').show();
        that.domElement.find('.video-container').show();
        that.domElement.find('.backgroundstory').hide();
    };

    return ShowBackgroundStory;

});