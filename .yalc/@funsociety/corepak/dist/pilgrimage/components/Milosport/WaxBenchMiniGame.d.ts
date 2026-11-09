import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { WaxBenchMiniGame as UtahWaxBenchMiniGame, type Props as UtahWaxBenchMiniGameProps } from '../../editions/utah/components/Milosport/WaxBenchMiniGame';
import { WaxBenchMiniGame as OrangeCountyWaxBenchMiniGame, type Props as OrangeCountyWaxBenchMiniGameProps } from '../../editions/orangecounty/components/Milosport/WaxBenchMiniGame';
export type WaxBenchMiniGameProps = OrangeCountyWaxBenchMiniGameProps & {
    edition?: PilgrimageEdition;
};
export { UtahWaxBenchMiniGame, OrangeCountyWaxBenchMiniGame, type UtahWaxBenchMiniGameProps, type OrangeCountyWaxBenchMiniGameProps, };
export declare const WaxBenchMiniGame: React.FC<WaxBenchMiniGameProps>;
