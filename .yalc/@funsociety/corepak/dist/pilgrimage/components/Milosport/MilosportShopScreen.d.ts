import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { MilosportShopScreen as UtahMilosportShopScreen, type Props as UtahMilosportShopScreenProps } from '../../editions/utah/components/Milosport/MilosportShopScreen';
import { MilosportShopScreen as OrangeCountyMilosportShopScreen, type Props as OrangeCountyMilosportShopScreenProps } from '../../editions/orangecounty/components/Milosport/MilosportShopScreen';
export type MilosportShopScreenProps = OrangeCountyMilosportShopScreenProps & {
    edition?: PilgrimageEdition;
};
export { UtahMilosportShopScreen, OrangeCountyMilosportShopScreen, type UtahMilosportShopScreenProps, type OrangeCountyMilosportShopScreenProps, };
export declare const MilosportShopScreen: React.FC<MilosportShopScreenProps>;
