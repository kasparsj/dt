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

export { lerp, map, constrain }