// Required Script Setup \\
async function setupRequiredScripts(scriptList) {
    for (let currentScript = 0; currentScript < scriptList.length; currentScript++) {
        await fetch(scriptList[currentScript])
  .then(response => response.text())
  .then(code => eval(code));
    }
}

// Public Variables \\
const gameScene = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.getScenes(false)[1]
const frameX = 680, frameY = 435, frameW = 120, frameH = 123;
const texture = gameScene.textures.get('GJ_WebSheet');
var publicOnlineBtn = null

texture.add('BB_onlineBtn_001', 0, frameX, frameY, frameW, frameH);

// Original Hook Variables \\
const makeBouncyButton = gameScene._makeBouncyButton
const startGame = gameScene._startGame
const create = gameScene.create

// Functions \\
async function NGSongIdToAudio(songID) {
    console.log("Attempting song download:", songID);
    const r = await fetch(`https://gd.bobisbilly.com/ng/${songID}`);
    
    if (!r.ok) throw new Error("Song download failed");

    const songBuffer = await r.arrayBuffer();
    const audioContext = gameScene.sound.context;
    
    // Decoding the audio
    return await audioContext.decodeAudioData(songBuffer);
}

async function setupLevelWithID(levelID) {
    const downloadedData = await fetch("https://gd.bobisbilly.com/gd", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: "Wmfd2893gb7", levelID: levelID })
    });
    
    const levelData = await downloadedData.text();
    const parts = levelData.split(":");
    const levelDataIndex = parts.indexOf("4");
    const songIDIndex = parts.indexOf("35");

    try {
        const songID = parts[songIDIndex + 1];
        const audioBuffer = await NGSongIdToAudio(songID);
        
        gameScene.cache.audio.add('custom_song', audioBuffer);
    } catch (err) {
        console.warn(err);
    }
    gameScene.cache.text.entries.set("level_1", parts[levelDataIndex + 1]);
}

async function openLevelSearchMenu() {
    if (this.isLoading) return;
    this.isLoading = true;

    publicOnlineBtn.setAlpha(0.5);
    gameScene._audio.playEffect("playSound_01");

    try {
        // Currently loads "1st Level" but fails to get audio because its "Base After Base" (Intentional)
        await setupLevelWithID(128);
        
        gameScene.scene.restart({ isCustomLevel: true });
    } catch (e) {
        console.error("Setup failed:", e);
        publicOnlineBtn.setAlpha(1);
        gameScene.scene.restart({ isCustomLevel: true });
        this.isLoading = false;
    } finally {
        this.isLoading = false;
    }
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

gameScene.create = function(data) {
    if(data && data.isCustomLevel) {
        data.isCustomLevel = false
        
        gameScene._audio.pauseMusic()

        setTimeout(() => {
            gameScene.scene.restart({startPlaying: true})
        }, 1000)
    } else if (data && data.startPlaying) {
        if (gameScene.cache.audio.entries.entries.custom_song) {
            gameScene._audio.playEffect("custom_song")
        }
        
        data.startPlaying = false
        
        setTimeout(() => {
            gameScene._startGame()
        }, 100)
    }

    const result = create.apply(this);

    return result
}

setupRequiredScripts([
    "https://raw.githubusercontent.com/BobisBilly/geometrydash.com-mods/refs/heads/main/utils/popupManager.js"
]).then(() => {
    onlineBtnSetup(true)
});
