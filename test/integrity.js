'use strict';
var requirejs = require("requirejs");
var assert = require("chai").assert;
global.localStorage = require('localStorage');
var domino = require('domino');
global.jQuery = require('jquery')(domino.createWindow());
global.$ = global.jQuery;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
$.support.cors=true; // cross domain
$.ajaxSettings.xhr = function() {
    return new global.XMLHttpRequest();
};

//requirejs.define('jquery', function() {
//    var domino = require('domino');
//    var $ = require('jquery')(domino.createWindow());
//    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//    $.support.cors=true; // cross domain
//    $.ajaxSettings.xhr = function() {
//        return new XMLHttpRequest();
//    };
//
//    return $;
//});

requirejs.define('store', function() {
    return require('store');
});

requirejs.define('jquery', function() {
    return jQuery;
});

requirejs.config({
    baseUrl: 'source/js',
    nodeRequire: require,
    paths: {
        'jsb': '../bower_components/jsb/jsb',
        //'cordova': '../cordova',
        //'jquery': '../bower_components/jquery/jquery.min',
        'underscore': '../bower_components/underscore/underscore',
        'logging': '../bower_components/logging.js/logging',
        //'Backbone': '../bower_components/backbone/backbone',
        //'store': '../bower_components/store.js/store',
        'uuid': '../bower_components/node-uuid/uuid',
        //'nouislider': '../bower_components/nouislider/distribute/jquery.nouislider.all'
    }
});

before(function(done) {
    requirejs(['logging'], function(logging) {
        logging.setLevel(logging.LEVEL_OFF);

        requirejs(
            [
                'services/Persons',
                'services/Tasks',
                'services/LocalStorage',
                'services/Levels',
                'data/Animations',
                'data/Context',
                'data/Levels',
                'data/Library',
                'data/Persons',
                'data/Tasks',
                'jquery'
            ],
            function() {
                done();
            }
        );
    });
});

describe('data/Tasks', function() {
    it('minigame of level should be the same of task', function() {
        var levels = requirejs('services/Levels');
        var tasksData = requirejs('data/Tasks');

        tasksData.forEach(function(task) {
            assert.ok(task.miniGameId);
            if (task.miniGameId == 5) {
                return ;
            }
            assert.ok(task.levelId);
            var level = levels.getLevelById(task.levelId);
            assert.ok(level);
            assert.equal(level.miniGameId, task.miniGameId);
        });
    });
    it('miniGameId of the tasks is 1..5', function() {
        var tasksData = requirejs('data/Tasks');

        tasksData.forEach(function(task) {
            assert.include([1,2,3,4,5], task.miniGameId);
        });
    });
    it('alternatives must not include the emotion', function() {
        var tasksData = requirejs('data/Tasks');

        tasksData.forEach(function(task) {
            assert.notInclude(task.alternatives, task.emotion);
        });
    });
    it('must have a person to match task and level', function() {
        var tasksData = requirejs('data/Tasks');
        var levels = requirejs('services/Levels');
        var localStorage = requirejs('services/LocalStorage');

        tasksData.forEach(function(task) {
            if (task.miniGameId == 5) {
                return ;
            }
            var level = levels.getLevelById(task.levelId);
            localStorage.setLastPerson(level.minigameId, null);
            var firstPerson = levels.loadPerson(level, task);
            assert.ok(firstPerson);
        });
    });
   //it('should return a different person for MG2', function() {
   //    var tasksData = requirejs('data/Tasks');
   //    var levels = requirejs('services/Levels');
   //    var localStorage = requirejs('services/LocalStorage');
   //
   //    var taskWithDefinatelyTheSamePersonAsNextTry = [];
   //
   //    tasksData.forEach(function(task) {
   //        if (task.miniGameId != 2) {
   //            return ;
   //        }
   //        var level = levels.getLevelById(task.levelId);
   //        localStorage.setLastPerson(level.minigameId, null);
   //        var firstPerson = levels.loadPerson(level, task);
   //        assert.ok(firstPerson);
   //        localStorage.setLastPerson(level.minigameId, firstPerson);
   //        var nextPerson = levels.loadPerson(level, task);
   //        assert.ok(nextPerson);
   //        if (firstPerson.file == nextPerson.file) {
   //            taskWithDefinatelyTheSamePersonAsNextTry.push("MG#" + task.miniGameId + " Task#" + task.id);
   //        }
   //    });
   //
   //    assert.equal(taskWithDefinatelyTheSamePersonAsNextTry.length, 0, 'The following tasks do match for only one person, so no new person after unsuccessful first try:\n ' + taskWithDefinatelyTheSamePersonAsNextTry.join('\n') + '\n');
   //});
});

describe('data/Persons', function() {
    var fs = require('fs');

    it('check if all images exist', function() {
        var persons = requirejs('data/Persons');

        var imagesMissing = [];

        persons.forEach(function(person) {
            assert.ok(person.fileName, "Error missing fileName: " + person.file);
            try
            {
                fs.accessSync(__dirname + '/../source/media/images/faces/' + person.fileName);
            }
            catch (error) {
                imagesMissing.push('source/media/images/faces/' + person.fileName);
            }
        });

        assert.equal(imagesMissing.length, 0, 'The following images are missing:\n' + imagesMissing.join('\n'))
    });
});

describe('data/Contexts', function() {
    var fs = require('fs');

    it('check if all images exist', function() {
        var contexts = requirejs('data/Context');

        var imagesMissing = [];

        contexts.forEach(function(context) {
            assert.ok(context.file, "Error missing fileName: " + JSON.stringify(context));
            assert.ok(context.emotion, "Error missing emotion: " + JSON.stringify(context));
            var selfIllustrationPath = "media/images/context_illustrations/context_"
                + context.emotion + "_"
                + context.context + "_self.svg";
            var otherIllustrationPath = "media/images/context_illustrations/context_"
                + context.emotion + "_"
                + context.context + "_self.svg";

            var posterPath = 'media/images/video_posters/context_'
                + context.emotion + '_'
                + context.context + '.png';
            try
            {
                fs.accessSync(__dirname + '/../source/' + selfIllustrationPath);
            }
            catch (error) {
                imagesMissing.push(selfIllustrationPath);
            }

            try
            {
                fs.accessSync(__dirname + '/../source/' + otherIllustrationPath);
            }
            catch (error) {
                imagesMissing.push(otherIllustrationPath);
            }

            try
            {
                fs.accessSync(__dirname + '/../source/' + posterPath);
            }
            catch (error) {
                imagesMissing.push(posterPath);
            }
        });

        assert.equal(imagesMissing.length, 0, 'The following images are missing:\n' + imagesMissing.join('\n'))
    });
});
