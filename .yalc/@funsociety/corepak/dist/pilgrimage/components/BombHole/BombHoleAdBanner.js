import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { BombHoleAdBanner as UtahBombHoleAdBanner } from '../../editions/utah/components/BombHole/BombHoleAdBanner';
import { BombHoleAdBanner as OrangeCountyBombHoleAdBanner } from '../../editions/orangecounty/components/BombHole/BombHoleAdBanner';
export { UtahBombHoleAdBanner, OrangeCountyBombHoleAdBanner };
export const BombHoleAdBanner = ({ edition }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyBombHoleAdBanner, {});
    }
    return _jsx(UtahBombHoleAdBanner, {});
};
