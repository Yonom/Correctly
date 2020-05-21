import { makeAlert } from '../components/GlobalNotifications';

export const errorCodes = {
  500: { // 'Thrown if an internal server error occured.'
    header: 'Interner Server-Fehler (HTTP-Statuscode: 500)',
    message: 'Der Server stieß auf eine unerwartete Bedingung, die ihn daran hinderte, die Anforderung zu erfüllen.',
  },
  'auth/csv-not-enabled': { // 'Thrown if the CSV authentication is not enabled in the server.'
    header: 'Die CSV-Authentifizierung ist auf dem Server nicht aktiviert',
    message: 'Die CSV-Authentifizierung ist nicht aktiviert. Bitte kontaktieren Sie den Admin (E-Mail Admin).',
  },
  'auth/email-already-in-use': { // 'Thrown if there already exists an account with the given email address'
    header: 'E-Mail-Adresse bereits vorhanden',
    message: 'Ihre angegebene E-Mail existiert bereits als Konto. Bitte loggen Sie sich mit dieser E-Mail Adresse ein.',
  },
  'auth/expired-action-code': { // 'Thrown if the action code has expired'
    header: 'Aktionscode ist abgelaufen',
    message: 'Ihr Aktionscode ist abgelaufen.',
  },
  'auth/firebase-not-enabled': { // 'Thrown if the Firebase authentication is not enabled in the server.'
    header: 'Die Authentifizierung ist nicht aktiviert',
    message: 'Die Firebase-Authentifizierung ist auf dem Server nicht aktiviert. Bitte kontaktieren Sie den Admin (E-Mail Admin).',
  },
  'auth/invalid-action-code': { // 'Thrown if the action code is invalid. This can happen if the code is malformed or has already been used'
    header: 'Aktionscode ist ungültig',
    message: 'Ihr Aktionscode ist ungültig. Dies kann passieren, wenn der Code fehlerhaft ist oder bereits verwendet wurde.',
  },
  'auth/invalid-credential': { // 'Thrown if the credential is malformed or has expired.',
    header: 'Berechtigungsnachweis ist fehlerhaft oder abgelaufen',
    message: 'Ihr Berechtigungsnachweis ist fehlerhaft oder abgelaufen. Bitte starten Sie eine neue Sitzung.',
  },
  'auth/invalid-email': { // 'Thrown if the email address is not valid'
    header: 'E-Mail-Adresse ist nicht gültig',
    message: 'Die E-Mail-Adresse ist nicht gültig. Bitte verwenden Sie eine E-Mail-Adresse, die @fs.de oder @fs-students.de enthält.',
  },
  'auth/invalid-name': { // 'Thrown if the provided name is not valid.',
    header: 'Angegebener Name ist nicht möglich',
    message: 'Der angegebene Name ist nicht gültig. Nur lateinische Buchstaben, "ä, ö, ü, ß" und Bindestrich sind möglich.',
  },
  'auth/invalid-student-id': { // 'Thrown if the student id is not valid.'
    header: 'Studenten-ID ist nicht gültig',
    message: 'Studenten-ID ist nicht gültig. Der angegebene Studenten-ID ist nicht gültig. Bitte überprüfen Sie Ihre Eingabe oder wenden Sie sich an den Helpdesk. Die Studenten-ID besteht aus 7 Ziffern.',
  },
  // 'auth/invalid-user-id'
  // 'auth/login-expired'
  // 'auth/not-logged-in'
  // 'auth/not-registered' 'Thrown if the registration is incomplete.' --- automatically handled
  // 'auth/not-superuser'
  'auth/not-verified': { // 'Thrown if the user has not verified their email yet. A new verification email has been sent.'
    header: 'E-Mail Adresse noch nicht verifiziert',
    message: 'Um den Registrierungsprozess abzuschließen, müssen Sie zunächst Ihre E-Mail-Adresse bestätigen. Eine neue Bestätigungs-E-Mail wurde an Ihren Posteingang geschickt. Bitte folgen Sie den Anweisungen in der E-Mail.',
  },
  'auth/user-disabled': { // 'Thrown if the user corresponding to the given action code has been disabled.'
    header: 'Benutzer wurde deaktiviert',
    message: 'Der Benutzer, der dem angegebenen Aktionscode entspricht, wurde deaktiviert. Bitte wenden Sie sich an den Helpdesk (E-Mail-Helpdesk).',
  },
  'auth/user-not-found': { // 'Thrown if the user is not found'
    header: 'Benutzer/E-Mail Adresse wird nicht gefunden',
    message: 'Benutzer wird nicht gefunden. Die E-Mail existiert nicht in unserer Datenbank. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut oder wenden Sie sich an den Helpdesk (E-Mail-Helpdesk).',
  },
  'auth/weak-password': { // 'Thrown if the new password is not strong enough',
    header: 'Das zur Registrierung verwendete Passwort ist nicht stark genug',
    message: 'Das eingegebene Passwort ist nicht stark genug. Tip: Um Ihr Passwort stärker zu machen, verwenden Sie Groß- und Kleinbuchstaben, Zahlen und Symbole wie ! ” ? $ % ^ & ).',
  },
  'auth/wrong-password': { // 'Thrown if the password is invalid for the given email',
    header: 'Ungültiges Passwort',
    message: 'Das Passwort ist für die angegebene E-Mail-Adresse ungültig. Versuchen Sie es erneut oder setzen Sie Ihr Passwort zurück.',
  },
};

export const defaultError = { // 'Thrown if the error code is unknown.'
  header: 'Unbekannter Fehler',
  message: 'Anfrage kann nicht erfüllt werden, da ein nicht identifizierter Fehler aufgetreten ist. Bitte wenden Sie sich an die IT-Administration (E-Mail-Admin).',
};

export const getFirebaseErrorMessageFromCode = (code) => {
  return errorCodes[code] || defaultError;
};

export const makeAPIErrorAlert = (apiError) => {
  return makeAlert(getFirebaseErrorMessageFromCode(apiError.code));
};
