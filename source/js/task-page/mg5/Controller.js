/**
 * Build Stack for MiniGame 4 for the LevelPage.js
 * Here will be defined which order the classes will be loaded
 */
define('task-page/mg5/Controller', ['jsb', 'logging', 'jquery', 'underscore',
        'task-page/mg5/ShowOptionsAfterVideoState'],
    function(jsb, logging, $, _,
             ShowOptionsAfterVideoState)
    {
        "use strict";

        var Controller = function(){

        };

        Controller.prototype.setStates = function(that) {
            that.state = new ShowOptionsAfterVideoState(that.domElement, {
                "level": that.level,
                "completeCallback": undefined
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
