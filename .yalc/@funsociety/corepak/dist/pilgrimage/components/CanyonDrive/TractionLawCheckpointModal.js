import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { TractionLawCheckpointModal as UtahTractionLawCheckpointModal, } from '../../editions/utah/components/CanyonDrive/TractionLawCheckpointModal';
import { TractionLawCheckpointModal as OrangeCountyTractionLawCheckpointModal, } from '../../editions/orangecounty/components/CanyonDrive/TractionLawCheckpointModal';
export { UtahTractionLawCheckpointModal, OrangeCountyTractionLawCheckpointModal, };
export const TractionLawCheckpointModal = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyTractionLawCheckpointModal, { ...props });
    }
    return _jsx(UtahTractionLawCheckpointModal, { ...props });
};
