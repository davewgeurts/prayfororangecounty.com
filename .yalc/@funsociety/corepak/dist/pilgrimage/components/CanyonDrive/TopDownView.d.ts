import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { TopDownView as UtahTopDownView, type Props as UtahTopDownViewProps } from '../../editions/utah/components/CanyonDrive/TopDownView';
import { TopDownView as OrangeCountyTopDownView, type Props as OrangeCountyTopDownViewProps } from '../../editions/orangecounty/components/CanyonDrive/TopDownView';
export type TopDownViewProps = OrangeCountyTopDownViewProps & {
    edition?: PilgrimageEdition;
};
export { UtahTopDownView, OrangeCountyTopDownView, type UtahTopDownViewProps, type OrangeCountyTopDownViewProps, };
export declare const TopDownView: React.FC<TopDownViewProps>;
