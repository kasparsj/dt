import * as arr from "./arr";
import * as math from "./math";

const bw = (bufferSize, sampleRate) => {
    return sampleRate / bufferSize;
}

const bin = (freq, bufferSize = 512, sampleRate = 44100) => {
    return Math.floor(freq / bw(bufferSize, sampleRate));
}

const freq = (bin, bufferSize = 512, sampleRate = 44100) => {
    return bin * bw(bufferSize, sampleRate);
}

const extract = (signal, options = {}) => {
    options = Object.assign({
        bufferSize: 512,
        chunkSize: signal.length,
        feature: "amplitudeSpectrum",
    }, options);
    options.bufferSize = parseInt(options.bufferSize);
    options.chunkSize = parseInt(options.chunkSize);
    const origBufferSize = Meyda.bufferSize;
    let fft = [];
    for (let i=0; i<signal.length; i += options.chunkSize) {
        let sig = signal.slice(i, i + options.chunkSize);
        if (sig.length < options.chunkSize) {
            sig = arr.padTo(sig, math.nextPow2(sig.length));
        }
        Meyda.bufferSize = options.bufferSize;
        let data = Meyda.extract(options.feature, sig);
        fft.push(data);
    }
    Meyda.bufferSize = origBufferSize;
    return fft.length > 1 ? fft : fft[0];
}

const band = (fft, options = {}) => {
    options = Object.assign({
        bufferSize: 512,
        loBin: 0,
        hiBin: 0,
    }, options);
    if (options.hiBin < 0) {
        options.hiBin = options.bufferSize / 2 - 1;
    }
    const chunkAvg = (chunk) => {
        return chunk.slice(options.loBin, options.hiBin + 1);
    };
    if (Array.isArray(fft[0]) || fft[0] instanceof Float32Array) {
        return fft.map(chunkAvg);
    }
    return chunkAvg(fft);
}

export { bw, bin, freq, extract, band };