define('task-page/mg4/ShowOpportunities', ['jsb', 'jquery', 'services/Animations', 'task-page/BaseTaskPageState',
    'services/Manikin', 'services/OpportunitiesBar'],
    function(jsb, $, Animations, BaseTaskPageState, Manikin, OpportunitiesBar)
{
    "use strict";

    var ShowOpportunities = BaseTaskPageState.extend('ShowOpportunities');

    ShowOpportunities.prototype.show = function() {
        var that = this;
        //Disable hint for the further game instruction
        //that.startInactivityTimer();

        //Show and Hide necessary elements
        that.hideElements(['.next-button', '.manikin',
            '.second-hint', '.curtain', 'video', '.bottom-bar']);
        that.showElements(['.fox-animation', '.stage', '.hint-video-container']);

        var hint = that.domElement.find('.hint-video-container');
        hint.css('background-image','url(\'' + that.getPersonImage() + '\')');

        that.foxAnimation('fox-pointing');
        that.setFoxPosition();
        if (typeof that.options.chosen !== "undefined") {
            that.playSound('was_dann.mp3', function() {
                that.loadOpportunities();
            });
        } else {
            that.playSound('meet_' + that.options.level.person.salutation + '.mp3', function() {
                that.loadOpportunities();
            });
        }

    };

    ShowOpportunities.prototype.hide = function() {
        var that = this;

        that.clearTimer();
        clearTimeout(that.inactiveTimer);
        clearTimeout(that.timeoutId);

        that.hideElements(['.stage', '.hint-video-container', '.next-button']);
        that.showElements(['.close-button']);

        that.domElement.find('.fox-animation').css({'margin-bottom': '0',
            'margin-left': '0'});

        that.domElement.find('.next-button').removeClass('next-button-finish');
        that.domElement.find('.next-button').removeClass('next-button-active');
    };

    ShowOpportunities.prototype.loadOpportunities = function() {
        var that = this;
        that.options.opportunitiesBar = new OpportunitiesBar({'context': that,
            'manikinValues': that.options.manikinValues,
            'opportunities': that.options.level.opportunities,
            'chosen': that.options.chosen,
            'eventHandle': function(element, opportunity, furtherOptions){
                that.onClickOpportunityButtons(element, opportunity, furtherOptions);
            },
            'completeCallback': function() {
                //Disable hint for the further game instruction
                //that.startInactivityTimer();
            }
        });
    };

    ShowOpportunities.prototype.setFoxPosition = function() {
        var that = this;
        that.domElement.find('.fox-animation').css({'margin-bottom': '-12%',
            'margin-left': '12%'});
    };
    ShowOpportunities.prototype.onClickOpportunityButtons = function(el, opportunity, furtherOptions) {
        var that = this;

        that.clearTimer();

        var nextBtn = that.domElement.find('.next-button');
        if (furtherOptions) {
            nextBtn.addClass('next-button-active');
        } else {
            nextBtn.addClass('next-button-finish');
            that.domElement.find('.close-button').hide();
        }
        that.chosen = opportunity;
        that.furtherOptions = furtherOptions;
        that.options.opportunitiesBar.hideIcons(opportunity);
        that.playSound('klick.mp3', function() {
            that.clearTimer();
            if (typeof that.options.chosen != "undefined") {
                that.playSound('gut_' + opportunity + '.mp3', function () {
                    nextBtn.fadeIn();
                    //Disable hint for the further game instruction
                    //that.setTimerWithBlinkingNextBtn();
                });
            } else {
                that.foxAnimation('fox-attention');
                that.setFoxPosition();
                that.playSound('aha_' + opportunity + '.mp3', function () {
                    nextBtn.fadeIn();
                    //Disable hint for the further game instruction
                    //that.setTimerWithBlinkingNextBtn();
                });
            }
        });



    };

    ShowOpportunities.prototype.onClickNextButton = function() {
        var that = this;
        if (typeof that.options.chosen != "undefined") {
            that.options.completeCallback(that.chosen, that.furtherOptions);
        } else {
            that.options.completeCallback(that.chosen, that.furtherOptions);
        }
    };

    ShowOpportunities.prototype.showBeforeCorrectState = function(callback) {

    };

    ShowOpportunities.prototype.showBeforeFirstHintState = function(callback) {

    };

    ShowOpportunities.prototype.showBeforeSecondHintState = function(callback) {

    };

    return ShowOpportunities;
});
