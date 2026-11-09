import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { CockpitView as UtahCockpitView, type Props as UtahCockpitViewProps } from '../../editions/utah/components/CanyonDrive/CockpitView';
import { CockpitView as OrangeCountyCockpitView, type Props as OrangeCountyCockpitViewProps } from '../../editions/orangecounty/components/CanyonDrive/CockpitView';
export type CockpitViewProps = OrangeCountyCockpitViewProps & {
    edition?: PilgrimageEdition;
};
export { UtahCockpitView, OrangeCountyCockpitView, type UtahCockpitViewProps, type OrangeCountyCockpitViewProps, };
export declare const CockpitView: React.FC<CockpitViewProps>;
