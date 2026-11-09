import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { SilentRockCard as UtahSilentRockCard, type Props as UtahSilentRockCardProps } from '../../editions/utah/components/CanyonDrive/SilentRockCard';
import { SilentRockCard as OrangeCountySilentRockCard, type Props as OrangeCountySilentRockCardProps } from '../../editions/orangecounty/components/CanyonDrive/SilentRockCard';
export type SilentRockCardProps = OrangeCountySilentRockCardProps & {
    edition?: PilgrimageEdition;
};
export { UtahSilentRockCard, OrangeCountySilentRockCard, type UtahSilentRockCardProps, type OrangeCountySilentRockCardProps, };
export declare const SilentRockCard: React.FC<SilentRockCardProps>;
