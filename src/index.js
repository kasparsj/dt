import * as fft from "./fft";
import {wrapRandomColor} from "./randomColor";
import * as nse from "./noise";

window.fft = fft;
window.randomColor = wrapRandomColor;
window.nse.options.init = nse.init;
