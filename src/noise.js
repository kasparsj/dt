import { Noise } from "noisejs";
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';
import { map } from "./math";

const options = {};
let perlin, simplex, pink, brown, yellow, improved, simplex2D, simplex3D, simplex4D, noisejs;

const init = (opts = {}) => {
    Object.assign(options, {
        seedFn: Math.random,
        scale: 0.06,
        octaves: 6,
        lacunarity: 2.0,
        // redistribution: 1,
    }, opts);
    initPerlin(options);
    initSimplex(options);
    initFBM(options);
    initImproved(options);
}

const initPerlin = ({seedFn, scale}) => {
    noisejs = new Noise(seedFn());
    perlin = {
        get2: function(x, y, scale2 = 1) {
            return noisejs.perlin2(x * scale * scale2, y * scale * scale2);
        },
        get3: function(x, y, z, scale2 = 1) {
            return noisejs.perlin3(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        },
    };
}

const initSimplex = ({seedFn, scale}) => {
    simplex2D = createNoise2D(seedFn);
    simplex3D = createNoise3D(seedFn);
    simplex4D = createNoise4D(seedFn);
    simplex = {
        get2: function(x, y, scale2 = 1) {
            return simplex2D(x * scale * scale2, y * scale * scale2);
        },
        get3: function(x, y, z, scale2 = 1) {
            return simplex3D(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        },
        get4: function(x, y, z, w, scale2 = 1) {
            return simplex4D(x * scale * scale2, y * scale * scale2, z * scale * scale2, w * scale * scale2);
        },
    };
}

const initFBM = () => {
    pink = {
        get2: function(x, y, options) {
            return fbm((f) => { return simplex.get2(x * f, y * f) }, 0, options);
        },
        get3: function(x, y, z, options) {
            return fbm((f) => { return simplex.get3(x * f, y * f, z * f) }, 0, options);
        },
        get4: function(x, y, z, options) {
            return fbm((f) => { return simplex.get4(x * f, y * f, z * f, w * f) }, 0, options);
        },
    };
    brown = {
        get2: function(x, y, z, w, options) {
            return fbm((f) => { return simplex.get2(x * f, y * f) }, 0.5, options);
        },
        get3: function(x, y, z, options) {
            return fbm((f) => { return simplex.get3(x * f, y * f, z * f) }, 0.5, options);
        },
        get4: function(x, y, z, options) {
            return fbm((f) => { return simplex.get4(x * f, y * f, z * f, w * f) }, 0.5, options);
        },
    };
    yellow = {
        get2: function(x, y, options) {
            return fbm((f) => { return simplex.get2(x * f, y * f) }, 1.0, options);
        },
        get3: function(x, y, z, options) {
            return fbm((f) => { return simplex.get3(x * f, y * f, z * f) }, 1.0, options);
        },
        get4: function(x, y, z, options) {
            return fbm((f) => { return simplex.get4(x * f, y * f, z * f, w * f) }, 1.0, options);
        },
    };
}

const initImproved = ({scale}) => {
    const improvedNoise = new ImprovedNoise();
    improved = {
        get2: function(x, y, scale2 = 1) {
            return improvedNoise.noise(x * scale * scale2, y * scale * scale2, 0);
        },
        get3: function(x, y, z, scale2 = 1) {
            return improvedNoise.noise(x * scale * scale2, y * scale * scale2, z * scale * scale2);
        },
    };
}

function get2(type, x, y, min = 0, max = 1, scale = 1) {
    const types = {perlin, simplex, pink, brown, yellow};
    return map(types[type].get2(x, y, scale), -1, 1, min, max);
}

function get3(type, x, y, z, min = 0, max = 1, scale = 1) {
    const types = {perlin, simplex, pink, brown, yellow};
    return map(types[type].get3(x, y, z, scale), -1, 1, min, max);
}

function get4(type, x, y, z, w, min = 0, max = 1, scale = 1) {
    const types = {simplex, pink, brown, yellow};
    return map(types[type].get4(x, y, z, w, scale), -1, 1, min, max);
}

function fbm(noiseFn, H, opts) {
    opts = Object.assign({}, options, opts || {});
    const G = Math.pow(2, -H);
    let frequency = 1.0;
    let amplitude = 1.0;
    // let max = amplitude;
    let result = 0.0;
    for (let i=0; i<opts.octaves; i++ ) {
        result += amplitude * noiseFn(frequency);
        frequency *= opts.lacunarity;
        amplitude *= G;
        // max += amplitude;
    }
    return result;
    // const redistributed = Math.pow(result, opts.redistribution);
    // return redistributed / max;
}

window.noise = {
    perlin, simplex, pink, brown, yellow, improved,
    init, initPerlin, initSimplex, initFBM, initImproved,
    fbm, get2, get3, get4,
};

export {
    perlin, simplex, pink, brown, yellow, improved,
    init, initPerlin, initSimplex, initFBM, initImproved,
    fbm, get2, get3, get4,
};