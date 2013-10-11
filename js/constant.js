(function(app) {

  // Module namespace
  var exports                 = app.constant = {};


  // Hydna related constants
  exports.HYDNA_URI           = "tartarus.hydna.net/players/";


  // Character action constants
  exports.JUMPING             = 1;
  exports.DUCKING             = 2;
  exports.TRAVEL_WEST         = 4;
  exports.TRAVEL_EAST         = 8;

  exports.FACING_WEST         = 0;
  exports.FACING_EAST         = 1;

  exports.CHAR_MARIO          = 1;
  exports.CHAR_BEAR           = 2;


  // Speech bubble constants
  exports.SPEECH_FONT         = "10px Arial Black";
  exports.SPEECH_COLOR        = "black";
  exports.SPEECH_BACKGROUND   = "white";


  // Name constants
  exports.NAME_FONT           = "10px Arial Black";
  exports.NAME_COLOR          = "white";


  // Key mapping
  exports.KEY_MAP             = { ESC:    27,
                                  LEFT:   37,
                                  UP:     38,
                                  RIGHT:  39,
                                  DOWN:   40,
                                  ENTER:  13
                                };

  exports.KEY_MAP_REV         = { "27":   "ESC",
                                  "37":   "LEFT",
                                  "38":   "UP",
                                  "39":   "RIGHT",
                                  "40":   "DOWN",
                                  "13":   "ENTER"
                                };


  // World map constants
  exports.MAP_KILLZONE_OFFSET = 600;
  exports.MAP_ANCHORS         = [ [0,   0],
                                  [100, 10],
                                  [50,  15],
                                  [100, 0],
                                  [75,  0],
                                  [20,  -20],
                                  [150, 10],
                                  [100, 5],
                                  [75,  10],
                                  [75,  -10],
                                  [120,  -20],
                                  [150, 10],
                                  [100, 20],
                                  [200, 20],
                                  [100, 20],
                                  [75,  25],
                                  [175,  25],
                                  [50,  15],
                                  [100, 0],
                                  [75,  0],
                                  [20,  -20],
                                  [150, 10],
                                  [100, 5],
                                  [150, 10],
                                  [100, 20],
                                  [200, 20],
                                  [100, -5]
                                ];

  exports.MAP_ARTIFACTS       = [ [70, -30, 2],
                                  [270, -45, 1],
                                  [600, -40, 3],
                                  [790, -20, 4],
                                  [850, -60, 3],
                                  [1070, -15, 2],
                                  [1110, -5, 2],
                                  [1200, 10, 4],
                                  [1500, 45, 1],
                                  [1800, 105, 2],
                                  [1890, 92, 2],
                                  [2150, 82, 3],
                                  [2550, 143, 4]
                                ];


})(window.tartarus || (window.tartarus = {}));