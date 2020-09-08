var contextID = -1;
var lastRemappedKeyEvent = undefined;

chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

chrome.input.ime.onBlur.addListener(function(context) {
  contextID = -1;
});

function isRemappedEvent(keyData) {
 // hack, should check for a sender ID (to be added to KeyData)
 return lastRemappedKeyEvent != undefined &&
        (lastRemappedKeyEvent.key == keyData.key &&
         lastRemappedKeyEvent.code == keyData.code &&
         lastRemappedKeyEvent.type == keyData.type
        ); // requestID would be different so we are not checking for it
}

chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;

      if (isRemappedEvent(keyData)) {
        return false;
      }

      if (keyData.code === "BrightnessDown") {
        keyData.code = "F1";
        handled = true;
      }
      if (keyData.code === "BrightnessUp") {
        keyData.code = "F2";
        handled = true;
      }
      if (keyData.code === "MediaTrackPrevious") {
        keyData.code = "F7";
        handled = true;
      }
      if (keyData.code === "AudioVolumeMute") {
        keyData.code = "F10";
        handled = true;
      }
      if (keyData.code === "AudioVolumeDown") {
        keyData.code = "F11";
        handled = true;
      }
      if (keyData.code === "AudioVolumeUp") {
        keyData.code = "F12";
        handled = true;
      }
      if (keyData.code === "") {
        keyData.code = "F5";
        handled = true;
      }

      if (handled) {
        lastRemappedKeyEvent = keyData;
        chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [keyData]});
      }

      return handled;
});
