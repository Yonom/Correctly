/* Ionic imports */
import { IonContent, IonItem, IonList, IonSearchbar, IonHeader, IonToolbar } from '@ionic/react';

import React, { useState } from 'react';

/* Custom components */
import AppPage from '../../components/AppPage';
import UserList from '../../components/UserList';

export default () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const test = [{
    id: '123',
    name: 'Yannick Aaron',
    email: 'yannick@yannick.de',
  }, {
    id: '1234',
    name: 'Simon Farshid',
    email: 'Simon@Simon.de',
  }, {
    id: '12345',
    name: 'Ling Ling',
    email: 'Ling@Ling.de',
  }, {
    id: '12346',
    name: 'Luca Lenhard',
    email: 'Luca@Luca.de',
  }, {
    id: '12347',
    name: 'Maik Maik',
    email: 'Maik@Maik.de',
  }];

  const testEl = test.filter((u) => u.name.startsWith(searchTerm)).map((u) => {
    return (
      <IonItem key={u.id}><UserList userID={u.id} userName={u.name} userEmail={u.email} /></IonItem>
    );
  });

  return (
    <AppPage title="User-Interface (Superuser)" footer="Correctly">
      <IonHeader translucent>
        <IonToolbar>
          <IonSearchbar placeholder="Filter nach Name" value={searchTerm} onIonChange={handleChange} />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {testEl}
        </IonList>
      </IonContent>
    </AppPage>
  );
};
