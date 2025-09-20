//
let vu_example_one = 'vu_example_1';
// ^^ note about this guy.
// there MUST be a named scaleform in the stream folder to match this name. 
// if there isnt, COPY-PASTA-RENAME, it's JUST a surface, but the name MUST MATCH
// TEXTURE LOADS ON MAP LOAD.. REFRESH DA CACHE
const Scaleforms = []
Scaleforms[vu_example_one] = {};
Scaleforms[vu_example_one].scaleformInteriorId = 197121
Scaleforms[vu_example_one].scaleformPlacementPos = [114.9, -1286.0, 30.3, 292.21];
Scaleforms[vu_example_one].scaleformWidth = 1280;
Scaleforms[vu_example_one].scaleformHeight = 720;
Scaleforms[vu_example_one].scaleformResize = 0.1;
Scaleforms[vu_example_one].scaleformUrl = 'https://player.twitch.tv/?channel=asot&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&quality=chunked&volume=0.09'
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
Scaleforms[vu_example_one].sfHandle = null;
Scaleforms[vu_example_one].txdHasBeenSet = false;
Scaleforms[vu_example_one].duiObj = null;
Scaleforms[vu_example_one].runtimeTextureDict = 'meows';
Scaleforms[vu_example_one].runtimeTextureName = 'woof';
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
    if (Scaleforms[vu_example_one].duiObj != null){
        DestroyDui(Scaleforms[vu_example_one].duiObj);
        console.log('Removed DUI', Scaleforms[vu_example_one].duiObj)
        Scaleforms[vu_example_one].duiObj = null;
    }
    if (Scaleforms[vu_example_one].sfHandle != null){
        SetScaleformMovieAsNoLongerNeeded(Scaleforms[vu_example_one].sfHandle)
        console.log('Removed sfHandle', Scaleforms[vu_example_one].sfHandle)
        Scaleforms[vu_example_one].sfHandle = null;
    }
    Scaleforms[vu_example_one].txdHasBeenSet = false;
}
//
on('onResourceStop', (resName) => {
    if (resName === GetCurrentResourceName()) {
        ScrapScaleforms()
    }
})
//
setTick(async () => {
    if (GetInteriorFromEntity(PlayerPedId()) == Scaleforms[vu_example_one].scaleformInteriorId){        
        if (Scaleforms[vu_example_one].sfHandle == null){
            Scaleforms[vu_example_one].sfHandle = await loadScaleform(vu_example_one);
            const txd = CreateRuntimeTxd(Scaleforms[vu_example_one].runtimeTextureDict);
            Scaleforms[vu_example_one].duiObj = CreateDui(Scaleforms[vu_example_one].scaleformUrl, Scaleforms[vu_example_one].scaleformWidth, Scaleforms[vu_example_one].scaleformHeight);
            const dui = GetDuiHandle(Scaleforms[vu_example_one].duiObj);
            const tx = CreateRuntimeTextureFromDuiHandle(txd, Scaleforms[vu_example_one].runtimeTextureName, dui);
            console.log('ScaleformId:', Scaleforms[vu_example_one].sfHandle, 'DuiObj', Scaleforms[vu_example_one].duiObj)
        }
        else{
            if (!Scaleforms[vu_example_one].txdHasBeenSet) {
                PushScaleformMovieFunction(Scaleforms[vu_example_one].sfHandle, 'SET_TEXTURE');
                PushScaleformMovieMethodParameterString(Scaleforms[vu_example_one].runtimeTextureDict); // txd
                PushScaleformMovieMethodParameterString(Scaleforms[vu_example_one].runtimeTextureName); // txn
                PushScaleformMovieFunctionParameterInt(0); // x
                PushScaleformMovieFunctionParameterInt(0); // y
                PushScaleformMovieFunctionParameterInt(Scaleforms[vu_example_one].scaleformWidth);
                PushScaleformMovieFunctionParameterInt(Scaleforms[vu_example_one].scaleformHeight);
                PopScaleformMovieFunctionVoid();
                // console.log('scaleform textures set')
                Scaleforms[vu_example_one].txdHasBeenSet = true;
            }
            if (HasScaleformMovieLoaded(Scaleforms[vu_example_one].sfHandle)) {
                DrawScaleformMovie_3dNonAdditive(
                    Scaleforms[vu_example_one].sfHandle,
                    Scaleforms[vu_example_one].scaleformPlacementPos[0], Scaleforms[vu_example_one].scaleformPlacementPos[1], Scaleforms[vu_example_one].scaleformPlacementPos[2],
                    0, Scaleforms[vu_example_one].scaleformPlacementPos[3], 0,
                    2, 2, 2,
                    Scaleforms[vu_example_one].scaleformResize * 1, Scaleforms[vu_example_one].scaleformResize * (9/16), 1,
                    2,
                );
            }
        }
    }
    if (GetInteriorFromEntity(PlayerPedId()) == 0){
        ScrapScaleforms()
    }
});