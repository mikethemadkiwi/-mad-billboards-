//
let mr_white_Two = 'mr_white_2';
// ^^ note about this guy.
// there MUST be a named scaleform in the stream folder to match this name. 
// if there isnt, COPY-PASTA-RENAME, it's JUST a surface, but the name MUST MATCH
// TEXTURE LOADS ON MAP LOAD.. REFRESH DA CACHE
const Scaleforms = []
Scaleforms[mr_white_Two] = {};
Scaleforms[mr_white_Two].scaleformInteriorId = 205825
Scaleforms[mr_white_Two].scaleformPlacementPos = [1402.5, 1140.4, 112.495, 178.05];
Scaleforms[mr_white_Two].scaleformWidth = 1280;
Scaleforms[mr_white_Two].scaleformHeight = 720;
Scaleforms[mr_white_Two].scaleformResize = 0.1;
// Scaleforms[mr_white_Two].scaleformUrl = 'https://mad.kiwi/purplemonkeydishwasher/media/videos/4115_4576.mp4'
Scaleforms[mr_white_Two].scaleformUrl = 'https://docs.google.com/presentation/d/e/2PACX-1vTprwC2WsfTusGyRiIpbNwq2WZ06fTnU-Uxaoe8dE9VL-qb56e-m1dc8Coafil8jW0dyVNei0GEwptW/pub?start=true&loop=true&delayms=10000'
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
Scaleforms[mr_white_Two].sfHandle = null;
Scaleforms[mr_white_Two].txdHasBeenSet = false;
Scaleforms[mr_white_Two].duiObj = null;
Scaleforms[mr_white_Two].runtimeTextureDict = 'meows';
Scaleforms[mr_white_Two].runtimeTextureName = 'woof';
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
    if (Scaleforms[mr_white_Two].duiObj != null){
        DestroyDui(Scaleforms[mr_white_Two].duiObj);
        console.log('Removed DUI', Scaleforms[mr_white_Two].duiObj)
        Scaleforms[mr_white_Two].duiObj = null;
    }
    if (Scaleforms[mr_white_Two].sfHandle != null){
        SetScaleformMovieAsNoLongerNeeded(Scaleforms[mr_white_Two].sfHandle)
        console.log('Removed sfHandle', Scaleforms[mr_white_Two].sfHandle)
        Scaleforms[mr_white_Two].sfHandle = null;
    }
    Scaleforms[mr_white_Two].txdHasBeenSet = false;
}
//
on('onResourceStop', (resName) => {
    if (resName === GetCurrentResourceName()) {
        ScrapScaleforms()
    }
})
//
setTick(async () => {
    if (GetInteriorFromEntity(PlayerPedId()) == Scaleforms[mr_white_Two].scaleformInteriorId){        
        if (Scaleforms[mr_white_Two].sfHandle == null){
            Scaleforms[mr_white_Two].sfHandle = await loadScaleform(mr_white_Two);
            const txd = CreateRuntimeTxd(Scaleforms[mr_white_Two].runtimeTextureDict);
            Scaleforms[mr_white_Two].duiObj = CreateDui(Scaleforms[mr_white_Two].scaleformUrl, Scaleforms[mr_white_Two].scaleformWidth, Scaleforms[mr_white_Two].scaleformHeight);
            const dui = GetDuiHandle(Scaleforms[mr_white_Two].duiObj);
            const tx = CreateRuntimeTextureFromDuiHandle(txd, Scaleforms[mr_white_Two].runtimeTextureName, dui);
            console.log('ScaleformId:', Scaleforms[mr_white_Two].sfHandle, 'DuiObj', Scaleforms[mr_white_Two].duiObj)
        }
        else{
            if (!Scaleforms[mr_white_Two].txdHasBeenSet) {
                PushScaleformMovieFunction(Scaleforms[mr_white_Two].sfHandle, 'SET_TEXTURE');
                PushScaleformMovieMethodParameterString(Scaleforms[mr_white_Two].runtimeTextureDict); // txd
                PushScaleformMovieMethodParameterString(Scaleforms[mr_white_Two].runtimeTextureName); // txn
                PushScaleformMovieFunctionParameterInt(0); // x
                PushScaleformMovieFunctionParameterInt(0); // y
                PushScaleformMovieFunctionParameterInt(Scaleforms[mr_white_Two].scaleformWidth);
                PushScaleformMovieFunctionParameterInt(Scaleforms[mr_white_Two].scaleformHeight);
                PopScaleformMovieFunctionVoid();
                // console.log('scaleform textures set')
                Scaleforms[mr_white_Two].txdHasBeenSet = true;
            }
            if (HasScaleformMovieLoaded(Scaleforms[mr_white_Two].sfHandle)) {
                DrawScaleformMovie_3dNonAdditive(
                    Scaleforms[mr_white_Two].sfHandle,
                    Scaleforms[mr_white_Two].scaleformPlacementPos[0], Scaleforms[mr_white_Two].scaleformPlacementPos[1], Scaleforms[mr_white_Two].scaleformPlacementPos[2],
                    0, Scaleforms[mr_white_Two].scaleformPlacementPos[3], 0,
                    2, 2, 2,
                    Scaleforms[mr_white_Two].scaleformResize * 1, Scaleforms[mr_white_Two].scaleformResize * (9/16), 1,
                    2,
                );
            }
        }
    }
    if (GetInteriorFromEntity(PlayerPedId()) == 0){
        ScrapScaleforms()
    }
});