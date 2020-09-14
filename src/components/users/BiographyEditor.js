import { IonTextarea, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { saveOutline } from 'ionicons/icons';
import { setBiography } from '../../services/users';
import IonController from '../IonController';
import { makeToast } from '../GlobalNotifications';
import { makeAPIErrorAlert } from '../../utils/errors';
import SubmitButton from '../SubmitButton';

const BiographyEditor = ({ userId, user }) => {
  const { control, handleSubmit } = useForm({ defaultValues: { biography: user?.biography } });
  const onSubmit = async ({ biography }) => {
    try {
      await setBiography(userId, biography);
      makeToast({ message: 'Biografie erfolgreich aktualisiert!' });
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <IonController
        control={control}
        name="biography"
        as={<IonTextarea autoGrow maxlength={2000} style={{ '--padding-start': 0 }} />}
      />
      <SubmitButton>
        <IonIcon icon={saveOutline} slot="start" />
        Speichern
      </SubmitButton>
    </form>
  );
};

export default BiographyEditor;
