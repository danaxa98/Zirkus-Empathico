define('task-page/mg2/ShowSecondHintState', ['jsb', 'jquery', 'task-page/BaseTaskPageState'], function(jsb, $, BaseTaskPageState)
{
    "use strict";

    var ShowSecondHintState = BaseTaskPageState.extend('ShowSecondHintState');

    ShowSecondHintState.prototype.show = function()
    {
        var that = this;
        that.showElements(['.fox-animation', '.video-container', '.video', '.second-hint']);

        this.domElement
            .find('.second-hint')
            .attr('src', 'img/hint2_' + this.options.level.correct + '_' + this.options.level.hint + '.svg')
            .show();
        that.foxAnimation('fox-pointing');

        this.hideFaceOptions();

        that.playSound('schaunochmal.mp3', function() {
            that.playSound('feature_' + that.options.level.correct + '_' + that.options.level.hint + '.mp3', function() {
                that.domElement.find('button').removeClass('is-correct is-incorrect');
                that.domElement.find('.second-hint').hide();
                that.showFaceOptions();
                that.clearClickPrevention();
                //Disable hint for the further game instruction
                //that.startInactivityTimer();
            });
        });
    };

    ShowSecondHintState.prototype.hide = function()
    {
        var that = this;

        that.clearTimer();
        that.stopSound();
        that.showFaceOptions();
    };

    return ShowSecondHintState;
});
