import { IonButton, IonModal, IonSearchbar, IonContent, IonList, IonLabel } from '@ionic/react';

const SearchListModal = ({ title, children, isOpen, doCloseModal, searchTerm, setSearchTerm }) => {
  const handleChangeSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <IonModal isOpen={isOpen} backdrop-dismiss onDidDismiss={doCloseModal}>
      <h1>
        <IonLabel className="ion-padding">{title}</IonLabel>
      </h1>
      <IonSearchbar placeholder="Filter by name" value={searchTerm} onIonChange={handleChangeSearch} />
      <IonContent>
        <IonList>
          {children}
        </IonList>
      </IonContent>
      <IonButton onClick={doCloseModal}>Save and Close</IonButton>
    </IonModal>
  );
};

export default SearchListModal;
