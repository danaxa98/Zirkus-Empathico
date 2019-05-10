define('services/Manikin', ['jsb', 'jquery', 'logging', 'services/Animations', 'nouislider'],
    function(jsb, $, logging, Animations, nouislider)
{
    /**
     *
     * @param {Object} config Config Object
     * @param {String} config.div All needed Divs
     * @param {String} config.div.fox Fox
     * @param {String} config.div.arousal div for arousal slider
     * @param {String} config.div.valence div for valence slider
     * @param {String} config.introduction Fox give an introduction
     * @constructor
     */
    var Manikin = function(domElement, config) {
        var that = this;

        logging.applyLogging(this, 'Manikin', ['convertScale', 'isInRange']);

        that.option = {'introduction': false,
                        'div': {
                            'fox': domElement.find('.fox-animation'),
                            'arousal': domElement.find('.manikin-slider-arousal-ui'),
                            'arousalMin': domElement.find('.manikin-slider-arousal-min'),
                            'arousalMax': domElement.find('.manikin-slider-arousal-max'),
                            'valence': domElement.find('.manikin-slider-valence-ui'),
                            'valenceMin': domElement.find('.manikin-slider-valence-min'),
                            'valenceMax': domElement.find('.manikin-slider-valence-max'),
                            'manikin': domElement.find('.manikin-self')
                        },
                        'eventHandle': undefined
        };
        that.sprite = new Animations(that.option.div.manikin, {name: "manikin-state-arousal2-valence0",
                        defaultCss: "manikin manikin-self", loop: true});

        that.option = _.extend(that.option, config);

        that.initSlider();

        that.hideArousalSlider();
        that.hideValenceSlider();
        that.setAnimation();

    };

    Manikin.prototype.initSlider = function() {
        var that = this;
        that.option.div.arousal.noUiSlider({
            animate: true,
            start: [50],
            //step: 22,
            behaviour: 'tap',
            connect: 'upper',
            orientation: "vertical",
            direction: 'rtl',
            range: {
                'min': 0,
                'max': 100
            }
        }, true);
        that.option.div.arousal.on('change', that.onChangeManikin);
        that.option.div.arousalMin.on('click', function() {
            that.onClickIcon($(this));
        });
        that.option.div.arousalMax.on('click', function() {
            that.onClickIcon($(this));
        });

        that.option.div.valence.noUiSlider({
            animate: true,
            start: [50],
            //step: 1,
            behaviour: 'tap',
            connect: 'upper',
            orientation: "horizontal",
            range: {
                'min': 0,
                'max': 100
            }
        }, true);
        /*
         that.option.div.valence.noUiSlider_pips({
         mode: 'steps',
         density: 1
         });
         */
        that.option.div.valence.on('change', that.onChangeManikin);
        that.option.div.valenceMin.on('click', function() {
            that.onClickIcon($(this));
        });
        that.option.div.valenceMax.on('click', function() {
            that.onClickIcon($(this));
        });
    };

    Manikin.prototype.reset = function() {
        var that = this;
        that.setValues({"valence": 2, "arousal": 2});
        that.showArousalSlider();
        that.showValenceSlider();
        that.showManikin();
    };

    Manikin.prototype.showArousalSlider = function() {
        var that = this;
        that.option.div.arousal.parent().show();
    };

    Manikin.prototype.showValenceSlider = function() {
        var that = this;
        that.option.div.valence.parent().show();
    };

    Manikin.prototype.hideArousalSlider = function() {
        var that = this;
        that.option.div.arousal.parent().hide();
    };

    Manikin.prototype.hideValenceSlider = function() {
        var that = this;
        that.option.div.valence.parent().hide();
    };
    Manikin.prototype.showManikin = function() {
        var that = this;
        that.option.div.manikin.show();
    };

    Manikin.prototype.hideManikin = function() {
        var that = this;
        that.option.div.manikin.hide();
    };

    Manikin.prototype.onClickIcon = function(icon) {
        var that = this;
        var val = that.getValues();
        if (icon.hasClass("manikin-slider-arousal-min")) {
            that.setArousal(val.arousal - 1);
        } else if (icon.hasClass("manikin-slider-arousal-max")) {
            that.setArousal(val.arousal + 1);
        } else if (icon.hasClass("manikin-slider-valence-min")) {
            that.setValence(val.valence - 1);
        } else if (icon.hasClass("manikin-slider-valence-max")) {
            that.setValence(val.valence + 1);
        }
    };

    Manikin.prototype.isInRange = function(val) {
        val = parseInt(val);
        if (val < 0) {
            return 0;
        } else if (val > 4) {
            return 4;
        } else {
            return val;
        }
    };

    Manikin.prototype.onChangeManikin = function() {
        var that = this;
        that.setAnimation();
        if (typeof that.option.eventHandle !== "undefined") {
            that.option.eventHandle();
        }
    };

    Manikin.prototype.convertInputValue = function(value) {
        var that = this;
        var delta = 10;
        value = that.isInRange(value);
        value = value * 20 + delta;
        return value;
    };
    Manikin.prototype.setArousal = function(value) {
        var that = this;
        that.option.div.arousal.val(that.convertInputValue(value));
        that.onChangeManikin();
    };

    Manikin.prototype.setValence = function(value) {
        var that = this;
        that.option.div.valence.val(that.convertInputValue(value));
        that.onChangeManikin();
    };

    /**
     *
     * @param obj.valence
     * @param obj.arousal
     */
    Manikin.prototype.setValues = function(obj) {
        var that = this;
        that.setValence(obj.valence);
        that.setArousal(obj.arousal);
        that.onChangeManikin();
    };

    Manikin.prototype.getValues = function() {
        var that = this;
        //The Scale is from 0 to 100
        /**
         * 0  -  20: 0
         * 21 -  40: 1
         * 41 -  60: 2
         * 61 -  80: 3
         * 81 - 100: 4
         */
        return {'arousal': that.convertScale(parseInt(that.option.div.arousal.val())),
            'valence': that.convertScale(parseInt(that.option.div.valence.val()))};

    };

    Manikin.prototype.convertScale = function(val) {
        if (val <= 20) {
            return 0;
        } else if (val <= 40) {
            return 1;
        } else if (val <= 60) {
            return 2;
        } else if (val <= 80) {
            return 3;
        } else {
            return 4;
        }
    };

    Manikin.prototype.play = function() {
        var that = this;
        that.setAnimation();
    };
    Manikin.prototype.stop = function() {
        var that = this;
        that.sprite.stop();
    };

    Manikin.prototype.setAnimation = function() {
        var that = this;
        var val = that.getValues();
        that.sprite.play('manikin-state-arousal'
            + val.valence
            + "-valence"
            + val.arousal);

    };

    Manikin.prototype.clear = function() {
        var that = this;

        that.stop();
        that.hideArousalSlider();
        that.hideValenceSlider();
        that.option.div.manikin.hide();
    };

    /**
     * Get all Emotions.
     * @returns {Array} All possible emotion.
     */
    Manikin.prototype.getAllEmotions = function() {
        return ['angry', 'anxious', 'sad', 'neutral', 'surprised', 'joyful'];
    };

    /**
     * Get all possible Emotion based on the manikin configuration.
     * @returns {Array} All possible emotion based on state of the "manikin"
     */
    Manikin.prototype.getEmotions = function() {
        // FIXME: wieso benutzen wir hier nicht die Daten von data/Library?
        //The order of the appearance show be
        //ärgerlich - ängstlich - traurig - neutral - überrascht - freudig
        //['angry', 'anxious', 'sad', 'neutral', 'surprised', 'joyful']
        var ary = [];
        var val = this.getValues();
        /**
         * Valenz (0, 1, 2, 3, 4)
         * Arousal (0; 1; 2; 3; 4)
         * Table:
         * Valence   Arousal     Hint
         * 2        0 - 2       neutral
         * 2		3 - 4		neutral, surprised
         * 3		0 - 2		joyful
         * 3		3 - 4		surprised, joyful
         * 4		0 - 4		joyful
         * 1		0 - 2		sad
         * 0		0 - 2		sad
         * 1        3			angry, anxious, sad, surprised
         * 0		3			angry, anxious, sad
         * 1        4           angry, anxious, surprised
         * 0		4			angry, anxious
         *
         */
        if (val.valence === 2 && (val.arousal >= 0 && val.arousal <= 2)) {
            return ['neutral'];
        } else if (val.valence === 2 && (val.arousal >= 3 && val.arousal <= 4)) {
            return ['neutral', 'surprised'];
        } else if (val.valence === 3 && (val.arousal >= 0 && val.arousal <= 2)) {
            return ['joyful'];
        } else if (val.valence === 3 && (val.arousal >= 3 && val.arousal <= 4)) {
            return ['surprised', 'joyful'];
        } else if (val.valence === 4 && (val.arousal >= 0 && val.arousal <= 4)) {
            return ['joyful'];
        } else if (val.valence === 1 && (val.arousal >= 0 && val.arousal <= 2)) {
            return ['sad'];
        } else if (val.valence === 0 && (val.arousal >= 0 && val.arousal <= 2)) {
            return ['sad'];
        } else if (val.valence === 1 && val.arousal === 3) {
            return ['angry', 'anxious', 'sad', 'surprised'];
        } else if (val.valence === 0 && val.arousal === 3) {
            return ['angry', 'anxious', 'sad'];
        } else if (val.valence === 1 && val.arousal === 4) {
            return ['angry', 'anxious', 'surprised'];
        } else if (val.valence === 0 && val.arousal === 4) {
            return ['angry', 'anxious'];
        }
        /*
        if (val.valence === 0 || val.valence === 1) {
            ary = ['angry', 'anxious', 'sad', 'neutral', 'surprised'];
        } else if (val.valence === 3 || val.valence === 4) {
            ary = ['neutral', 'surprised', 'joyful'];
        } else {
            if (val.arousal === 0 || val.arousal === 1) {
                ary = ['neutral'];
            } else if (val.arousal === 2 || val.arousal === 3 || val.arousal === 4) {
                ary = ['neutral', 'surprised'];
            }
        }
        */
        return ary;
    };

    return Manikin;
});
