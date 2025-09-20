//
let morgue_default = 'morgue_default';
// ^^ note about this guy.
// there MUST be a named scaleform in the stream folder to match this name. 
// if there isnt, COPY-PASTA-RENAME, it's JUST a surface, but the name MUST MATCH
// TEXTURE LOADS ON MAP LOAD.. REFRESH DA CACHE
const Scaleforms = []
Scaleforms[morgue_default] = {};
Scaleforms[morgue_default].scaleformInteriorId = 60418;
Scaleforms[morgue_default].scaleformPlacementPos = [237, -1360, 32.0, 310.0];
Scaleforms[morgue_default].scaleformWidth = 1280;
Scaleforms[morgue_default].scaleformHeight = 720;
Scaleforms[morgue_default].scaleformResize = 0.1;
// Scaleforms[morgue_default].scaleformUrl = 'https://mad.kiwi/madhaus/banner.php';
Scaleforms[morgue_default].scaleformUrl = 'https://docs.google.com/presentation/d/e/2PACX-1vTprwC2WsfTusGyRiIpbNwq2WZ06fTnU-Uxaoe8dE9VL-qb56e-m1dc8Coafil8jW0dyVNei0GEwptW/pub?start=true&loop=true&delayms=10000'
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
Scaleforms[morgue_default].sfHandle = null;
Scaleforms[morgue_default].txdHasBeenSet = false;
Scaleforms[morgue_default].duiObj = null;
Scaleforms[morgue_default].runtimeTextureDict = 'meows';
Scaleforms[morgue_default].runtimeTextureName = 'woof';
//
async function loadScaleform(scaleform) {
  let scaleformHandle = RequestScaleformMovie(scaleform);
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (HasScaleformMovieLoaded(scaleformHandle)) {
        clearInterval(interval);
        resolve(scaleformHandle);
      } else {
        scaleformHandle = RequestScaleformMovie(scaleform);
      }
    }, 0);
  });
}
//
function ScrapScaleforms(){
    if (Scaleforms[morgue_default].duiObj != null){
        DestroyDui(Scaleforms[morgue_default].duiObj);
        console.log('Removed DUI', Scaleforms[morgue_default].duiObj)
        Scaleforms[morgue_default].duiObj = null;
    }
    if (Scaleforms[morgue_default].sfHandle != null){
        SetScaleformMovieAsNoLongerNeeded(Scaleforms[morgue_default].sfHandle)
        console.log('Removed sfHandle', Scaleforms[morgue_default].sfHandle)
        Scaleforms[morgue_default].sfHandle = null;
    }
    Scaleforms[morgue_default].txdHasBeenSet = false;
}
//
on('onResourceStop', (resName) => {
    if (resName === GetCurrentResourceName()) {
        ScrapScaleforms()
    }
})
//
setTick(async () => {
    if (GetInteriorFromEntity(PlayerPedId()) == Scaleforms[morgue_default].scaleformInteriorId){        
        if (Scaleforms[morgue_default].sfHandle == null){
            Scaleforms[morgue_default].sfHandle = await loadScaleform(morgue_default);
            const txd = CreateRuntimeTxd(Scaleforms[morgue_default].runtimeTextureDict);
            Scaleforms[morgue_default].duiObj = CreateDui(Scaleforms[morgue_default].scaleformUrl, Scaleforms[morgue_default].scaleformWidth, Scaleforms[morgue_default].scaleformHeight);
            const dui = GetDuiHandle(Scaleforms[morgue_default].duiObj);
            const tx = CreateRuntimeTextureFromDuiHandle(txd, Scaleforms[morgue_default].runtimeTextureName, dui);
            console.log('ScaleformId:', Scaleforms[morgue_default].sfHandle, 'DuiObj', Scaleforms[morgue_default].duiObj)
        }
        else{
            if (!Scaleforms[morgue_default].txdHasBeenSet) {
                PushScaleformMovieFunction(Scaleforms[morgue_default].sfHandle, 'SET_TEXTURE');
                PushScaleformMovieMethodParameterString(Scaleforms[morgue_default].runtimeTextureDict); // txd
                PushScaleformMovieMethodParameterString(Scaleforms[morgue_default].runtimeTextureName); // txn
                PushScaleformMovieFunctionParameterInt(0); // x
                PushScaleformMovieFunctionParameterInt(0); // y
                PushScaleformMovieFunctionParameterInt(Scaleforms[morgue_default].scaleformWidth);
                PushScaleformMovieFunctionParameterInt(Scaleforms[morgue_default].scaleformHeight);
                PopScaleformMovieFunctionVoid();
                // console.log('scaleform textures set')
                Scaleforms[morgue_default].txdHasBeenSet = true;
            }
            if (HasScaleformMovieLoaded(Scaleforms[morgue_default].sfHandle)) {
                DrawScaleformMovie_3dNonAdditive(
                    Scaleforms[morgue_default].sfHandle,
                    Scaleforms[morgue_default].scaleformPlacementPos[0], Scaleforms[morgue_default].scaleformPlacementPos[1], Scaleforms[morgue_default].scaleformPlacementPos[2],
                    0, Scaleforms[morgue_default].scaleformPlacementPos[3], 0,
                    2, 2, 2,
                    Scaleforms[morgue_default].scaleformResize * 1, Scaleforms[morgue_default].scaleformResize * (9/16), 1,
                    2,
                );
            }
        }
    }
    if (GetInteriorFromEntity(PlayerPedId()) == 0){
        ScrapScaleforms()
    }
});