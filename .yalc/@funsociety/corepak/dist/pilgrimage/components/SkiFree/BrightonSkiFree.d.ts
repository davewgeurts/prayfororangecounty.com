import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { BrightonSkiFree as UtahBrightonSkiFree, type Props as UtahBrightonSkiFreeProps } from '../../editions/utah/components/SkiFree/BrightonSkiFree';
import { BrightonSkiFree as OrangeCountyBrightonSkiFree, type Props as OrangeCountyBrightonSkiFreeProps } from '../../editions/orangecounty/components/SkiFree/BrightonSkiFree';
export type BrightonSkiFreeProps = OrangeCountyBrightonSkiFreeProps & {
    edition?: PilgrimageEdition;
};
export { UtahBrightonSkiFree, OrangeCountyBrightonSkiFree, type UtahBrightonSkiFreeProps, type OrangeCountyBrightonSkiFreeProps, };
export declare const BrightonSkiFree: React.FC<BrightonSkiFreeProps>;
