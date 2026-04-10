# This is a list of mods I have made for https://geometrydash.com

If you want to use these mods for some reason heres a small guide:

1. Open the developer console
2. Run and replace <ModName> with the mod folders name you want to run. e.g. userLevelSearch
```js
const gameWindow = document.getElementsByClassName("w-full h-full border-0 relative z-50")[0].contentWindow

gameWindow.fetch('https://raw.githubusercontent.com/BobisBilly/geometrydash.com-mods/refs/heads/main/<ModName>/main.js')
  .then(response => response.text())
  .then(code => gameWindow.eval(code));
```

> [!NOTE]
> If you find any bugs please share them.

> [!WARNING]
> If the level doesn't load, blame my Raspberry Pi for doing something wrong
