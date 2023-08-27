const lerp = (a, b, perc) => {
    return a + (b - a) * perc;
}

const map = (n, start1, stop1, start2, stop2, withinBounds) => {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return constrain(newval, start2, stop2);
    } else {
        return constrain(newval, stop2, start2);
    }
};

const constrain = (n, low = 0, high = 1.0) => {
    return Math.max(Math.min(n, high), low);
};

const nextPow2 = (n) => {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
}

window.math = { lerp, map, constrain, nextPow2 };

export { lerp, map, constrain, nextPow2 }