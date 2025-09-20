//
let vu_example_two = 'vu_example_2';
// ^^ note about this guy.
// there MUST be a named scaleform in the stream folder to match this name. 
// if there isnt, COPY-PASTA-RENAME, it's JUST a surface, but the name MUST MATCH
// TEXTURE LOADS ON MAP LOAD.. REFRESH DA CACHE
const Scaleforms = []
Scaleforms[vu_example_two] = {};
Scaleforms[vu_example_two].scaleformInteriorId = 198145
Scaleforms[vu_example_two].scaleformPlacementPos = [76.2, -1390.8, 31.3, 80.21];
Scaleforms[vu_example_two].scaleformWidth = 1280;
Scaleforms[vu_example_two].scaleformHeight = 720;
Scaleforms[vu_example_two].scaleformResize = 0.1;
Scaleforms[vu_example_two].scaleformUrl = 'https://docs.google.com/presentation/d/e/2PACX-1vTprwC2WsfTusGyRiIpbNwq2WZ06fTnU-Uxaoe8dE9VL-qb56e-m1dc8Coafil8jW0dyVNei0GEwptW/pub?start=true&loop=true&delayms=10000'
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
Scaleforms[vu_example_two].sfHandle = null;
Scaleforms[vu_example_two].txdHasBeenSet = false;
Scaleforms[vu_example_two].duiObj = null;
Scaleforms[vu_example_two].runtimeTextureDict = 'meows';
Scaleforms[vu_example_two].runtimeTextureName = 'woof';
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
    if (Scaleforms[vu_example_two].duiObj != null){
        DestroyDui(Scaleforms[vu_example_two].duiObj);
        console.log('Removed DUI', Scaleforms[vu_example_two].duiObj)
        Scaleforms[vu_example_two].duiObj = null;
    }
    if (Scaleforms[vu_example_two].sfHandle != null){
        SetScaleformMovieAsNoLongerNeeded(Scaleforms[vu_example_two].sfHandle)
        console.log('Removed sfHandle', Scaleforms[vu_example_two].sfHandle)
        Scaleforms[vu_example_two].sfHandle = null;
    }
    Scaleforms[vu_example_two].txdHasBeenSet = false;
}
//
on('onResourceStop', (resName) => {
    if (resName === GetCurrentResourceName()) {
        ScrapScaleforms()
    }
})
//
setTick(async () => {
    if (GetInteriorFromEntity(PlayerPedId()) == Scaleforms[vu_example_two].scaleformInteriorId){        
        if (Scaleforms[vu_example_two].sfHandle == null){
            Scaleforms[vu_example_two].sfHandle = await loadScaleform(vu_example_two);
            const txd = CreateRuntimeTxd(Scaleforms[vu_example_two].runtimeTextureDict);
            Scaleforms[vu_example_two].duiObj = CreateDui(Scaleforms[vu_example_two].scaleformUrl, Scaleforms[vu_example_two].scaleformWidth, Scaleforms[vu_example_two].scaleformHeight);
            const dui = GetDuiHandle(Scaleforms[vu_example_two].duiObj);
            const tx = CreateRuntimeTextureFromDuiHandle(txd, Scaleforms[vu_example_two].runtimeTextureName, dui);
            console.log('ScaleformId:', Scaleforms[vu_example_two].sfHandle, 'DuiObj', Scaleforms[vu_example_two].duiObj)
        }
        else{
            if (!Scaleforms[vu_example_two].txdHasBeenSet) {
                PushScaleformMovieFunction(Scaleforms[vu_example_two].sfHandle, 'SET_TEXTURE');
                PushScaleformMovieMethodParameterString(Scaleforms[vu_example_two].runtimeTextureDict); // txd
                PushScaleformMovieMethodParameterString(Scaleforms[vu_example_two].runtimeTextureName); // txn
                PushScaleformMovieFunctionParameterInt(0); // x
                PushScaleformMovieFunctionParameterInt(0); // y
                PushScaleformMovieFunctionParameterInt(Scaleforms[vu_example_two].scaleformWidth);
                PushScaleformMovieFunctionParameterInt(Scaleforms[vu_example_two].scaleformHeight);
                PopScaleformMovieFunctionVoid();
                // console.log('scaleform textures set')
                Scaleforms[vu_example_two].txdHasBeenSet = true;
            }
            if (HasScaleformMovieLoaded(Scaleforms[vu_example_two].sfHandle)) {
                DrawScaleformMovie_3dNonAdditive(
                    Scaleforms[vu_example_two].sfHandle,
                    Scaleforms[vu_example_two].scaleformPlacementPos[0], Scaleforms[vu_example_two].scaleformPlacementPos[1], Scaleforms[vu_example_two].scaleformPlacementPos[2],
                    0, Scaleforms[vu_example_two].scaleformPlacementPos[3], 0,
                    2, 2, 2,
                    Scaleforms[vu_example_two].scaleformResize * 1, Scaleforms[vu_example_two].scaleformResize * (9/16), 1,
                    2,
                );
            }
        }
    }
    if (GetInteriorFromEntity(PlayerPedId()) == 0){
        ScrapScaleforms()
    }
});