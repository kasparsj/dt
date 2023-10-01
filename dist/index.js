(() => {
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
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

var $3168d8109a341ea3$exports = {};

$parcel$export($3168d8109a341ea3$exports, "setfn", () => $3168d8109a341ea3$export$b0728870bc7c976a);
$parcel$export($3168d8109a341ea3$exports, "num", () => $3168d8109a341ea3$export$61cc6a0be4938a2a);
$parcel$export($3168d8109a341ea3$exports, "int", () => $3168d8109a341ea3$export$7d260a2a5f8bc19e);
$parcel$export($3168d8109a341ea3$exports, "bool", () => $3168d8109a341ea3$export$87b259aa03e3d267);
$parcel$export($3168d8109a341ea3$exports, "choice", () => $3168d8109a341ea3$export$7a5825874deea16a);
$parcel$export($3168d8109a341ea3$exports, "exp", () => $3168d8109a341ea3$export$b310ec824aaee37f);
$parcel$export($3168d8109a341ea3$exports, "gauss", () => $3168d8109a341ea3$export$770bce1690f63f17);
$parcel$export($3168d8109a341ea3$exports, "gaussMinMax", () => $3168d8109a341ea3$export$30bcd85f437fc607);
$parcel$export($3168d8109a341ea3$exports, "cache", () => $3168d8109a341ea3$export$69a3209f1a06c04d);
$parcel$export($3168d8109a341ea3$exports, "cacheNum", () => $3168d8109a341ea3$export$63ed2dc4b9bddf35);
$parcel$export($3168d8109a341ea3$exports, "cacheGauss", () => $3168d8109a341ea3$export$ff729b6547d3cd4);
$parcel$export($3168d8109a341ea3$exports, "cacheGaussMinMax", () => $3168d8109a341ea3$export$1d95d1e0fadf82f8);
$parcel$export($3168d8109a341ea3$exports, "cacheBool", () => $3168d8109a341ea3$export$949f46e8b9b85930);
$parcel$export($3168d8109a341ea3$exports, "color", () => $3168d8109a341ea3$export$35e9368ef982300f);

var $3UDaX = parcelRequire("3UDaX");
var $3fc3b968ae0cf52c$exports = {};

$parcel$export($3fc3b968ae0cf52c$exports, "lerp", () => $3fc3b968ae0cf52c$export$3a89f8d6f6bf6c9f);
$parcel$export($3fc3b968ae0cf52c$exports, "map", () => $3fc3b968ae0cf52c$export$871de8747c9eaa88);
$parcel$export($3fc3b968ae0cf52c$exports, "constrain", () => $3fc3b968ae0cf52c$export$c4e2ecac49351ef2);
$parcel$export($3fc3b968ae0cf52c$exports, "nextPow2", () => $3fc3b968ae0cf52c$export$f0d90cf68bd426eb);
$parcel$export($3fc3b968ae0cf52c$exports, "rad", () => $3fc3b968ae0cf52c$export$29e4e862bebba87f);
$parcel$export($3fc3b968ae0cf52c$exports, "deg", () => $3fc3b968ae0cf52c$export$61ddd819c68acdd);
const $3fc3b968ae0cf52c$export$3a89f8d6f6bf6c9f = (a, b, perc)=>{
    return a + (b - a) * perc;
};
const $3fc3b968ae0cf52c$export$871de8747c9eaa88 = (n, start1, stop1, start2 = 0, stop2 = 1, withinBounds = false)=>{
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) return newval;
    if (start2 < stop2) return $3fc3b968ae0cf52c$export$c4e2ecac49351ef2(newval, start2, stop2);
    else return $3fc3b968ae0cf52c$export$c4e2ecac49351ef2(newval, stop2, start2);
};
const $3fc3b968ae0cf52c$export$c4e2ecac49351ef2 = (n, low = 0, high = 1.0)=>{
    return Math.max(Math.min(n, high), low);
};
const $3fc3b968ae0cf52c$export$f0d90cf68bd426eb = (n)=>{
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
};
const $3fc3b968ae0cf52c$export$29e4e862bebba87f = (deg)=>{
    return deg * Math.PI / 180;
};
const $3fc3b968ae0cf52c$export$61ddd819c68acdd = (rad)=>{
    return rad * 180 / Math.PI;
};


let $3168d8109a341ea3$var$rndFn = Math.random;
const $3168d8109a341ea3$var$_cache = {};
const $3168d8109a341ea3$var$gaussPrev = {};
const $3168d8109a341ea3$export$b0728870bc7c976a = (func)=>{
    $3168d8109a341ea3$var$rndFn = func;
};
const $3168d8109a341ea3$export$61cc6a0be4938a2a = (a = 0.0, b = 1.0)=>{
    if (typeof b === "undefined") {
        b = a;
        a = 0;
    }
    return (0, $3fc3b968ae0cf52c$export$3a89f8d6f6bf6c9f)(a, b, $3168d8109a341ea3$var$rndFn());
};
// random integer between a and b (b is included)
// requires a < b
const $3168d8109a341ea3$export$7d260a2a5f8bc19e = (a, b)=>{
    if (typeof b === "undefined") {
        b = a;
        a = 0;
    }
    return Math.floor($3168d8109a341ea3$export$61cc6a0be4938a2a(a, b + 1));
};
// random boolean with p as percent likelihood of true
const $3168d8109a341ea3$export$87b259aa03e3d267 = (p = 0.5)=>{
    return $3168d8109a341ea3$var$rndFn() < p;
};
// choose a random item in an array of items
const $3168d8109a341ea3$export$7a5825874deea16a = (list)=>{
    return list[$3168d8109a341ea3$export$7d260a2a5f8bc19e(0, list.length - 1)];
};
const $3168d8109a341ea3$export$b310ec824aaee37f = (a, b, n = 2)=>{
    return a + $3168d8109a341ea3$var$rndFn() ** n * (b - a);
};
const $3168d8109a341ea3$export$770bce1690f63f17 = (mean, sd = 1, y1 = false, prevKey = "gauss")=>{
    let x1, x2, w;
    if (y1 === false) {
        if ($3168d8109a341ea3$var$gaussPrev[prevKey]) {
            y1 = $3168d8109a341ea3$var$gaussPrev[prevKey];
            delete $3168d8109a341ea3$var$gaussPrev[prevKey];
        } else {
            do {
                x1 = $3168d8109a341ea3$export$61cc6a0be4938a2a(0, 2) - 1;
                x2 = $3168d8109a341ea3$export$61cc6a0be4938a2a(0, 2) - 1;
                w = x1 * x1 + x2 * x2;
            }while (w >= 1);
            w = Math.sqrt(-2 * Math.log(w) / w);
            y1 = x1 * w;
            $3168d8109a341ea3$var$gaussPrev[prevKey] = x2 * w;
        }
    }
    const m = mean || 0;
    return y1 * sd + m;
};
const $3168d8109a341ea3$export$30bcd85f437fc607 = (a = 0, b = 1, y1 = false, prevKey = "gaussMinMax")=>{
    return $3168d8109a341ea3$export$770bce1690f63f17(a + (b - a) / 2, (b - a) / 2, y1, prevKey);
};
const $3168d8109a341ea3$export$69a3209f1a06c04d = (name, gen)=>{
    if (!$3168d8109a341ea3$var$_cache[name]) $3168d8109a341ea3$var$_cache[name] = (gen || $3168d8109a341ea3$var$rndFn)();
    return $3168d8109a341ea3$var$_cache[name];
};
const $3168d8109a341ea3$export$63ed2dc4b9bddf35 = (name, a = 0.0, b = 1.0)=>{
    return (0, $3fc3b968ae0cf52c$export$3a89f8d6f6bf6c9f)(a, b, $3168d8109a341ea3$export$69a3209f1a06c04d(name));
};
const $3168d8109a341ea3$export$ff729b6547d3cd4 = (name, mean, sd = 1, prevKey = "cacheGauss")=>{
    return $3168d8109a341ea3$export$69a3209f1a06c04d(name, ()=>{
        return $3168d8109a341ea3$export$770bce1690f63f17(mean, sd, false, prevKey);
    });
};
const $3168d8109a341ea3$export$1d95d1e0fadf82f8 = (name, a = 0, b = 1, prevKey = "cacheGaussMinMax")=>{
    return $3168d8109a341ea3$export$69a3209f1a06c04d(name, ()=>{
        return $3168d8109a341ea3$export$30bcd85f437fc607(a, b, false, prevKey);
    });
};
const $3168d8109a341ea3$export$949f46e8b9b85930 = (name, p = 0.5)=>{
    return $3168d8109a341ea3$export$69a3209f1a06c04d(name) < p;
};
const $3168d8109a341ea3$export$35e9368ef982300f = (options)=>{
    return (0, (/*@__PURE__*/$parcel$interopDefault($3UDaX)))(Object.assign({
        format: "rgbArray"
    }, options || {})).map((v)=>{
        const div = (v1)=>v1 / 255;
        return Array.isArray(v) ? v.map(div) : div(v);
    });
};


var $6b43bac69b71d100$exports = {};

$parcel$export($6b43bac69b71d100$exports, "perlin", () => $6b43bac69b71d100$export$1eca773ee6cf0fcc);
$parcel$export($6b43bac69b71d100$exports, "simplex", () => $6b43bac69b71d100$export$cdff0fdd5b0f2742);
$parcel$export($6b43bac69b71d100$exports, "pink", () => $6b43bac69b71d100$export$47853bc718611763);
$parcel$export($6b43bac69b71d100$exports, "brown", () => $6b43bac69b71d100$export$b6e6178d3f565007);
$parcel$export($6b43bac69b71d100$exports, "yellow", () => $6b43bac69b71d100$export$594c5a8758200c32);
$parcel$export($6b43bac69b71d100$exports, "improved", () => $6b43bac69b71d100$export$75f70b54b2b75878);
$parcel$export($6b43bac69b71d100$exports, "init", () => $6b43bac69b71d100$export$2cd8252107eb640b);
$parcel$export($6b43bac69b71d100$exports, "initPerlin", () => $6b43bac69b71d100$export$ae8059055a2327f1);
$parcel$export($6b43bac69b71d100$exports, "initSimplex", () => $6b43bac69b71d100$export$89117dd3963cebb7);
$parcel$export($6b43bac69b71d100$exports, "initFBM", () => $6b43bac69b71d100$export$5ca7a1d5f06a0627);
$parcel$export($6b43bac69b71d100$exports, "initImproved", () => $6b43bac69b71d100$export$1cca2dd0ffb5bfea);
$parcel$export($6b43bac69b71d100$exports, "fbm", () => $6b43bac69b71d100$export$5ec52a817164e2df);
$parcel$export($6b43bac69b71d100$exports, "get2", () => $6b43bac69b71d100$export$c6c37d5d787adc8a);
$parcel$export($6b43bac69b71d100$exports, "get3", () => $6b43bac69b71d100$export$abdab843d5b7c01b);
$parcel$export($6b43bac69b71d100$exports, "get4", () => $6b43bac69b71d100$export$7aa292d2922f05b3);
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


// https://cs.nyu.edu/~perlin/noise/
const $6d8adc124e61cb0a$var$_p = [
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
for(let i = 0; i < 256; i++)$6d8adc124e61cb0a$var$_p[256 + i] = $6d8adc124e61cb0a$var$_p[i];
function $6d8adc124e61cb0a$var$fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}
function $6d8adc124e61cb0a$var$lerp(t, a, b) {
    return a + t * (b - a);
}
function $6d8adc124e61cb0a$var$grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}
class $6d8adc124e61cb0a$export$e93f229b482630b9 {
    noise(x, y, z) {
        const floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);
        const X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;
        x -= floorX;
        y -= floorY;
        z -= floorZ;
        const xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;
        const u = $6d8adc124e61cb0a$var$fade(x), v = $6d8adc124e61cb0a$var$fade(y), w = $6d8adc124e61cb0a$var$fade(z);
        const A = $6d8adc124e61cb0a$var$_p[X] + Y, AA = $6d8adc124e61cb0a$var$_p[A] + Z, AB = $6d8adc124e61cb0a$var$_p[A + 1] + Z, B = $6d8adc124e61cb0a$var$_p[X + 1] + Y, BA = $6d8adc124e61cb0a$var$_p[B] + Z, BB = $6d8adc124e61cb0a$var$_p[B + 1] + Z;
        return $6d8adc124e61cb0a$var$lerp(w, $6d8adc124e61cb0a$var$lerp(v, $6d8adc124e61cb0a$var$lerp(u, $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[AA], x, y, z), $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[BA], xMinus1, y, z)), $6d8adc124e61cb0a$var$lerp(u, $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[AB], x, yMinus1, z), $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[BB], xMinus1, yMinus1, z))), $6d8adc124e61cb0a$var$lerp(v, $6d8adc124e61cb0a$var$lerp(u, $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[AA + 1], x, y, zMinus1), $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[BA + 1], xMinus1, y, zMinus1)), $6d8adc124e61cb0a$var$lerp(u, $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[AB + 1], x, yMinus1, zMinus1), $6d8adc124e61cb0a$var$grad($6d8adc124e61cb0a$var$_p[BB + 1], xMinus1, yMinus1, zMinus1))));
    }
}



const $6b43bac69b71d100$var$options = {};
let $6b43bac69b71d100$export$1eca773ee6cf0fcc, $6b43bac69b71d100$export$cdff0fdd5b0f2742, $6b43bac69b71d100$export$47853bc718611763, $6b43bac69b71d100$export$b6e6178d3f565007, $6b43bac69b71d100$export$594c5a8758200c32, $6b43bac69b71d100$export$75f70b54b2b75878, $6b43bac69b71d100$var$simplex2D, $6b43bac69b71d100$var$simplex3D, $6b43bac69b71d100$var$simplex4D, $6b43bac69b71d100$var$noisejs;
const $6b43bac69b71d100$export$2cd8252107eb640b = (opts = {})=>{
    Object.assign($6b43bac69b71d100$var$options, {
        seedFn: Math.random,
        scale: 0.06,
        octaves: 6,
        lacunarity: 2.0
    }, opts);
    $6b43bac69b71d100$export$ae8059055a2327f1($6b43bac69b71d100$var$options);
    $6b43bac69b71d100$export$89117dd3963cebb7($6b43bac69b71d100$var$options);
    $6b43bac69b71d100$export$5ca7a1d5f06a0627($6b43bac69b71d100$var$options);
    $6b43bac69b71d100$export$1cca2dd0ffb5bfea($6b43bac69b71d100$var$options);
};
const $6b43bac69b71d100$export$ae8059055a2327f1 = ({ seedFn: seedFn, scale: scale })=>{
    $6b43bac69b71d100$var$noisejs = new (0, $04aca31748229d16$exports.Noise)(seedFn());
    $6b43bac69b71d100$export$1eca773ee6cf0fcc = {
        get2: function(x, y, scale2 = 1) {
            return $6b43bac69b71d100$var$noisejs.perlin2(x * scale * scale2, y * scale * scale2);
        },
        get3: function(x, y, z, scale2 = 1) {
            return $6b43bac69b71d100$var$noisejs.perlin3(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        }
    };
};
const $6b43bac69b71d100$export$89117dd3963cebb7 = ({ seedFn: seedFn, scale: scale })=>{
    $6b43bac69b71d100$var$simplex2D = (0, $358871abb9661525$export$9de79e9646a874e5)(seedFn);
    $6b43bac69b71d100$var$simplex3D = (0, $358871abb9661525$export$80cd39cae172f7fa)(seedFn);
    $6b43bac69b71d100$var$simplex4D = (0, $358871abb9661525$export$8ec263ee3d525d98)(seedFn);
    $6b43bac69b71d100$export$cdff0fdd5b0f2742 = {
        get2: function(x, y, scale2 = 1) {
            return $6b43bac69b71d100$var$simplex2D(x * scale * scale2, y * scale * scale2);
        },
        get3: function(x, y, z, scale2 = 1) {
            return $6b43bac69b71d100$var$simplex3D(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        },
        get4: function(x, y, z, w, scale2 = 1) {
            return $6b43bac69b71d100$var$simplex4D(x * scale * scale2, y * scale * scale2, z * scale * scale2, w * scale * scale2);
        }
    };
};
const $6b43bac69b71d100$export$5ca7a1d5f06a0627 = ()=>{
    $6b43bac69b71d100$export$47853bc718611763 = {
        get2: function(x, y, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get2(x * scale * f, y * scale * f);
            }, 0, options);
        },
        get3: function(x, y, z, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get3(x * scale * f, y * scale * f, z * scale * f);
            }, 0, options);
        },
        get4: function(x, y, z, w, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get4(x * scale * f, y * scale * f, z * f, w * scale * f);
            }, 0, options);
        }
    };
    $6b43bac69b71d100$export$b6e6178d3f565007 = {
        get2: function(x, y, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get2(x * scale * f, y * scale * f);
            }, 0.5, options);
        },
        get3: function(x, y, z, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get3(x * scale * f, y * scale * f, z * scale * f);
            }, 0.5, options);
        },
        get4: function(x, y, z, w, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get4(x * scale * f, y * scale * f, z * scale * f, w * scale * f);
            }, 0.5, options);
        }
    };
    $6b43bac69b71d100$export$594c5a8758200c32 = {
        get2: function(x, y, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get2(x * scale * f, y * scale * f);
            }, 1.0, options);
        },
        get3: function(x, y, z, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get3(x * scale * f, y * scale * f, z * scale * f);
            }, 1.0, options);
        },
        get4: function(x, y, z, w, scale = 1, options = {}) {
            return $6b43bac69b71d100$export$5ec52a817164e2df((f)=>{
                return $6b43bac69b71d100$export$cdff0fdd5b0f2742.get4(x * scale * f, y * scale * f, z * scale * f, w * scale * f);
            }, 1.0, options);
        }
    };
};
const $6b43bac69b71d100$export$1cca2dd0ffb5bfea = ({ scale: scale })=>{
    const improvedNoise = new (0, $6d8adc124e61cb0a$export$e93f229b482630b9)();
    $6b43bac69b71d100$export$75f70b54b2b75878 = {
        get2: function(x, y, scale2 = 1) {
            return improvedNoise.noise(x * scale * scale2, y * scale * scale2, 0);
        },
        get3: function(x, y, z, scale2 = 1) {
            return improvedNoise.noise(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        }
    };
};
function $6b43bac69b71d100$export$c6c37d5d787adc8a(type, x, y, min = 0, max = 1, scale = 1) {
    const types = {
        perlin: $6b43bac69b71d100$export$1eca773ee6cf0fcc,
        simplex: $6b43bac69b71d100$export$cdff0fdd5b0f2742,
        pink: $6b43bac69b71d100$export$47853bc718611763,
        brown: $6b43bac69b71d100$export$b6e6178d3f565007,
        yellow: $6b43bac69b71d100$export$594c5a8758200c32,
        improved: $6b43bac69b71d100$export$75f70b54b2b75878
    };
    return (0, $3fc3b968ae0cf52c$export$871de8747c9eaa88)(types[type].get2(x, y, scale), -1, 1, min, max);
}
function $6b43bac69b71d100$export$abdab843d5b7c01b(type, x, y, z, min = 0, max = 1, scale = 1) {
    const types = {
        perlin: $6b43bac69b71d100$export$1eca773ee6cf0fcc,
        simplex: $6b43bac69b71d100$export$cdff0fdd5b0f2742,
        pink: $6b43bac69b71d100$export$47853bc718611763,
        brown: $6b43bac69b71d100$export$b6e6178d3f565007,
        yellow: $6b43bac69b71d100$export$594c5a8758200c32,
        improved: $6b43bac69b71d100$export$75f70b54b2b75878
    };
    return (0, $3fc3b968ae0cf52c$export$871de8747c9eaa88)(types[type].get3(x, y, z, scale), -1, 1, min, max);
}
function $6b43bac69b71d100$export$7aa292d2922f05b3(type, x, y, z, w, min = 0, max = 1, scale = 1) {
    const types = {
        simplex: $6b43bac69b71d100$export$cdff0fdd5b0f2742,
        pink: $6b43bac69b71d100$export$47853bc718611763,
        brown: $6b43bac69b71d100$export$b6e6178d3f565007,
        yellow: $6b43bac69b71d100$export$594c5a8758200c32
    };
    return (0, $3fc3b968ae0cf52c$export$871de8747c9eaa88)(types[type].get4(x, y, z, w, scale), -1, 1, min, max);
}
function $6b43bac69b71d100$export$5ec52a817164e2df(noiseFn, H, opts = {}) {
    opts = Object.assign({}, $6b43bac69b71d100$var$options, opts);
    const G = Math.pow(2, -H);
    let frequency = 1.0;
    let amplitude = 1.0;
    // let max = amplitude;
    let result = 0.0;
    for(let i = 0; i < opts.octaves; i++){
        result += amplitude * noiseFn(frequency);
        frequency *= opts.lacunarity;
        amplitude *= G;
    // max += amplitude;
    }
    return result;
// const redistributed = Math.pow(result, opts.redistribution);
// return redistributed / max;
}


var $9c47f2c9245cc4b2$exports = {};

$parcel$export($9c47f2c9245cc4b2$exports, "create", () => $9c47f2c9245cc4b2$export$185802fd694ee1f5);
$parcel$export($9c47f2c9245cc4b2$exports, "uint8", () => $9c47f2c9245cc4b2$export$52e103c63c4e68cf);
$parcel$export($9c47f2c9245cc4b2$exports, "float32", () => $9c47f2c9245cc4b2$export$1a4bac2aea11f30e);
$parcel$export($9c47f2c9245cc4b2$exports, "noise", () => $9c47f2c9245cc4b2$export$d3022aad56692482);
$parcel$export($9c47f2c9245cc4b2$exports, "random", () => $9c47f2c9245cc4b2$export$4385e60b38654f68);
$parcel$export($9c47f2c9245cc4b2$exports, "mirror", () => $9c47f2c9245cc4b2$export$205349702e9dbad8);
$parcel$export($9c47f2c9245cc4b2$exports, "mirror1", () => $9c47f2c9245cc4b2$export$c7e28f8718285ebf);
$parcel$export($9c47f2c9245cc4b2$exports, "grid", () => $9c47f2c9245cc4b2$export$85fc379452d91af0);
$parcel$export($9c47f2c9245cc4b2$exports, "image", () => $9c47f2c9245cc4b2$export$5c452ff88e35e47d);
$parcel$export($9c47f2c9245cc4b2$exports, "sum", () => $9c47f2c9245cc4b2$export$8a63f25cc62965f1);
$parcel$export($9c47f2c9245cc4b2$exports, "mul", () => $9c47f2c9245cc4b2$export$6e3a27864ab166fe);
$parcel$export($9c47f2c9245cc4b2$exports, "padTo", () => $9c47f2c9245cc4b2$export$fcbe1efa6919329);
$parcel$export($9c47f2c9245cc4b2$exports, "map", () => $9c47f2c9245cc4b2$export$871de8747c9eaa88);
$parcel$export($9c47f2c9245cc4b2$exports, "normalize", () => $9c47f2c9245cc4b2$export$a3295358bff77e);
$parcel$export($9c47f2c9245cc4b2$exports, "avg", () => $9c47f2c9245cc4b2$export$86c4352b5bd9c815);
$parcel$export($9c47f2c9245cc4b2$exports, "transpose", () => $9c47f2c9245cc4b2$export$9cb09a71b7d66923);



const $9c47f2c9245cc4b2$export$185802fd694ee1f5 = (len, mapfn)=>{
    return Array.from({
        length: len
    }, mapfn);
};
const $9c47f2c9245cc4b2$export$52e103c63c4e68cf = (len, mapfn)=>{
    return Uint8Array.from({
        length: len
    }, mapfn);
};
const $9c47f2c9245cc4b2$export$1a4bac2aea11f30e = (len, mapfn)=>{
    return Float32Array.from({
        length: len
    }, mapfn);
};
const $9c47f2c9245cc4b2$export$d3022aad56692482 = (width, height = 1, options = {})=>{
    if (typeof height === "object") {
        options = height;
        height = 1;
    }
    options = Object.assign({
        type: "improved",
        offset: $3168d8109a341ea3$export$7d260a2a5f8bc19e(10000),
        scale: 1.0,
        tw: width
    }, options);
    const data = new Uint8Array(width * height);
    for(let i = 0; i < height; i++)for(let j = 0; j < width; j++){
        const n = ($6b43bac69b71d100$exports[options.type].get2(i + options.offset, j, options.scale) + 1.0) / 2.0;
        data[i * width + j] = Math.round(n * 255);
    }
    data.width = options.tw;
    data.height = width * height / options.tw;
    return data;
};
const $9c47f2c9245cc4b2$export$4385e60b38654f68 = (width, height = 1, options = {})=>{
    if (typeof height === "object") {
        options = height;
        height = 1;
    }
    options = Object.assign({
        min: 0,
        tw: width
    }, options);
    const dataType = options.dataType || ([
        "float",
        "bool"
    ].indexOf(options.type) > -1 ? "float32" : "uint8");
    let data, max;
    switch(dataType){
        case "float":
        case "float32":
            data = new Float32Array(width * height);
            max = 1.0;
            break;
        case "uint16":
            data = new Uint16Array(width * height);
            max = 511;
            break;
        case "uint8":
        default:
            data = new Uint8Array(width * height);
            max = 255;
            break;
    }
    options.max || (options.max = max);
    for(let i = 0; i < height; i++)for(let j = 0; j < width; j++){
        let n;
        switch(options.type){
            case "bool":
                n = $3168d8109a341ea3$export$87b259aa03e3d267() ? options.max : options.min;
                break;
            case "float":
                n = $3168d8109a341ea3$export$61cc6a0be4938a2a(options.min, options.max);
                break;
            case "uint8":
            default:
                n = $3168d8109a341ea3$export$7d260a2a5f8bc19e(options.min, options.max);
                break;
        }
        data[i * width + j] = n;
    }
    data.width = options.tw;
    data.height = width * height / options.tw;
    return data;
};
const $9c47f2c9245cc4b2$export$205349702e9dbad8 = (data)=>{
    const resultSize = data.length * 4;
    const resultArray = new data.constructor(resultSize);
    if (data.width && data.height) {
        for(let i = 0; i < data.width; i++)for(let j = 0; j < data.height; j++){
            const k = j * data.width + i;
            const l = j * 2 * data.width + i;
            resultArray[l] = data[k];
            resultArray[data.width + l] = data[j * data.width + data.width - i - 1];
            resultArray[data.length * 2 + l] = data[data.length - (j + 1) * data.width + i];
            resultArray[resultSize - l - 1] = data[k];
        }
        resultArray.width = data.width * 2;
        resultArray.height = data.height * 2;
    }
    return resultArray;
};
const $9c47f2c9245cc4b2$export$c7e28f8718285ebf = (data)=>{
    let resultArray;
    if (data.width && data.height) {
        const resultSize = (data.width * 2 - 1) * (data.height * 2 - 1);
        resultArray = new data.constructor(resultSize);
        for(let i = 0; i < data.width; i++)for(let j = 0; j < data.height; j++){
            const k = j * data.width + i;
            const l = j * (2 * data.width - 1) + i;
            resultArray[l] = data[k];
            resultArray[resultSize - l - 1] = data[k];
            if (i > 0) {
                resultArray[data.width + l - 1] = data[j * data.width + data.width - i - 1];
                if (j > 0) {
                    const m = (j - 1) * (2 * data.width - 1) + i;
                    resultArray[data.length * 2 - data.height + m - 1] = data[data.length - (j + 1) * data.width + i - 1];
                }
            }
        }
        resultArray.width = data.width * 2 - 1;
        resultArray.height = data.height * 2 - 1;
    }
    return resultArray;
};
const $9c47f2c9245cc4b2$export$85fc379452d91af0 = (width, height = 1, options = {})=>{
    if (typeof height === "object") {
        options = height;
        height = 1;
    }
    width = width | 0;
    height = height | 0;
    options = Object.assign({
        tw: width
    }, options);
    const data = new Uint8Array(width * height * 2);
    for(let i = 0; i < height; i++)for(let j = 0; j < width; j++){
        data[i * width * 2 + j * 2] = j / (width - 1) * 255;
        data[i * width * 2 + j * 2 + 1] = i / (height - 1) * 255;
    }
    data.width = options.tw;
    data.height = width * height / options.tw;
    data.format = "luminance alpha";
    return data;
};
const $9c47f2c9245cc4b2$export$5c452ff88e35e47d = (url)=>{
    const data = new Uint8Array();
    tx.load(url, (texture)=>{
        const image = texture.image;
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        data.set(imageData.data.buffer);
        data.width = image.width;
        data.height = image.height;
    });
    return data;
};
const $9c47f2c9245cc4b2$export$8a63f25cc62965f1 = (list)=>{
    return list.reduce((partialSum, a)=>partialSum + a, 0);
};
const $9c47f2c9245cc4b2$export$6e3a27864ab166fe = (list, mul)=>{
    return list.map((v)=>v * mul);
};
const $9c47f2c9245cc4b2$export$fcbe1efa6919329 = (arr, len, value = 0)=>{
    if (arr.length < len) {
        const padding = new Array(len - arr.length).fill(value); // Creates an array filled with zeros.
        return arr.concat(padding);
    }
    return arr;
};
const $9c47f2c9245cc4b2$export$871de8747c9eaa88 = (arr, from = [
    0,
    0
], to = [
    0,
    1
])=>{
    if (!Array.isArray(from)) from = [
        from,
        0
    ];
    from[1] || (from[1] = Math.max(...arr));
    if (!Array.isArray(to)) to = [
        0,
        to
    ];
    return arr.map((value)=>$3fc3b968ae0cf52c$export$871de8747c9eaa88(value, from[0], from[1], to[0], to[1]));
};
const $9c47f2c9245cc4b2$export$a3295358bff77e = (arr)=>{
    return $9c47f2c9245cc4b2$export$871de8747c9eaa88(arr);
};
const $9c47f2c9245cc4b2$export$86c4352b5bd9c815 = (arr)=>{
    return arr.reduce((acc, value)=>acc + value, 0) / arr.length;
};
const $9c47f2c9245cc4b2$export$9cb09a71b7d66923 = (arr)=>{
    if (arr.length) {
        if (!Array.isArray(arr[0])) arr[0] = Array.from(arr[0]);
        return arr[0].map((col, i)=>arr.map((row)=>row[i]));
    }
    return arr;
};


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
        if (sig.length < options.chunkSize) sig = $9c47f2c9245cc4b2$export$fcbe1efa6919329(sig, $3fc3b968ae0cf52c$export$f0d90cf68bd426eb(sig.length));
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



window.rnd = $3168d8109a341ea3$exports;
window.nse = $6b43bac69b71d100$exports;
window.arr = $9c47f2c9245cc4b2$exports;
window.fft = $2d2b90f04cc861b4$exports;
window.math = $3fc3b968ae0cf52c$exports;

})();
//# sourceMappingURL=index.js.map
