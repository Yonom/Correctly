import { IonCardContent, IonItem, IonLabel } from '@ionic/react';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';

const privacy = () => {
  return (
    <AppPage title="Privacy" footer="Correctly">
      <IonCenterContent>
        <IonCardContent>

          <IonItem>
            <IonLabel>
              <p>Responsible in the sense of the data protection laws, in particular the EU Data Protection Basic Regulation (DSGVO), is Simon Farshid</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <b>Your data subject rights</b>
              <p>
                You can exercise the following rights at any time by contacting our data protection officer:
              </p>
              <p>
                Information about your data stored with us and its processing (Art. 15 DSGVO),
                Correcting incorrect personal data (Art. 16 DSGVO),
                Deletion of your data stored with us (Art. 17 DSGVO),
                Restriction of data processing, provided that we are not yet allowed to delete your data due to legal obligations (Art. 18 DSGVO),
                Objection to the processing of your data by us (Art. 21 DSGVO) andData transferability, if you have consented to data processing or have concluded a contract with us (Art. 20 DSGVO).
                If you have given us your consent, you can revoke it at any time with effect for the future.
                You may at any time submit a complaint to a supervisory authority, e.g. to the competent supervisory authority of the federal state of your residence or to the authority responsible for us as the responsible body.
                A list of the regulatory authorities (for the non-public sector) with their addresses can be found at:
                https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html.

              </p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <b>Registration on our website</b>
              <b>
                Nature and purpose of the processing:
              </b>
              <p>
                When registering to use our personalized services, some personal data is collected, such as name, address, contact and communication data (e.g. telephone number and e-mail address). If you are registered with us, you can access content and services that we offer only to registered users. Registered users also have the option of changing or deleting the data provided during registration at any time if necessary. Of course, we will also provide you with information about the personal data we have stored about you at any time.
              </p>
              <b>
                Legal basis:
              </b>
              <p>
                The processing of the data entered during registration is based on the user's consent (Art. 6 para. 1 lit. a DSGVO).
                If the registration serves the fulfilment of a contract to which the person concerned is a party or the implementation of pre-contractual measures, the additional legal basis for the processing of the data is Art. 6 para. 1 lit. b DSGVO.
              </p>
              <b>
                Recipient:
              </b>
              <p>
                Recipients of the data may be technical service providers who act as contract processors for the operation and maintenance of our website.Storage period:
                Data will only be processed in this context as long as the corresponding consent has been obtained. Thereafter, they will be deleted, provided that there are no legal storage obligations to the contrary. To contact us in this context, please use the contact data given at the end of this data protection declaration.
              </p>
              <b>
                Provision prescribed or necessary:
              </b>
              <p>
                The provision of your personal data is voluntary, solely based on your consent. Without the provision of your personal data, we cannot grant you access to our offered contents and services.
              </p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <b>Contact form</b>
              <b>
                Nature and purpose of the processing:
              </b>
              <p>
                The data entered by you will be stored for the purpose of individual communication with you. For this purpose, it is necessary to provide a valid e-mail address and your name. This serves to assign the inquiry and to answer it afterwards. The specification of further data is optional.
              </p>
              <b>
                Legal basis:
              </b>
              <p>
                The processing of the data entered in the contact form is based on a legitimate interest (Art. 6 para. 1 lit. f DSGVO).
                By providing the contact form, we would like to make it easy for you to contact us. The information you provide will be stored for the purpose of processing your inquiry and for possible follow-up questions.If you contact us to request an offer, the data entered in the contact form will be processed for the purpose of implementing pre-contractual measures (Art. 6 para. 1 lit. b DSGVO).
              </p>
              <b>
                Recipient:
              </b>
              <p>
                We make personal data available to our affiliated companies (e.g. Firebase,CockroachDB, Google), other trustworthy companies or persons who process them on our behalf. This is done on the basis of our instructions and in accordance with our privacy policy and other appropriate confidentiality and security measures.
              </p>
              <b>
                Storage duration:
              </b>
              <p>
                Data will be deleted at the latest 6 months after processing the request.If a contractual relationship is established, we are subject to the legal retention periods according to HGB and delete your data after these periods have expired.
                Provision prescribed or necessary:
                The provision of your personal data is voluntary. Unfortunately we can onlyprocess your request if you provide us with your name, your e-mail address and the reason for your request.
              </p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <b>SSL Encryption</b>
              <p>
                To protect the security of your data during transmission, we use state-of-the-art encryption procedures (e.g. SSL) via HTTPS.
              </p>
              <b>
                Change of our data protection regulations
              </b>
              <p>
                We reserve the right to adapt this data protection declaration so that it always meets the current legal requirements or to implement changes to our services in the data protection declaration, e.g. when introducing new services. The new data protection declaration then applies to your renewed visit.
              </p>
              <b>
                Questions to the data protection officer
              </b>
              <p>
                If you have any questions regarding data protection, please send us an e-mail or contact the person responsible for data protection in our organization directly:
              </p>

            </IonLabel>
          </IonItem>

        </IonCardContent>
      </IonCenterContent>
    </AppPage>
  );
};

export default privacy;
