import * as noiseLib from "./noise";
import * as rnd from "./rnd";
import * as math from "./math";

const create = (len, mapfn) => {
    return Array.from({length: len}, mapfn);
}

const uint8 = (len, mapfn) => {
    return Uint8Array.from({length: len}, mapfn);
}

const float32 = (len, mapfn) => {
    return Float32Array.from({length: len}, mapfn);
}
const noise = (width, height = 1, options = {}) => {
    if (typeof(height) === 'object') {
        options = height;
        height = 1;
    }
    options = Object.assign({
        type: 'improved',
        scale: 1.0,
        tw: width,
    }, options);
    const data = new Uint8Array(width * height);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const n = (noiseLib[options.type].get2(i, j, options.scale) + 1.0) / 2.0;
            data[i * width + j] = Math.round(n * 255);
        }
    }
    data.width = options.tw;
    data.height = width * height / options.tw;
    return data;
}

const random = (width, height = 1, options = {}) => {
    if (typeof(height) === 'object') {
        options = height;
        height = 1;
    }
    options = Object.assign({
        min: 0,
        tw: width,
    }, options);
    const dataType = options.dataType || (['float', 'bool'].indexOf(options.type) > -1 ? 'float32' : 'uint8');
    let data, max;
    switch (dataType) {
        case 'float':
        case 'float32':
            data = new Float32Array(width * height);
            max = 1.0;
            break;
        case 'uint16':
            data = new Uint16Array(width * height);
            max = 511;
            break;
        case 'uint8':
        default:
            data = new Uint8Array(width * height);
            max = 255;
            break;
    }
    options.max || (options.max = max);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let n;
            switch (options.type) {
                case 'bool':
                    n = rnd.bool() ? options.max : options.min;
                    break;
                case 'float':
                    n = rnd.num(options.min, options.max);
                    break;
                case 'uint8':
                default:
                    n = rnd.int(options.min, options.max);
                    break;
            }
            data[i * width + j] = n;
        }
    }
    data.width = options.tw;
    data.height = width * height / options.tw;
    return data;
}

const grid = (width, height = 1, options = {}) => {
    if (typeof(height) === 'object') {
        options = height;
        height = 1;
    }
    width = width | 0;
    height = height | 0;
    options = Object.assign({
        tw: width,
    }, options);
    const data = new Uint8Array(width * height * 2);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            data[i * width * 2 + j * 2] = j / (width-1) * 255;
            data[i * width * 2 + j * 2 + 1] = i / (height-1) * 255;
        }
    }
    data.width = options.tw;
    data.height = (width * height) / options.tw;
    data.format = 'luminance alpha';
    return data;
}

const image = (url) => {
    const data = new Uint8Array();
    tx.load(url, (texture) => {
        const image = texture.image;
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        data.set(imageData.data.buffer);
        data.width = image.width;
        data.height = image.height;
    });
    return data;
}

const sum = (list) => {
    return list.reduce((partialSum, a) => partialSum + a, 0);
};

const mul = (list, mul) => {
    return list.map((v) => v * mul);
};

const padTo = (arr, len, value = 0) => {
    if (arr.length < len) {
        const padding = new Array(len - arr.length).fill(value); // Creates an array filled with zeros.
        return arr.concat(padding);
    }
    return arr;
}

const map = (arr, from = [0, 0], to = [0, 1]) => {
    if (!Array.isArray(from)) from = [from, 0];
    from[1] || (from[1] = Math.max(...arr));
    if (!Array.isArray(to)) to = [0, to];
    return arr.map(value => math.map(value, from[0], from[1], to[0], to[1]));
}

const normalize = (arr) => {
    return map(arr);
}

const avg = (arr) => {
    return arr.reduce((acc, value) => acc + value, 0) / arr.length;
}

const transpose = (arr) => {
    if (arr.length) {
        if (!Array.isArray(arr[0])) arr[0] = Array.from(arr[0]);
        return arr[0].map((col, i) => arr.map(row => row[i]));
    }
    return arr;
}

export { create, uint8, float32, noise, random, image, grid, sum, mul, padTo, map, normalize, avg, transpose };