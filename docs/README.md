<p align="center">
  <a href="https://praxisprojekt.cf/"><img src="https://i.imgur.com/ublWou7.png" width=600></a>
  <br>
  <b>frontend & backend</b> |
  <a href="https://github.com/Yonom/praxisprojekt-database">database</a> |
  <a href="https://github.com/Yonom/praxisprojekt-devops">devops</a> |
  <a href="https://github.com/Yonom/praxisprojekt-env">env</a>
</p>

## Quickstart

- Install the [necessary software](https://confluence.praxisprojekt.cf/display/TEC/Entwicklungsumgebung+einrichten)
- Setup [key.json](https://confluence.praxisprojekt.cf/display/TEC/Tutorial-Videos)
- Run `npm run dev`

## Tutorials

- [Tutorial Videos](https://confluence.praxisprojekt.cf/display/TEC/Tutorial-Videos)
- [Getting Started](https://confluence.praxisprojekt.cf/display/TEC/Liste+der+Tutorials)
- [Using Postman](https://confluence.praxisprojekt.cf/display/TEC/Postman)

## How To?

### Table of Contents

- [Repository Structure](#repository-structure)
- [Run ESLint](#run-eslint)
- Frontend
  * [Name Things](#name-things)
  * [Make Page](#make-page)
  * [Make Component](#make-component)
  * [Add CSS](#add-css)
  * [Ionic](#ionic)
  * [Ionic Grid System](#ionic-grid-system)
  * [Add Image](#add-image)
  * [Add Form](#add-form)
  * [Show Alert](#show-alert)
  * [Show Toast](#show-toast)
  * [Make API Call](#make-api-call)
- Backend
  * [Make GET API](#make-get-api)
  * [Make POST API](#make-post-api)
  * [Use Request Method](#use-request-method)
  * [Use Authentication](#use-authentication)
  * [Query Database](#query-database)


## Repository Structure
- `public`: Static files
- `src`: Source code
- `src/components`: React Components
- `src/pages`: Next.JS Pages
- `src/pages/api`: Next.JS API Endpoints
- `src/services`: Services used by the client
- `src/services/api`: Services used by the server
- `src/utils`: Utility files used by the client
- `src/utils/api`: Utility files used by the server

### Run ESLint

```js
npm run lint
```

Let ESLint automatically try to fix all errors by running

```js
npm run fix
```

## How To? (Frontend)

### Name Things

Avoid single letter names. Be descriptive with your naming. 

- **File names:**
  - **Everything under `/src/pages`:** lower-case-with-dashes
  - **Other:** Depending on the default export:
    - **Class/Component:** PascalCase
    - **Other/No default export:** camelCase
- **Identifiers:**
  - **Classes/Components:** PascalCase
  - **Functions/Parameters/Variables:** camelCase
  - **Database Tables/Columns:** camelCase

### Make Page

Add a file in the `/src/pages` folder (but outside the `/src/pages/api` folder).
It is a good idea to use our AppPage component to ensure consistency in layout across pages.

```js
import AppPage from '../components/AppPage';

const MyPage = () => {
  return (
    <AppPage title="my title" footer="my footer">
      content goes here...
    </AppPage>
  );
};

export default MyPage;
```

### Make Component

Split your UI into components. This improves performance and readability of your code.
Use a component when you show the same thing in multiple places on the same page or across different pages.

**Note:** Leave business logic outside of components. A component should only be concerned with presenting data.

Add a file in the `/src/components` folder.

**CoolButton.js**
```js
import { IonButton } from '@ionic/react';

const CoolButton = ({ onClick, children }) => {
  return (
    <IonButton onClick={onClick} style={{ backgroundColor: 'lightblue' }}>{children}</IonButton>
  );
};

export default CoolButton;
```

**Usage elsewhere:**
```js
import CoolButton from '../components/CoolButton';

// ... later in code
<CoolButton onClick={clickHandler}>Click me, I'm cool</CoolButton>
```

#### Properties

Declare which properties your component needs in the parameters of your function. Do not forget the `{}` around them!

```js
const YourComponent = ({ name, color }) => { // use like <YourComponent name="bob" color="pink" />
```

#### Children Property

`children` is a special property which contains the contents of your component.
See CoolButton example above.

### Add CSS

**Hold up!** You should be using Ionic Components and the Ionic Grid System (read about them in the next sections).

Still convinced that you need CSS? Ok then...

#### Inline styles
For simple one-line CSS, use inline styles.

```js
<IonButton style={{ backgroundColor: 'lightblue' }}>My Button</IonButton>
```

More info: https://www.w3schools.com/react/react_css.asp

#### CSS Modules
For more complex styling, use CSS modules.  

**Note:** You should ONLY use CSS classes inside modules.  
**Note:** Use camelCase in your class names here!  

**components/CoolButton.module.css**
```css
.coolButton {
  background-color: lightblue;
}
```

**components/CoolButton.js**
```js
import styles from './CoolButton.module.css';
import { IonButton } from '@ionic/react';

const CoolButton = ({ children }) => {
  return (
    <IonButton className={styles.coolButton}>{children}</IonButton>
  );
};

export default CoolButton;
```

More info: https://github.com/css-modules/css-modules

### Ionic

Check out the [Ionic Components Documentation](https://ionicframework.com/docs/components) and select the right component for the job.

Example of a button:
```js
import { IonButton } from '@ionic/react';

const MyPage = () => {
  const clickHandler = () => {
    // Button was clicked, do something!
  };

  return (
    <IonButton onClick={clickHandler}>Click me!!!</IonButton>
  );
};

export default MyPage;
```

**Not supported components:**  
IonTab (but you can use IonTabBar), IonVirtualScroll, IonRouter


### Ionic Grid System

Ionic Grid Documentation: https://ionicframework.com/docs/layout/grid
TODO

### Add Image

Images should be placed inside the `/public/img/` folder. 

```js
<IonImg src="/img/myimage.png" alt="Description of the image." />
```

More info: https://nextjs.org/docs/basic-features/static-file-serving

### Add Form

Use `react-hook-form` to create forms.

```js
import { useForm } from 'react-hook-form';
import IonController from '../components/IonController';
import { IonButton, IonInput } from '@ionic/react';

const MyPage = () => {
  const { control, handleSubmit } = useForm();
  const onSubmit = ({ firstItem, secondItem }) => {
    // submit button was clicked, do something
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <IonController type="text" as={IonInput} control={control} name="firstItem" />
      <IonController type="text" as={IonInput} control={control} name="secondItem" />
      <IonButton type="submit">Submit</IonButton>
    </form>
  );
};

export default MyPage;
```

#### IonController
`IonController` is our compatibility bridge between `react-hook-form` and `Ionic`.  
You must put each form field into its separate `IonController`!


**Example with IonInput:**
```js
// short form
<IonController type="text" as={IonInput} control={control} name="field1" />

// long form
<IonController control={control} name="field1" as={
  <IonInput type="text" as={IonInput} />
} />
```

**Example with IonRadioGroup:**
```js
<IonController control={control} name="manufacturers" as={
  <IonRadioGroup>
    <IonListHeader>
      <IonLabel>Manufacturers </IonLabel>
    </IonListHeader>
    <IonItem>
      <IonLabel>Apple</IonLabel>
      <IonRadio value="apple" />
    </IonItem>
    <IonItem>
      <IonLabel>Microsoft</IonLabel>
      <IonRadio value="microsoft" />
    </IonItem>
  </IonRadioGroup>
} />
```

#### IonFileButtonController

For uploading file, you need the specialized `IonFileButtonController`, as the `IonInput` and `react-hook-form` libraroes are both incompatible with file inputs.

Usage:
```js
import { IonFileButtonController } from '../components/IonController';
import { toBase64 } from '../utils/fileUtils';

const MyPage = () => {
  const { control, handleSubmit } = useForm();
  const onSubmit = async ({ myfile }) => {
    const myfileBase64 = myfile ? await toBase64(myfile) : null;
    // do something with the contents
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <IonFileButtonController control={control} name="myfile">Select file</IonFileButtonController>
      <IonButton type="submit">Submit</IonButton>
    </form>
  );
};

export default MyPage;
```

#### Input validation & errors

```js
import { useForm } from 'react-hook-form';
import IonController from '../components/IonController';
import { verifyEmail } from '../utils/auth/isValidEmail';
import { IonButton, IonInput } from '@ionic/react';

const MyPage =() => {
  const { control, handleSubmit, error } = useForm();

  return (
    <form>
      <IonController type="text" as={IonInput} control={control} name="firstItem" rules={{ required: true, maxLength: 50 }} />
      {errors.firstItem?.type === "required" && "Your input is required"}
      {errors.firstItem?.type === "maxLength" && "Your input exceed maxLength"}
      
      <IonController type="email" as={IonInput} control={control} name="email" rules={{ validate: verifyEmail }} />
      {errors.email && "Your email is invalid"}

      <IonButton type="submit">Submit</IonButton>
    </form>
  );
};

export default MyPage;
```

#### Dynamic UI Updates

Instead of waiting for the user to press `Submit`, you might want to update the UI as soon as the user types their input.  
Use the `watch` API for this purpose. 

```js
  const { control, watch } = useForm();
  const userInput = watch('userInput'); // this variable updates as the user types

  return (
    <form>
      <p>Your input is: {userInput}</p>
      <IonController type="text" as={IonInput} control={control} name="userInput" />
    </form>
  );
```

### Show Alert

```js
import { makeAlert } from '../components/GlobalNotifications';

await makeAlert({
  header: 'Woah!',
  message: 'I am an alert.',
});
```

For a list of supported properties, see: https://ionicframework.com/docs/api/alert

### Show Toast

```js
import { makeToast } from '../components/GlobalNotifications';

await makeToast({
  message: 'Hey there! 👋',
});
```

For a list of supported properties, see: https://ionicframework.com/docs/api/toast

### Make API Call

Use API calls to communicate with the server from the client.

#### GET Call

The SWR helper library helps you fetch data from the server.
Place code that facilitates interaction with external services in the `services` folder.

**services/userData.js**
```js
import useSWR from 'swr';

export const useUserData = (userId) => {
  return useSWR(`/api/getUserData?userId=${userId}`);
};
```

**Usage elsewhere:**
```js
import { useUserData } from '../services/userData';

const MyPage = () => {
  const { data, error } = useUserData('ABCD');
  if (error) return "failed to load";
  if (!data) return "loading...";
  return (data.message);
};

export default MyPage;
```

#### Show API Error (GET Call)

The helper function `useSWROnErrorAlert` shows an alert when an API fails to load.

```js
import { useOnErrorAlert } from '../utils/errors';
import { useUserData } from '../services/userData';

const MyPage = () => {
  const { data, error } = useOnErrorAlert(useUserdata('ABCD')); // automatically shows an alert on error
  if (error) return "failed to load";
  if (!data) return "loading...";
  return (data.message);
};

export default MyPage;
```

#### POST Call

Place code that facilitates interaction with external services in the `services` folder.

**services/userData.js**
```js
import fetchPost from '../utils/fetchPost';

export const updateUserData = async (userId, firstName, lastName) => {
  return await fetchPost('/api/updateUserData', {
    userId,
    firstName,
    lastName
  });
};
```

**Usage elsewhere:**
```js
import { updateUserData } from '../services/userData';

// later in code
const clickHandler = async () => {
  const { user } = await updateUserData(123, "Bob", "Smith");

  // do something with the updated user
};
```

#### Show API Error (POST Call)

The helper function `makeAPIErrorAlert` shows an alert if the API throws an error.

```js
import { makeAPIErrorAlert } from '../utils/errors';
import { updateUserData } from '../services/userData';

// later in code
const clickHandler = async () => {
  const user;
  try {
    { user } = await updateUserData(123, "Bob", "Smith");
  } catch (ex) {
    makeAPIErrorAlert(ex);
    return;
  }

  // do something with the updated user
};
```

## How To? (Backend)

### Make GET API

Add a file in the `/src/pages/api` folder.

**Example:**
```js
import handleRequestMethod from '../../utils/api/handleRequestMethod';

const doSomething = async (req, res) => {
  // make sure this is a GET call
  await handleRequestMethod(req, res, 'GET');

  // get parameters
  const { userId } = req.query;

  if (userId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  // empty json to confirm success
  return res.json({});
};

export default doSomething;
```

### Make POST API

Add a file in the `/src/pages/api` folder.

**Example:**
```js
import handleRequestMethod from '../../utils/api/handleRequestMethod';

const doSomething = async (req, res) => {
  // make sure this is a POST call
  await handleRequestMethod(req, res, 'POST');

  // get parameters
  const { userId, firstName, lastName } = req.body;

  if (userId == null) {
    // this is an error
    // use 4XX codes for user error and 5XX codes for server errors
    return res.status(400).json({ code: 'auth/no-user-id' });
  }

  // empty json to confirm success
  return res.json({});
};

export default doSomething;
```

#### Error Codes

User the format `<area>/<error-name>` for your error codes.  
The `utils/error.js` file translates these errors to user readable error messages.

Throw an error in the server like this:
```js
return res.status(400).json({ code: 'myarea/some-error' });
```

### Use Request Method

With the help of `handleRequestMethod`, you can make sure that your API is only called with a given method (either POST or GET).

**Usage example:**
```js
import handleRequestMethod from '../../utils/api/handleRequestMethod';

const doSomething = async (req, res) => {
  await handleRequestMethod(req, res, 'POST');
  // rest of your code
};

export default doSomething;
```

### Use Authentication

With the help of `authMiddleware`, you can be sure that your API is only called with authenticated users.

**Usage example:**
```js
import handleRequestMethod from '../../utils/api/handleRequestMethod';
import authMiddleware from '../../utils/api/auth/authMiddleware';
import { verifyEmployee } from '../../utils/auth/api/role';

const myAPI = async (req, res, { userId, role }) => {
  await handleRequestMethod(req, res, 'GET');

  // userId and role are available here

  // verify user request
  try {
    verifyEmployee(role);
  } catch ({ code }) {
    return res.status(400).json({ code });
  }
};

export default authMiddleware(myAPI);
```

### Query Database

Database functionality is provided through helper function in `/src/utils/api/database/` folder.  
These are organized based on the functionality of the application.  
You may call these functions from the backend code.

**Example helper function:**
```js
import { databaseQuery } from '.';

export function getEmailFromUser(userId) {
  const queryText = 'SELECT email FROM users WHERE userId = $1';
  const params = [userId];
  return databaseQuery(queryText, params);
}
```

#### Database Transaction

Use `databaseTransaction` to run multiple SQL statements in a transaction.

```js
import { databaseTransaction } from '.';

export function getEmailFromUser(userId) {
  return databaseTransaction(async client => {
    const queryText = '<TRANSACTIONAL SQL HERE>';
    const params = [userId];
    client.databaseQuery(queryText1, params);
  });
}
```
