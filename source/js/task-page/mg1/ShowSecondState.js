define('task-page/mg1/ShowSecondHintState', ['jsb', 'jquery', 'task-page/BaseTaskPageState'], function(jsb, $, BaseTaskPageState)
{
    "use strict";

    var ShowFirstHintState = BaseTaskPageState.extend('ShowFirstHintState');

    ShowFirstHintState.prototype.show = function()
    {
        var that = this;

        that.foxAnimation('fox-pointing-' + that.options.level.hint);

        /*this.domElement.find('.no-hint-fox').hide();
        this.domElement.find('.first-hint-fox').attr('src', 'img/minigame2_fox_pointing_' + that.options.level.hint + '.gif');
        this.domElement.find('.first-hint-fox').show();
        this.restartAnimation('.first-hint-fox');
        */

        this.playSound('versuchsnochmal.mp3', function()
        {
            that.playSound('hint_' + that.options.level.hint + '.mp3', function(){
                that.domElement.find('button').removeClass('is-correct is-incorrect');
            });
        });
    };

    ShowFirstHintState.prototype.hide = function()
    {
        var that = this;

        that.stopSound();
    };


    return ShowFirstHintState;
});
