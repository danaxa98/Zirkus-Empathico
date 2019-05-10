define('services/EmotionBar', ['jsb', 'underscore', 'jquery', 'logging'],
    function(jsb, _, $, logging)
    {
        /**
         *
         * @param {Object} [config] Config Object
         * @param {Object} [config.context] Task-Page reference
         * @param {Array} [config.emotions] List of all Emotions
         * @param {Boolean} [config.introduction] Introduce all Emotion
         * @param {Boolean} [config.autoplay] After load EmotionBar run play
         * @param {Object} [config.div.bar] DOM Element
         * @param {Function} [config.eventHandle] Callback
         * @param {Function} [config.onCompletion] Callback
         * @constructor
         */
        var EmotionBar = function(config) {
            var that = this;
            logging.applyLogging(this, 'EmotionBar', ['loadEmotionIcons']);

            if (typeof config.context != "object") {
                throw "You have to provide an Context";
            }
            if (typeof config.emotions != "object") {
                throw "You have to provide an list of emotions";
            }

            that.option = {
                'introduction': true,
                'autoplay': false,
                'afterSelectionHideOthers': true,
                'div': {
                    'bar': config.context.domElement.find('.emotion-list')
                },
                'eventHandle': function() {
                    console.log('Emotion Bar event thrown');
                }
            };

            that.option = _.extend(that.option, config);

            that.empty();
            that.show();

            if (that.option.autoplay) {
                that.play();
            }
        };

        EmotionBar.prototype.change = function(ary, config) {
            var that= this;
            that.option.emotions = ary;
            that.option = _.extend(that.option, config);
        };

        EmotionBar.prototype.play = function() {
            var that= this;
            that.empty();
            that.loadEmotionIcons(that.option.emotions.reverse());
        };

        EmotionBar.prototype.empty = function() {
            var that= this;
            that.option.div.bar.empty();
        };

        EmotionBar.prototype.show = function() {
            var that= this;
            that.option.div.bar.show();
        };

        EmotionBar.prototype.hide = function() {
            var that= this;
            that.option.div.bar.hide();
        };

        /**
         * This function get called from onClickNextButton. To introduce all possible emotions.
         * Beware that the function is recursive, it stops when [ary] empty is.
         * @param {Array} [ary] List auf all possible emotions
         */
        EmotionBar.prototype.loadEmotionIcons = function(ary) {
            var that = this;

            //Anker
            if (ary.length === 0) {
                if (that.option.onCompletion) {
                    that.option.onCompletion();
                }
                return;
            }

            var emotion = ary.pop();

            var icon = $('<button data="' + emotion + '" style="background-image: ' +
                'url(\'img/emotion_' + emotion + '.svg\'); display:none;"></button>');
            if (ary.length != 1) {
                icon.on('click', function () {
                    that.onClickEmotionDuringIntro(that);
                });
            }
            that.option.div.bar.append(icon);

            if (that.option.introduction) {
                icon.fadeIn();
                that.option.context.playSound(emotion + '.mp3', function() {
                    that.loadEmotionIcons(ary);
                });
            } else {
                icon.show();
                that.loadEmotionIcons(ary);
            }

            if (ary.length <= 1) {
                that.initEventHandler();
            }
        };

        EmotionBar.prototype.onClickEmotion = function(that, el) {
            el.parent().find('button').off('click');
            var emotion = el.attr('data');
            el.attr('data-clicked', 'true');
            if (that.option.afterSelectionHideOthers) {
                that.option.div.bar.find('button[data-clicked!=true]').fadeOut();
            }
            that.option.eventHandle(el, emotion);
        };

        EmotionBar.prototype.onClickEmotionDuringIntro = function(that) {
            that.option.context.playBackgroundSound('incorrect.mp3', null, {loop: false});
        };

        EmotionBar.prototype.initEventHandler = function() {
            var that = this;
            that.option.div.bar.find('button').off('click');
            that.option.div.bar.find('button').on('click', function() {
                that.onClickEmotion(that, $( this ));
            });
        };

        return EmotionBar;
    });
