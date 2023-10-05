(() => {
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequireceb7"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequireceb7"] = parcelRequire;
}
parcelRequire.register("3UDaX", function(module, exports) {
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/
(function(root, factory) {
    var randomColor = factory();
    // Support NodeJS & Component, which allow module.exports to be a function
    if (module && module.exports) exports = module.exports = randomColor;
    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;
})(this, function() {
    // Seed to get repeatable colors
    var seed = null;
    // Shared color dictionary
    var colorDictionary = {};
    // Populate the color dictionary
    loadColorBounds();
    // check if a range is taken
    var colorRanges = [];
    var randomColor = function(options) {
        options = options || {};
        // Check if there is a seed and ensure it's an
        // integer. Otherwise, reset the seed value.
        if (options.seed !== undefined && options.seed !== null && options.seed === parseInt(options.seed, 10)) seed = options.seed;
        else if (typeof options.seed === "string") seed = stringToInteger(options.seed);
        else if (options.seed !== undefined && options.seed !== null) throw new TypeError("The seed value must be an integer or string");
        else seed = null;
        var H, S, B;
        // Check if we need to generate multiple colors
        if (options.count !== null && options.count !== undefined) {
            var totalColors = options.count, colors = [];
            // Value false at index i means the range i is not taken yet.
            for(var i = 0; i < options.count; i++)colorRanges.push(false);
            options.count = null;
            while(totalColors > colors.length){
                var color = randomColor(options);
                if (seed !== null) options.seed = seed;
                colors.push(color);
            }
            options.count = totalColors;
            return colors;
        }
        // First we pick a hue (H)
        H = pickHue(options);
        // Then use H to determine saturation (S)
        S = pickSaturation(H, options);
        // Then use S and H to determine brightness (B).
        B = pickBrightness(H, S, options);
        // Then we return the HSB color in the desired format
        return setFormat([
            H,
            S,
            B
        ], options);
    };
    function pickHue(options) {
        if (colorRanges.length > 0) {
            var hueRange = getRealHueRange(options.hue);
            var hue = randomWithin(hueRange);
            //Each of colorRanges.length ranges has a length equal approximatelly one step
            var step = (hueRange[1] - hueRange[0]) / colorRanges.length;
            var j = parseInt((hue - hueRange[0]) / step);
            //Check if the range j is taken
            if (colorRanges[j] === true) j = (j + 2) % colorRanges.length;
            else colorRanges[j] = true;
            var min = (hueRange[0] + j * step) % 359, max = (hueRange[0] + (j + 1) * step) % 359;
            hueRange = [
                min,
                max
            ];
            hue = randomWithin(hueRange);
            if (hue < 0) hue = 360 + hue;
            return hue;
        } else {
            var hueRange = getHueRange(options.hue);
            hue = randomWithin(hueRange);
            // Instead of storing red as two seperate ranges,
            // we group them, using negative numbers
            if (hue < 0) hue = 360 + hue;
            return hue;
        }
    }
    function pickSaturation(hue, options) {
        if (options.hue === "monochrome") return 0;
        if (options.luminosity === "random") return randomWithin([
            0,
            100
        ]);
        var saturationRange = getSaturationRange(hue);
        var sMin = saturationRange[0], sMax = saturationRange[1];
        switch(options.luminosity){
            case "bright":
                sMin = 55;
                break;
            case "dark":
                sMin = sMax - 10;
                break;
            case "light":
                sMax = 55;
                break;
        }
        return randomWithin([
            sMin,
            sMax
        ]);
    }
    function pickBrightness(H, S, options) {
        var bMin = getMinimumBrightness(H, S), bMax = 100;
        switch(options.luminosity){
            case "dark":
                bMax = bMin + 20;
                break;
            case "light":
                bMin = (bMax + bMin) / 2;
                break;
            case "random":
                bMin = 0;
                bMax = 100;
                break;
        }
        return randomWithin([
            bMin,
            bMax
        ]);
    }
    function setFormat(hsv, options) {
        switch(options.format){
            case "hsvArray":
                return hsv;
            case "hslArray":
                return HSVtoHSL(hsv);
            case "hsl":
                var hsl = HSVtoHSL(hsv);
                return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";
            case "hsla":
                var hslColor = HSVtoHSL(hsv);
                var alpha = options.alpha || Math.random();
                return "hsla(" + hslColor[0] + ", " + hslColor[1] + "%, " + hslColor[2] + "%, " + alpha + ")";
            case "rgbArray":
                return HSVtoRGB(hsv);
            case "rgb":
                var rgb = HSVtoRGB(hsv);
                return "rgb(" + rgb.join(", ") + ")";
            case "rgba":
                var rgbColor = HSVtoRGB(hsv);
                var alpha = options.alpha || Math.random();
                return "rgba(" + rgbColor.join(", ") + ", " + alpha + ")";
            default:
                return HSVtoHex(hsv);
        }
    }
    function getMinimumBrightness(H, S) {
        var lowerBounds = getColorInfo(H).lowerBounds;
        for(var i = 0; i < lowerBounds.length - 1; i++){
            var s1 = lowerBounds[i][0], v1 = lowerBounds[i][1];
            var s2 = lowerBounds[i + 1][0], v2 = lowerBounds[i + 1][1];
            if (S >= s1 && S <= s2) {
                var m = (v2 - v1) / (s2 - s1), b = v1 - m * s1;
                return m * S + b;
            }
        }
        return 0;
    }
    function getHueRange(colorInput) {
        if (typeof parseInt(colorInput) === "number") {
            var number = parseInt(colorInput);
            if (number < 360 && number > 0) return [
                number,
                number
            ];
        }
        if (typeof colorInput === "string") {
            if (colorDictionary[colorInput]) {
                var color = colorDictionary[colorInput];
                if (color.hueRange) return color.hueRange;
            } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
                var hue = HexToHSB(colorInput)[0];
                return [
                    hue,
                    hue
                ];
            }
        }
        return [
            0,
            360
        ];
    }
    function getSaturationRange(hue) {
        return getColorInfo(hue).saturationRange;
    }
    function getColorInfo(hue) {
        // Maps red colors to make picking hue easier
        if (hue >= 334 && hue <= 360) hue -= 360;
        for(var colorName in colorDictionary){
            var color = colorDictionary[colorName];
            if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) return colorDictionary[colorName];
        }
        return "Color not found";
    }
    function randomWithin(range) {
        if (seed === null) {
            //generate random evenly destinct number from : https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
            var golden_ratio = 0.618033988749895;
            var r = Math.random();
            r += golden_ratio;
            r %= 1;
            return Math.floor(range[0] + r * (range[1] + 1 - range[0]));
        } else {
            //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
            var max = range[1] || 1;
            var min = range[0] || 0;
            seed = (seed * 9301 + 49297) % 233280;
            var rnd = seed / 233280.0;
            return Math.floor(min + rnd * (max - min));
        }
    }
    function HSVtoHex(hsv) {
        var rgb = HSVtoRGB(hsv);
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        var hex = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
        return hex;
    }
    function defineColor(name, hueRange, lowerBounds) {
        var sMin = lowerBounds[0][0], sMax = lowerBounds[lowerBounds.length - 1][0], bMin = lowerBounds[lowerBounds.length - 1][1], bMax = lowerBounds[0][1];
        colorDictionary[name] = {
            hueRange: hueRange,
            lowerBounds: lowerBounds,
            saturationRange: [
                sMin,
                sMax
            ],
            brightnessRange: [
                bMin,
                bMax
            ]
        };
    }
    function loadColorBounds() {
        defineColor("monochrome", null, [
            [
                0,
                0
            ],
            [
                100,
                0
            ]
        ]);
        defineColor("red", [
            -26,
            18
        ], [
            [
                20,
                100
            ],
            [
                30,
                92
            ],
            [
                40,
                89
            ],
            [
                50,
                85
            ],
            [
                60,
                78
            ],
            [
                70,
                70
            ],
            [
                80,
                60
            ],
            [
                90,
                55
            ],
            [
                100,
                50
            ]
        ]);
        defineColor("orange", [
            18,
            46
        ], [
            [
                20,
                100
            ],
            [
                30,
                93
            ],
            [
                40,
                88
            ],
            [
                50,
                86
            ],
            [
                60,
                85
            ],
            [
                70,
                70
            ],
            [
                100,
                70
            ]
        ]);
        defineColor("yellow", [
            46,
            62
        ], [
            [
                25,
                100
            ],
            [
                40,
                94
            ],
            [
                50,
                89
            ],
            [
                60,
                86
            ],
            [
                70,
                84
            ],
            [
                80,
                82
            ],
            [
                90,
                80
            ],
            [
                100,
                75
            ]
        ]);
        defineColor("green", [
            62,
            178
        ], [
            [
                30,
                100
            ],
            [
                40,
                90
            ],
            [
                50,
                85
            ],
            [
                60,
                81
            ],
            [
                70,
                74
            ],
            [
                80,
                64
            ],
            [
                90,
                50
            ],
            [
                100,
                40
            ]
        ]);
        defineColor("blue", [
            178,
            257
        ], [
            [
                20,
                100
            ],
            [
                30,
                86
            ],
            [
                40,
                80
            ],
            [
                50,
                74
            ],
            [
                60,
                60
            ],
            [
                70,
                52
            ],
            [
                80,
                44
            ],
            [
                90,
                39
            ],
            [
                100,
                35
            ]
        ]);
        defineColor("purple", [
            257,
            282
        ], [
            [
                20,
                100
            ],
            [
                30,
                87
            ],
            [
                40,
                79
            ],
            [
                50,
                70
            ],
            [
                60,
                65
            ],
            [
                70,
                59
            ],
            [
                80,
                52
            ],
            [
                90,
                45
            ],
            [
                100,
                42
            ]
        ]);
        defineColor("pink", [
            282,
            334
        ], [
            [
                20,
                100
            ],
            [
                30,
                90
            ],
            [
                40,
                86
            ],
            [
                60,
                84
            ],
            [
                80,
                80
            ],
            [
                90,
                75
            ],
            [
                100,
                73
            ]
        ]);
    }
    function HSVtoRGB(hsv) {
        // this doesn't work for the values of 0 and 360
        // here's the hacky fix
        var h = hsv[0];
        if (h === 0) h = 1;
        if (h === 360) h = 359;
        // Rebase the h,s,v values
        h = h / 360;
        var s = hsv[1] / 100, v = hsv[2] / 100;
        var h_i = Math.floor(h * 6), f = h * 6 - h_i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s), r = 256, g = 256, b = 256;
        switch(h_i){
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        var result = [
            Math.floor(r * 255),
            Math.floor(g * 255),
            Math.floor(b * 255)
        ];
        return result;
    }
    function HexToHSB(hex) {
        hex = hex.replace(/^#/, "");
        hex = hex.length === 3 ? hex.replace(/(.)/g, "$1$1") : hex;
        var red = parseInt(hex.substr(0, 2), 16) / 255, green = parseInt(hex.substr(2, 2), 16) / 255, blue = parseInt(hex.substr(4, 2), 16) / 255;
        var cMax = Math.max(red, green, blue), delta = cMax - Math.min(red, green, blue), saturation = cMax ? delta / cMax : 0;
        switch(cMax){
            case red:
                return [
                    60 * ((green - blue) / delta % 6) || 0,
                    saturation,
                    cMax
                ];
            case green:
                return [
                    60 * ((blue - red) / delta + 2) || 0,
                    saturation,
                    cMax
                ];
            case blue:
                return [
                    60 * ((red - green) / delta + 4) || 0,
                    saturation,
                    cMax
                ];
        }
    }
    function HSVtoHSL(hsv) {
        var h = hsv[0], s = hsv[1] / 100, v = hsv[2] / 100, k = (2 - s) * v;
        return [
            h,
            Math.round(s * v / (k < 1 ? k : 2 - k) * 10000) / 100,
            k / 2 * 100
        ];
    }
    function stringToInteger(string) {
        var total = 0;
        for(var i = 0; i !== string.length; i++){
            if (total >= Number.MAX_SAFE_INTEGER) break;
            total += string.charCodeAt(i);
        }
        return total;
    }
    // get The range of given hue when options.count!=0
    function getRealHueRange(colorHue) {
        if (!isNaN(colorHue)) {
            var number = parseInt(colorHue);
            if (number < 360 && number > 0) return getColorInfo(colorHue).hueRange;
        } else if (typeof colorHue === "string") {
            if (colorDictionary[colorHue]) {
                var color = colorDictionary[colorHue];
                if (color.hueRange) return color.hueRange;
            } else if (colorHue.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
                var hue = HexToHSB(colorHue)[0];
                return getColorInfo(hue).hueRange;
            }
        }
        return [
            0,
            360
        ];
    }
    return randomColor;
});

});

var $2d2b90f04cc861b4$exports = {};

$parcel$export($2d2b90f04cc861b4$exports, "bw", () => $2d2b90f04cc861b4$export$45d219bdcd8ac53c);
$parcel$export($2d2b90f04cc861b4$exports, "bin", () => $2d2b90f04cc861b4$export$f03e751d9cddb7a);
$parcel$export($2d2b90f04cc861b4$exports, "freq", () => $2d2b90f04cc861b4$export$8b37c28a89a20fdc);
$parcel$export($2d2b90f04cc861b4$exports, "extract", () => $2d2b90f04cc861b4$export$f9380c9a627682d3);
$parcel$export($2d2b90f04cc861b4$exports, "band", () => $2d2b90f04cc861b4$export$236249644b838d24);
const $2d2b90f04cc861b4$export$45d219bdcd8ac53c = (bufferSize, sampleRate)=>{
    return sampleRate / bufferSize;
};
const $2d2b90f04cc861b4$export$f03e751d9cddb7a = (freq, bufferSize = 512, sampleRate = 44100)=>{
    return Math.floor(freq / $2d2b90f04cc861b4$export$45d219bdcd8ac53c(bufferSize, sampleRate));
};
const $2d2b90f04cc861b4$export$8b37c28a89a20fdc = (bin, bufferSize = 512, sampleRate = 44100)=>{
    return bin * $2d2b90f04cc861b4$export$45d219bdcd8ac53c(bufferSize, sampleRate);
};
const $2d2b90f04cc861b4$export$f9380c9a627682d3 = (signal, options = {})=>{
    options = Object.assign({
        bufferSize: 512,
        chunkSize: signal.length,
        feature: "amplitudeSpectrum"
    }, options);
    options.bufferSize = parseInt(options.bufferSize);
    options.chunkSize = parseInt(options.chunkSize);
    const origBufferSize = Meyda.bufferSize;
    let fft = [];
    for(let i = 0; i < signal.length; i += options.chunkSize){
        let sig = signal.slice(i, i + options.chunkSize);
        if (sig.length < options.chunkSize) sig = arr.padTo(sig, math.nextPow2(sig.length));
        Meyda.bufferSize = options.bufferSize;
        let data = Meyda.extract(options.feature, sig);
        fft.push(data);
    }
    Meyda.bufferSize = origBufferSize;
    return fft.length > 1 ? fft : fft[0];
};
const $2d2b90f04cc861b4$export$236249644b838d24 = (fft, options = {})=>{
    options = Object.assign({
        bufferSize: 512,
        loBin: 0,
        hiBin: 0
    }, options);
    if (options.hiBin < 0) options.hiBin = options.bufferSize / 2 - 1;
    const chunkAvg = (chunk)=>{
        return chunk.slice(options.loBin, options.hiBin + 1);
    };
    if (Array.isArray(fft[0]) || fft[0] instanceof Float32Array) return fft.map(chunkAvg);
    return chunkAvg(fft);
};



var $3UDaX = parcelRequire("3UDaX");
const $988726ef3516a293$export$241b415aa4c83287 = (options)=>{
    return (0, (/*@__PURE__*/$parcel$interopDefault($3UDaX)))(Object.assign({
        format: "rgbArray"
    }, options || {})).map((v)=>{
        const div = (v1)=>v1 / 255;
        return Array.isArray(v) ? v.map(div) : div(v);
    });
};


var $04aca31748229d16$exports = {};
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */ (function(global) {
    // Passing in seed will seed this Noise instance
    function Noise(seed) {
        function Grad(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Grad.prototype.dot2 = function(x, y) {
            return this.x * x + this.y * y;
        };
        Grad.prototype.dot3 = function(x, y, z) {
            return this.x * x + this.y * y + this.z * z;
        };
        this.grad3 = [
            new Grad(1, 1, 0),
            new Grad(-1, 1, 0),
            new Grad(1, -1, 0),
            new Grad(-1, -1, 0),
            new Grad(1, 0, 1),
            new Grad(-1, 0, 1),
            new Grad(1, 0, -1),
            new Grad(-1, 0, -1),
            new Grad(0, 1, 1),
            new Grad(0, -1, 1),
            new Grad(0, 1, -1),
            new Grad(0, -1, -1)
        ];
        this.p = [
            151,
            160,
            137,
            91,
            90,
            15,
            131,
            13,
            201,
            95,
            96,
            53,
            194,
            233,
            7,
            225,
            140,
            36,
            103,
            30,
            69,
            142,
            8,
            99,
            37,
            240,
            21,
            10,
            23,
            190,
            6,
            148,
            247,
            120,
            234,
            75,
            0,
            26,
            197,
            62,
            94,
            252,
            219,
            203,
            117,
            35,
            11,
            32,
            57,
            177,
            33,
            88,
            237,
            149,
            56,
            87,
            174,
            20,
            125,
            136,
            171,
            168,
            68,
            175,
            74,
            165,
            71,
            134,
            139,
            48,
            27,
            166,
            77,
            146,
            158,
            231,
            83,
            111,
            229,
            122,
            60,
            211,
            133,
            230,
            220,
            105,
            92,
            41,
            55,
            46,
            245,
            40,
            244,
            102,
            143,
            54,
            65,
            25,
            63,
            161,
            1,
            216,
            80,
            73,
            209,
            76,
            132,
            187,
            208,
            89,
            18,
            169,
            200,
            196,
            135,
            130,
            116,
            188,
            159,
            86,
            164,
            100,
            109,
            198,
            173,
            186,
            3,
            64,
            52,
            217,
            226,
            250,
            124,
            123,
            5,
            202,
            38,
            147,
            118,
            126,
            255,
            82,
            85,
            212,
            207,
            206,
            59,
            227,
            47,
            16,
            58,
            17,
            182,
            189,
            28,
            42,
            223,
            183,
            170,
            213,
            119,
            248,
            152,
            2,
            44,
            154,
            163,
            70,
            221,
            153,
            101,
            155,
            167,
            43,
            172,
            9,
            129,
            22,
            39,
            253,
            19,
            98,
            108,
            110,
            79,
            113,
            224,
            232,
            178,
            185,
            112,
            104,
            218,
            246,
            97,
            228,
            251,
            34,
            242,
            193,
            238,
            210,
            144,
            12,
            191,
            179,
            162,
            241,
            81,
            51,
            145,
            235,
            249,
            14,
            239,
            107,
            49,
            192,
            214,
            31,
            181,
            199,
            106,
            157,
            184,
            84,
            204,
            176,
            115,
            121,
            50,
            45,
            127,
            4,
            150,
            254,
            138,
            236,
            205,
            93,
            222,
            114,
            67,
            29,
            24,
            72,
            243,
            141,
            128,
            195,
            78,
            66,
            215,
            61,
            156,
            180
        ];
        // To remove the need for index wrapping, double the permutation table length
        this.perm = new Array(512);
        this.gradP = new Array(512);
        this.seed(seed || 0);
    }
    // This isn't a very good seeding function, but it works ok. It supports 2^16
    // different seed values. Write something better if you need more seeds.
    Noise.prototype.seed = function(seed) {
        if (seed > 0 && seed < 1) // Scale the seed out
        seed *= 65536;
        seed = Math.floor(seed);
        if (seed < 256) seed |= seed << 8;
        var p = this.p;
        for(var i = 0; i < 256; i++){
            var v;
            if (i & 1) v = p[i] ^ seed & 255;
            else v = p[i] ^ seed >> 8 & 255;
            var perm = this.perm;
            var gradP = this.gradP;
            perm[i] = perm[i + 256] = v;
            gradP[i] = gradP[i + 256] = this.grad3[v % 12];
        }
    };
    /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/ // Skewing and unskewing factors for 2, 3, and 4 dimensions
    var F2 = 0.5 * (Math.sqrt(3) - 1);
    var G2 = (3 - Math.sqrt(3)) / 6;
    var F3 = 1 / 3;
    var G3 = 1 / 6;
    // 2D simplex noise
    Noise.prototype.simplex2 = function(xin, yin) {
        var n0, n1, n2; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * G2;
        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
        var y0 = yin - j + t;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        }
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1 + 2 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        i &= 255;
        j &= 255;
        var perm = this.perm;
        var gradP = this.gradP;
        var gi0 = gradP[i + perm[j]];
        var gi1 = gradP[i + i1 + perm[j + j1]];
        var gi2 = gradP[i + 1 + perm[j + 1]];
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    };
    // 3D simplex noise
    Noise.prototype.simplex3 = function(xin, yin, zin) {
        var n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin + zin) * F3; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var k = Math.floor(zin + s);
        var t = (i + j + k) * G3;
        var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
        var y0 = yin - j + t;
        var z0 = zin - k + t;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        var x1 = x0 - i1 + G3; // Offsets for second corner
        var y1 = y0 - j1 + G3;
        var z1 = z0 - k1 + G3;
        var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
        var y2 = y0 - j2 + 2 * G3;
        var z2 = z0 - k2 + 2 * G3;
        var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
        var y3 = y0 - 1 + 3 * G3;
        var z3 = z0 - 1 + 3 * G3;
        // Work out the hashed gradient indices of the four simplex corners
        i &= 255;
        j &= 255;
        k &= 255;
        var perm = this.perm;
        var gradP = this.gradP;
        var gi0 = gradP[i + perm[j + perm[k]]];
        var gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
        var gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
        var gi3 = gradP[i + 1 + perm[j + 1 + perm[k + 1]]];
        // Calculate the contribution from the four corners
        var t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
        }
        var t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0;
        else {
            t3 *= t3;
            n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 32 * (n0 + n1 + n2 + n3);
    };
    // ##### Perlin noise stuff
    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    function lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }
    // 2D Perlin Noise
    Noise.prototype.perlin2 = function(x, y) {
        // Find unit grid cell containing point
        var X = Math.floor(x), Y = Math.floor(y);
        // Get relative xy coordinates of point within that cell
        x = x - X;
        y = y - Y;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        // Calculate noise contributions from each of the four corners
        var perm = this.perm;
        var gradP = this.gradP;
        var n00 = gradP[X + perm[Y]].dot2(x, y);
        var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
        var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
        var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);
        // Compute the fade curve value for x
        var u = fade(x);
        // Interpolate the four results
        return lerp(lerp(n00, n10, u), lerp(n01, n11, u), fade(y));
    };
    // 3D Perlin Noise
    Noise.prototype.perlin3 = function(x, y, z) {
        // Find unit grid cell containing point
        var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
        // Get relative xyz coordinates of point within that cell
        x = x - X;
        y = y - Y;
        z = z - Z;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;
        // Calculate noise contributions from each of the eight corners
        var perm = this.perm;
        var gradP = this.gradP;
        var n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
        var n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
        var n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
        var n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
        var n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
        var n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
        var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
        var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);
        // Compute the fade curve value for x, y, z
        var u = fade(x);
        var v = fade(y);
        var w = fade(z);
        // Interpolate
        return lerp(lerp(lerp(n000, n100, u), lerp(n001, n101, u), w), lerp(lerp(n010, n110, u), lerp(n011, n111, u), w), v);
    };
    global.Noise = Noise;
})((0, $04aca31748229d16$exports));


/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.

 Copyright (c) 2022 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */ // these #__PURE__ comments help uglifyjs with dead code removal
// 
const $358871abb9661525$var$F2 = /*#__PURE__*/ 0.5 * (Math.sqrt(3.0) - 1.0);
const $358871abb9661525$var$G2 = /*#__PURE__*/ (3.0 - Math.sqrt(3.0)) / 6.0;
const $358871abb9661525$var$F3 = 1.0 / 3.0;
const $358871abb9661525$var$G3 = 1.0 / 6.0;
const $358871abb9661525$var$F4 = /*#__PURE__*/ (Math.sqrt(5.0) - 1.0) / 4.0;
const $358871abb9661525$var$G4 = /*#__PURE__*/ (5.0 - Math.sqrt(5.0)) / 20.0;
// I'm really not sure why this | 0 (basically a coercion to int)
// is making this faster but I get ~5 million ops/sec more on the
// benchmarks across the board or a ~10% speedup.
const $358871abb9661525$var$fastFloor = (x)=>Math.floor(x) | 0;
const $358871abb9661525$var$grad2 = /*#__PURE__*/ new Float64Array([
    1,
    1,
    -1,
    1,
    1,
    -1,
    -1,
    -1,
    1,
    0,
    -1,
    0,
    1,
    0,
    -1,
    0,
    0,
    1,
    0,
    -1,
    0,
    1,
    0,
    -1
]);
// double seems to be faster than single or int's
// probably because most operations are in double precision
const $358871abb9661525$var$grad3 = /*#__PURE__*/ new Float64Array([
    1,
    1,
    0,
    -1,
    1,
    0,
    1,
    -1,
    0,
    -1,
    -1,
    0,
    1,
    0,
    1,
    -1,
    0,
    1,
    1,
    0,
    -1,
    -1,
    0,
    -1,
    0,
    1,
    1,
    0,
    -1,
    1,
    0,
    1,
    -1,
    0,
    -1,
    -1
]);
// double is a bit quicker here as well
const $358871abb9661525$var$grad4 = /*#__PURE__*/ new Float64Array([
    0,
    1,
    1,
    1,
    0,
    1,
    1,
    -1,
    0,
    1,
    -1,
    1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    1,
    0,
    -1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    0,
    -1,
    -1,
    -1,
    1,
    0,
    1,
    1,
    1,
    0,
    1,
    -1,
    1,
    0,
    -1,
    1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    1,
    -1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    1,
    0,
    1,
    1,
    1,
    0,
    -1,
    1,
    -1,
    0,
    1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    0,
    1,
    -1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    1,
    1,
    0,
    1,
    1,
    -1,
    0,
    1,
    -1,
    1,
    0,
    1,
    -1,
    -1,
    0,
    -1,
    1,
    1,
    0,
    -1,
    1,
    -1,
    0,
    -1,
    -1,
    1,
    0,
    -1,
    -1,
    -1,
    0
]);
function $358871abb9661525$export$9de79e9646a874e5(random = Math.random) {
    const perm = $358871abb9661525$export$98cd52c6119fe283(random);
    // precalculating this yields a little ~3% performance improvement.
    const permGrad2x = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad2[v % 12 * 2]);
    const permGrad2y = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad2[v % 12 * 2 + 1]);
    return function noise2D(x, y) {
        // if(!isFinite(x) || !isFinite(y)) return 0;
        let n0 = 0; // Noise contributions from the three corners
        let n1 = 0;
        let n2 = 0;
        // Skew the input space to determine which simplex cell we're in
        const s = (x + y) * $358871abb9661525$var$F2; // Hairy factor for 2D
        const i = $358871abb9661525$var$fastFloor(x + s);
        const j = $358871abb9661525$var$fastFloor(y + s);
        const t = (i + j) * $358871abb9661525$var$G2;
        const X0 = i - t; // Unskew the cell origin back to (x,y) space
        const Y0 = j - t;
        const x0 = x - X0; // The x,y distances from the cell origin
        const y0 = y - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } else {
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        const x1 = x0 - i1 + $358871abb9661525$var$G2; // Offsets for middle corner in (x,y) unskewed coords
        const y1 = y0 - j1 + $358871abb9661525$var$G2;
        const x2 = x0 - 1.0 + 2.0 * $358871abb9661525$var$G2; // Offsets for last corner in (x,y) unskewed coords
        const y2 = y0 - 1.0 + 2.0 * $358871abb9661525$var$G2;
        // Work out the hashed gradient indices of the three simplex corners
        const ii = i & 255;
        const jj = j & 255;
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            const gi0 = ii + perm[jj];
            const g0x = permGrad2x[gi0];
            const g0y = permGrad2y[gi0];
            t0 *= t0;
            // n0 = t0 * t0 * (grad2[gi0] * x0 + grad2[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
            n0 = t0 * t0 * (g0x * x0 + g0y * y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            const gi1 = ii + i1 + perm[jj + j1];
            const g1x = permGrad2x[gi1];
            const g1y = permGrad2y[gi1];
            t1 *= t1;
            // n1 = t1 * t1 * (grad2[gi1] * x1 + grad2[gi1 + 1] * y1);
            n1 = t1 * t1 * (g1x * x1 + g1y * y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            const gi2 = ii + 1 + perm[jj + 1];
            const g2x = permGrad2x[gi2];
            const g2y = permGrad2y[gi2];
            t2 *= t2;
            // n2 = t2 * t2 * (grad2[gi2] * x2 + grad2[gi2 + 1] * y2);
            n2 = t2 * t2 * (g2x * x2 + g2y * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
    };
}
function $358871abb9661525$export$80cd39cae172f7fa(random = Math.random) {
    const perm = $358871abb9661525$export$98cd52c6119fe283(random);
    // precalculating these seems to yield a speedup of over 15%
    const permGrad3x = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad3[v % 12 * 3]);
    const permGrad3y = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad3[v % 12 * 3 + 1]);
    const permGrad3z = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad3[v % 12 * 3 + 2]);
    return function noise3D(x, y, z) {
        let n0, n1, n2, n3; // Noise contributions from the four corners
        // Skew the input space to determine which simplex cell we're in
        const s = (x + y + z) * $358871abb9661525$var$F3; // Very nice and simple skew factor for 3D
        const i = $358871abb9661525$var$fastFloor(x + s);
        const j = $358871abb9661525$var$fastFloor(y + s);
        const k = $358871abb9661525$var$fastFloor(z + s);
        const t = (i + j + k) * $358871abb9661525$var$G3;
        const X0 = i - t; // Unskew the cell origin back to (x,y,z) space
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = x - X0; // The x,y,z distances from the cell origin
        const y0 = y - Y0;
        const z0 = z - Z0;
        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } // Z X Y order
        } else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } // Y X Z order
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        const x1 = x0 - i1 + $358871abb9661525$var$G3; // Offsets for second corner in (x,y,z) coords
        const y1 = y0 - j1 + $358871abb9661525$var$G3;
        const z1 = z0 - k1 + $358871abb9661525$var$G3;
        const x2 = x0 - i2 + 2.0 * $358871abb9661525$var$G3; // Offsets for third corner in (x,y,z) coords
        const y2 = y0 - j2 + 2.0 * $358871abb9661525$var$G3;
        const z2 = z0 - k2 + 2.0 * $358871abb9661525$var$G3;
        const x3 = x0 - 1.0 + 3.0 * $358871abb9661525$var$G3; // Offsets for last corner in (x,y,z) coords
        const y3 = y0 - 1.0 + 3.0 * $358871abb9661525$var$G3;
        const z3 = z0 - 1.0 + 3.0 * $358871abb9661525$var$G3;
        // Work out the hashed gradient indices of the four simplex corners
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        // Calculate the contribution from the four corners
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            const gi0 = ii + perm[jj + perm[kk]];
            t0 *= t0;
            n0 = t0 * t0 * (permGrad3x[gi0] * x0 + permGrad3y[gi0] * y0 + permGrad3z[gi0] * z0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1]];
            t1 *= t1;
            n1 = t1 * t1 * (permGrad3x[gi1] * x1 + permGrad3y[gi1] * y1 + permGrad3z[gi1] * z1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2]];
            t2 *= t2;
            n2 = t2 * t2 * (permGrad3x[gi2] * x2 + permGrad3y[gi2] * y2 + permGrad3z[gi2] * z2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            const gi3 = ii + 1 + perm[jj + 1 + perm[kk + 1]];
            t3 *= t3;
            n3 = t3 * t3 * (permGrad3x[gi3] * x3 + permGrad3y[gi3] * y3 + permGrad3z[gi3] * z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to stay just inside [-1,1]
        return 32.0 * (n0 + n1 + n2 + n3);
    };
}
function $358871abb9661525$export$8ec263ee3d525d98(random = Math.random) {
    const perm = $358871abb9661525$export$98cd52c6119fe283(random);
    // precalculating these leads to a ~10% speedup
    const permGrad4x = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad4[v % 32 * 4]);
    const permGrad4y = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad4[v % 32 * 4 + 1]);
    const permGrad4z = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad4[v % 32 * 4 + 2]);
    const permGrad4w = new Float64Array(perm).map((v)=>$358871abb9661525$var$grad4[v % 32 * 4 + 3]);
    return function noise4D(x, y, z, w) {
        let n0, n1, n2, n3, n4; // Noise contributions from the five corners
        // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
        const s = (x + y + z + w) * $358871abb9661525$var$F4; // Factor for 4D skewing
        const i = $358871abb9661525$var$fastFloor(x + s);
        const j = $358871abb9661525$var$fastFloor(y + s);
        const k = $358871abb9661525$var$fastFloor(z + s);
        const l = $358871abb9661525$var$fastFloor(w + s);
        const t = (i + j + k + l) * $358871abb9661525$var$G4; // Factor for 4D unskewing
        const X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
        const Y0 = j - t;
        const Z0 = k - t;
        const W0 = l - t;
        const x0 = x - X0; // The x,y,z,w distances from the cell origin
        const y0 = y - Y0;
        const z0 = z - Z0;
        const w0 = w - W0;
        // For the 4D case, the simplex is a 4D shape I won't even try to describe.
        // To find out which of the 24 possible simplices we're in, we need to
        // determine the magnitude ordering of x0, y0, z0 and w0.
        // Six pair-wise comparisons are performed between each possible pair
        // of the four coordinates, and the results are used to rank the numbers.
        let rankx = 0;
        let ranky = 0;
        let rankz = 0;
        let rankw = 0;
        if (x0 > y0) rankx++;
        else ranky++;
        if (x0 > z0) rankx++;
        else rankz++;
        if (x0 > w0) rankx++;
        else rankw++;
        if (y0 > z0) ranky++;
        else rankz++;
        if (y0 > w0) ranky++;
        else rankw++;
        if (z0 > w0) rankz++;
        else rankw++;
        // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
        // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
        // impossible. Only the 24 indices which have non-zero entries make any sense.
        // We use a thresholding to set the coordinates in turn from the largest magnitude.
        // Rank 3 denotes the largest coordinate.
        // Rank 2 denotes the second largest coordinate.
        // Rank 1 denotes the second smallest coordinate.
        // The integer offsets for the second simplex corner
        const i1 = rankx >= 3 ? 1 : 0;
        const j1 = ranky >= 3 ? 1 : 0;
        const k1 = rankz >= 3 ? 1 : 0;
        const l1 = rankw >= 3 ? 1 : 0;
        // The integer offsets for the third simplex corner
        const i2 = rankx >= 2 ? 1 : 0;
        const j2 = ranky >= 2 ? 1 : 0;
        const k2 = rankz >= 2 ? 1 : 0;
        const l2 = rankw >= 2 ? 1 : 0;
        // The integer offsets for the fourth simplex corner
        const i3 = rankx >= 1 ? 1 : 0;
        const j3 = ranky >= 1 ? 1 : 0;
        const k3 = rankz >= 1 ? 1 : 0;
        const l3 = rankw >= 1 ? 1 : 0;
        // The fifth corner has all coordinate offsets = 1, so no need to compute that.
        const x1 = x0 - i1 + $358871abb9661525$var$G4; // Offsets for second corner in (x,y,z,w) coords
        const y1 = y0 - j1 + $358871abb9661525$var$G4;
        const z1 = z0 - k1 + $358871abb9661525$var$G4;
        const w1 = w0 - l1 + $358871abb9661525$var$G4;
        const x2 = x0 - i2 + 2.0 * $358871abb9661525$var$G4; // Offsets for third corner in (x,y,z,w) coords
        const y2 = y0 - j2 + 2.0 * $358871abb9661525$var$G4;
        const z2 = z0 - k2 + 2.0 * $358871abb9661525$var$G4;
        const w2 = w0 - l2 + 2.0 * $358871abb9661525$var$G4;
        const x3 = x0 - i3 + 3.0 * $358871abb9661525$var$G4; // Offsets for fourth corner in (x,y,z,w) coords
        const y3 = y0 - j3 + 3.0 * $358871abb9661525$var$G4;
        const z3 = z0 - k3 + 3.0 * $358871abb9661525$var$G4;
        const w3 = w0 - l3 + 3.0 * $358871abb9661525$var$G4;
        const x4 = x0 - 1.0 + 4.0 * $358871abb9661525$var$G4; // Offsets for last corner in (x,y,z,w) coords
        const y4 = y0 - 1.0 + 4.0 * $358871abb9661525$var$G4;
        const z4 = z0 - 1.0 + 4.0 * $358871abb9661525$var$G4;
        const w4 = w0 - 1.0 + 4.0 * $358871abb9661525$var$G4;
        // Work out the hashed gradient indices of the five simplex corners
        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;
        const ll = l & 255;
        // Calculate the contribution from the five corners
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0.0;
        else {
            const gi0 = ii + perm[jj + perm[kk + perm[ll]]];
            t0 *= t0;
            n0 = t0 * t0 * (permGrad4x[gi0] * x0 + permGrad4y[gi0] * y0 + permGrad4z[gi0] * z0 + permGrad4w[gi0] * w0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0.0;
        else {
            const gi1 = ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]];
            t1 *= t1;
            n1 = t1 * t1 * (permGrad4x[gi1] * x1 + permGrad4y[gi1] * y1 + permGrad4z[gi1] * z1 + permGrad4w[gi1] * w1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0.0;
        else {
            const gi2 = ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]];
            t2 *= t2;
            n2 = t2 * t2 * (permGrad4x[gi2] * x2 + permGrad4y[gi2] * y2 + permGrad4z[gi2] * z2 + permGrad4w[gi2] * w2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0.0;
        else {
            const gi3 = ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]];
            t3 *= t3;
            n3 = t3 * t3 * (permGrad4x[gi3] * x3 + permGrad4y[gi3] * y3 + permGrad4z[gi3] * z3 + permGrad4w[gi3] * w3);
        }
        let t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) n4 = 0.0;
        else {
            const gi4 = ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]];
            t4 *= t4;
            n4 = t4 * t4 * (permGrad4x[gi4] * x4 + permGrad4y[gi4] * y4 + permGrad4z[gi4] * z4 + permGrad4w[gi4] * w4);
        }
        // Sum up and scale the result to cover the range [-1,1]
        return 27.0 * (n0 + n1 + n2 + n3 + n4);
    };
}
function $358871abb9661525$export$98cd52c6119fe283(random) {
    const tableSize = 512;
    const p = new Uint8Array(tableSize);
    for(let i = 0; i < tableSize / 2; i++)p[i] = i;
    for(let i = 0; i < tableSize / 2 - 1; i++){
        const r = i + ~~(random() * (256 - i));
        const aux = p[i];
        p[i] = p[r];
        p[r] = aux;
    }
    for(let i = 256; i < tableSize; i++)p[i] = p[i - 256];
    return p;
}


let $6b43bac69b71d100$export$9f7d4fdb157d33bf, $6b43bac69b71d100$export$75de80029543ad4b, $6b43bac69b71d100$export$d984b0759ab0dc43, $6b43bac69b71d100$export$d06611caaacc3b9a, $6b43bac69b71d100$export$1eca773ee6cf0fcc, $6b43bac69b71d100$export$cdff0fdd5b0f2742;
const $6b43bac69b71d100$export$2cd8252107eb640b = (options = {})=>{
    $6b43bac69b71d100$var$initPerlin(options);
    $6b43bac69b71d100$var$initSimplex(options);
    Object.assign(nse.types, {
        perlin: $6b43bac69b71d100$export$1eca773ee6cf0fcc,
        simplex: $6b43bac69b71d100$export$cdff0fdd5b0f2742
    });
    nse.pink.get4 = (x, y, z, w, scale = 1, options = {})=>{
        return nse.fbm((f)=>{
            return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get4(x * scale * f, y * scale * f, z * f, w * scale * f);
        }, 0, options);
    };
    nse.brown.get4 = (x, y, z, w, scale = 1, options = {})=>{
        return nse.fbm((f)=>{
            return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get4(x * scale * f, y * scale * f, z * scale * f, w * scale * f);
        }, 0.5, options);
    };
    nse.yellow.get4 = (x, y, z, w, scale = 1, options = {})=>{
        return nse.fbm((f)=>{
            return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get4(x * scale * f, y * scale * f, z * scale * f, w * scale * f);
        }, 1.0, options);
    };
};
const $6b43bac69b71d100$var$initPerlin = ({ seedFn: seedFn, scale: scale })=>{
    $6b43bac69b71d100$export$d06611caaacc3b9a = new (0, $04aca31748229d16$exports.Noise)(seedFn());
    $6b43bac69b71d100$export$1eca773ee6cf0fcc = {
        get2: function(x, y, scale2 = 1) {
            return $6b43bac69b71d100$export$d06611caaacc3b9a.perlin2(x * scale * scale2, y * scale * scale2);
        },
        get3: function(x, y, z, scale2 = 1) {
            return $6b43bac69b71d100$export$d06611caaacc3b9a.perlin3(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        }
    };
};
const $6b43bac69b71d100$var$initSimplex = ({ seedFn: seedFn, scale: scale })=>{
    $6b43bac69b71d100$export$9f7d4fdb157d33bf = (0, $358871abb9661525$export$9de79e9646a874e5)(seedFn);
    $6b43bac69b71d100$export$75de80029543ad4b = (0, $358871abb9661525$export$80cd39cae172f7fa)(seedFn);
    $6b43bac69b71d100$export$d984b0759ab0dc43 = (0, $358871abb9661525$export$8ec263ee3d525d98)(seedFn);
    $6b43bac69b71d100$export$cdff0fdd5b0f2742 = {
        get2: function(x, y, scale2 = 1) {
            return $6b43bac69b71d100$export$9f7d4fdb157d33bf(x * scale * scale2, y * scale * scale2);
        },
        get3: function(x, y, z, scale2 = 1) {
            return $6b43bac69b71d100$export$75de80029543ad4b(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        },
        get4: function(x, y, z, w, scale2 = 1) {
            return $6b43bac69b71d100$export$d984b0759ab0dc43(x * scale * scale2, y * scale * scale2, z * scale * scale2, w * scale * scale2);
        }
    };
};


window.fft = $2d2b90f04cc861b4$exports;
window.randomColor = (0, $988726ef3516a293$export$241b415aa4c83287);
window.nse.options.init = $6b43bac69b71d100$export$2cd8252107eb640b;

})();
//# sourceMappingURL=index.js.map
