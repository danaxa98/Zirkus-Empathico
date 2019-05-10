define('Library', ['jsb', 'logging', 'jquery', 'BasePage', 'services/Manikin', 'data/Library'],
    function(jsb, logging, $, BasePage, Manikin, dataLibrary)
{
    "use strict";

    var Library = BasePage.extend('Library');

    Library.prototype.show = function() {
        var that = this;

		jsb.fireEvent('Tracking::ACTIVITY', {
			"actor": {
				"objectType": "user"
			},
			"verb": "enter-library"
		});

		that.options = {
            'fox': that.domElement.find('.fox-animation'),
            'cards': that.domElement.find('.card'),
            'close': that.domElement.find('.close-button'),
            'home': that.domElement.find('.home'),
            'modal': that.domElement.find('.modal-view'),
            'modalIcon': that.domElement.find('.emotion-icon'),
            'modalMouth': that.domElement.find('.emotion-mouth'),
            'modalEyes': that.domElement.find('.emotion-eyes'),
            'modalContext': that.domElement.find('.emotion-context'),
            'modalFace': that.domElement.find('.emotion-face'),
            'modalManikin': that.domElement.find('.emotion-manikin')
        };
        that.domElement.show();

        that.manikin = new Manikin(that.domElement);
        that.resetStage();


        that.playIntroSound('presentation_emotions.mp3',
            function(){
                that.firstIntro();
            }, function() {
                var el = that.options.cards.find('a[data-name="manikin"]').parent();
                that.timeoutId = setTimeout(function() {
                    el.fadeOut(400);
                    el.fadeIn(400);
                }, 1200);
                that.playSound('presentation_doll.mp3', function() {
                    that.showManikin();
                });
            }, function() {
                that.foxAnimation('fox-pointing');
                that.playSound('schau_dich_um.mp3', function() {
                    that.playSound('library.mp3');
                    that.invokeInactivityTimer();
                });
                that.initializeEventListeners();
        });


    };

    Library.prototype.invokeInactivityTimer = function(filename) {
        this.startInactivityTimer(filename || 'inactiv_15_library.mp3');
    };

    Library.prototype.firstIntro = function() {
        var that = this;
        that.foxAnimation('fox-pointing');
        that.timeoutId = setTimeout(function() {
            that.glowCards(['sad', 'surprised', 'joyful', 'angry', 'anxious'].reverse());
        }, 7000);
    };

    Library.prototype.glowCards = function(ary) {
        var that = this;

        if (ary.length === 0) {
            return;
        }

        var emotion = ary.pop();
        var el = that.options.cards.find('a[data-name="' + emotion + '"]').parent();
        el.fadeOut(400);
        el.fadeIn(400);
        that.timeoutId = setTimeout(function() {
            that.glowCards(ary);
        }, 1500);
    };

    Library.prototype.hide = function() {
        var that = this;
        that.domElement.hide();
        that.resetStage();
        that.clearTimer();
        that.timeoutId = clearTimeout(that.timeoutId);
    };

    Library.prototype.resetStage = function() {
        var that = this;
        that.manikin.reset();
        that.manikin.hideValenceSlider();
        that.manikin.hideArousalSlider();
        that.manikin.hideManikin();

        that.domElement.removeClass('slider');
        that.domElement.removeClass('emotion-card');
        that.options.fox.show();
        that.options.cards.show();
        that.options.close.hide();
        that.options.home.show();
        that.options.modal.hide();
        that.options.modal.find('div').attr('data-intro', 'false');
        that.stopSound();
        clearTimeout(that.timeoutId);
        that.invokeInactivityTimer();
    };

    Library.prototype.showEmotionCard = function(name) {
        var that = this;
        that.domElement.addClass('emotion-card');
        that.manikin.showManikin();
        that.options.fox.hide();
        that.options.modal.show();
        that.options.home.hide();
        that.options.close.show();
        that.currentEmotion = name;
        that.loadEmotionCard();
        that.playSound('library/intro_card.mp3', function() {
            that.invokeInactivityTimer('library/inactiv_20_kreuz.mp3');
        });
    };

    Library.prototype.loadEmotionCard = function() {
        var that = this;
        that.options.modalIcon.css('background-image', 'url(\'img/emotion_' + that.currentEmotion + '.svg\')');
        that.options.modalMouth.css('background-image', 'url(\'img/hint2_' + that.currentEmotion + '_mouth.svg\')');
        that.options.modalEyes.css('background-image', 'url(\'img/hint2_' + that.currentEmotion + '_eyes.svg\')');


        that.options.modalFace.empty();
        _.map(dataLibrary[that.currentEmotion].faces, function(val, i) {
            that.options.modalFace.append($('<div ' +
                'style="display:none;background-image:url(\'media/images/library/faces/' + val + '_'
                    + that.currentEmotion + '.png\')"></div>'));
        });
        that.options.modalFace.find('div:first-child').show();
        that.options.modalFace.attr('data-show', '0');

        that.options.modalContext.empty();
        _.map(dataLibrary[that.currentEmotion].context, function(val, i) {
            that.options.modalContext.append($('<div ' +
                'style="display:none;background-image:url(\'media/images/library/context/context_' +
                that.currentEmotion + '_' +
                val + '.png\')"></div>'));
        });
        that.options.modalContext.find('div:first-child').show();
        that.options.modalContext.attr('data-show', '0');

        that.manikin.setValues(dataLibrary[that.currentEmotion].manikin[0]);
        that.manikin.play();
        that.manikin.stop();

    };

    Library.prototype.initializeEventListeners = function() {
        var that = this;

        BasePage.prototype.initializeEventListeners.apply(this, arguments);

        that.domElement.find('.card a').on('click', function() {
            var el = $(this);
            that.onClickCard(el.attr('data-name'), el);
        });

        that.domElement.find('.home').on('click', function() {
            var el = $(this);
            that.hide();
            that.playClickSound();
            document.location = 'main.html#start';
        });

        that.domElement.find('.close-button').on('click', function() {
            var el = $(this);
            that.resetStage();
            that.playClickSound();
        });

        that.domElement.find('.emotion-icon, .emotion-eyes, ' +
            '.emotion-mouth, .emotion-manikin').on('click', function () {
            var el = $(this);
            that.playClickSound(function(){
                that.playIntro(el);
            });
        });
        that.domElement.find('.emotion-face, .emotion-context').on('click', function () {
            var el = $(this);

            that.playClickSound(function() {
                that.playIntro(el);
            }, false);
            that.slideShow(el);
        });

        that.domElement.find('.emotion-manikin').on('click', function () {
            var el = $(this);

            that.playClickSound(function() {
                that.playIntro(el);
            });

            that.options.modalManikin.attr('data-step', '-1');
            that.playManikinShow();
        });
    };

    /**
     * Emotion Card: Show Manikin State for the Emotion
     */
    Library.prototype.playManikinShow = function() {
        var that = this;
        var no = (parseInt(that.options.modalManikin.attr('data-step')) + 1)
            % dataLibrary[that.currentEmotion].manikin.length;
        that.manikin.setValues(dataLibrary[that.currentEmotion].manikin[no]);
        that.manikin.play();
        that.options.modalManikin.attr('data-step', no);

        if (that.timeoutId) {
            that.timeoutId = clearTimeout(that.timeoutId);
        }
        //Stop after one round
        if ((no + 1) == dataLibrary[that.currentEmotion].manikin.length) {
            that.timeoutId = setTimeout(function(){
                that.manikin.stop();
            }, 2000);
        } else {
            that.timeoutId = setTimeout(function(){
                that.playManikinShow();
            }, 2000);
        }
    };

    /**
     * Emotion Card: Handle the slide show.
     * @param {Object} [el] Dom Element of Faces or Context Slide Show
     */
    Library.prototype.slideShow = function(el) {
        var that = this;
        var divs = that.options.modalContext.find('div');
        if (el.hasClass('emotion-face')) {
            divs = that.options.modalFace.find('div');
        }

        var no = (parseInt(el.attr('data-show')) + 1) % divs.length;
        divs.hide();
        $(divs[no]).show();
        el.attr('data-show', no);
    };

    /**
     * Emotion Card: Play intro sound when not allready played
     * @param {Object} [el] Current dom element.
     */
    Library.prototype.playIntro = function(el) {
        var that = this;
        //if (el.attr('data-intro') == "true") {
        //    return;
        //}

        if (el.hasClass('emotion-icon')) {
            that.playSound('library/name_' + that.currentEmotion + '.mp3');
        } else if (el.hasClass('emotion-eyes')) {
            that.playSound('library/feature_' + that.currentEmotion + '_eyes.mp3');
        } else if (el.hasClass('emotion-mouth')) {
            that.playSound('library/feature_' + that.currentEmotion + '_mouth.mp3');
        } else if (el.hasClass('emotion-face')) {
            that.playSound('library/face_' + that.currentEmotion + '.mp3');
        } else if (el.hasClass('emotion-context')) {
            that.playSound('library/context_' + that.currentEmotion + '.mp3');
        } else if (el.hasClass('emotion-manikin')) {
            that.playSound('library/doll_' + that.currentEmotion + '.mp3');
        }
        el.attr('data-intro', 'true');
    };

    Library.prototype.onClickCard = function(name, el) {
        var that = this;

        that.playClickSound(function(){
            if (name == "manikin") {
                that.playSound("name_mini5.mp3", function(){
                    that.showManikin();
                });
            } else {
                that.playSound(name + ".mp3", function(){
                    that.showEmotionCard(name);
                });
            }
        });
    };

    Library.prototype.showManikin = function() {
        var that = this;
        that.domElement.addClass('slider');
        that.options.fox.hide();
        that.options.cards.hide();
        that.options.close.show();
        that.options.home.hide();
        that.manikin.hideValenceSlider();
        that.manikin.hideArousalSlider();
        that.manikin.showManikin();
        that.manikin.play();
        that.playManikinIntroOne();
        that.clearTimer();
    };
    Library.prototype.setDefaultManikinValues = function() {
        var that = this;
        that.manikin.setArousal(2);
        that.manikin.setValence(2);
    };

    Library.prototype.playManikinIntroOne = function() {
        var that = this;
        that.setDefaultManikinValues();
        that.playSound('library/introduction_doll.mp3', function(){
            that.setDefaultManikinValues();
            that.manikin.showValenceSlider();
            that.playSound('library/introduction_doll_valenz1.mp3', function(){
                that.playTimer([0, 2000, 2300], function() {
                    that.manikin.setValence(3);
                }, function() {
                    that.manikin.setValence(4);
                }, function() {
                    that.playManikinIntroTwo();
                });
            });
        });
    };

    Library.prototype.playManikinIntroTwo = function() {
        var that = this;
        that.setDefaultManikinValues();
        that.playSound('library/introduction_doll_valenz2.mp3', function(){
            that.playTimer([0, 2000, 2300], function() {
                that.manikin.setValence(1);
            }, function() {
                that.manikin.setValence(0);
            }, function() {
                that.manikin.setValence(2);
                that.setDefaultManikinValues();
                that.playSound('library/probier_selbst1.mp3', function(){
                    that.timeoutId = setTimeout(function(){
                        that.playManikinIntroThree();
                    }, 10 * 1000);
                });
            });
        });
    };

    Library.prototype.playManikinIntroThree = function() {
        var that = this;
        that.setDefaultManikinValues();
        that.manikin.showArousalSlider();
        that.playSound('library/introduction_doll_arousal1.mp3', function(){
            that.playTimer([50, 1200, 2000], function() {
                that.manikin.setArousal(3);
            }, function() {
                that.manikin.setArousal(4);
            }, function() {
                that.manikin.setArousal(2);
                that.playManikinIntroFour();
            });
        });
    };

    Library.prototype.playManikinIntroFour = function() {
        var that = this;
        that.setDefaultManikinValues();
        that.playSound('library/introduction_doll_arousal2.mp3', function(){
            that.playTimer([50, 1200, 2000], function() {
                that.manikin.setArousal(1);
            }, function() {
                that.manikin.setArousal(0);
            }, function() {
                that.manikin.setArousal(2);
                that.setDefaultManikinValues();
                that.playSound('library/probier_selbst2.mp3', function() {
                    that.invokeInactivityTimer('library/inactiv_20_kreuz.mp3');
                });
            });
        });
    };


    Library.prototype.playTimer = function(times, funcOne, funcTwo, callback){
        var that = this;
        that.timeoutId = setTimeout(function(){
            funcOne();
            that.timeoutId = setTimeout(function(){
                funcTwo();
                that.timeoutId = setTimeout(function(){
                    callback();
                }, times[2]);
            }, times[1]);
        }, times[0]);
    };
    return Library;
});
