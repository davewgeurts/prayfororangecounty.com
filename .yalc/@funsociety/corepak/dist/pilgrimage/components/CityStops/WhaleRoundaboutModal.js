import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { WhaleRoundaboutModal as UtahWhaleRoundaboutModal, } from '../../editions/utah/components/CityStops/WhaleRoundaboutModal';
import { WhaleRoundaboutModal as OrangeCountyWhaleRoundaboutModal, } from '../../editions/orangecounty/components/CityStops/WhaleRoundaboutModal';
export { UtahWhaleRoundaboutModal, OrangeCountyWhaleRoundaboutModal, };
export const WhaleRoundaboutModal = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyWhaleRoundaboutModal, { ...props });
    }
    return _jsx(UtahWhaleRoundaboutModal, { ...props });
};
