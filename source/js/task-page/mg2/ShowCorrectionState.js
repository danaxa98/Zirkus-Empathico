define('task-page/mg2/ShowCorrectionState', ['jsb', 'jquery', 'task-page/BaseTaskPageState'], function(jsb, $, BaseTaskPageState)
{
    "use strict";

    var ShowCorrectionState = BaseTaskPageState.extend('ShowCorrectionState');

    ShowCorrectionState.prototype.show = function()
    {
        var that = this;
        that.showElements(['.fox-animation', '.video-container', '.video', '.stage']);

        var correct_option = null;
        for (var i = 1; i <= 6; i++) {
            if (this.options.level.options[i - 1] == this.options.level.correct) {
                correct_option = i;
            }
        }
        that.foxAnimation('fox-laying-' + correct_option );

        that.domElement.find('.library-card .hint-eyes')
            .attr('src', 'img/hint2_' + that.options.level.correct + '_eyes.svg');
        that.domElement.find('.library-card .hint-mouth')
            .attr('src', 'img/hint2_' + that.options.level.correct + '_mouth.svg');

        that.domElement.find('.library-card .avatar1')
            .attr('src', 'media/images/faces/Ew_' + that.options.level.correct + '.png');
        that.domElement.find('.library-card .avatar2')
            .attr('src', 'media/images/faces/Em_' + that.options.level.correct + '.png');
        that.domElement.find('.library-card .avatar3')
            .attr('src', 'media/images/faces/Km_' + that.options.level.correct + '.png');
        that.domElement.find('.library-card .avatar4')
            .attr('src', 'media/images/faces/Kw_' + that.options.level.correct + '.png');

        that.domElement.find('.no-hint-fox').hide();
        that.addClickPrevention();
        that.playSound('correct_' + this.options.level.correct + '.mp3', function() {
            that.showElements(['.fox-animation', '.library-card']);
            that.hideElements(['.hint-eyes', '.hint-mouth', '.avatar1', '.avatar2',
                '.avatar3', '.avatar4', '.video-container']);
            that.domElement.addClass('is-fourth-hint');
            that.domElement.find('.next-button').addClass('next-button-finish');

            that.stopVideo();
            that.hideVideo();

            that.hideFaceOptions();

            that.foxAnimation("fox-pointing");

            that.domElement.find('.correct-option').css('background-image', 'url("img/emotion_' + that.options.level.correct + '.svg")');
            that.domElement.find('.correct-option').addClass('is-correct');

            that.playSound('soerkenntman_' + that.options.level.correct + '.mp3', function() {
                that.domElement.find('.hint-eyes').fadeIn();

                that.foxAnimation("fox-pointing-eyes");
                that.playSound('feature_' + that.options.level.correct + '_eyes.mp3', function() {
                    that.domElement.find('.hint-mouth').fadeIn();
                    that.foxAnimation("fox-pointing-mouth");
                    that.playSound('feature_' + that.options.level.correct + '_mouth.mp3', function() {
                        that.domElement.find('.avatar1, .avatar2, .avatar3, .avatar4').fadeIn();
                        that.foxAnimation("fox-pointing");
                        that.playSound('face_' + that.options.level.correct + '.mp3', function (){
                            that.domElement.find('.next-button').show();
                            that.clearClickPrevention();
                            that.setTimerWithBlinkingNextBtn();
                        });
                    });
                });
            });
        });
    };

    ShowCorrectionState.prototype.hide = function() {
        var that = this;

        that.clearTimer();

        that.domElement.find('.next-button').removeClass('next-button-finish');
        that.hideElements(['.fox-animation', '.video-container', '.library-card', '.next-button']);


        that.domElement.removeClass('is-fourth-hint');

    };

    return ShowCorrectionState;
});
