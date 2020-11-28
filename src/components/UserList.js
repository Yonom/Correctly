import { IonButton, IonLabel, IonText, IonInput, IonList } from '@ionic/react';
import { useForm } from 'react-hook-form';
import styles from './UserList.module.css';
import Expandable from './Expandable';
import IonController from './IonController';
import { makeAPIErrorAlert, onSubmitError } from '../utils/errors';
import { deleteUser, changeUser } from '../services/users';
import { makeToast, withLoading } from './GlobalNotifications';
import { isStudentEmail } from '../utils/auth/isStudentEmail';
import { authProvider } from '../utils/config';
import SafariFixedIonItem from './SafariFixedIonItem';

const UserList = ({ userId, userLastName, userFirstName, userStudentId, userEmail }) => {
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      userLastName,
      userFirstName,
      userStudentId,
      userEmail,
    },
  });

  const disabled = authProvider === 'csv';

  const isStudentIdRequired = isStudentEmail(watch('userEmail'));

  const onSubmit = withLoading(async ({ userLastName: lastName, userFirstName: firstName, userStudentId: studentId, userEmail: email }) => {
    const studentIdIfRequired = isStudentIdRequired ? parseInt(studentId, 10) : null;

    try {
      await changeUser(userId, firstName, lastName, email, studentIdIfRequired);
      await makeToast({ message: `User '${firstName} ${lastName}' was successfully updated.` });
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  });

  // deleteUserfunction
  const onDelete = withLoading(async () => {
    try {
      await deleteUser(userId);
      await makeToast({ message: `User with ID ${userId} was successfully deleted.` });
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  });

  return (
    <>
      <Expandable lazy header={`${userFirstName} ${userLastName}`} subheader={userEmail}>
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
          <IonList lines="full" class="ion-no-margin ion-no-padding">
            <SafariFixedIonItem>
              {/* Safari bug workaround */}
              <div tabIndex="0" />
              <IonLabel position="stacked">
                Last Name
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} name="userLastName" control={control} disabled={disabled} />
            </SafariFixedIonItem>

            <SafariFixedIonItem>
              {/* Safari bug workaround */}
              <div tabIndex="0" />
              <IonLabel position="stacked">
                First Name
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} name="userFirstName" control={control} disabled={disabled} />
            </SafariFixedIonItem>
            {isStudentIdRequired === true && (
              <SafariFixedIonItem>
                {/* Safari bug workaround */}
                <div tabIndex="0" />
                <IonLabel position="stacked">
                  Student ID
                  {' '}
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController type="text" as={IonInput} name="userStudentId" control={control} disabled={disabled} />
              </SafariFixedIonItem>
            )}
            <SafariFixedIonItem>
              {/* Safari bug workaround */}
              <div tabIndex="0" />
              <IonLabel position="stacked">
                E-Mail
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} name="userEmail" control={control} disabled={disabled} />
            </SafariFixedIonItem>
          </IonList>
          <div className={styles.userFooter}>
            <IonButton color="success" type="submit" disabled={disabled}>Save</IonButton>
            <IonButton color="danger" onClick={onDelete} disabled={disabled}>Disable User</IonButton>
          </div>
        </form>
      </Expandable>
    </>
  );
};

export default UserList;
