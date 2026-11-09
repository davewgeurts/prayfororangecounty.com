import { jsx as _jsx } from "react/jsx-runtime";
import { getPilgrimageEdition } from '../../edition';
import { CopPullOverModal as UtahCopPullOverModal, } from '../../editions/utah/components/CanyonDrive/CopPullOverModal';
import { CopPullOverModal as OrangeCountyCopPullOverModal, } from '../../editions/orangecounty/components/CanyonDrive/CopPullOverModal';
export { UtahCopPullOverModal, OrangeCountyCopPullOverModal, };
export const CopPullOverModal = ({ edition, ...props }) => {
    const activeEdition = edition ?? getPilgrimageEdition();
    if (activeEdition === 'orangecounty') {
        return _jsx(OrangeCountyCopPullOverModal, { ...props });
    }
    return _jsx(UtahCopPullOverModal, { ...props });
};
