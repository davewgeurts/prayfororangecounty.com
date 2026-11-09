import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { SilentRockCard as UtahSilentRockCard, } from '../../editions/utah/components/CanyonDrive/SilentRockCard';
import { SilentRockCard as OrangeCountySilentRockCard, } from '../../editions/orangecounty/components/CanyonDrive/SilentRockCard';
export { UtahSilentRockCard, OrangeCountySilentRockCard, };
export const SilentRockCard = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountySilentRockCard, { ...props });
    }
    return _jsx(UtahSilentRockCard, { ...props });
};
