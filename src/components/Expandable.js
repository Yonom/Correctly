import { IonItem, IonButton, IonLabel, IonIcon } from '@ionic/react';

import { useState } from 'react';
import styles from './Expandable.module.css';

const Expandable = ({ header, extra, subheader, ionIcon = undefined, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpenHandler = () => {
    setIsOpen(!isOpen);
  };

  const icon = ionIcon !== undefined
    ? <IonIcon class="ion-padding" icon={ionIcon} color="dark" />
    : null;

  return (
    <>
      <div className={styles.expandableComponent}>
        <IonItem>
          {/* Safari bug workaround */}
          <div tabIndex="0" />
          {/* header */}
          {icon}
          <IonLabel>
            <h2>{header}</h2>
            {subheader}
          </IonLabel>
          {extra}
          <IonButton onClick={toggleIsOpenHandler}>{isOpen ? 'Hide' : 'Show'}</IonButton>
        </IonItem>
        {isOpen && (
          <div className={styles.expandableContent}>
            {/* body */}
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default Expandable;
