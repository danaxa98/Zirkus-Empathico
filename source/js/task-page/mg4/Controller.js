/**
 * Build Stack for MiniGame 4 for the LevelPage.js
 * Here will be defined which order the classes will be loaded
 */
define('task-page/mg4/Controller', ['jsb', 'logging', 'jquery', 'underscore',
        'task-page/mg4/ShowOptionsAfterVideoState',
        'task-page/ShowBackgroundStory', 'task-page/ShowFullScreenVideo',
        'task-page/mg4/ShowOpportunities'],
    function(jsb, logging, $, _,
             ShowOptionsAfterVideoState,
             ShowBackgroundStory, ShowFullScreenVideo,
             ShowOpportunities)
    {
        "use strict";

        var Controller = function(){

        };

        Controller.prototype.setStates = function(that) {
            /*
            that.state = new ShowOptionsAfterVideoState(that.domElement, {
                "level": that.level,
                "completeCallback": function(manikinValues) {
                    that.state.hide();
                    that.state = new ShowOpportunities(that.domElement, {
                        "level": that.level,
                        "manikinValues": manikinValues, //{'arousal': 4, 'valence': 4},
                        completeCallback: function(choosenOpportunity) {
                            that.state.hide();
                            that.state = new ShowOpportunities(that.domElement, {
                                "level": that.level,
                                "chosen": choosenOpportunity,
                                completeCallback: function() {
                                    //FIXME: Müsste mal umbenannt werden
                                    that.state.hide();
                                    that.chooseCorrectFace();
                                }
                            });
                            that.state.show();
                        }
                    });
                    that.state.show();
                }
            });
            */

            that.state = new ShowBackgroundStory(that.domElement, {
                "level": that.level,
                "completeCallback": function() {
                    that.state.hide();
                    that.state = new ShowFullScreenVideo(that.domElement, {
                        "level": that.level,
                        "hintState": true,
                        "completeCallback": function() {
                            that.state.hide();
                            that.state = new ShowOptionsAfterVideoState(that.domElement, {
                                "level": that.level,
                                "completeCallback": function(manikinValues) {
                                    that.state.hide();
                                    that.state = new ShowOpportunities(that.domElement, {
                                        "level": that.level,
                                        "manikinValues": manikinValues,
                                        completeCallback: function(chosenOpportunity, furtherOptions) {
                                            that.state.hide();
                                            if (furtherOptions === false) {
                                                //FIXME: Müsste mal umbenannt werden
                                                that.chooseCorrectFace();
                                            } else {
                                                that.state = new ShowOpportunities(that.domElement, {
                                                    "level": that.level,
                                                    "chosen": chosenOpportunity,
                                                    completeCallback: function () {
                                                        that.state.hide();
                                                        //FIXME: Müsste mal umbenannt werden
                                                        that.chooseCorrectFace();
                                                    }
                                                });
                                                that.state.show();
                                            }
                                        }
                                    });
                                    that.state.show();
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
