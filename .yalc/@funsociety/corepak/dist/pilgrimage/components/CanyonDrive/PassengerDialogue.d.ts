import React from 'react';
import { type PilgrimageEdition } from '../../edition';
import { PassengerDialogue as UtahPassengerDialogue, type Props as UtahPassengerDialogueProps } from '../../editions/utah/components/CanyonDrive/PassengerDialogue';
import { PassengerDialogue as OrangeCountyPassengerDialogue, type Props as OrangeCountyPassengerDialogueProps } from '../../editions/orangecounty/components/CanyonDrive/PassengerDialogue';
export type PassengerDialogueProps = OrangeCountyPassengerDialogueProps & {
    edition?: PilgrimageEdition;
};
export { UtahPassengerDialogue, OrangeCountyPassengerDialogue, type UtahPassengerDialogueProps, type OrangeCountyPassengerDialogueProps, };
export declare const PassengerDialogue: React.FC<PassengerDialogueProps>;
