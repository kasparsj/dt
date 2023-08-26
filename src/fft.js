const bw = (bufferSize, sampleRate) => {
    return sampleRate / bufferSize;
}

const bin = (freq, bufferSize = 512, sampleRate = 44100) => {
    return Math.floor(freq / fftBw(bufferSize, sampleRate));
}

const freq = (bin, bufferSize = 512, sampleRate = 44100) => {
    return bin * fftBw(bufferSize, sampleRate);
}

const extract = (signal, options = {}) => {
    options = Object.assign({
        bufferSize: 512,
        chunkSize: signal.length,
        loBin: 0,
        hiBin: 0,
        feature: "amplitudeSpectrum",
    }, options);
    if (options.hiBin < 0) {
        options.hiBin = options.bufferSize / 2 - 1;
    }
    const origBufferSize = Meyda.bufferSize;
    let values = [];
    for (let i=0; i<signal.length; i += options.chunkSize) {
        let data = signal.slice(i, i + options.chunkSize);
        if (data.length < options.chunkSize) {
            data = padTo(data, nextPow2(data.length));
        }
        Meyda.bufferSize = options.bufferSize;
        let fft = Meyda.extract(options.feature, data);
        let value = avg(fft.slice(options.loBin, options.hiBin + 1));
        values.push(value);
    }
    Meyda.bufferSize = origBufferSize;
    return values;
}

window.fft = { bw, bin, extract };

export { bw, bin, extract };