/* Ionic imports */
import { IonButton, IonLabel, IonItem, IonInput, IonText, IonRadioGroup, IonGrid, IonRow, IonCol, IonLoading } from '@ionic/react';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Components } from 'antd/lib/date-picker/generatePicker';
import fetchPost from '../../../utils/fetchPost';

import AppPage from '../../../components/AppPage';
import IonController from '../../../components/IonController';
import IonCenterContent from '../../../components/IonCenterContent';

import { makeToast } from '../../../components/GlobalNotifications';
import SearchListModal from '../../../components/SearchListModal';
import UserItem from '../../../components/UserItem';
import UserRadio from '../../../components/UserRadio';
import UserChip from '../../../components/UserChip';
import { makeAPIErrorAlert, useOnErrorAlert } from '../../../utils/errors';
import { useAllUsers } from '../../../services/users';
import { useAttends } from '../../../services/attends';
import { useCourse } from '../../../services/courses';
import SubmitButton from '../../../components/SubmitButton';

// the array to load all existing users
let users = [];

// the users that are relevant for any role and will be send to the api
let selectedUsers = [];

// the user id that has been defined as module coordinator
let selectedModuleCoordinator;

/**
 * @param {object} u the user that should be updated if it exists and insterted
 *  if it does not exist in the aray 'selectedUsers'
 */
function upsertSelectedUsers(u) {
  // check if the User exists in the selectedUser Array.
  const foundId = selectedUsers.findIndex(({ userid }) => userid === u.userid);
  if (foundId !== -1) {
    // update user, if it already exists
    selectedUsers[foundId] = u;
  } else {
    // insert user if it does not exist
    selectedUsers.push(u);
  }
}

/**
 * @param {object} u the user for which a role has been changed. Will be updated/inserted at selectedUser or
 * dropped if it is not relevant any more (= deselected completely
 */
function updateSelectedUsers(u) {
  // determine wheter we should add the selected user to the selctedUsers variable which will
  // later be sent to the backend. If the user is not selected as any role (=deselection of roles)
  // it will be removed from the array
  if (!u.selectedModuleCoordinator && !u.selectedLecturer && !u.selectedStudent) {
    selectedUsers = selectedUsers.filter((obj) => {
      return obj.userid !== u.userid;
    });
  } else {
    // add or update at selectedUsers
    upsertSelectedUsers(u);
  }
}

/**
 * @param {Array} attendees
 * @param {Function} setSelectedModuleCoordinatorItem
 */
function initializeAttendees(attendees, setSelectedModuleCoordinatorItem) {
  let attendee;
  for (attendee of attendees) {
    const attendeeId = attendee.userid;
    const foundId = users.findIndex(({ userid }) => userid === attendeeId);
    // if the user is still active and has been found
    if (foundId !== -1) {
      users[foundId].selectedLecturer = attendee.islecturer;
      users[foundId].selectedModuleCoordinator = attendee.ismodulecoordinator;
      if (attendee.ismodulecoordinator) {
        setSelectedModuleCoordinatorItem(`radio_u${attendeeId}`);
        selectedModuleCoordinator = users[attendeeId];
      }
      users[foundId].selectedStudent = attendee.isstudent;
      updateSelectedUsers(users[foundId]);
    }
  }
}

const EditCoursePage = () => {
  // initialize router
  const router = useRouter();
  const courseId = router.query.id;

  users = useOnErrorAlert(useAllUsers()).data || [];

  // get data and attendees about selected course

  const { data: course, error: errorCourse } = useCourse(courseId);
  const { data: attendees, error: errorAttendees } = useAttends(courseId);

  // initialize state variables:
  //    modals
  const [showModuleCoordinatorModal, setShowModuleCoordinatorModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [showStudentModal, setShowStudentsModal] = useState(false);
  //    searchbars
  const [searchTermModuleCoordinator, setSearchTermModuleCoordinator] = useState('');
  const [searchTermLecturer, setSearchTermLecturer] = useState('');
  const [searchTermStudent, setSearchTermStudent] = useState('');
  //    radiobutton selection
  const [selectedModuleCoordinatorItem, setSelectedModuleCoordinatorItem] = useState(undefined);

  //    state about updating transaction after clicking Save&Edit
  const [updateLoading, setUpdateLoading] = useState(false);

  //    state about wheather a user has access to editing course
  const [restrictedAccess, setRestrictedAccess] = useState(false);

  //    state about wheather getting data about course and attendees is done
  const [doneGettingData, setDoneGettingData] = useState(false);

  // roleStrings for the onCheck function
  const roleStringModuleCoordintator = 'moduleCoordinator';
  const roleStringLecturer = 'lecturer';
  const roleStringStudent = 'student';

  // function to load attendees in selectedUsers as soon as attendees are loaded
  useEffect(() => {
    if (typeof attendees !== 'undefined' && users.length !== 0) {
      initializeAttendees(attendees, setSelectedModuleCoordinatorItem);
      setDoneGettingData(true);
    }
  }, [attendees]);

  // when the errorCourse changes and neither courseId nor errorCourse are undefindet,
  // errorCourse will be shown as an error
  useEffect(() => {
    if (typeof courseId !== 'undefined' && typeof errorCourse !== 'undefined') {
      makeAPIErrorAlert(errorCourse);
    }
  }, [courseId, errorCourse]);
  // checks if user has no access to course and disables save button
  // editing a restricted course is disabled via front-end and back-emd
  useEffect(() => {
    if (errorCourse?.code === 'course/not-found') {
      setRestrictedAccess(true);
    }
  }, [errorCourse]);
  /**
   * the oncheck function which is called by the userItems for a checked or unchecked
   * checkbox
   *
   * @param {Event} e the corresponding event
   * @param {object} u the corresponding user
   * @param {Function} f the function to set the state
   * @param {string} r the roleString which indicates whether the role should be assigned as
   * module coordinator, lecturer or student
   */
  const onCheck = (e, u, f, r) => {
    const checkboxState = e.detail.checked;
    f(e.detail.checked);
    switch (r) {
      case roleStringModuleCoordintator:
        users.find((x) => x.userid === u.userid).selectedModuleCoordinator = checkboxState;
        break;
      case roleStringLecturer:
        users.find((x) => x.userid === u.userid).selectedLecturer = checkboxState;
        break;
      case roleStringStudent:
        users.find((x) => x.userid === u.userid).selectedStudent = checkboxState;
        break;
      default:
    }
    updateSelectedUsers(u);
  };

  const onClickChip = (e, u, r, setShowChip) => {
    switch (r) {
      case roleStringModuleCoordintator:
        users.find((x) => x.userid === u.userid).selectedModuleCoordinator = false;
        setSelectedModuleCoordinatorItem(undefined);
        break;
      case roleStringLecturer:
        users.find((x) => x.userid === u.userid).selectedLecturer = false;
        break;
      case roleStringStudent:
        users.find((x) => x.userid === u.userid).selectedStudent = false;
        break;
      default:
    }
    updateSelectedUsers(u);
    setShowChip(false);
  };

  /**
   * @param {Event} e  the corresponding event
   */
  const onRadio = (e) => {
    const key = e.detail.value;
    // setSelectedModuleCoordinatorItem(key);
    const oldSelectedModuleCoordinator = selectedModuleCoordinator;

    // if a user has been deselected
    if (key === undefined || key === null) {
      selectedModuleCoordinator = undefined;
      const oldU = users.find((x) => x.userid === oldSelectedModuleCoordinator);
      if (oldU !== undefined) {
        oldU.selectedModuleCoordinator = false;
        updateSelectedUsers(oldU);
      }
    } else {
      const selectedUId = key.replace('radio_u', '');
      // if another MC has been defined before
      if (oldSelectedModuleCoordinator !== undefined) {
        // deselect 'selectedModuleCoordinator' attribute and update selectedUsers
        const oldU = users.find((x) => x.userid === oldSelectedModuleCoordinator);
        if (oldU !== undefined) {
          oldU.selectedModuleCoordinator = false;
          updateSelectedUsers(oldU);
        }
      }
      const newU = users.find((x) => x.userid === selectedUId);
      newU.selectedModuleCoordinator = true;
      updateSelectedUsers(newU);
      selectedModuleCoordinator = selectedUId;
    }
  };

  // filtering functions for the modulecoordinator, lecturer and student elements:
  // returns all users which contain the search term in:
  // - firstname
  // - lastname or
  // - email
  const moduleCoordinatorItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermModuleCoordinator.toLowerCase())).map((u) => {
    // return element list with radio button items
    return (
      <UserRadio
        user={u}
        key={`radio_u${u.userid}`}
      />
    );
  });
  const lecturersItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermLecturer.toLowerCase())).map((u) => {
    return (
      <UserItem
        user={u}
        key={`lecturerBox_u${u.userid}`}
        selected={u.selectedLecturer}
        roleString={roleStringLecturer}
        onCheck={onCheck}
      />
    );
  });

  const studentsItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermStudent.toLowerCase())).map((u) => {
    return (
      <UserItem
        user={u}
        key={`studentsBox_u${u.userid}`}
        selected={u.selectedStudent}
        roleString={roleStringStudent}
        onCheck={onCheck}
      />
    );
  });

  const moduleCoordinatorsChips = selectedUsers.filter((u) => `radio_u${u.userid}` === selectedModuleCoordinatorItem).map((u) => {
    return (
      <UserChip
        user={u}
        id={`moduleCoordinatorChip_u${u.userid}`}
        roleString={roleStringModuleCoordintator}
        onCheck={onClickChip}
      />
    );
  });

  const lecturersChips = selectedUsers.filter((u) => u.selectedLecturer).map((u) => {
    return (
      <UserChip
        user={u}
        id={`lecturerChip_u${u.userid}`}
        roleString={roleStringLecturer}
        onCheck={onClickChip}
      />
    );
  });

  const studentsChips = selectedUsers.filter((u) => u.selectedStudent).map((u) => {
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
  const doUpdateCourse = async (data) => {
    try {
      const formdata = {
        courseId,
        courseTitle: data.courseTitle,
        yearCode: data.yearCode,
        users: selectedUsers,
      };
      setUpdateLoading(true);
      await fetchPost('../../api/courses/editCourse', formdata);
      setUpdateLoading(false);
      makeToast({ message: 'Course updated successfully 😳👉👈' });
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  };
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset({
      courseTitle: course?.title,
      yearCode: course?.yearcode,
    });
  }, [reset, course]);

  const onSubmit = (data) => {
    doUpdateCourse(data);
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
    <AppPage title="Editing courses">
      <IonLoading isOpen={(!attendees && !errorAttendees) || updateLoading} />
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
          onIonChange={(e) => {
            const key = e.detail.value;
            setSelectedModuleCoordinatorItem(key);
            onRadio(e);
          }}
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
        <form name="courseForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="ion-padding">
            <IonItem>
              <IonLabel position="floating">
                Course title
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="courseTitle" required defaultValue={course?.title} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                Year code
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" expand="block" as={IonInput} control={control} name="yearCode" required defaultValue={course?.yearcode} />
            </IonItem>
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <IonLabel>Module coordination</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowModuleCoordinatorModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol isOpen={doneGettingData}>
                  {moduleCoordinatorsChips}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9">
                  <IonLabel position="floating">Lecturers</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowLecturerModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol isOpen={doneGettingData}>
                  {lecturersChips}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9">
                  <IonLabel position="floating">Students</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowStudentsModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol isOpen={doneGettingData}>
                  {studentsChips}
                </IonCol>
              </IonRow>
              <IonRow />
            </IonGrid>
            <SubmitButton color="secondary" expand="block" disabled={restrictedAccess}>Save edits</SubmitButton>
          </div>
        </form>
        <section className="ion-padding">
          <Link href="/" passHref>
            <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Back to the menu</IonButton>
          </Link>
        </section>
      </IonCenterContent>
    </AppPage>
  );
};

export default EditCoursePage;
