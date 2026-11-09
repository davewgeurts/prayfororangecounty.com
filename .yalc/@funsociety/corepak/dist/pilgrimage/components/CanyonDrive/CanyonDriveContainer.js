import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { CanyonDriveContainer as UtahCanyonDriveContainer } from '../../editions/utah/components/CanyonDrive/CanyonDriveContainer';
import { CanyonDriveContainer as OrangeCountyCanyonDriveContainer } from '../../editions/orangecounty/components/CanyonDrive/CanyonDriveContainer';
export { UtahCanyonDriveContainer, OrangeCountyCanyonDriveContainer };
export const CanyonDriveContainer = ({ edition }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyCanyonDriveContainer, {});
    }
    return _jsx(UtahCanyonDriveContainer, {});
};
