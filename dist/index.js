(() => {
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
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


window.fft = $2d2b90f04cc861b4$exports;

})();
//# sourceMappingURL=index.js.map
