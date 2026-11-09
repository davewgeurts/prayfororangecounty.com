import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { X96StudioModal as UtahX96StudioModal, } from '../../editions/utah/components/CityStops/X96StudioModal';
import { X96StudioModal as OrangeCountyX96StudioModal, } from '../../editions/orangecounty/components/CityStops/X96StudioModal';
export { UtahX96StudioModal, OrangeCountyX96StudioModal, };
export const X96StudioModal = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyX96StudioModal, { ...props });
    }
    return _jsx(UtahX96StudioModal, { ...props });
};
