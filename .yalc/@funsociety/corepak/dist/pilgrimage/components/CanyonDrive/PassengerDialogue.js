import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { PassengerDialogue as UtahPassengerDialogue, } from '../../editions/utah/components/CanyonDrive/PassengerDialogue';
import { PassengerDialogue as OrangeCountyPassengerDialogue, } from '../../editions/orangecounty/components/CanyonDrive/PassengerDialogue';
export { UtahPassengerDialogue, OrangeCountyPassengerDialogue, };
export const PassengerDialogue = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyPassengerDialogue, { ...props });
    }
    return _jsx(UtahPassengerDialogue, { ...props });
};
