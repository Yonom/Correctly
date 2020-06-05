/* Ionic imports */
import { IonContent, IonItem, IonList, IonSearchbar, IonHeader, IonToolbar } from '@ionic/react';

import React, { useState } from 'react';

import useSWR from 'swr';

/* Custom components */
import AppPage from '../../components/AppPage';
import UserList from '../../components/UserList';

export default () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const users = useSWR('/api/users/allUsers').data || [];
  console.log(users);
  const test = [{
    id: '123',
    name: 'Yannick Aaron',
    surname: 'Lehr',
    email: 'yannick@yannick.de',
  }, {
    id: '1234',
    name: 'Simon',
    surname: 'Farshid',
    email: 'Simon@Simon.de',
  }, {
    id: '12345',
    name: 'Ling',
    surname: 'Linn',
    email: 'Ling@Ling.de',
  }, {
    id: '12346',
    name: 'Luca',
    surname: 'Lenhard',
    email: 'Luca@Luca.de',
  }, {
    id: '12347',
    name: 'Maik Maik',
    surname: 'Lehr',
    email: 'Maik@Maik.de',
  }];

  /**
   * @param userObject
   */
  function filterUser(userObject) {
    const terms = searchTerm.toUpperCase().split(' ');
    const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
    const rObject = userObject.filter((u) => check(`${u.name} ${u.surname} ${u.email}`));
    return rObject;
  }

  const testEl = filterUser(test).map((u) => {
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
