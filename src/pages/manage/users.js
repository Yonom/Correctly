/* Ionic imports */
import { IonContent, IonList, IonSearchbar, IonToolbar, IonListHeader } from '@ionic/react';

import React, { useState } from 'react';

/* Custom components */
import AppPage from '../../components/AppPage';
import UserList from '../../components/UserList';
import { useAllUsers } from '../../services/users';
import { useOnErrorAlert } from '../../utils/errors';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const users = useOnErrorAlert(useAllUsers()).data || [];

  const filterUser = (userObject) => {
    const terms = searchTerm.toUpperCase().split(' ');
    const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
    const rObject = userObject.filter((u) => check(`${u.firstname} ${u.lastname} ${u.email}`));
    return rObject;
  };

  const filteredUsers = filterUser(users).map((u) => {
    return (
      <UserList key={u.userid} userId={u.userid} userLastName={u.lastname} userFirstName={u.firstname} userStudentId={u.studentid} userEmail={u.email} />
    );
  });

  return (
    <AppPage title="Manage Users">
      <div style={{ maxHeight: '100%' }}>
        <IonToolbar>
          <IonSearchbar placeholder="Filter nach Name" value={searchTerm} onIonChange={handleChange} />
        </IonToolbar>
        <div style={{ maxHeight: '100%', overflow: 'scroll' }}>
          {filteredUsers}
        </div>
      </div>
    </AppPage>
  );
};

export default Users;
