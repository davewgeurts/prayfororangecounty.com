import { getPilgrimageEdition } from '../edition';
import { CanyonAudioEngine as UtahCanyonAudioEngine, } from '../editions/utah/utils/audioEngine';
import { CanyonAudioEngine as OrangeCountyCanyonAudioEngine, } from '../editions/orangecounty/utils/audioEngine';
export { UtahCanyonAudioEngine, OrangeCountyCanyonAudioEngine, };
export class CanyonAudioEngine {
    static get() {
        return (getPilgrimageEdition() === 'orangecounty'
            ? OrangeCountyCanyonAudioEngine.get()
            : UtahCanyonAudioEngine.get());
    }
    static getInstance() {
        return CanyonAudioEngine.get();
    }
}
