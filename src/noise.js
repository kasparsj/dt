import { Noise } from "noisejs";
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';

let simplex2D, simplex3D, simplex4D, noisejs, perlin, simplex;

const init = (options = {}) => {
    initPerlin(options);
    initSimplex(options);
    Object.assign(nse.types, {perlin, simplex});
    nse.pink.get4 = (x, y, z, w, scale = 1, options = {}) => {
        return nse.fbm((f) => { return simplex.get4(x * scale * f, y * scale * f, z * f, w * scale * f) }, 0, options);
    }
    nse.brown.get4 = (x, y, z, w, scale = 1, options = {}) => {
        return nse.fbm((f) => { return simplex.get4(x * scale * f, y * scale * f, z * scale * f, w * scale * f) }, 0.5, options);
    }
    nse.yellow.get4 = (x, y, z, w, scale = 1, options = {}) => {
        return nse.fbm((f) => { return simplex.get4(x * scale * f, y * scale * f, z * scale * f, w * scale * f) }, 1.0, options);
    }
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

export {
    simplex2D, simplex3D, simplex4D, noisejs,
    perlin, simplex,
    init,
}