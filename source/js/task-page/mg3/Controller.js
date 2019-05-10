/**
 * Build Stack for MiniGame 3 for the LevelPage.js
 * Here will be defined which order the classes will be loaded
 */
define('task-page/mg3/Controller', ['jsb', 'logging', 'jquery', 'underscore',
        'task-page/mg3/ShowOptionsNextAfterVideoState',
        'task-page/ShowBackgroundStory', 'task-page/ShowFullScreenVideo',
        'task-page/mg3/ShowSecondHintState'],
    function(jsb, logging, $, _,
             ShowOptionsNextAfterVideoState,
             ShowBackgroundStory, ShowFullScreenVideo,
             ShowSecondHintStateMG3)
    {
        "use strict";

        var Controller = function(){

        };

        Controller.prototype.setStates = function(that) {
            that.state = new ShowBackgroundStory(that.domElement, {
                "level": that.level,
                "completeCallback": function() {
                    that.state.hide();
                    that.state = new ShowFullScreenVideo(that.domElement, {
                        "level": that.level,
                        "completeCallback": function() {
                            that.state.hide();
                            that.state = new ShowOptionsNextAfterVideoState(that.domElement, {
                                "level": that.level,
                                "completeCallback": undefined
                            });
                            that.state.show();
                        }
                    });
                    that.state.show();
                }
            });
        };

        Controller.prototype.chooseFaceHintOption = function(that) {
            if (that.hintLevel == 1) {
                that.state.showBeforeFirstHintState(function() {
                    that.state.hide();
                    that.state = new ShowFullScreenVideo(that.domElement, {
                        "level": that.level,
                        "hintState": true,
                        "completeCallback": function () {
                            that.state.hide();
                            that.state = new ShowOptionsNextAfterVideoState(that.domElement, {
                                "level": that.level,
                                "hintState": true,
                                "completeCallback": undefined
                            });
                            that.state.show();
                        }
                    });
                    that.state.show();
                });
            } else if (that.hintLevel == 2) {
                that.state.showBeforeSecondHintState();
                that.state.options.completeCallback = function () {
                    that.state.hide();
                    //FIXME: Müsste mal umbenannt werden
                    that.chooseCorrectFace();
                };
            }
        };

        Controller.prototype.onClickNextButton = function(that) {
            //the function delegated to the state itself
            that.state.onClickNextButton();
        };

        return new Controller();
    });
