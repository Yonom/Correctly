# praxisprojekt

Contains the source code for the frontend and backend of the project (excluding the database).

## Links

- Website: https://praxisprojekt.cf/
- API Documentation: https://docs.praxisprojekt.cf/apiSpec/
- Diagrams:
  - Authentication: https://docs.praxisprojekt.cf/diagrams/auth.html
- Getting Started: https://confluence.praxisprojekt.cf/display/TEC/Liste+der+Tutorials

## Contributing

- Install Node.js
- Install the [VS Code ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- Copy [key.json](https://confluence.praxisprojekt.cf/display/TEC/key.json) into the `.keys` folder
- Run `npm run dev`


### Repository Structure

- `.github`: CI for ESLint
- `.keys`: Tools and data regarding API keys and other secrets
- `.vscode`: VS Code settings
- `public`: Static files
- `src`: Source code
- `src/components`: React Components
- `src/pages`: Next.JS Pages
- `src/pages/api`: Next.JS API Endpoints
- `src/services`: Services used by the client
- `src/services/api`: Services used by the server
- `src/utils`: Utility files used by the client
- `src/utils/api`: Utility files used by the server

## How To?

### Basics

[List of Tutorials](https://confluence.praxisprojekt.cf/display/TEC/Liste+der+Tutorials)

### Run ESLint

```js
npm run lint
```

Let ESLint automatically try to fix all errors by running

```js
npm run fix
```

## How To? (Frontend)

### Make Page

Add a file in the `/src/pages` folder (but outside the `/src/pages/api` folder).
It is a good idea to use our AppPage component to ensure consistency in layout across pages.

```js
import AppPage from '../components/AppPage';

export default () => {
  return (
    <AppPage title="my title" footer="my footer">
      content goes here...
    </AppPage>
  );
};
```

### Make Component

Split your UI into components. This improves performance and readability of your code.
Use a component when you show the same thing in multiple places on the same page or across different pages.

**Note:** Leave business logic outside of components. A component should only be concerned with presenting data.

Add a file in the `/src/components` folder.

**CoolButton.js**
```js
import { IonButton } from '@ionic/react';

export default ({ onClick, children }) => {
  return (
    <IonButton onClick={onClick} style={{ backgroundColor: 'lightblue' }}>{children}</IonButton>
  );
};
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
export default ({ name, color }) => { // use like <YourComponent name="bob" color="pink" />
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

export default ({ children }) => {
  return (
    <IonButton className={styles.coolButton}>{children}</IonButton>
  );
};
```

More info: https://github.com/css-modules/css-modules

### Ionic

Check out the [Ionic Components Documentation](https://ionicframework.com/docs/components) and select the right component for the job.

Example of a button:
```js
import { IonButton } from '@ionic/react';

export default () => {
  const clickHandler = () => {
    // Button was clicked, do something!
  };

  return (
    <IonButton onClick={clickHandler}>Click me!!!</IonButton>
  );
};
```

**Not supported components:**  
IonTab (but you can use IonTabBar), IonVirtualScroll, IonRouter


### Ionic Grid System

Ionic Grid Documentation: https://ionicframework.com/docs/layout/grid
TODO

### Show Alert

```js
import { makeAlert } from '../../components/GlobalNotifications';

await makeAlert({
  header: 'Woah!',
  message: 'I am an alert.',
});
```

For a list of supported properties, see: https://ionicframework.com/docs/api/alert

### Show Toast

```js
import { makeToast } from '../../components/GlobalNotifications';

await makeToast({
  message: 'Hey there! 👋',
});
```

For a list of supported properties, see: https://ionicframework.com/docs/api/toast
