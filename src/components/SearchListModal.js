import { IonButton, IonModal, IonSearchbar, IonContent, IonList } from '@ionic/react';

const SearchListModal = ({ title, children, isOpen, doCloseModal, searchTerm, setSearchTerm }) => {
  const handleChangeSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <IonModal isOpen={isOpen} backdrop-dismiss onDidDismiss={doCloseModal}>
      <h1>{title}</h1>
      <IonSearchbar placeholder="Filter by name" value={searchTerm} onIonChange={handleChangeSearch} />
      <IonContent>
        <IonList>
          {children}
        </IonList>
      </IonContent>
      <IonButton onClick={doCloseModal}>Save and close</IonButton>
    </IonModal>
  );
};

export default SearchListModal;
