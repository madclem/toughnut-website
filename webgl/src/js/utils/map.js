const map = (val, inputMin, inputMax, outputMin, outputMax) => ((outputMax - outputMin) * ((val - inputMin) / (inputMax - inputMin))) + outputMin;

export { map };
