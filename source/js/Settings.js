define('Settings', ['jsb', 'underscore', 'logging', 'jquery', 'store', 'BasePage',
        'services/Levels', 'services/Tasks', 'services/LocalStorage', 'services/Circus', 'data/Persons', 'data/Context'],
    function(jsb, _, logging, $, store, BasePage, levels, tasks, localStorage, circus, persons, context)
{
    "use strict";

    var Settings = BasePage.extend('Settings');

    Settings.prototype.show = function() {
        var that = this;
        that.domElement.fadeIn();

        that.domElement.find('.clear-all-data').on('click', function() {
            store.clear();
            that.logDebug('Clear local store');
        });
        that.domElement.find('.set-debug-mode').on('click', function() {
            localStorage.setDebug(!localStorage.isDebugActive());
            that.logDebug('Debug mode: ' + localStorage.isDebugActive());
        });

        that.domElement.find('.set-demo-mode').on('click', function() {
            localStorage.setDemoMode(!localStorage.isDemoMode());
            that.logDebug('Debug mode: ' + localStorage.isDemoMode());
        });

        that.domElement.find('.run-test').on('click', function() {
            that.logDebug('Run Test');
            $('.run-test-result').empty();
            that.checkIfAllImagesExist();
        });


        that.domElement.find('.set-progress').on('click', function() {
            that.changeProgressOfMiniGame(
                that.domElement.find('.set-progress-mg').val(),
                that.domElement.find('.set-progress-level').val(),
                that.domElement.find('.set-progress-last-level').val()
            );
            that.logDebug('Progress are set.');
        });
    };

    Settings.prototype.hide = function() {
        var that = this;
        that.domElement.hide();
        that.stopBackgroundSound();
        that.stopSound();
    };

    /**
     * Change the Progress of a Mini Game.
     * @param {Integer} [miniGameId] Mini Game Id: 1-4
     * @param {Integer} [maxGame] Until what level should be fill up
     */
    Settings.prototype.changeProgressOfMiniGame = function(miniGameId, maxGame, lastProgress) {
        var that = this;

        var miniGameLevels = levels.getLevelsByMiniGameId(miniGameId);

        maxGame = (parseInt(maxGame) - 1) || 5;
        if (maxGame > (miniGameLevels.length - 1)) {
            maxGame = (miniGameLevels.length - 1);
        }

        lastProgress = parseInt(lastProgress);

        for (var i = 0; i <= maxGame; i++) {
            var allLevelsOfTasks = tasks.getTasksByMiniGameIdAndLevelId(miniGameId, miniGameLevels[i].id);
            var len = (i == maxGame) ? lastProgress : allLevelsOfTasks.length;
            for (var j = 0; j < len; j++) {
                localStorage.setTaskFinishedForMiniGameLevelAndTaskId(miniGameId,
                    miniGameLevels[i].id, allLevelsOfTasks[j].id);
            }

            localStorage.setCurrentLevel(miniGameId, miniGameLevels[i].id);
            localStorage.setLastPlayedLevel(miniGameId, miniGameLevels[i].id);
        }

        that.checkIfProgressMatchWithRewards();
    };

    Settings.prototype.checkIfAllImagesExist = function() {
        var that = this;
        var i = 0;
        for (i = 0; i < persons.length; i++) {
            if (typeof persons[i].fileName == "undefined") {
                console.log("Error missing fileName: " +  persons[i].file);
                continue;
            }
            var fileName =  persons[i].fileName;
            $.get(that.getRootPath("media/images/faces/" + fileName))
                .fail(that.catchError);
        }

        for (i = 0; i < context.length; i++) {
            $.get(that.getContextIllustrationPath(context[i], "self"))
                .fail(that.catchError);

            $.get(that.getContextIllustrationPath(context[i], "other"))
                .fail(that.catchError);

            $.get(that.getContextPosterPath(context[i]))
                .fail(that.catchError);

        }

    };

    Settings.prototype.catchError = function(xhr, statusText) {
        $('.run-test-result').append("<li> Error missing file: " +  xhr.responseText + "</li>");
    };

    Settings.prototype.getContextIllustrationPath = function(entry, type) {
        var that = this;
        return that.getRootPath("media/images/context_illustrations/context_"
            + entry.emotion + "_"
            + entry.context + "_" + type + ".svg");

    };

    Settings.prototype.getContextPosterPath = function(entry, type) {
        var that = this;
        return that.getRootPath('media/images/video_posters/context_'
            + entry.emotion + '_'
            + entry.context + '.png');

    };

    Settings.prototype.getRootPath = function(filename) {
        var that = this;
        return localStorage.getAbsolutePathForRelativeMediaPath(filename || "");
    };

    Settings.prototype.checkIfProgressMatchWithRewards = function() {
        var cntFinishedLevel = 0;
        for (var miniGameId = 1; miniGameId <= 4; miniGameId++) {
            var miniGameLevels = levels.getLevelsByMiniGameId(miniGameId);
            for (var i = 0; i < miniGameLevels.length; i++) {
                if (
                    miniGameLevels[i].id == 30 ||
                    miniGameLevels[i].id == 6 ||
                    miniGameLevels[i].id == 12 ||
                    miniGameLevels[i].id == 18 ||
                    miniGameLevels[i].id == 24
                    ) {
                    continue;
                }
                if (localStorage.getTaskProgress(miniGameId, miniGameLevels[i].id) == 10) {
                    cntFinishedLevel++;
                }
            }
        }
        var crtFinishedLevel = localStorage.getSelectedAnimations().length;
        if (cntFinishedLevel > crtFinishedLevel){
            var list = circus.getUnselectedAnimations();
            list = list.slice(0, cntFinishedLevel - crtFinishedLevel);
            _.map(list, function(iconId) {
                localStorage.addNewAnimation(iconId);
            });
        }

        var animal = "";
        if (localStorage.getTaskProgress(1,30) == 10) {
            animal = "owl";
            localStorage.addNewAnimal(animal);
        } else if (localStorage.getTaskProgress(2, 6) == 10) {
            animal = "pig";
            localStorage.addNewAnimal(animal);
        } else if (localStorage.getTaskProgress(2, 12) == 10) {
            animal = "toad";
            localStorage.addNewAnimal(animal);
        } else if (localStorage.getTaskProgress(3, 18) == 10) {
            animal = "hedgehog";
            localStorage.addNewAnimal(animal);
        } else if (localStorage.getTaskProgress(4, 24) == 10) {
            animal = "wolf";
            localStorage.addNewAnimal(animal);
        }

        localStorage.resetRewardStatus();
    };


    return Settings;
});
