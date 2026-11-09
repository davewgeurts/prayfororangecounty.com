import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { CockpitView as UtahCockpitView, } from '../../editions/utah/components/CanyonDrive/CockpitView';
import { CockpitView as OrangeCountyCockpitView, } from '../../editions/orangecounty/components/CanyonDrive/CockpitView';
export { UtahCockpitView, OrangeCountyCockpitView, };
export const CockpitView = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyCockpitView, { ...props });
    }
    return _jsx(UtahCockpitView, { ...props });
};
