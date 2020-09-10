import { IonItem, IonButton, IonLabel } from '@ionic/react';

import { useState, useRef } from 'react';
import styles from './Expandable.module.css';

const Expandable = ({ header, subheader, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef();

  const toggleIsOpenHandler = () => {
    setIsOpen(!isOpen);
  };

  const contentLength = contentRef.current
    ? contentRef.current.clientHeight
    : 'auto';
  return (
    <>
      <div className={styles.expandableComponent}>
        <IonItem>
          <div className={styles.expandableHeader}>
            {/* header */}
            <IonLabel>
              <div className={styles.test}>
                <h2>{header}</h2>
                <h3>{subheader}</h3>
              </div>
            </IonLabel>
            <IonButton onClick={toggleIsOpenHandler}>{isOpen ? 'Hide' : 'Show'}</IonButton>
          </div>
        </IonItem>
        <div className={styles.expandableBody} style={{ height: isOpen ? contentLength : 0, visibility: isOpen ? 'visible' : 'hidden', overflow: 'hidden' }}>
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
