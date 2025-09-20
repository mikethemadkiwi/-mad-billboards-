//
let mr_white_default = 'mr_white_default';
// ^^ note about this guy.
// there MUST be a named scaleform in the stream folder to match this name. 
// if there isnt, COPY-PASTA-RENAME, it's JUST a surface, but the name MUST MATCH
// TEXTURE LOADS ON MAP LOAD.. REFRESH DA CACHE
const Scaleforms = []
Scaleforms[mr_white_default] = {};
Scaleforms[mr_white_default].scaleformInteriorId = 205825
Scaleforms[mr_white_default].scaleformPlacementPos = [1402.18, 1161.867, 119.495, 271.67];
Scaleforms[mr_white_default].scaleformWidth = 1280;
Scaleforms[mr_white_default].scaleformHeight = 720;
Scaleforms[mr_white_default].scaleformResize = 0.1;
Scaleforms[mr_white_default].scaleformUrl = 'https://mad.kiwi/purplemonkeydishwasher/media/sounds/fivem/MONO_FERNANDO_SHOW_1.wav'
// Scaleforms[mr_white_default].scaleformUrl = 'https://docs.google.com/presentation/d/e/2PACX-1vTprwC2WsfTusGyRiIpbNwq2WZ06fTnU-Uxaoe8dE9VL-qb56e-m1dc8Coafil8jW0dyVNei0GEwptW/pub?start=true&loop=true&delayms=10000'
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
Scaleforms[mr_white_default].sfHandle = null;
Scaleforms[mr_white_default].txdHasBeenSet = false;
Scaleforms[mr_white_default].duiObj = null;
Scaleforms[mr_white_default].runtimeTextureDict = 'meows';
Scaleforms[mr_white_default].runtimeTextureName = 'woof';
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
    if (Scaleforms[mr_white_default].duiObj != null){
        DestroyDui(Scaleforms[mr_white_default].duiObj);
        console.log('Removed DUI', Scaleforms[mr_white_default].duiObj)
        Scaleforms[mr_white_default].duiObj = null;
    }
    if (Scaleforms[mr_white_default].sfHandle != null){
        SetScaleformMovieAsNoLongerNeeded(Scaleforms[mr_white_default].sfHandle)
        console.log('Removed sfHandle', Scaleforms[mr_white_default].sfHandle)
        Scaleforms[mr_white_default].sfHandle = null;
    }
    Scaleforms[mr_white_default].txdHasBeenSet = false;
}
//
on('onResourceStop', (resName) => {
    if (resName === GetCurrentResourceName()) {
        ScrapScaleforms()
    }
})
//
setTick(async () => {
    if (GetInteriorFromEntity(PlayerPedId()) == Scaleforms[mr_white_default].scaleformInteriorId){        
        if (Scaleforms[mr_white_default].sfHandle == null){
            Scaleforms[mr_white_default].sfHandle = await loadScaleform(mr_white_default);
            const txd = CreateRuntimeTxd(Scaleforms[mr_white_default].runtimeTextureDict);
            Scaleforms[mr_white_default].duiObj = CreateDui(Scaleforms[mr_white_default].scaleformUrl, Scaleforms[mr_white_default].scaleformWidth, Scaleforms[mr_white_default].scaleformHeight);
            const dui = GetDuiHandle(Scaleforms[mr_white_default].duiObj);
            const tx = CreateRuntimeTextureFromDuiHandle(txd, Scaleforms[mr_white_default].runtimeTextureName, dui);
            console.log('ScaleformId:', Scaleforms[mr_white_default].sfHandle, 'DuiObj', Scaleforms[mr_white_default].duiObj)
        }
        else{
            if (!Scaleforms[mr_white_default].txdHasBeenSet) {
                PushScaleformMovieFunction(Scaleforms[mr_white_default].sfHandle, 'SET_TEXTURE');
                PushScaleformMovieMethodParameterString(Scaleforms[mr_white_default].runtimeTextureDict); // txd
                PushScaleformMovieMethodParameterString(Scaleforms[mr_white_default].runtimeTextureName); // txn
                PushScaleformMovieFunctionParameterInt(0); // x
                PushScaleformMovieFunctionParameterInt(0); // y
                PushScaleformMovieFunctionParameterInt(Scaleforms[mr_white_default].scaleformWidth);
                PushScaleformMovieFunctionParameterInt(Scaleforms[mr_white_default].scaleformHeight);
                PopScaleformMovieFunctionVoid();
                // console.log('scaleform textures set')
                Scaleforms[mr_white_default].txdHasBeenSet = true;
            }
            if (HasScaleformMovieLoaded(Scaleforms[mr_white_default].sfHandle)) {
                DrawScaleformMovie_3dNonAdditive(
                    Scaleforms[mr_white_default].sfHandle,
                    Scaleforms[mr_white_default].scaleformPlacementPos[0], Scaleforms[mr_white_default].scaleformPlacementPos[1], Scaleforms[mr_white_default].scaleformPlacementPos[2],
                    0, Scaleforms[mr_white_default].scaleformPlacementPos[3], 0,
                    2, 2, 2,
                    Scaleforms[mr_white_default].scaleformResize * 1, Scaleforms[mr_white_default].scaleformResize * (9/16), 1,
                    2,
                );
            }
        }
    }
    if (GetInteriorFromEntity(PlayerPedId()) == 0){
        ScrapScaleforms()
    }
});