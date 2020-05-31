
/* eslint-disable camelcase */
import { IonButton, IonModal, IonSearchbar, IonContent, IonList, IonRadioGroup, IonLabel } from '@ionic/react';

import ReactDom from 'react-dom';
import { Component, useState } from 'react';


export default ({ title, children, isOpen, doCloseModal, searchTerm, setSearchTerm, selectedRadio = undefined, radioAction = undefined }) => {
  console.log('default modal opened');

  const [showModal, setShowModal] = useState(isOpen);
  const [value, setValue] = useState(selectedRadio);

  const handleChangeSearch = (event) => {
    console.log('Search');
    setSearchTerm(event.target.value);
  };

  return (
    <IonModal isOpen={isOpen}>
      <h1>{title}</h1>
      <IonSearchbar placeholder="Filter nach Name" value={searchTerm} onIonChange={handleChangeSearch} />
      <IonContent>
        <IonList>
          <IonRadioGroup
            allowEmptySelection
            onIonChange={(e) => { if (radioAction !== undefined) return radioAction(e, setValue); return null; }}
            value={value}
          >
            {children}
          </IonRadioGroup>
        </IonList>
      </IonContent>
      <IonButton onClick={doCloseModal}>Close Modal</IonButton>
    </IonModal>
  );
};


// add proptypes
