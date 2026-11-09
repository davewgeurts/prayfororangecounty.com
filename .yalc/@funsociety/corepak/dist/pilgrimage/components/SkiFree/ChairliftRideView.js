import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { ChairliftRideView as UtahChairliftRideView, } from '../../editions/utah/components/SkiFree/ChairliftRideView';
import { ChairliftRideView as OrangeCountyChairliftRideView, } from '../../editions/orangecounty/components/SkiFree/ChairliftRideView';
export { UtahChairliftRideView, OrangeCountyChairliftRideView, };
export const ChairliftRideView = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyChairliftRideView, { ...props });
    }
    return _jsx(UtahChairliftRideView, { ...props });
};
