import { CanyonAudioEngine as UtahCanyonAudioEngine, type RadioStation, type RadioSource, type RadioStatus } from '../editions/utah/utils/audioEngine';
import { CanyonAudioEngine as OrangeCountyCanyonAudioEngine } from '../editions/orangecounty/utils/audioEngine';
export { UtahCanyonAudioEngine, OrangeCountyCanyonAudioEngine, type RadioStation, type RadioSource, type RadioStatus, };
export declare class CanyonAudioEngine {
    static get(): UtahCanyonAudioEngine;
    static getInstance(): UtahCanyonAudioEngine;
}
