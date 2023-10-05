import randomColor from "randomcolor";

const wrapRandomColor = (options) => {
    return randomColor(Object.assign({
        format: 'rgbArray'
    }, options || {})).map((v) => {
        const div = (v1) => v1/255;
        return Array.isArray(v) ? v.map(div) : div(v);
    });
}

export {wrapRandomColor}