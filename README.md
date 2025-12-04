# Adder: To-Do Lissst

## Description

This is a to-do app! Use this to track your chores, homework, etc. It's not just any other to-do app - we have added features so you can store your tasks in their relevant folders, plus a task archive!

## Deployment Info

[Frontend](https://nice-glacier-0ec51b010.3.azurestaticapps.net/) </br>
[Backend](adder-backend.azurewebsites.net)

## UI Prototype (12/02/2025)

(https://www.figma.com/design/XcBx6SbkDTE6RphCEUn38E/Adder?node-id=0-1&t=Uk4U2qqAMdy2cWEr-1)

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

## Testing

```bash
npm test
npm run test:coverage  #testing with coverage
```
