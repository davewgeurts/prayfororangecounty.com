import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { SwigDriveThruModal as UtahSwigDriveThruModal, } from '../../editions/utah/components/CityStops/SwigDriveThruModal';
import { SwigDriveThruModal as OrangeCountySwigDriveThruModal, } from '../../editions/orangecounty/components/CityStops/SwigDriveThruModal';
export { UtahSwigDriveThruModal, OrangeCountySwigDriveThruModal, };
export const SwigDriveThruModal = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountySwigDriveThruModal, { ...props });
    }
    return _jsx(UtahSwigDriveThruModal, { ...props });
};
