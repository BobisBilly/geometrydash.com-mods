// Required Script Setup \\
await fetch('https://raw.githubusercontent.com/BobisBilly/geometrydash.com-mods/refs/heads/main/utils/popupManager.js')
  .then(response => response.text())
  .then(code => eval(code));

// Public Variables \\
const gameScene = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.getScenes(false)[1]
const frameX = 680, frameY = 435, frameW = 120, frameH = 123;
const texture = gameScene.textures.get('GJ_WebSheet');
var publicOnlineBtn = null

texture.add('BB_onlineBtn_001', 0, frameX, frameY, frameW, frameH);

// Original Hook Variables \\
const makeBouncyButton = gameScene._makeBouncyButton
const startGame = gameScene._startGame

// Functions \\
function openLevelSearchMenu() {
    // To-Do: Make UI for level searching
    // Currently starts "Stereo Madness"
    
    gameScene._audio.playEffect("playSound_01")
    gameScene._startGame()
}

function onlineBtnSetup(firstLaunch) {
    const onlineBtn = gameScene.add.image(gameScene.scale.width / 4 + gameScene.scale.width / 2, gameScene.scale.height/2, 'GJ_WebSheet', 'BB_onlineBtn_001');
    
    onlineBtn.setInteractive()

    gameScene._makeBouncyButton(onlineBtn, 1, openLevelSearchMenu)

    publicOnlineBtn = onlineBtn

    if (firstLaunch) {
        const noticeData = [
            "Notice",
            "From BobisBilly",
            "\nCouldn't help but notice\n that you're using very\n   experimental code!",
            "\n\n\n\n   Bugs are fully expected, have fun!",
        ]
        
        createPopup(noticeData)
    }
}

// Hooks \\
gameScene._makeBouncyButton = function(btnElement, scale, onRelease, fullOverride) {
    if (btnElement.frame.name == "GJ_playBtn_001.png") {
        onlineBtnSetup()
    }

    const result = makeBouncyButton.apply(this, arguments);

    return result; 
};

gameScene._startGame = function() {
    if (publicOnlineBtn) {
        publicOnlineBtn.destroy()
    }

    const result = startGame.apply(this);

    return result
}

onlineBtnSetup(true)
