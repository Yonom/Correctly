/* Ionic imports */
import { IonSearchbar, IonToolbar } from '@ionic/react';

import React, { useState } from 'react';

/* Custom components */
import AppPage from '../../components/AppPage';
import UserList from '../../components/UserList';
import { useAllUsers } from '../../services/users';
import { authProvider } from '../../utils/config';
import { useOnErrorAlert } from '../../utils/errors';

const ManageUsersPage = () => {
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
    <AppPage title={`Manage Users${authProvider === 'csv' ? ' (CSV Mode: Read-Only)' : ''}`}>
      <div style={{ maxHeight: '100%', overflow: 'scroll' }}>
        <IonToolbar style={{ position: 'sticky', top: 0, zIndex: 9999 }}>
          <IonSearchbar placeholder="Filter by name" value={searchTerm} onIonChange={handleChange} />
        </IonToolbar>

        {filteredUsers}
      </div>
    </AppPage>
  );
};

export default ManageUsersPage;
