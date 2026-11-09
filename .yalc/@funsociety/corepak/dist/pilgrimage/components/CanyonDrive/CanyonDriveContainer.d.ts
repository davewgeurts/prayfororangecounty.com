import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { CanyonDriveContainer as UtahCanyonDriveContainer } from '../../editions/utah/components/CanyonDrive/CanyonDriveContainer';
import { CanyonDriveContainer as OrangeCountyCanyonDriveContainer } from '../../editions/orangecounty/components/CanyonDrive/CanyonDriveContainer';
export interface CanyonDriveContainerProps {
    edition?: PilgrimageEdition;
}
export { UtahCanyonDriveContainer, OrangeCountyCanyonDriveContainer };
export declare const CanyonDriveContainer: React.FC<CanyonDriveContainerProps>;
