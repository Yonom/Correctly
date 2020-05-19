import { IonButton, IonLabel } from '@ionic/react';

import { useState, useRef } from 'react';
import styles from './Expandable.module.css';

export default ({ header, subheader, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [btnText, setbtnText] = useState('Anzeigen');
  const contentRef = useRef();

  const toggleIsOpenHandler = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setbtnText('Ausblenden');
    } else {
      setbtnText('Anzeigen');
    }
  };

  const contentLength = contentRef.current ? contentRef.current.clientHeight : 'auto';
  return (
    <>
      <div className={styles.expandableComponent}>
        <div className={styles.expandableHeader}>
          {/* header */}
          <IonLabel>
            <div className={styles.test}>
              <h2>{header}</h2>
              <h3>{subheader}</h3>
            </div>
          </IonLabel>
          <IonButton onClick={toggleIsOpenHandler}>{btnText}</IonButton>
        </div>
        <div className={styles.expandableBody} style={{ height: isOpen ? contentLength : 0 }}>
          <div className={styles.expandableContent} ref={contentRef}>
            {/* body */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
