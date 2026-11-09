import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { SevenElevenGasModal as UtahSevenElevenGasModal, } from '../../editions/utah/components/CityStops/SevenElevenGasModal';
import { SevenElevenGasModal as OrangeCountySevenElevenGasModal, } from '../../editions/orangecounty/components/CityStops/SevenElevenGasModal';
export { UtahSevenElevenGasModal, OrangeCountySevenElevenGasModal, };
export const SevenElevenGasModal = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountySevenElevenGasModal, { ...props });
    }
    return _jsx(UtahSevenElevenGasModal, { ...props });
};
