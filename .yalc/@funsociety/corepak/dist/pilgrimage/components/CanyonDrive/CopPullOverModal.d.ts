import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { CopPullOverModal as UtahCopPullOverModal, type Props as UtahCopPullOverModalProps } from '../../editions/utah/components/CanyonDrive/CopPullOverModal';
import { CopPullOverModal as OrangeCountyCopPullOverModal, type Props as OrangeCountyCopPullOverModalProps } from '../../editions/orangecounty/components/CanyonDrive/CopPullOverModal';
export type CopPullOverModalProps = OrangeCountyCopPullOverModalProps & {
    edition?: PilgrimageEdition;
};
export { UtahCopPullOverModal, OrangeCountyCopPullOverModal, type UtahCopPullOverModalProps, type OrangeCountyCopPullOverModalProps, };
export declare const CopPullOverModal: React.FC<CopPullOverModalProps>;
