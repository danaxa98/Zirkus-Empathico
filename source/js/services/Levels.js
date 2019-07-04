/**
 * @typedef {Object} Level
 * @property {Integer} miniGameId
 * @property {Integer} id
 * @property {Integer} taskId
 * @property {String} correct
 * @property {String} hint
 * @property {String} gender
 * @property {String} context
 * @property {Integer} timeVideo
 * @property {Integer} timeAudio
 * @property {String} contextFileExtension
 * @property {String} context
 * @property {String} file
 * @property {Person} person
 * @property {List} options
 */
define('services/Levels', ['jsb', 'logging', 'data/Levels', 'services/Tasks', 'services/Persons', 'services/LocalStorage', 'underscore'],
    function(jsb, logging, levelsData, tasks, persons, localStorage, _)
{
    "use strict";

    var Levels = function()
    {
        logging.applyLogging(this, 'Levels');

        this.presents = [

            {
                "id": 0,
                "name": "owl",
                "miniGameId": 1,
                "afterLevelId": 1,
                "positions": [
                    "246", "1000"
                ],
                "sizes": [
                    "117", "79"
                ]
            },
            {
                "id": 1,
                "name": "pig",
                "miniGameId": 2,
                "positions": [
                    "328", "510"
                ],
                "sizes": [
                    "149", "93"
                ]
            },
            {
                "id": 2,
                "name": "toad",
                "miniGameId": 2,
                "positions": [
                    "102", "1123"
                ],
                "sizes": [
                    "117", "79"
                ]
            },
            {
                "id": 3,
                "name": "hedgehog",
                "miniGameId": 3,
                "positions": [
                    "246", "1000"
                ],
                "sizes": [
                    "117", "79"
                ]
            },
            {
                "id": 4,
                "name": "wolf",
                "miniGameId": 4,
                "positions": [
                    "246", "1000"
                ],
                "sizes": [
                    "117", "79"
                ]
            }
        ];


    };

    Levels.prototype.getLevelById = function(id)
    {
        var levelsLength = levelsData.length;

        for (var i = 0; i < levelsLength; i++)
        {
            if (id == levelsData[i].id)
            {
                return levelsData[i];
            }
        }

        throw new Error('Cannot find level with id: ' + id);
    };

    Levels.prototype.getFirstLevelIdByMiniGameId = function(miniGameId)
    {
        var miniGameLevels = [];

        var levelsLength = levelsData.length;

        for (var i = 0; i < levelsLength; i++)
        {
            if (miniGameId == levelsData[i].miniGameId)
            {
                return levelsData[i].id;
            }
        }

        throw new Error("Cannot find a level for minigame " + miniGameId);
    };

    Levels.prototype.getLevelsByMiniGameId = function(miniGameId)
    {
        var miniGameLevels = [];

        var levelsLength = levelsData.length;

        for (var i = 0; i < levelsLength; i++)
        {
            if (miniGameId == levelsData[i].miniGameId)
            {
                miniGameLevels.push(levelsData[i]);
            }
        }

        return miniGameLevels;
    };

    Levels.prototype.getLevelsPresents = function(miniGameId)
    {
        var miniGameBenefits = [];

        var benefitsLength = this.presents.length;

        for (var i = 0; i < benefitsLength; i++)
        {
            if (miniGameId == this.presents[i].miniGameId)
            {
                miniGameBenefits.push(this.presents[i]);
            }
        }

        return miniGameBenefits;
    };

    /**
     * This function load all important settings vor Task of a mini game
     * @param  {Integer} [levelId] Level Id, each level have a unique number.
     * @returns {Object}
     */
    Levels.prototype.load = function(levelId) {
        var level = this.getLevelById(levelId);
        //Mini Game 5 have no games
        if (level.miniGameId == 5) {
            return {"id": level.id,
                "miniGameId": level.miniGameId};
        }

        var task = tasks.getRandomNextTaskByMiniGameIdAndLevelId(level.miniGameId, level.id);
        var person = this.loadPerson(level, task);

        return {
            "file": person.file,
            "gender": (person.isChild) ? "child" : person.gender,
            "correct": task.emotion,
            "options": this.getOptions(task),
            "id": level.id,
            "hint": person.hint,
            "taskId": task.id,
            "miniGameId": level.miniGameId,
            "timeVideo": task.timeVideo,
            "timeVideoFadeOut": task.timeVideoFadeOut,
            "timeAudio": task.timeAudio,
            "contextFileExtension": task.contextFileExtension || "",
            "context": task.context,
            "person": person,
            "opportunities": task.opportunities
        };
    };

    /**
     * Get Person related to level and task.
     * @param {Level} [level]
     * @param {Task} [task]
     * @returns {Person}
     */
    Levels.prototype.loadPerson = function(level, task) {
        var lastPerson = localStorage.getLastPerson(level.miniGameId);
        var person = null;

        if (level.miniGameId == 1) {
            this.logDebug('find person by task intensity', task.intensity, 'and emotion', task.emotion, 'for task', task.id);
            try
            {
                person = persons.getRandomPersonByIntensityAndEmotion(task.intensity, task.emotion);
            }
            catch (error) {
                this.logDebug('we did not find a person with this intensity, so fallback to emotion only');
                person = persons.getRandomPersonByEmotion(task.emotion);
            }
        } else if (level.miniGameId == 2) {
            if (lastPerson != null) {
                var gender = task.gender;

                //if (lastPerson.salutation == gender) {
                    if (!lastPerson.isChild) {
                        gender = "child";
                    } else {
                        gender = _.shuffle(["male", "female"])[0];
                    }
                //}

                try
                {
                    this.logDebug('we had a last person, so we\'ll choose one by intensity, emotion and a gender for this task', task);
                    person = persons.getRandomPersonByIntensityAndEmotionAndSalutation(task.intensity, task.emotion, gender);
                }
                catch (error) {
                    try
                    {
                        this.logDebug('we had no luck, so we try a person by intensity and emotion now.');
                        person = persons.getRandomPersonByIntensityAndEmotion(task.intensity, task.emotion);
                    }
                    catch (secondError) {
                        this.logDebug('we did not find a person with this intensity, so fallback to emotion only');
                        person = persons.getRandomPersonByEmotion(task.emotion);
                    }
                }
            } else {
                try
                {
                    this.logDebug('we had no last person, so we\'ll choose one by intensity and emotion of this task', task);
                    person = persons.getRandomPersonByIntensityAndEmotion(task.intensity, task.emotion);
                }
                catch (error) {
                    this.logDebug('we did not find a person with this intensity, so fallback to emotion only');
                    person = persons.getRandomPersonByEmotion(task.emotion);
                }
            }
        } else if (level.miniGameId == 3 || level.miniGameId == 4) {
            this.logDebug('find person by task intensity ', task.intensity,
                          ', emotion ', task.emotion,
                          ', gender ', task.gender,
                          ' and exclude person ', task.excludePerson,
                          ' for task', task.id);
            try
            {
                person = persons.getRandomPersonByIntensityAndEmotionAndSalutation(task.intensity, task.emotion, task.gender, task.excludePerson);
            }
            catch (error) {
                try
                {
                    this.logDebug('we had no luck with intensity, emotion and gender. so we\'ll try with intensity and emotion only!', task);
                    person = persons.getRandomPersonByIntensityAndEmotion(task.intensity, task.emotion, task.excludePerson);
                }
                catch (secondError) {
                    this.logDebug('we did not find a person with this intensity and emotion, so fallback to emotion only');
                    person = persons.getRandomPersonByEmotion(task.emotion, task.excludePerson);
                }
            }
        } else {
            throw new Error('Cannot find a person for miniGame ' + level.miniGameId + ', it\'s not implemented!');
        }

        localStorage.setLastPerson(level.miniGameId, person);

        return person;
    };

    /**
     * Shuffle the possible emotion list it always contains the right answer.
     * @param {Task} [task]
     * @returns {List} List of String.
     */
    Levels.prototype.getOptions = function(task) {
        var options;
        if (typeof task.alternatives !== "undefined"){
            options = task.alternatives.join(',').split(',');
        } else {
            options = [];
        }

        //Shuffle all alternative options and at least on but max NumberOfChoicesForCurrentTask-1
        var numberOfChoicesForAdaptiveTraining = localStorage.getNumberOfChoicesForCurrentTask() - 1;

        options = _.shuffle(options).slice(0, numberOfChoicesForAdaptiveTraining > 1 ? numberOfChoicesForAdaptiveTraining : 1);

        //Add the right add answer
        options.push(task.emotion);
        //shuffle again
        options = this.shuffleOptions(task, options);

        return options;
    };

    Levels.prototype.shuffleOptions = function(task, options) {
        if (options.length < 2) {
            return;
        }
        options = _.shuffle(options);
        //Anscheinend kommt sehr oft vor, das die richtige Antwort auf dem ersten Feld liegt.
        //Daher ein kleiner Umweg, damit das nicht mehr so oft vorkommt...

        //Sollte die gleiche Position bei behalten werden,
        //das entscheidet ein Münzwurf.
        var coinFlip = _.shuffle([true,false])[0];
        var position = this.getPositionOfCorrectAnswer(options, task.emotion);
        if (coinFlip) {
            //Die Position der richtigen Antwort soll geändert werden.
            var lastPosition = localStorage.getLastCorrectPosition();
            while (lastPosition != null && position == lastPosition) {
                options = _.shuffle(options);
                position = this.getPositionOfCorrectAnswer(options, task.emotion);
            }
        }
        localStorage.setLastCorrectPosition(position);
        return options;
    };
    /**
     * Get the position of emotion in options.
     * @param {Array} [options]
     * @param {String} [emotion]
     * @returns {number}
     */
    Levels.prototype.getPositionOfCorrectAnswer = function(options, emotion) {
        for (var i = 0; i < options.length; i++) {
            if (options[i] === emotion) {
                return i;
            }
        }
    };

    return new Levels();
});
