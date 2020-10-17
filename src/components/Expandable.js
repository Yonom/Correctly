import { IonButton, IonLabel, IonIcon } from '@ionic/react';

import { useState } from 'react';
import styles from './Expandable.module.css';
import SafariFixedIonItem from './SafariFixedIonItem';

const Expandable = ({ header, extra, subheader, lazy, ionIcon = undefined, children }) => {
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
        <SafariFixedIonItem>
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
        </SafariFixedIonItem>
        {(isOpen || !lazy) && (
          <div className={styles.expandableBody} style={{ height: isOpen ? undefined : 0 }}>
            <div className={styles.expandableContent}>
              {/* body */}
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Expandable;
