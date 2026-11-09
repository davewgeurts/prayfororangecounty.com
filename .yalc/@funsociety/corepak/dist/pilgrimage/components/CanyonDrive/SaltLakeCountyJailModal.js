import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { SaltLakeCountyJailModal as UtahSaltLakeCountyJailModal, } from '../../editions/utah/components/CanyonDrive/SaltLakeCountyJailModal';
import { SaltLakeCountyJailModal as OrangeCountySaltLakeCountyJailModal, } from '../../editions/orangecounty/components/CanyonDrive/SaltLakeCountyJailModal';
export { UtahSaltLakeCountyJailModal, OrangeCountySaltLakeCountyJailModal, };
export const SaltLakeCountyJailModal = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountySaltLakeCountyJailModal, { ...props });
    }
    return _jsx(UtahSaltLakeCountyJailModal, { ...props });
};
