import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { TopDownView as UtahTopDownView, } from '../../editions/utah/components/CanyonDrive/TopDownView';
import { TopDownView as OrangeCountyTopDownView, } from '../../editions/orangecounty/components/CanyonDrive/TopDownView';
export { UtahTopDownView, OrangeCountyTopDownView, };
export const TopDownView = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyTopDownView, { ...props });
    }
    return _jsx(UtahTopDownView, { ...props });
};
