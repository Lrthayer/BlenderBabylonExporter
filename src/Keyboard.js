var BlenderKeyConversion = {};

BlenderKeyConversion["A"] = 65; BlenderKeyConversion["B"] = 66;BlenderKeyConversion["C"] = 67;BlenderKeyConversion["D"] = 68;BlenderKeyConversion["E"] = 69;
BlenderKeyConversion["F"] = 70;BlenderKeyConversion["G"] = 71;BlenderKeyConversion["H"] = 72;BlenderKeyConversion["I"] = 73;BlenderKeyConversion["J"] = 74;
BlenderKeyConversion["K"] = 75;BlenderKeyConversion["L"] = 76;BlenderKeyConversion["M"] = 77;BlenderKeyConversion["N"] = 78;BlenderKeyConversion["O"] = 79;
BlenderKeyConversion["P"] = 80;BlenderKeyConversion["Q"] = 81;BlenderKeyConversion["R"] = 82;BlenderKeyConversion["S"] = 83;BlenderKeyConversion["T"] = 84;
BlenderKeyConversion["U"] = 85;BlenderKeyConversion["V"] = 86;BlenderKeyConversion["W"] = 87;BlenderKeyConversion["X"] = 88;BlenderKeyConversion["Y"] = 89;
BlenderKeyConversion["Z"] = 90;

//variable holding key being pressed
this.currentKey = null;
keysDown = new Array(256);
//initialize keys array to all false
for (keyNum = 0; keyNum < 256; keyNum++) {
    this.keysDown[keyNum] = false;
} // end for

this.updateKeys = function (e) {
    currentKey = e.keyCode;
    keysDown[e.keyCode] = true;
}

this.clearKeys = function (e) {
    currentKey = null;
    keysDown[e.keyCode] = false;
}

document.onkeydown = this.updateKeys;
document.onkeyup = this.clearKeys;