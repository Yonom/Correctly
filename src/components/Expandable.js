import { IonItem, IonButton, IonLabel, IonIcon } from '@ionic/react';

import { useState, useRef } from 'react';
import styles from './Expandable.module.css';

const Expandable = ({ header, subheader, ionIcon = undefined, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef();

  const toggleIsOpenHandler = () => {
    setIsOpen(!isOpen);
  };

  const icon = ionIcon !== undefined
    ? <IonIcon class="ion-padding" icon={ionIcon} color="dark" />
    : null;

  const contentLength = contentRef.current
    ? contentRef.current.clientHeight
    : 'auto';

  return (
    <>
      <div className={styles.expandableComponent}>
        <IonItem>
          {/* header */}
          {icon}
          <IonLabel>
            <h2>{header}</h2>
            {subheader}
          </IonLabel>
          <IonButton onClick={toggleIsOpenHandler}>{isOpen ? 'Hide' : 'Show'}</IonButton>
        </IonItem>
        <div className={styles.expandableBody} style={{ height: isOpen ? contentLength : 0, overflow: 'hidden' }}>
          <div ref={contentRef} className={styles.expandableContentContainer}>
            <div className={styles.expandableContent}>
              {/* body */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expandable;
