//create a dictionary
var BlenderKeyConversion = {};

//convert any blender char to the value javascript accepts
BlenderKeyConversion["A"] = 65; BlenderKeyConversion["B"] = 66;BlenderKeyConversion["C"] = 67;BlenderKeyConversion["D"] = 68;BlenderKeyConversion["E"] = 69;
BlenderKeyConversion["F"] = 70;BlenderKeyConversion["G"] = 71;BlenderKeyConversion["H"] = 72;BlenderKeyConversion["I"] = 73;BlenderKeyConversion["J"] = 74;
BlenderKeyConversion["K"] = 75;BlenderKeyConversion["L"] = 76;BlenderKeyConversion["M"] = 77;BlenderKeyConversion["N"] = 78;BlenderKeyConversion["O"] = 79;
BlenderKeyConversion["P"] = 80;BlenderKeyConversion["Q"] = 81;BlenderKeyConversion["R"] = 82;BlenderKeyConversion["S"] = 83;BlenderKeyConversion["T"] = 84;
BlenderKeyConversion["U"] = 85;BlenderKeyConversion["V"] = 86;BlenderKeyConversion["W"] = 87;BlenderKeyConversion["X"] = 88;BlenderKeyConversion["Y"] = 89;
BlenderKeyConversion["Z"] = 90; BlenderKeyConversion["SPACE"] = 32; BlenderKeyConversion["LEFT_ARROW"] = 37; BlenderKeyConversion["RIGHT_ARROW"] = 39;
BlenderKeyConversion["UP_ARROW"] = 38; BlenderKeyConversion["DOWN_ARROW"] = 40; BlenderKeyConversion["ESC"] = 27; BlenderKeyConversion["PAGE_UP"] = 33;
BlenderKeyConversion["PAGE_UP"] = 34; BlenderKeyConversion["HOME"] = 36; BlenderKeyConversion["END"] = 35; BlenderKeyConversion["NUMPAD_0"] = 48;
BlenderKeyConversion["NUMPAD_1"] = 49; BlenderKeyConversion["NUMPAD_2"] = 50; BlenderKeyConversion["NUMPAD_3"] = 51; BlenderKeyConversion["NUMPAD_4"] = 52;
BlenderKeyConversion["NUMPAD_5"] = 53; BlenderKeyConversion["NUMPAD_6"] = 54; BlenderKeyConversion["NUMPAD_7"] = 55; BlenderKeyConversion["NUMPAD_8"] = 56;
BlenderKeyConversion["NUMPAD_9"] = 57;

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

//make our functions run when javascript's event handler keydown and keyup is called
document.onkeydown = this.updateKeys;
document.onkeyup = this.clearKeys;