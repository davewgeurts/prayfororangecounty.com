import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { ChairliftRideView as UtahChairliftRideView, type Props as UtahChairliftRideViewProps } from '../../editions/utah/components/SkiFree/ChairliftRideView';
import { ChairliftRideView as OrangeCountyChairliftRideView, type Props as OrangeCountyChairliftRideViewProps } from '../../editions/orangecounty/components/SkiFree/ChairliftRideView';
export type ChairliftRideViewProps = OrangeCountyChairliftRideViewProps & {
    edition?: PilgrimageEdition;
};
export { UtahChairliftRideView, OrangeCountyChairliftRideView, type UtahChairliftRideViewProps, type OrangeCountyChairliftRideViewProps, };
export declare const ChairliftRideView: React.FC<ChairliftRideViewProps>;
