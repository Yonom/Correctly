import { IonButton, IonModal, IonSearchbar, IonContent, IonList, IonRadioGroup } from '@ionic/react';

import { useState } from 'react';

const SearchListModal = ({ title, children, isOpen, doCloseModal, searchTerm, setSearchTerm, selectedRadio = undefined, radioAction = undefined }) => {
  const [value, setValue] = useState(selectedRadio);

  const handleChangeSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <IonModal isOpen={isOpen} backdrop-dismiss onDidDismiss={doCloseModal}>
      <h1>{title}</h1>
      <IonSearchbar placeholder="Filter by name" value={searchTerm} onIonChange={handleChangeSearch} />
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
      <IonButton onClick={doCloseModal}>Speichern und Schließen</IonButton>
    </IonModal>
  );
};

export default SearchListModal;
