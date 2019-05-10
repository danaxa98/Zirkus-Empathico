define('app', ['Backbone', 'jsb', 'logging', 'jquery', 'services/LocalStorage', 'services/Levels'],
    function(Backbone, jsb, logging, $, localStorage, level)
{
    "use strict";

    var App = function() {
        var that = this;

        logging.applyLogging(that, 'App');

        jsb.on(
            'Cordova::PAUSE', // identifier
            function(values, event_name) { // callback
                that.onCordovaPause(values, event_name);
            }
        );

        jsb.on(
            'Cordova::RESUME', // identifier
            function(values, event_name) { // callback
                that.onCordovaResume(values, event_name);
            }
        );

        jsb.on(
            'Cordova::BACKBUTTON', // identifier
            function(values, event_name) { // callback
                that.onCordovaBackButton(values, event_name);
            }
        );

        if (localStorage.isDebugActive()) {
            $('.skip-button').show();
        } else {
            $('.skip-button').hide();
        }

        this.initializeCordovaIfInHybriadApp();
    };

    App.prototype.initializeCordovaIfInHybriadApp = function() {
        var that = this;

        if (location.href.indexOf('http') === 0) {
            /* We are in a http or https environment, so no cordova today! */
            return ;
        }

        this.logDebug('require cordova');

        require(['cordova'], function(cordova)
        {
            that.logDebug('cordova required! listen for deviceready');

            document.addEventListener("deviceready", function()
            {
                jsb.fireEvent('Cordova::DEVICE_READY');
            }, false);

            that.logDebug('listen for pause+resume+backbutton');
            document.addEventListener("pause", function()
            {
                jsb.fireEvent('Cordova::PAUSE');
            }, false);

            document.addEventListener("resume", function()
            {
                jsb.fireEvent('Cordova::RESUME');
            }, false);

            document.addEventListener("backbutton", function()
            {
                jsb.fireEvent('Cordova::BACKBUTTON');
            }, false);
        });
    };

    App.prototype.onCordovaPause = function(values, event_name) {
        localStorage.setLastActivity();

        if (document.location.pathname.indexOf('index.html') > -1) {
            navigator.app.exitApp();
        }

        if (document.location.hash.indexOf('#play-level') > -1) {
            var levelId = hash.match('#play-level\/([0-9]*).*')[1];
            var miniGameId = level.getLevelById(levelId).miniGameId;
            document.location = 'main.html#choose-level/' + miniGameId;
        }

        $('audio, video').map(function (i, val) {
            val.pause();
            val.innerHTML = "";
            return val;
        });

        //Clear all timer when the app get suspended
        var maxId = setTimeout(function(){}, 0);

        for(var i=0; i < maxId; i+=1) {
            clearTimeout(i);
        }


    };
    /**
     * When the App is not used for a while the intro. will be played again.
     * @param values
     * @param event_name
     */
    App.prototype.onCordovaResume = function(values, event_name) {
        if (localStorage.isPlayIntro()) {
            localStorage.resetIntro();
            document.location = 'index.html';
        }
    };
    /**
     * When the back button is pressed will be overwritten the browser history.
     * @param values
     * @param event_name
     */
    App.prototype.onCordovaBackButton = function(values, event_name) {
        var hash = document.location.hash;
        if (hash.indexOf('#start') > -1) {
            navigator.app.exitApp();
        } else if (hash.indexOf('#choose-level') > -1 ||
            hash.indexOf('#reward-page') > -1 ||
            hash.indexOf('#library') > -1
            ) {
            document.location = 'main.html#start';
        } else if (hash.indexOf('#play-level') > -1) {
            var levelId = hash.match('#play-level\/([0-9]*).*')[1];
            var miniGameId = level.getLevelById(levelId).miniGameId;
            document.location = 'main.html#choose-level/' + miniGameId;
        }
    };

    return new App();
});
