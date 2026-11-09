import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { X96StudioModal as UtahX96StudioModal, type Props as UtahX96StudioModalProps } from '../../editions/utah/components/CityStops/X96StudioModal';
import { X96StudioModal as OrangeCountyX96StudioModal, type Props as OrangeCountyX96StudioModalProps } from '../../editions/orangecounty/components/CityStops/X96StudioModal';
export type X96StudioModalProps = OrangeCountyX96StudioModalProps & {
    edition?: PilgrimageEdition;
};
export { UtahX96StudioModal, OrangeCountyX96StudioModal, type UtahX96StudioModalProps, type OrangeCountyX96StudioModalProps, };
export declare const X96StudioModal: React.FC<X96StudioModalProps>;
