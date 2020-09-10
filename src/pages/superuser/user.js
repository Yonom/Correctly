/* Ionic imports */
import { IonContent, IonItem, IonList, IonSearchbar, IonHeader, IonToolbar } from '@ionic/react';

import React, { useState } from 'react';

import useSWR from 'swr';

/* Custom components */
import AppPage from '../../components/AppPage';
import UserList from '../../components/UserList';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const users = useSWR('/api/users/allUsers').data || [];

  /**
   * @param userObject
   */
  function filterUser(userObject) {
    const terms = searchTerm.toUpperCase().split(' ');
    const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
    const rObject = userObject.filter((u) => check(`${u.firstname} ${u.lastname} ${u.email}`));
    return rObject;
  }

  const filteredUsers = filterUser(users).map((u) => {
    return (
      <IonItem key={u.userid}><UserList userID={u.userid} userLastname={u.lastname} userFirstname={u.firstname} userStudentid={u.studentid} userEmail={u.email} /></IonItem>
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
          {filteredUsers}
        </IonList>
      </IonContent>
    </AppPage>
  );
};

export default Users;
