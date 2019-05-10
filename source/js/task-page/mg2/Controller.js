/**
 * Build Stack for MiniGame 2 for the LevelPage.js
 * Here will be defined which order the classes will be loaded
 */
define('task-page/mg2/Controller', ['jsb', 'logging', 'jquery', 'underscore',
        'task-page/mg2/MiniGameTwoPlayingVideoState',
        'task-page/mg2/ShowOptionsNextToVideoState', 'task-page/mg2/ShowFirstHintState',
        'task-page/mg2/ShowSecondHintState', 'task-page/mg2/ShowCorrectionState'],
    function(jsb, logging, $, _,
             MiniGameTwoPlayingVideoState,
             ShowOptionsNextToVideoState, ShowFirstHintState,
             ShowSecondHintState, ShowCorrectionState)
    {
        "use strict";

        var Controller = function(){

        };

        Controller.prototype.setStates = function(that) {
            that.state = new MiniGameTwoPlayingVideoState(that.domElement, {
                "level": that.level,
                "completeCallback": function() {
                    that.state.hide();
                    that.state = new ShowOptionsNextToVideoState(that.domElement, {
                        "level": that.level,
                        "completeCallback": undefined
                    });
                    that.state.show();
                }
            });
        };

        Controller.prototype.onClickNextButton = function(that) {
            that.chooseCorrectFace();
        };

        Controller.prototype.chooseFaceHintOption = function(that) {
            that.state.hide();
            if (that.hintLevel == 1) {
                that.state = new ShowFirstHintState(that.domElement, {
                    "level": that.level
                });
            } else if (that.hintLevel == 2) {
                that.state = new ShowSecondHintState(that.domElement, {
                    "level": that.level
                });
            } else if (that.hintLevel > 2) {
                that.state = new ShowCorrectionState(that.domElement, {
                    "level": that.level
                });
            }
            that.state.show();
        };


        return new Controller();
    });
