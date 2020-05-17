/* eslint-disable camelcase */
import { IonTitle, IonFooter, IonToolbar, IonPage, IonHeader } from '@ionic/react';
import Collapsible from 'react-collapsible';
// better remove
const collapsible_style = {
  backgroundColor: '#777',
  color: 'white',
  cursor: 'pointer',
  padding: '18px',
  width: '100%',
  border: 'none',
  textAlign: 'left',
  outline: 'none',
  fontSize: '15px',
};

const content_style = {
  padding: '0 18px',
  display: 'none',
  overflow: 'hidden',
  backgroundColor: '#f1f1f1',
};

export default ({ children }) => {
  return (
    <>
      <Collapsible trigger="Start here">
        <div style={content_style}>
          <p>TEST</p>
        </div>
      </Collapsible>
    </>
  );
};
