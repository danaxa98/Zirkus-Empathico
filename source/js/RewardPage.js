define('RewardPage', ['jsb', 'logging', 'jquery', 'BasePage', 'services/Levels', 'services/Circus'],
    function(jsb, logging, $, BasePage, levels, Circus)
{
    "use strict";

    var RewardPage = BasePage.extend('RewardPage');

    RewardPage.prototype.show = function() {
        var that = this;
        that.domElement.fadeIn();
        that.domElement.find('.next-link').hide();

        Circus.setDomElement(that.domElement);
        Circus.setCallback(function() {
            that.foxAnimation('fox-attention');
            Circus.playSound('reward/tschuess.mp3', function() {
                document.location = 'main.html#start';
                that.hide();
            });
        });
        Circus.setContext(that);
        Circus.show();
    };

    RewardPage.prototype.hide = function() {
        var that = this;
        Circus.hide();
        that.domElement.hide();
        that.stopBackgroundSound();
        that.stopSound();
    };


    return RewardPage;
});
