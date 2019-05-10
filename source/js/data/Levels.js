define('data/Levels', [],
    function()
{
    "use strict";

    /*
     * Videos: 180
     *   Kopf-Erwachsene: 60
     *     Darsteller: ~10, (fast) jeder in jeder Emotion
     *   Kopf-Kinder: 60
     *     Darsteller: ~10, (fast) jeder in jeder Emotion
     *   Kontext-Videos: 60
     *
     * Level: 300 Aufgaben
     *   Minigame1: 6 => 60 Aufgaben (weil 60 Kontext-Videos)
     *   Minigame2: 12 => 120 Aufgaben (120 Kopf-Videos)
     *   Minigame3: 6 => 60 Aufgaben (60 Kopf-Videos, 60 Kontext-Videos)
     *   Minigame4: 6 => 60 Aufgaben (60 Kopf-Videos, 60 Kontext-Videos)
     */
    return [
        {
            "id": 1,
            "miniGameId": 2,
            "positions": [
                "3.5", "8"
            ]
        },
        {
            "id": 2,
            "miniGameId": 2,
            "positions": [
                "9", "14"
            ]
        },
        {
            "id": 3,
            "miniGameId": 2,
            "positions": [
                "14.7", "20"
            ]
        },
        {
            "id": 4,
            "miniGameId": 2,
            "positions": [
                "20.2", "26.5"
            ]
        },
        {
            "id": 5,
            "miniGameId": 2,
            "positions": [
                "26", "33"
            ]
        },
        {
            "id": 6,
            "miniGameId": 2,
            "positions": [
                "31.2", "39.5"
            ]
        },
        {
            "id": 7,
            "miniGameId": 2,
            "positions": [
                "36.8", "52.5"
            ]
        },
        {
            "id": 8,
            "miniGameId": 2,
            "positions": [
                "42.5", "59"
            ]
        },
        {
            "id": 9,
            "miniGameId": 2,
            "positions": [
                    "48", "65.3"
            ]
        },
        {
            "id": 10,
            "miniGameId": 2,
            "positions": [
                "53.6", "71.7"
            ]
        },
        {
            "id": 11,
            "miniGameId": 2,
            "positions": [
                "59.2", "78.3"
            ]
        },
        {
            "id": 12,
            "miniGameId": 2,
            "positions": [
                "64.5", "85"
            ]
        },
        /*
        * Mini Game 3
        * */
        {
            "id": 13,
            "miniGameId": 3,
            "positions": [
                "16.5", "38.5"
            ]
        },
        {
            "id": 14,
            "miniGameId": 3,
            "positions": [
                "22.2", "45"
            ]
        },
        {
            "id": 15,
            "miniGameId": 3,
            "positions": [
                "28", "51.5"
            ]
        },
        {
            "id": 16,
            "miniGameId": 3,
            "positions": [
                "33.5", "58"
            ]
        },
        {
            "id": 17,
            "miniGameId": 3,
            "positions": [
                "39", "64.5"
            ]
        },
        {
            "id": 18,
            "miniGameId": 3,
            "positions": [
                "44.5", "71"
            ]
        },
        /*
        * Mini Game 1
        * */
        {
            "id": 25,
            "miniGameId": 1,
            "positions": [
                "16.5", "38.5"
            ]
        },
        {
            "id": 26,
            "miniGameId": 1,
            "positions": [
                "22.2", "45"
            ]
        },
        {
            "id": 27,
            "miniGameId": 1,
            "positions": [
                "28", "51.5"
            ]
        },
        {
            "id": 28,
            "miniGameId": 1,
            "positions": [
                "33.5", "58"
            ]
        },
        {
            "id": 29,
            "miniGameId": 1,
            "positions": [
                "39", "64.5"
            ]
        },
        {
            "id": 30,
            "miniGameId": 1,
            "positions": [
                "44.5", "71"
            ]
        },
        /*
        * Mini Game 4
        * */
        {
            "id": 19,
            "miniGameId": 4,
            "positions": [
                "16.5", "38.5"
            ]
        },
        {
            "id": 20,
            "miniGameId": 4,
            "positions": [
                "22.2", "45"
            ]
        },
        {
            "id": 21,
            "miniGameId": 4,
            "positions": [
                "28", "51.5"
            ]
        },
        {
            "id": 22,
            "miniGameId": 4,
            "positions": [
                "33.5", "58"
            ]
        },
        {
            "id": 23,
            "miniGameId": 4,
            "positions": [
                "39", "64.5"
            ]
        },
        {
            "id": 24,
            "miniGameId": 4,
            "positions": [
                "44.5", "71"
            ]
        },
        /*
         * Mini Game 5
         * */
        {
            "id": 31,
            "miniGameId": 5,
            "positions": [
                "16.5", "38.5"
            ]
        }
    ];
});
