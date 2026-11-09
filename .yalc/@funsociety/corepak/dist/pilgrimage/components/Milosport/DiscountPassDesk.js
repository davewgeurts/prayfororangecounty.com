import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { DiscountPassDesk as UtahDiscountPassDesk, } from '../../editions/utah/components/Milosport/DiscountPassDesk';
import { DiscountPassDesk as OrangeCountyDiscountPassDesk, } from '../../editions/orangecounty/components/Milosport/DiscountPassDesk';
export { UtahDiscountPassDesk, OrangeCountyDiscountPassDesk, };
export const DiscountPassDesk = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyDiscountPassDesk, { ...props });
    }
    return _jsx(UtahDiscountPassDesk, { ...props });
};
