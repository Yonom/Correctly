# praxisprojekt

Contains the source code for the frontend and backend of the project (excluding the database).

## Links

- Website: https://praxisprojekt.cf/
- API Documentation: https://docs.praxisprojekt.cf/apiSpec/

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