import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { DiscountPassDesk as UtahDiscountPassDesk, type Props as UtahDiscountPassDeskProps } from '../../editions/utah/components/Milosport/DiscountPassDesk';
import { DiscountPassDesk as OrangeCountyDiscountPassDesk, type Props as OrangeCountyDiscountPassDeskProps } from '../../editions/orangecounty/components/Milosport/DiscountPassDesk';
export type DiscountPassDeskProps = OrangeCountyDiscountPassDeskProps & {
    edition?: PilgrimageEdition;
};
export { UtahDiscountPassDesk, OrangeCountyDiscountPassDesk, type UtahDiscountPassDeskProps, type OrangeCountyDiscountPassDeskProps, };
export declare const DiscountPassDesk: React.FC<DiscountPassDeskProps>;
