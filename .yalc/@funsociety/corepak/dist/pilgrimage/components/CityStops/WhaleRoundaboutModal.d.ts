import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { WhaleRoundaboutModal as UtahWhaleRoundaboutModal, type Props as UtahWhaleRoundaboutModalProps } from '../../editions/utah/components/CityStops/WhaleRoundaboutModal';
import { WhaleRoundaboutModal as OrangeCountyWhaleRoundaboutModal, type Props as OrangeCountyWhaleRoundaboutModalProps } from '../../editions/orangecounty/components/CityStops/WhaleRoundaboutModal';
export type WhaleRoundaboutModalProps = OrangeCountyWhaleRoundaboutModalProps & {
    edition?: PilgrimageEdition;
};
export { UtahWhaleRoundaboutModal, OrangeCountyWhaleRoundaboutModal, type UtahWhaleRoundaboutModalProps, type OrangeCountyWhaleRoundaboutModalProps, };
export declare const WhaleRoundaboutModal: React.FC<WhaleRoundaboutModalProps>;
