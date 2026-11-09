import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { TractionLawCheckpointModal as UtahTractionLawCheckpointModal, type Props as UtahTractionLawCheckpointModalProps } from '../../editions/utah/components/CanyonDrive/TractionLawCheckpointModal';
import { TractionLawCheckpointModal as OrangeCountyTractionLawCheckpointModal, type Props as OrangeCountyTractionLawCheckpointModalProps } from '../../editions/orangecounty/components/CanyonDrive/TractionLawCheckpointModal';
export type TractionLawCheckpointModalProps = OrangeCountyTractionLawCheckpointModalProps & {
    edition?: PilgrimageEdition;
};
export { UtahTractionLawCheckpointModal, OrangeCountyTractionLawCheckpointModal, type UtahTractionLawCheckpointModalProps, type OrangeCountyTractionLawCheckpointModalProps, };
export declare const TractionLawCheckpointModal: React.FC<TractionLawCheckpointModalProps>;
