import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { SwigDriveThruModal as UtahSwigDriveThruModal, type Props as UtahSwigDriveThruModalProps } from '../../editions/utah/components/CityStops/SwigDriveThruModal';
import { SwigDriveThruModal as OrangeCountySwigDriveThruModal, type Props as OrangeCountySwigDriveThruModalProps } from '../../editions/orangecounty/components/CityStops/SwigDriveThruModal';
export type SwigDriveThruModalProps = OrangeCountySwigDriveThruModalProps & {
    edition?: PilgrimageEdition;
};
export { UtahSwigDriveThruModal, OrangeCountySwigDriveThruModal, type UtahSwigDriveThruModalProps, type OrangeCountySwigDriveThruModalProps, };
export declare const SwigDriveThruModal: React.FC<SwigDriveThruModalProps>;
