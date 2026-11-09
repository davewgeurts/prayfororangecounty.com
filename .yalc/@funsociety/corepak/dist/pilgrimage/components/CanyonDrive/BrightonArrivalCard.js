import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { BrightonArrivalCard as UtahBrightonArrivalCard, } from '../../editions/utah/components/CanyonDrive/BrightonArrivalCard';
import { BrightonArrivalCard as OrangeCountyBrightonArrivalCard, } from '../../editions/orangecounty/components/CanyonDrive/BrightonArrivalCard';
export { UtahBrightonArrivalCard, OrangeCountyBrightonArrivalCard, };
export const BrightonArrivalCard = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyBrightonArrivalCard, { ...props });
    }
    return _jsx(UtahBrightonArrivalCard, { ...props });
};
