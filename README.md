# Create your own Monorepo
Code for the [Youtube video](https://youtu.be/pz4f9Q6VYZA) on how to create your own Monorepo using PNPM workspace, React, Vue, Node, Eslint, Prettier and Typescript

## The commands and code used throughout the video:

```sh
npm install -g pnpm
```

```sh
pnpm init
```

```sh
git init
```

### Setup Prettier

```sh
pnpm add -D prettier
```

Create **.prettierignore** with the below contents:

```
coverage
public
dist
pnpm-lock.yaml
pnpm-workspace.yaml
```

Create **.prettierrc** with the below contents:

```js
{
  "semi": true,
  "singleQuote": true
}
```

### Setup VSCODE

Create workspace settings:

```sh
mkdir .vscode && touch .vscode/settings.json
```

Add below contents inside settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Setup ESLint

```sh
pnpm create @eslint/config
```

Create **.eslintignore** with the below contents:

```
coverage
public
dist
pnpm-lock.yaml
pnpm-workspace.yaml
```

### Integrating ESLint with Prettier

Add below plugins so that both Prettier and Eslint can do both of their jobs without getting in ecah other ways

```sh
pnpm add -D eslint-config-prettier eslint-plugin-prettier
```

```js
module.exports = {
  extends: [..., 'plugin:prettier/recommended'],
}
```

```sh
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.format="prettier --write ."
```

### Pre-commit hooks

```sh
pnpm add --save-dev husky lint-staged
pnpm exec husky install
npm pkg set scripts.prepare="husky install"
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"
```

```json
"lint-staged": {
    "**/*.{js,ts,tsx}": [
      "eslint --fix"
    ],
    "**/*": "prettier --write --ignore-unknown"
  }
```

### Setup workspace

```sh
touch pnpm-workspace.yaml
```

```yml
packages:
  - 'apps/*'
  - 'libs/*'
```

```sh
mkdir apps libs
```

### Setup common package - utils

```sh
pnpm create vite utils --template vanilla-ts
cd utils/
pnpm install
npm pkg set scripts.dev="pnpm run build --watch"
```

Remove unnecessary files

And add below contents in **main.ts** file

```js
export const isEmpty = (data: unknown) => {
if (data === null || data === undefined) {
return 'It is Empty';
}
return 'It is not Empty';
};
```

#### Setup Vite Library Mode

Add below package to create type definitions from the library

```sh
pnpm add -D vite-plugin-dts
```

Create **vite.config.ts** file and add below contents in it

```js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: { lib: { entry: resolve(__dirname, 'src/main.ts'), name: 'utils' } },
  plugins: [dts()],
});
```

Update **utils** **package.json** to have

```json
{...,
  "main": "./dist/utils.umd.cjs",
  "module": "./dist/utils.js",
  "types": "./dist/main.d.ts",
}
```

### Setup Backend

Create a **backend** package using below commands

```sh
cd apps/
mkdir backend
cd backend
pnpm init
npm pkg set type="module"
```

Create **tsconfig.json** with below contents in it

```json
{
  "compilerOptions": {
    "module": "ES2020",
    "moduleResolution": "Node",
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "dist",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["src/**/*"]
}
```

Create **nodemon.json** with below contents in it

```json
{
  "execMap": {
    "ts": "ts-node-esm"
  }
}
```

Since our **backend** will use the **utils** library, hence update **package.json** **dependencies** with

```sh
"utils": "workspace:*"
```

and run

```sh
pnpm install
```

so that our **backend** can symlink the **utils** package present in the workspace

Create an **app.ts** file in **src** directory and add below contents in it

```js
import express from 'express';
import cors from 'cors';
import utils from 'utils';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: utils.isEmpty({}) });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
```

Create **vue-frontend** and **react-frontend** using below commands and repeat the process to add **utils** as a dependency to both of them

```sh
pnpm create vite vue-frontend --template vue-ts
cd vue-frontend
pnpm install
```

```sh
pnpm create vite react-frontend --template react-ts
cd react-frontend
pnpm install

```

Now to use the **utils** library in React, update **src/App.ts** with below contents

```js
import { isEmpty } from 'utils';
...
...
useEffect(() => {
  fetch('http://localhost:5000')
    .then((res) => res.json())
    .then((msg) => console.log({ msg }));
}, []);
....
....
return(
...
<pre>{isEmpty('abc')}</pre>
<pre>{isEmpty(null)}</pre>
</>
)
```

And similarly for Vue, update **src/App.vue** with below contents

```js
import { onMounted } from 'vue';
import { isEmpty } from 'utils';
...
...
onMounted(() => {
  fetch('http://localhost:5000')
    .then((data) => data.json())
    .then((data) => console.log(data));
});
....
....
<template>
...
...
<pre>{isEmpty({})}</pre>
<pre>{isEmpty(null)}</pre>
</template>

```

If you are facing any issue related to eslint prettier integration while committing code then run below command

```sh
pnpm add -D eslint-plugin-prettier -w
```
