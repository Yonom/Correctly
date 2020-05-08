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
- `src/utils/api`: Utility files used by the server- `src/utils/api`: Utility files used by the server

## How To?

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
=======
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
