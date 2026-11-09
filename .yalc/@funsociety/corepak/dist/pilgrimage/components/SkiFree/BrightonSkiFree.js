import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { BrightonSkiFree as UtahBrightonSkiFree, } from '../../editions/utah/components/SkiFree/BrightonSkiFree';
import { BrightonSkiFree as OrangeCountyBrightonSkiFree, } from '../../editions/orangecounty/components/SkiFree/BrightonSkiFree';
export { UtahBrightonSkiFree, OrangeCountyBrightonSkiFree, };
export const BrightonSkiFree = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyBrightonSkiFree, { ...props });
    }
    return _jsx(UtahBrightonSkiFree, { ...props });
};
