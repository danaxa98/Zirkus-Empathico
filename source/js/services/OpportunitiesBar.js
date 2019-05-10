define('services/OpportunitiesBar', ['jsb', 'jquery', 'logging'],
    function(jsb, $, logging)
    {
        /**
         *
         * @param {Object} [config] Config Object
         * @param {Object} [config.context] Task-Page reference
         * @param {String} [config.chosen] Chosen general opportunity
         * @param {Object} [config.opportunities] Object of general and specific action advises
         * @param {Array} [config.opportunities.general] List of all Opportunities
         * @param {Array} [config.opportunities.general-highlight] The index is the arousal level and the key which should be highlighted
         * @param {Object} [config.opportunities.specific] Keys are all Opportunities
         * @param {Array} [config.opportunities.specific.approach.data] All Option for state approach
         * @param {Array} [config.opportunities.specific.approach.highlight] Option that will be highlight
         * @param {Boolean} [config.introduction] Introduce all Emotion
         * @param {Boolean} [config.autoplay] After load OpportunitiesBar run play
         * @param {Object} [config.div.bar] DOM Element
         * @param {Function} [config.eventHandle] Callback
         * @param {Function} [config.completeCallback] Callback
         * @constructor
         */
        var OpportunitiesBar = function(config) {
            var that = this;
            logging.applyLogging(this, 'OpportunitiesBar');

            if (typeof config.context != "object") {
                throw "You have to provide an Context";
            }
            if (typeof config.opportunities != "object") {
                throw "You have to provide an list of opportunities";
            }

            that.option = {
                'introduction': true,
                'autoplay': true,
                'type': (typeof config.chosen === "undefined" || config.chosen === "") ? "general" : "specific",
                'chosen': "",
                'div': {
                    'bar': config.context.domElement.find('.emotion-list')
                },
                'eventHandle': function() {
                    console.log('OpportunitiesBar event thrown');
                },
                'completeCallback': function() {
                    console.log('OpportunitiesBar complete loaded');
                }
            };

            that.option = _.extend(that.option, config);


            if (that.option.type == "specific") {
                that.option.n = that.option.opportunities.specific[that.option.chosen].data.length;
                that.option.list = that.option.opportunities.specific[that.option.chosen].data;
                that.option.highlight = that.option.opportunities.specific[that.option.chosen].highlight;
            } else {
                that.option.n = that.option.opportunities.general.length;
                that.option.list = that.option.opportunities.general;
                that.option.highlight = that.option.opportunities["general-highlight"];
            }

            that.empty();
            that.show();

            if (that.option.autoplay) {
                that.play();
            }
        };

        OpportunitiesBar.prototype.play = function() {
            var that= this;
            that.option.spacePerN = 100 / that.option.n;
            that.loadIcons(0, that.option.list.reverse());
        };

        OpportunitiesBar.prototype.empty = function() {
            var that= this;
            that.option.div.bar.empty();
        };

        OpportunitiesBar.prototype.show = function() {
            var that= this;
            that.option.div.bar.show();
        };

        OpportunitiesBar.prototype.hide = function() {
            var that= this;
            that.option.div.bar.hide();
        };

        /**
         * This function get called from onClickNextButton. To introduce all possible emotions.
         * Beware that the function is recursive, it stops when [ary] empty is.
         * @param {Array} [ary] List auf all possible emotions
         */
        OpportunitiesBar.prototype.loadIcons = function(no, ary) {
            var that = this;

            //Anker
            if (ary.length === 0) {
                that.option.completeCallback();
                return;
            }

            var opportunity = ary.pop();
            var highlight = 0;
            if (that.option.type == "general") {
                if (opportunity == that.option.highlight[that.option.manikinValues.arousal]) {
                    highlight = 10;
                }
            } else if (that.option.type == "specific"){
                if (opportunity == that.option.highlight) {
                    highlight = 10;
                }
            }
            var icon = $('<button ' +
                'data="' + opportunity + '" ' +
                'style="' +
                        'background-image: url(\'img/minigame4_action_' + opportunity + '.svg\'); ' +
                        'top: ' + (that.option.spacePerN * no - (highlight / 2)) + '%;' +
                        'height: ' + (that.option.spacePerN + 5 + highlight) + '%;' +
                        'width: ' + (52 + highlight) + '%;' +
                        ((no % 2 === 0) ? "left:0px;" : "right:0px;") +
                        'display:none;' +
                    '"' +
                '></button>');
            icon.on('click', function() {
                that.onClickOpportunityDuringIntro(that);
            });
            that.option.div.bar.append(icon);

            if (that.option.introduction) {
                icon.fadeIn();
                that.option.context.playSound(opportunity +
                        ((opportunity == "approach")? "_" + that.option.context.options.level.person.salutation : "") + '.mp3',
                    function() {
                        that.loadIcons(++no, ary);
                });
            } else {
                icon.show();
                that.loadIcons(ary);
            }

            if (ary.length <= 1) {
                that.initEventHandler();
            }
        };

        OpportunitiesBar.prototype.onClickOpportunityDuringIntro = function(that) {
            that.option.context.playBackgroundSound('incorrect.mp3', null, {loop: false});
        };

        OpportunitiesBar.prototype.onClick = function(that, el) {
            el.parent().find('button').off('click');
            var opportunity = el.attr('data');
            el.hide();
            el.css('background-image', 'url(\'img/minigame4_action_' + opportunity + '_selected.svg\')');
            setTimeout(function(){el.show();}, 50);
            if (that.option.type == "general") {
                that.option.eventHandle(el,
                    opportunity,
                    that.option.opportunities.specific[opportunity].data.length > 0);
            } else if (that.option.type == "specific"){
                that.option.eventHandle(el, opportunity, false);
            }

        };

        OpportunitiesBar.prototype.initEventHandler = function() {
            var that = this;
            that.option.div.bar.find('button').off('click');
            that.option.div.bar.find('button').on('click', function() {
                that.onClick(that, $( this ));
            });
        };

        OpportunitiesBar.prototype.hideIcons = function(except) {
            var that = this;
            that.option.div.bar.find('button').map(function(i, el){
                el = $(el);
                if (el.attr('data') != except) {
                    el.fadeOut();
                }
            });
        };

        return OpportunitiesBar;
    });
