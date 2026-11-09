import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { BombHoleAdBanner as UtahBombHoleAdBanner } from '../../editions/utah/components/BombHole/BombHoleAdBanner';
import { BombHoleAdBanner as OrangeCountyBombHoleAdBanner } from '../../editions/orangecounty/components/BombHole/BombHoleAdBanner';
export interface BombHoleAdBannerProps {
    edition?: PilgrimageEdition;
}
export { UtahBombHoleAdBanner, OrangeCountyBombHoleAdBanner };
export declare const BombHoleAdBanner: React.FC<BombHoleAdBannerProps>;
