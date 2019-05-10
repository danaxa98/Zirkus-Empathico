/**
 * Build Stack for MiniGame 1 for the LevelPage.js
 * Here will be defined which order the classes will be loaded
 */
define('task-page/mg1/Controller', ['jsb', 'logging', 'jquery', 'underscore',
        'task-page/mg1/ShowOptionsNextAfterVideoState',
        'task-page/ShowBackgroundStory', 'task-page/ShowFullScreenVideo',
        'task-page/mg1/ShowSecondState'],
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
                                "completeCallback": function() {
                                    //FIXME: Müsste mal umbenannt werden
                                    that.state.hide();
                                    that.finish(that.state.successfull);
                                }
                            });
                            that.state.show();
                        }
                    });
                    that.state.show();
                }
            });
        };

        Controller.prototype.onClickNextButton = function(that) {
            //the function delegated to the state itself
            that.state.onClickNextButton();
        };

        Controller.prototype.chooseFaceHintOption = function(that) {

        };

        return new Controller();
    });
