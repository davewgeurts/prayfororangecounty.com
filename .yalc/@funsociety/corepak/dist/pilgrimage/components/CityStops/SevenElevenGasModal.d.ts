import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { SevenElevenGasModal as UtahSevenElevenGasModal, type Props as UtahSevenElevenGasModalProps } from '../../editions/utah/components/CityStops/SevenElevenGasModal';
import { SevenElevenGasModal as OrangeCountySevenElevenGasModal, type Props as OrangeCountySevenElevenGasModalProps } from '../../editions/orangecounty/components/CityStops/SevenElevenGasModal';
export type SevenElevenGasModalProps = OrangeCountySevenElevenGasModalProps & {
    edition?: PilgrimageEdition;
};
export { UtahSevenElevenGasModal, OrangeCountySevenElevenGasModal, type UtahSevenElevenGasModalProps, type OrangeCountySevenElevenGasModalProps, };
export declare const SevenElevenGasModal: React.FC<SevenElevenGasModalProps>;
