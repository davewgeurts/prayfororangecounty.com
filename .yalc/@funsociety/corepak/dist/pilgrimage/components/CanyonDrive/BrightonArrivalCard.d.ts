import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { BrightonArrivalCard as UtahBrightonArrivalCard, type Props as UtahBrightonArrivalCardProps } from '../../editions/utah/components/CanyonDrive/BrightonArrivalCard';
import { BrightonArrivalCard as OrangeCountyBrightonArrivalCard, type Props as OrangeCountyBrightonArrivalCardProps } from '../../editions/orangecounty/components/CanyonDrive/BrightonArrivalCard';
export type BrightonArrivalCardProps = OrangeCountyBrightonArrivalCardProps & {
    edition?: PilgrimageEdition;
};
export { UtahBrightonArrivalCard, OrangeCountyBrightonArrivalCard, type UtahBrightonArrivalCardProps, type OrangeCountyBrightonArrivalCardProps, };
export declare const BrightonArrivalCard: React.FC<BrightonArrivalCardProps>;
