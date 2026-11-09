import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { SaltLakeCountyJailModal as UtahSaltLakeCountyJailModal, type Props as UtahSaltLakeCountyJailModalProps } from '../../editions/utah/components/CanyonDrive/SaltLakeCountyJailModal';
import { SaltLakeCountyJailModal as OrangeCountySaltLakeCountyJailModal, type Props as OrangeCountySaltLakeCountyJailModalProps } from '../../editions/orangecounty/components/CanyonDrive/SaltLakeCountyJailModal';
export type SaltLakeCountyJailModalProps = OrangeCountySaltLakeCountyJailModalProps & {
    edition?: PilgrimageEdition;
};
export { UtahSaltLakeCountyJailModal, OrangeCountySaltLakeCountyJailModal, type UtahSaltLakeCountyJailModalProps, type OrangeCountySaltLakeCountyJailModalProps, };
export declare const SaltLakeCountyJailModal: React.FC<SaltLakeCountyJailModalProps>;
