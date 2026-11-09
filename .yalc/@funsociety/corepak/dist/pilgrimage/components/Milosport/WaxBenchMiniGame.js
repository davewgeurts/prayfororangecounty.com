import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { WaxBenchMiniGame as UtahWaxBenchMiniGame, } from '../../editions/utah/components/Milosport/WaxBenchMiniGame';
import { WaxBenchMiniGame as OrangeCountyWaxBenchMiniGame, } from '../../editions/orangecounty/components/Milosport/WaxBenchMiniGame';
export { UtahWaxBenchMiniGame, OrangeCountyWaxBenchMiniGame, };
export const WaxBenchMiniGame = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyWaxBenchMiniGame, { ...props });
    }
    return _jsx(UtahWaxBenchMiniGame, { ...props });
};
