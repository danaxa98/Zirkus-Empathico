define('data/Library', [], function()
{
    "use strict";
    /**
     * All Data for the Library Card
     */
    return {
        'neutral': {
            'faces': ['Ew', 'Em', 'Kw', 'Km'],
            'context': ['computer',  'drive', 'hands',  'mop'],
            'manikin': [
                // 0/2
                {'valence': 2, 'arousal': 2}
            ]
        },
        'angry': {
            'faces': ['Ew', 'Em', 'Kw', 'Km'],
            'context': ['chewinggum',  'mobile', 'broken', 'car'],
            'manikin': [
                // -1/3, -1/4, -2/3,-2/4
                {'valence': 1, 'arousal': 3},
                {'valence': 1, 'arousal': 4},
                {'valence': 0, 'arousal': 3},
                {'valence': 0, 'arousal': 4}
            ]
        },
        'anxious': {
            'faces': ['Ew', 'Em', 'Kw', 'Km'],
            'context': ['spooky', 'thunderstorm', 'dog', 'gost'],
            'manikin': [
                // -1/3, -1/4, -2/3,-2/4
                {'valence': 1, 'arousal': 3},
                {'valence': 1, 'arousal': 4},
                {'valence': 0, 'arousal': 3},
                {'valence': 0, 'arousal': 4}
            ]
        },
        'joyful': {
            'faces': ['Ew', 'Em', 'Kw', 'Km'],
            'context': ['kids',  'sweets',  'puppy', 'hug'],
            'manikin': [
                // 1/3, 1/4, 2/3, 2/4
                {'valence': 3, 'arousal': 3},
                {'valence': 3, 'arousal': 4},
                {'valence': 4, 'arousal': 3},
                {'valence': 4, 'arousal': 4}
            ]
        },
        'sad': {
            'faces': ['Ew', 'Em', 'Kw', 'Km'],
            'context': ['hurt', 'animalshelter', 'teddy', 'dead'],
            'manikin': [
                // -1/0, -1/1, -2/0, -2/1
                {'valence': 1, 'arousal': 0},
                {'valence': 1, 'arousal': 1},
                {'valence': 0, 'arousal': 0},
                {'valence': 0, 'arousal': 1}
            ]
        },
        'surprised': {
            'faces': ['Ew', 'Em', 'Kw', 'Km'],
            'context': ['shoe', 'calender', 'cat', 'flowers'],
            'manikin': [
                // 0/3, 0/4, 1/3, 1/4
                {'valence': 2, 'arousal': 3},
                {'valence': 2, 'arousal': 4},
                {'valence': 3, 'arousal': 3},
                {'valence': 3, 'arousal': 4}
            ]
        }
    };
});