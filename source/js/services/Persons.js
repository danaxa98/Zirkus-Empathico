/**
 * @typedef {Object} Person
 * @property {String} file - Relative Path to file in media folder.
 * @property {String} name - The name of the actor.
 * @property {Boolean} isChild - Is the actor a child?
 * @property {String} gender - Is actor a male or female
 * @property {String} emotion - Type of emotion.
 * @property {String} intensity - Emotion can be high or low.
 * @property {String} hint - Is the emotion on mouth or eyes better to guess.
 */
define('services/Persons', ['jsb', 'logging', 'data/Persons'], function(jsb, logging, personsData)
{
    "use strict";
    /**
     * Person is always a video related data set. See properties from the type of {@link Person}.
     * @class
     * @constructor
     */
    var Persons = function()
    {
        logging.applyLogging(this, 'Persons');
    };
    /**
     *
     * @param {String} [intensity]
     * @param {String} [emotion]
     * @returns {Person}
     */
    Persons.prototype.getRandomPersonByIntensityAndEmotion = function(intensity, emotion, excludePerson) {
        return this.getRandomPersonByIntensityAndEmotionAndSalutation(intensity, emotion, null, excludePerson);
    };

    /**
     *
     * @param {String} [intensity]
     * @param {String} [emotion]
     * @param {String} [salutation]
     * @returns {Person}
     */
    Persons.prototype.getRandomPersonByIntensityAndEmotionAndSalutation = function(intensity, emotion, salutation, excludePerson) {
        var possiblePersons = [];
        intensity = intensity || false;
        salutation = salutation || false;
        excludePerson = excludePerson || [];

        for (var i = 0; i < personsData.length; i++) {
            if (personsData[i].emotion == emotion
                && (!intensity || personsData[i].intensity == intensity)
                && (!salutation || personsData[i].salutation == salutation)
                && (excludePerson.length === 0 || excludePerson.indexOf(personsData[i].name) === -1)
                )
            {
                possiblePersons.push(personsData[i]);
            }
        }

        if (possiblePersons.length === 0) {
            throw new Error("Error: Problem to select a Person with the parameter emotion= '" + emotion
                + "', intensity= '" + intensity + "' and salutation= '" + salutation + "'");
        }

        var possiblePersonPosition = Math.floor(Math.random() * possiblePersons.length);
        return possiblePersons[possiblePersonPosition];
    };

    /**
     *
     * @param {String} [emotion]
     * @returns {Person}
     */
    Persons.prototype.getRandomPersonByEmotion = function(emotion, excludePerson) {
        return this.getRandomPersonByIntensityAndEmotionAndSalutation(null, emotion, null, excludePerson);
    };

    return new Persons();
});
