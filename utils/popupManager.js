globalThis.createPopup = function(popupTextData) {
    gameScene._buildInfoPopup()

    const infoPopup = gameScene._infoPopup

    infoPopup.list[7].destroy()
    
    for (let currentTextIndex = 0; currentTextIndex < 6; currentTextIndex++) {
        if (popupTextData[currentTextIndex] != false) {
            infoPopup.list[currentTextIndex + 3].setText(popupTextData[currentTextIndex])
        }

        if (popupTextData[currentTextIndex] == null) {
            infoPopup.list[currentTextIndex + 3].setText("")
        }
  }
}
