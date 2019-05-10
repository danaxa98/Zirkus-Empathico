define('LoadPage', ['jsb', 'logging', 'jquery', 'BasePage', 'services/LocalStorage'],
    function(jsb, logging, $, BasePage, localStorage)
    {
        "use strict";

        var LoadPage = BasePage.extend('LoadPage');

        LoadPage.prototype.show = function() {
            var that = this;
            that.logDebug('Show Loading Screen');
            that.domElement.fadeIn();

            localStorage.resetIntro();

            jsb.whenFired('Cordova::DEVICE_READY', function() {
                localStorage.setCordova(true);
                that.intro();
            });

            if (!localStorage.isCordova()) {
                that.intro();
            }
        };

        LoadPage.prototype.intro = function() {
            var that = this;
            that.foxAnimation('fox-pointing', function() {
                setTimeout(function () {
                    that.foxAnimation('fox-attention');
                }, 1500);
            });
            that.playSound('introduction_fuchs.mp3', function() {
                document.location = 'main.html#start';
            });
        };

        return LoadPage;
    });
