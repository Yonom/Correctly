/* Ionic imports */
import { IonButton, IonLabel, IonInput, IonText, IonRadioGroup, IonGrid, IonRow, IonCol } from '@ionic/react';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Router from 'next/router';
import AppPage from '../../../components/AppPage';
import IonController from '../../../components/IonController';
import IonCenterContent from '../../../components/IonCenterContent';

import { makeToast } from '../../../components/GlobalNotifications';
import SearchListModal from '../../../components/SearchListModal';
import UserItem from '../../../components/UserItem';
import UserRadio from '../../../components/UserRadio';
import UserChip from '../../../components/UserChip';
import { makeAPIErrorAlert, onSubmitError, useOnErrorAlert } from '../../../utils/errors';
import { useAllUsers } from '../../../services/users';
import SubmitButton from '../../../components/SubmitButton';
import { addCourse } from '../../../services/courses';
import SafariFixedIonItem from '../../../components/SafariFixedIonItem';
import { withLoading } from '../../../components/GlobalLoading';

const AddCoursePage = () => {
  // get all users from the api
  const { data: users } = useOnErrorAlert(useAllUsers());

  // initalize state variables:
  // ->  roles
  const [roles, setRoles] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  // ->  modals
  const [showModuleCoordinatorModal, setShowModuleCoordinatorModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [showStudentModal, setShowStudentsModal] = useState(false);
  // ->  searchbars
  const [searchTermModuleCoordinator, setSearchTermModuleCoordinator] = useState('');
  const [searchTermLecturer, setSearchTermLecturer] = useState('');
  const [searchTermStudent, setSearchTermStudent] = useState('');
  // ->  radiobutton selection
  const [selectedModuleCoordinatorItem, setSelectedModuleCoordinatorItem] = useState(undefined);

  // roleStrings for the onCheck and onClickChip function
  const roleStringModuleCoordintator = 'moduleCoordinator';
  const roleStringLecturer = 'lecturer';
  const roleStringStudent = 'student';

  // function to load attendees in selectedUsers as soon as attendees are loaded
  useEffect(() => {
    if (typeof users !== 'undefined' && users.length !== 0 && !usersLoaded) {
      setRoles(users);
      setUsersLoaded(true);
    }
  }, [users, usersLoaded]);

  /**
   * updates a given role by inserting it at a given index.
   *
   * @param {object} userRole the userRole to be inserted
   * @param {number} i the index where the userRole should be inserte
   */
  const updateRole = (userRole, i) => {
    const newRoles = [...roles];
    newRoles[i] = userRole;
    setRoles(newRoles);
  };

  /**
   * the oncheck function which is called by the userItems for a checked or unchecked
   * checkbox
   *
   * @param {Event} e the corresponding event
   * @param {object} user the corresponding user
   * @param {string} roleString the roleString which indicates whether the role should be assigned as
   * module coordinator, lecturer or student
   */
  const onCheck = (e, user, roleString) => {
    const role = user;
    const checkboxState = e.detail.checked;
    switch (roleString) {
      case roleStringLecturer:
        role.selectedLecturer = checkboxState;
        updateRole(role);
        break;
      case roleStringStudent:
        role.selectedStudent = checkboxState;
        updateRole(role);
        break;
      default:
    }
  };

  /**
   * the onclick function which is called by the userChips in order to deselect the
   * corresponding role for the specified user
   *
   * @param {Event} e the corresponding event
   * @param {object} user the corresponding user
   * @param {string} roleString the roleString which indicates whether the role should be assigned as
   * module coordinator, lecturer or student
   * @param {Function} setShowChip the function to change the show state of the caller chip to false
   */

  const onClickChip = (e, user, roleString, setShowChip) => {
    const role = user;
    switch (roleString) {
      case roleStringModuleCoordintator:
        role.selectedModuleCoordinator = false;
        updateRole(role);
        setSelectedModuleCoordinatorItem(undefined);
        break;
      case roleStringLecturer:
        role.selectedLecturer = false;
        updateRole(role);
        break;
      case roleStringStudent:
        role.selectedStudent = false;
        updateRole(role);
        break;
      default:
    }
    setShowChip(false);
  };

  /**
   * returns an array of all users that have been assigne a rol
   */
  const assignedUsers = () => {
    // set the selected modulecoordinator
    const selectedMCIndex = selectedModuleCoordinatorItem !== undefined
      ? roles.findIndex(({ userid }) => userid === selectedModuleCoordinatorItem.replace('radio_u', ''))
      : -1;
    if (selectedMCIndex !== -1) {
      const role = roles[selectedMCIndex];
      role.selectedModuleCoordinator = true;
      updateRole(role);
    }

    // only return users with roles asigned
    const sendSelectedUsers = roles.filter((u) => {
      return !(!u.selectedModuleCoordinator && !u.selectedLecturer && !u.selectedStudent);
    });

    return sendSelectedUsers;
  };

  /**
   * @param {Event} e  the corresponding event
   */
  const onRadio = (e) => {
    const key = e.detail.value;
    setSelectedModuleCoordinatorItem(key);
  };

  // filtering functions for the modulecoordinator, lecturer and student elements:
  // returns all users which contain the search term in:
  // - firstname
  // - lastname or
  // - email
  const moduleCoordinatorItems = roles !== undefined
    ? roles.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermModuleCoordinator.toLowerCase())).map((u, index) => {
    // return element list with radio button items
      return (
        <UserRadio
          user={u}
          index={index}
          key={`radio_u${u.userid}`}
        />
      );
    })
    : null;
  const lecturersItems = roles !== undefined
    ? roles.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermLecturer.toLowerCase())).map((u, index) => {
      return (
        <UserItem
          user={u}
          index={index}
          key={`lecturerBox_u${u.userid}`}
          roleString={roleStringLecturer}
          onCheck={onCheck}
          checked={u.selectedLecturer}
        />
      );
    })
    : null;
  const studentsItems = roles !== undefined
    ? roles.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermStudent.toLowerCase())).map((u, index) => {
      return (
        <UserItem
          user={u}
          index={index}
          key={`studentsBox_u${u.userid}`}
          roleString={roleStringStudent}
          onCheck={onCheck}
          checked={u.selectedStudent}
        />
      );
    })
    : null;

  // functions for the chips components to be generated once a user
  // has been assigned inside one of the modals
  const moduleCoordinatorsChip = roles.filter((u) => `radio_u${u.userid}` === selectedModuleCoordinatorItem).map((u) => {
    return (
      <UserChip
        user={u}
        key={`moduleCoordinatorChip_u${u.userid}`}
        roleString={roleStringModuleCoordintator}
        onCheck={onClickChip}
      />
    );
  });
  const lecturersChips = roles.filter((u) => u.selectedLecturer).map((u) => {
    return (
      <UserChip
        user={u}
        key={`lecturerChip_u${u.userid}`}
        roleString={roleStringLecturer}
        onCheck={onClickChip}
      />
    );
  });
  const studentsChips = roles.filter((u) => u.selectedStudent).map((u) => {
    return (
      <UserChip
        user={u}
        key={`studentsChip_u${u.userid}`}
        roleString={roleStringStudent}
        onCheck={onClickChip}
      />
    );
  });

  // Sending the form and handling the response
  const doCreateCourse = withLoading(async (data) => {
    try {
      // send the data to the api and show the loading component in
      // the meantime to inform user and prevent double requests
      await addCourse(data.courseTitle, data.yearCode, assignedUsers());
      makeToast({ message: 'Course created successfully.' });
      return Router.push('/manage/courses');
    } catch (ex) {
      return makeAPIErrorAlert(ex);
    }
  });
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => {
    doCreateCourse(data);
  };
    // Modal open/close handlers
  const doShowModuleCoordinatorModal = () => {
    setShowModuleCoordinatorModal(true);
  };
  const doShowLecturerModal = () => {
    setShowLecturerModal(true);
  };
  const doShowStudentsModal = () => {
    setShowStudentsModal(true);
  };

  const doCloseModuleCoordinatorModal = () => {
    setShowModuleCoordinatorModal(false);
  };
  const doCloseLecturerModal = () => {
    setShowLecturerModal(false);
  };
  const doCloseStudentsModal = () => {
    setShowStudentsModal(false);
  };

  return (
    <AppPage title="Add Course">
      <SearchListModal
        title="Select module coordination"
        key="moduleCoordinationModal"
        isOpen={showModuleCoordinatorModal}
        doCloseModal={doCloseModuleCoordinatorModal}
        searchTerm={searchTermModuleCoordinator}
        setSearchTerm={setSearchTermModuleCoordinator}
      >
        <IonRadioGroup
          key="radioGroupModuleCoordination"
          allowEmptySelection
          onIonChange={onRadio}
          value={selectedModuleCoordinatorItem}
        >
          {moduleCoordinatorItems}
        </IonRadioGroup>
      </SearchListModal>
      <SearchListModal
        title="Select Lecturer"
        key="lecturerModal"
        isOpen={showLecturerModal}
        doCloseModal={doCloseLecturerModal}
        searchTerm={searchTermLecturer}
        setSearchTerm={setSearchTermLecturer}
      >
        {lecturersItems}
      </SearchListModal>
      <SearchListModal
        title="Select Students"
        key="studentsModal"
        isOpen={showStudentModal}
        doCloseModal={doCloseStudentsModal}
        searchTerm={searchTermStudent}
        setSearchTerm={setSearchTermStudent}
      >
        {studentsItems}
      </SearchListModal>
      <IonCenterContent>
        <form name="courseForm" onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <div className="ion-padding">
            <SafariFixedIonItem>
              <IonLabel position="floating">
                Course title
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} control={control} placeholder="e.g. Introduction to programming" name="courseTitle" required />
            </SafariFixedIonItem>
            <SafariFixedIonItem>
              <IonLabel position="floating">
                Year code
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" expand="block" as={IonInput} control={control} placeholder="e.g. WI/DIF-172" name="yearCode" required />
            </SafariFixedIonItem>
            <IonGrid>
              <IonRow>
                <IonCol size="9" style={{ alignSelf: 'flex-end', fontWeight: 'bold' }}>
                  <IonLabel>Module coordination</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowModuleCoordinatorModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {moduleCoordinatorsChip}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9" style={{ alignSelf: 'flex-end', fontWeight: 'bold' }}>
                  <IonLabel position="floating">Lecturers</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowLecturerModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {lecturersChips}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9" style={{ alignSelf: 'flex-end', fontWeight: 'bold' }}>
                  <IonLabel position="floating">Students</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowStudentsModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {studentsChips}
                </IonCol>
              </IonRow>
              <IonRow />
            </IonGrid>
            <SubmitButton color="secondary" expand="block">Create course</SubmitButton>
          </div>
        </form>
      </IonCenterContent>
    </AppPage>
  );
};

export default AddCoursePage;
