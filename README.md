# CSC-307-To-Do-App

## Deployment Info

[Frontend](https://nice-glacier-0ec51b010.3.azurestaticapps.net/) </br>
[Backend](adder-backend.azurewebsites.net)

## Getting Started: Install Dependencies

```bash
cd packages/react-frontend
npm install
cd ../express-backend
npm install
```

_Installing Prettier and ESLint extensions for VS Code is recommended._

## Contributing: Code Styles

```json
{
  "trailingComma": "none",
  "semi": true,
  "singleQuote": false,
  "printWidth": 64
}
```

## Running

Two separate terminals are recommended:

```bash
# Terminal 1
cd packages/react-frontend
npm run dev   # runs on localhost:5173

# Terminal 2
cd packages/express-backend
npm run dev   # runs on localhost:8000
```
