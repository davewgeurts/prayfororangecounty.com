import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { MilosportShopScreen as UtahMilosportShopScreen, } from '../../editions/utah/components/Milosport/MilosportShopScreen';
import { MilosportShopScreen as OrangeCountyMilosportShopScreen, } from '../../editions/orangecounty/components/Milosport/MilosportShopScreen';
export { UtahMilosportShopScreen, OrangeCountyMilosportShopScreen, };
export const MilosportShopScreen = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyMilosportShopScreen, { ...props });
    }
    return _jsx(UtahMilosportShopScreen, { ...props });
};
