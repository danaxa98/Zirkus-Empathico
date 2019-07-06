/**
 * @typedef {Object} Task
 * @property {Integer} miniGameId
 * @property {Integer} id
 * @property {Integer} levelId
 * @property {String} emotion - Type of emotion what are looking for in task.
 * @property {String} intensity - Should the emotion be high or low?
 * @property {String} gender - The task is related to a specific gender.
 * @property {String} context - Context id.
 * @property {Integer} timeVideo - When should be displayed the context hint.
 * @property {String} contextFileExtension - The context video can be changed by extending the file name,
 * @property {String} excludePerson - A list of person who not be selected as face video
 * like 'context_NAME_EXTENTION.mp4'.
 */
define('services/Tasks', ['jsb', 'logging', 'services/LocalStorage', 'data/Tasks', 'AdaptiveSystem', 'services/UserProfile'],
    function(jsb, logging, localStorage, tasksData, AdaptiveSystem, userProfile)
{
    "use strict";

    var Tasks = function() {
        logging.applyLogging(this, 'Tasks');
    };

    /**
     * Get a random task but exclude all done tasks.
     * @param {Integer} [miniGameId]
     * @param {Integer} [levelId]
     * @returns {Task}
     */
    Tasks.prototype.getRandomNextTaskByMiniGameIdAndLevelId = function(miniGameId, levelId) {

        var tasks = this.getTasksByMiniGameIdAndLevelId(miniGameId, levelId);

        if (miniGameId === 2){

            var chosenEmotion = AdaptiveSystem.chooseEmotion( userProfile.getUserEmotionScores() );

            var taskConstraints = AdaptiveSystem.generateTask(chosenEmotion[0], chosenEmotion[1], userProfile.getUserEloScore() );
            
            localStorage.setLastEmotionPlayed(chosenEmotion[0]);
            localStorage.setNumberOfChoicesForCurrentTask(taskConstraints[0]);

            
            localStorage.setCurrentTimeConstraint( taskConstraints[1] );
            localStorage.setExpectedSuccessRate(taskConstraints[2]);

            tasks = this.getTasksByMiniGameIdAndEmotionAndChoices(miniGameId, chosenEmotion[0], taskConstraints[0] );

            localStorage.setCurrentTimeConstraintAchieved(true);

            //setting time for timeconstraint + 10 seconds for fox explaining video and options
            localStorage.setCurrentTimerID( setTimeout( function(){ localStorage.setCurrentTimeConstraintAchieved(false); }, localStorage.getCurrentTimeConstraint() * 1000 + 10000 ) );

        }

        
        var unsolvedTasks = [];

        if (tasks.length === 0) {
            throw new Error('We don\'t have any tasks for this miniGameId ' + miniGameId + ' and levelId ' + levelId);
        }
        for (var i = 0; i < tasks.length; i++) {
            if (!localStorage.isTaskFinishedByMiniGameLevelAndTaskId(miniGameId, levelId, tasks[i].id)) {
                unsolvedTasks.push(tasks[i]);
            }
        }

        if (unsolvedTasks.length === 0) {
            var randomTaskPosition = Math.floor(Math.random() * tasks.length);
            return tasks[randomTaskPosition];
        }

        //When more than 1 task there, delete the last played game.
        //Because never appear the same task twice.
        var openTasks = [];
        if (unsolvedTasks.length > 1) {
            var lastPlayedTaskId = localStorage.getLastPlayedTask(miniGameId);
            for (i = 0; i < unsolvedTasks.length; i++) {
                if (unsolvedTasks[i].id != lastPlayedTaskId) {
                    openTasks.push(unsolvedTasks[i]);
                }
            }
        } else {
            openTasks = unsolvedTasks;
        }
        var randomUnsolvedTaskPosition = Math.floor(Math.random() * openTasks.length);
        localStorage.setLastPlayedTask(miniGameId, openTasks[randomUnsolvedTaskPosition].id);
        return openTasks[randomUnsolvedTaskPosition];
    };


    /**
     * Get all Task filtered by miniGameId and levelId.
     * @param {Integer} [miniGameId]
     * @param {Integer} [levelId]
     * @returns {Array}
     */
    Tasks.prototype.getTasksByMiniGameIdAndLevelId = function(miniGameId, levelId) {
        var tasks = [];
        var tasksDataLength = tasksData.length;

        for (var i = 0; i < tasksDataLength; i++) {
            if (levelId == tasksData[i].levelId && miniGameId == tasksData[i].miniGameId) {
                tasks.push(tasksData[i]);
            }
        }

        return tasks;
    };

    /**
     * Get all Task filtered by miniGameId and emotion.
     * @param {Integer} [miniGameId]
     * @param {String} [emotion]
     * @param {Integer} [numberOfChoices]
     * @returns {Array}
     */
    Tasks.prototype.getTasksByMiniGameIdAndEmotionAndChoices = function(miniGameId, emotion, numberOfChoices) {
        var tasks = [];
        var tasksDataLength = tasksData.length;

        for (var i = 0; i < tasksDataLength; i++) {
            if (emotion == tasksData[i].emotion && miniGameId == tasksData[i].miniGameId && tasksData[i].alternatives.length >= numberOfChoices - 1) {
                tasks.push(tasksData[i]);
            }
        }

        return tasks;
    };    

    return new Tasks();
});
