define('services/Circus', ['jsb', 'logging', 'underscore',
    'services/LocalStorage', 'services/Animations'],
    function(jsb, logging, _, LocalStorage, Animations)
{
    "use strict";
    /**
     *
     * @constructor
     */
    var Circus = function() {
        logging.applyLogging(this, 'Circus', ['setFrame', 'draw']);
        var that = this;
        that.options = {};
        that.options.callback = undefined;
    };

    Circus.prototype.setCallback = function(callback) {
        var that = this;
        that.options.callback = callback;
    };
    Circus.prototype.setContext = function(context) {
        var that = this;
        that.options.context = context;
    };
    Circus.prototype.setDomElement = function(domElement) {
        var that = this;
        that.options.domElement = domElement;
        that.options.iconBar = that.options.domElement.find('.circus-icon-list');
        that.options.circusStage = that.options.domElement.find('.circus-stage');
    };

    Circus.prototype.show = function() {
        var that = this;

        var status = LocalStorage.getRewardStatus();
        if (LocalStorage.isGameFinished()) {
            that.theEnd();
            LocalStorage.resetRewardStatus();
        } else if (status.active) {
            that.setAnimations();
            if (status.type == "reward") {
                that.options.context.foxAnimation('fox-pointing');
                that.playSound('reward/choose_reward.mp3');
                that.setListOfAnimations();
            } else if (status.type == "animal"){
                that.introNewAnimal();
                LocalStorage.resetRewardStatus();
            }
        } else {
            if (that.options.callback) {
                that.options.callback();
            }
        }

    };

    Circus.prototype.hide = function() {
        var that = this;
        that.timeoutId = clearTimeout(that.timeoutId);
        that.clearAnimations();
    };

    Circus.prototype.playSound = function(file, callback) {
        var that = this;
        that.options.context.changeBackgroundSoundVolume(0.1);
        that.options.context.playSound(file, function(){
            that.options.context.changeBackgroundSoundVolume(1);
            if (callback) {
                callback();
            }
        });
    };

    Circus.prototype.clearAnimations = function() {
        var that = this;
        if (typeof that.animationThreads === "undefined") {
            that.animationThreads = [];
            return;
        }

        var i = null;
        while(i = that.animationThreads.pop()) {
            i.stop();
        }
    };

    Circus.prototype.getAllAnimations = function() {
        return [     1,  2,  3,  4,  5,  6,  7,  8,  9,
            10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25];
    };



    Circus.prototype.getUnselectedAnimations = function() {
        var that = this;
        return _.difference(that.getAllAnimations(), LocalStorage.getSelectedAnimations());
    };

    Circus.prototype.getAllAnimals = function() {
        return ["hedgehog", "owl", "pig", "toad", "wolf"];
    };

    Circus.prototype.setAnimations = function() {
        var that = this;
        that.clearAnimations();

        var ary = LocalStorage.getSelectedAnimations();
        //var ary = that.getAllAnimations();

        that.options.circusStage.empty();

        _.map(ary, function(val, i) {
            that.createAnimatedIcon(val);
        });

        ary = LocalStorage.getAnimals();
        _.map(ary, function(val, i) {
            that.createAnimatedAnimal(val);
        });
    };

    Circus.prototype.createAnimatedIcon = function(iconId) {
        var that = this;
        var el = $('<div class="circus-item-' + iconId + '"></div>');
        that.options.circusStage.append(el);

        var sprite = new Animations(el, {name: "circus-item-" + iconId,
            defaultCss: "circus-item", loop: true, autoplay: false});
        that.animationThreads.push(sprite);

        return sprite;
    };

    Circus.prototype.createAnimatedAnimal = function(name) {
        var that = this;
        var el = $('<div class="circus-' + name + '"></div>');
        that.animationThreads.push(new Animations(el, {name: "circus-" + name,
            defaultCss: "circus-item", loop: true, autoplay: false}));
        that.options.circusStage.append(el);
    };

    Circus.prototype.introNewAnimal = function() {
        var that = this;
        var name = LocalStorage.getLastAddedAnimal();
        var present = that.options.context.domElement.find(".circus-" + name);
        present.hide();

        //Find the last added animal and play the animation for the intro
        var sprite = null;
        for (var i = 0; i < that.animationThreads.length; i++) {
            if (that.animationThreads[i].getAnimationName() == "circus-" + name) {
                sprite = that.animationThreads[i];
                break;
            }
        }
        present.fadeIn(1200, function() {
            sprite.run();
        });

        that.options.context.foxAnimation('fox-pointing');
        that.playSound('spiral.mp3', function(){
            that.playSound(that.getPositiveSoundFile(), function() {
                if (LocalStorage.isGameFinished()) {
                    that.playSound('reward/the_end.mp3', function() {
                        that.options.context.playBackgroundSound('zirkusmusik.mp3');
                        that.setStartTimer();
                    });
                } else {
                    that.options.context.playBackgroundSound('zirkusmusik.mp3');
                    that.setStartTimer();
                }
            });

        });
    };

    Circus.prototype.showExitButton = function() {
        var that = this;
        that.options.context.domElement.find('.next-link').show();
    };

    Circus.prototype.setListOfAnimations = function() {
        var that = this;

        var ary = that.getUnselectedAnimations().slice(0,5);

        if (ary.length === 0) {
            that.showExitButton();
        }

        _.map(ary, function(val, i) {
            var el = $('<button data="' + val + '" class="circus-icon circus-icon-' + val + '"></button>');
            el.on('click', function(){
                var el = $(this);
                that.onClickNewCircusIcon(el);
            });
            that.options.iconBar.append(el);
        });

    };

    Circus.prototype.getPositiveSoundFile = function() {
            return 'reward/' + _.shuffle(['sensationell.mp3', 'unglaublich.mp3',
                'grossartig.mp3', 'fantastisch.mp3'])[0];
    };

    Circus.prototype.onClickNewCircusIcon = function(element) {
        var that = this;
        var iconId = element.attr('data');
        that.options.iconBar.find('button').off('click');
        that.options.iconBar.empty();

        LocalStorage.addNewAnimation(iconId);
        LocalStorage.resetRewardStatus();

        var sprite = that.createAnimatedIcon(iconId);
        sprite.run();

        that.playSound('spiral.mp3', function(){
            that.playSound(that.getPositiveSoundFile(), function () {
                that.options.context.playBackgroundSound('zirkusmusik.mp3');
            });
            that.setStartTimer();
        });
    };

    Circus.prototype.theEnd = function() {
        var that = this;

        that.setAnimations();
        that.showExitButton();
        that.playSound('reward/the_end.mp3', function() {
            that.options.context.playBackgroundSound('zirkusmusik.mp3');
            that.start();
        });
    };
    Circus.prototype.setTimeoutTimer = function() {
        //No time out when the game is done
        if (LocalStorage.isGameFinished()) {
            return;
        }

        var that = this;
        that.timeoutId = setTimeout(function(){
            if (that.options.callback) {
                that.options.callback();
            }
        }, 30 * 1000);
    };

    Circus.prototype.setStartTimer = function() {
        var that = this;

        that.showExitButton();

        that.timeoutId = setTimeout(function(){
            that.start();
            that.setTimeoutTimer();
        }, 3500);
    };

    Circus.prototype.start = function() {
        var that = this;
        _.map(that.animationThreads, function(animationItem, i) {
            animationItem.start();
        });
    };

    Circus.prototype.stop = function() {
        var that = this;
        _.map(that.animationThreads, function(animationItem, i) {
            animationItem.stop();
        });
    };
    
    return new Circus();
});
