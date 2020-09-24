import { IonButton, IonModal, IonSearchbar, IonContent, IonList } from '@ionic/react';

const SearchListModal = ({ title, children, isOpen, doCloseModal, searchTerm, setSearchTerm }) => {
  const handleChangeSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <IonModal isOpen={isOpen} backdrop-dismiss onDidDismiss={doCloseModal}>
      <h1>{title}</h1>
      <IonSearchbar placeholder="Filter nach Name" value={searchTerm} onIonChange={handleChangeSearch} />
      <IonContent>
        <IonList>
          {children}
        </IonList>
      </IonContent>
      <IonButton onClick={doCloseModal}>Speichern und Schließen</IonButton>
    </IonModal>
  );
};

export default SearchListModal;
