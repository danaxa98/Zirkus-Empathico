define('services/LevelScreen',
    ['jsb', 'logging', 'underscore', 'services/Levels',
        'services/LocalStorage', 'services/Tasks', 'services/Animations'],
    function(jsb, logging, _, levels, localStorage, tasks, Animations) {
        "use strict";

        /**
         * Wrapper Class of all front end things for level screen.
         * @param {Object} [config]
         * @param {Object} [config.context]
         * @constructor
         */
        var LevelScreen = function (config) {
            logging.applyLogging(this, 'LevelScreen');
            var that = this;
            var defaultValues = {
                context: null
            };
            that.foxSprite = null;
            that.options = _.extend(defaultValues, config);
        };

        /**
         * Show after a Game a big progress chart.
         * @param show
         */
        LevelScreen.prototype.displayBigLevelProgress = function(show, cb) {
            cb = cb || null;
            var that = this.options.context;
            var miniGameLevelProgress = that.domElement.find('.level-progress');
            var stairProgress = that.domElement.find('.is-level-chooser-active');

            if (show) {
                //stairProgress.removeClass();
                //stairProgress.addClass('level-chooser is-task-progress-'
                //    + (that.options.selectedLevelProgress - 1) + ' is-level-chooser-active');

                miniGameLevelProgress.show();
                var oldState = $('<div class="is-level-progress-' + (that.options.selectedLevelProgress - 1) + '" />');
                var newState = $('<div class="is-level-progress-' + (that.options.selectedLevelProgress)
                    + '" style="display: none;" />');
                miniGameLevelProgress.empty();
                miniGameLevelProgress.append(oldState);
                miniGameLevelProgress.append(newState);

                var newStairState = $('<div class="level-chooser is-task-progress-' + (that.options.selectedLevelProgress)
                    + '" style="display:none;"/>');
                newStairState.attr('data-id', stairProgress.attr('data-id'));
                newStairState.html(stairProgress.html());
                stairProgress.empty();
                stairProgress.append(newStairState);

                //Animation
                newStairState.fadeIn(6200);
                newState.fadeIn(6200, cb);
            } else {
                miniGameLevelProgress.hide();
            }
        };

        /**
         * Create for a Mini Game the "Level Chooser".
         * Level Chooser are the pie charts from a steps of the Level Screen.
         */
        LevelScreen.prototype.createLevelChooserElements = function()
        {
            var that = this.options.context;
            var miniGameLevelsLength = that.options.miniGameLevels.length;

            //Buttons to select level
            var levelChooserUl = that.domElement.find('.level-choosers');
            levelChooserUl.empty();
            for (var i = 0; i < miniGameLevelsLength; i++) {
                var miniGameLevel = that.options.miniGameLevels[i];
                var levelLink = $('<a href="#choose-level/' + that.options.miniGameId + '"></a>');

                levelLink.on('click', {"levelId": miniGameLevel.id}, that.changeLevel);
                var levelProgress = localStorage.getTaskProgress(that.options.miniGameId, miniGameLevel.id);
                var levelLinkLi = $('<li ' +
                    'class="level-chooser ' +
                            'is-task-progress-' +
                                // When gamer close the task successfully, the cake slice will be added later
                                ((localStorage.isStatusWonWithAward() &&
                                    that.options.selectedLevelId == miniGameLevel.id) ?
                                        (levelProgress - 1) : levelProgress ) + ' ' +
                            ((that.options.selectedLevelId == miniGameLevel.id) ? 'is-level-chooser-active' : '') + '"' +
                    'style="bottom:' + miniGameLevel.positions[0] +'%;' +
                            'left:' + miniGameLevel.positions[1] + '%;" ' +
                    'data-id="' + miniGameLevel.id + '"/>');

                levelLinkLi.append(levelLink);
                levelChooserUl.append(levelLinkLi);

                //only display the unlocked levels
                if (that.options.currentLevelId == miniGameLevel.id) {
                    break;
                }
            }

        };

        /**
         * Put the Present box on the stairs, when the step is not reach.
         */
        LevelScreen.prototype.createLevelPresentsElements = function() {
            var that = this.options.context;

            //MiniGame presents
            var miniGamePresents = levels.getLevelsPresents(that.options.miniGameId);
            var miniGamePresentsLength = miniGamePresents.length;

            var levelPresentsUl = that.domElement.find('.level-presents');
            levelPresentsUl.empty();
            for (var i = 0; i < miniGamePresentsLength; i++) {
                var miniGamePresent = miniGamePresents[i];

                if (localStorage.isAnimalInCircus(miniGamePresent.name)) {
                    continue;
                }

                var presentLinkLi = $('<li ' +
                    'class="level-present level-present-' + miniGamePresent.name +
                    '" data-name="' + miniGamePresent.name + '" ' +
                    ' style="' +
                    'top:' + miniGamePresent.positions[0] + 'px;' +
                    'left:' + miniGamePresent.positions[1] + 'px;' +
                    'width:' + miniGamePresent.sizes[0] + 'px;' +
                    'height:' + miniGamePresent.sizes[1] + 'px;' +
                    '"/>');
                levelPresentsUl.append(presentLinkLi);
            }

            that.domElement.find('.level-present').on('click', function() {
                that.onClickAnimal($(this));
            });
        };

        /**
         * Set the Animation from the fox.
         * @param {String} [type] Name of a Animation.
         * @param {Function} [cb] Function get called after the completion of the animation.
         * @returns {Animations}
         */
        LevelScreen.prototype.setFoxPosition = function(type, cb) {
            var that = this.options.context;
            type = type || "fox-go-on";

            //Position Fox
            var levelPosition = that.domElement.find('.level-chooser[data-id=' +
                that.options.miniGameLevel.id +
                ']').position();


            that.options.fox.css('top', (levelPosition.top - 210) + 'px');
            that.options.fox.css('left', (levelPosition.left - 100) + 'px');

            if (!that.foxSprite) {
                that.foxSprite = new Animations(that.options.fox, {name: type, complete: cb});
            } else {
                that.foxSprite.stop();
                that.foxSprite.play(type, cb);
            }

            return that.foxSprite;
        };

        /**
         * Beam Fox between stairs
         * @param {Event} [event]
         */
        LevelScreen.prototype.changeLevel = function(event) {
            var that = this.options.context;
            that.logDebug('Change Level');
            var selectLevel = that.domElement.find('.level-chooser[data-id=' + event.data.levelId + ']');
            var currentLevel = that.domElement.find('.is-level-chooser-active');

            that.setLevelSettings(that.options.miniGameId, event.data.levelId);

            that.playClickSound(function () {
                if (currentLevel.attr('data-id') == event.data.levelId) {
                    that.animateThreadId = window.setTimeout(function() {
                        //clear all timer
                        that.hide();
                        document.location = 'main.html#play-level/' + event.data.levelId + '';
                    }, 10);
                } else {
                    that.options.fox.addClass('disappear');
                    that.animateThreadId = window.setTimeout(function(){
                        that.options.fox.hide();
                        that.options.fox.removeClass('appear disappear');
                        currentLevel.removeClass('is-level-chooser-active');

                        that.options.miniGameLevel = levels.getLevelById(event.data.levelId);
                        that.levelScreen.setFoxPosition().stop();

                        that.options.fox.addClass('appear');
                        that.options.fox.show();
                        selectLevel.addClass('is-level-chooser-active');

                        that.animateThreadId = window.setTimeout(function() {
                            that.options.fox.removeClass('appear disappear');
                        }, 1000);
                    }, 1000);
                }
            });
        };

        LevelScreen.prototype.getAPositiveAudioFile = function() {
            var that = this.options.context;

            var list = ['gut_mitgemacht.mp3', 'gut_voran.mp3'];
            if (that.options.miniGameId == 2 || that.options.miniGameId == 3) {
                list = ['spitze.mp3', 'fantastisch.mp3', 'klasse.mp3', 'toll.mp3',
                    'sehr_schoen.mp3', 'wunderbar.mp3', 'sehr_gut.mp3', 'super.mp3', 'richtig.mp3'];
            }
            return list;
        };

        return LevelScreen;
});