npm install -g pnpm

pnpm init

git init

pnpm add -D prettier

Create .prettierignore
coverage
public
dist
pnpm-lock.yaml
pnpm-workspace.yaml

Create.prettierrc

```
{
  "semi": true,
  "singleQuote": true
}
```

VSCODE extension
mkdir .vscode && touch .vscode/settings.json

```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

pnpm create @eslint/config

pnpm add -D eslint-config-prettier eslint-plugin-prettier

```
module.exports = {
  extends: [..., 'plugin:prettier/recommended'],
}
```

```
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.format="prettier --write ."

pnpm add --save-dev husky lint-staged
pnpm exec husky install
npm pkg set scripts.prepare="husky install"
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"
```

```
"lint-staged": {
    "**/*.{js,ts,tsx}": [
      "eslint --fix"
    ],
    "**/*": "prettier --write --ignore-unknown"
  }
```

touch pnpm-workspace.yaml

```
packages:
  - 'apps/*'
  - 'libs/*'
```

```
mkdir apps libs
```

```
pnpm create vite utils
pnpm install

dev:"pnpm run build --watch" (so that any change in the code will rebuild automatically and reflect in the 'web-app' in real-time.)

pnpm add -D vite-plugin-dts

import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: { lib: { entry: resolve(__dirname, 'src/main.ts'), name:'utils' } },
  plugins: [dts()],
})

//main.ts
export const isEmpty = (data: unknown) => {
  if (data === null || data === undefined) {
    return 'It is Empty';
  }
  return 'It is not Empty';
};

//tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

```
npm install -g typescript

cd apps && mkdir backend
tsc --init

//tsconfig.json
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

// nodemon.json
{
  "execMap": {
    "ts": "ts-node-esm"
  }
}

"utils": "workspace:*"

// app.ts
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

```
// Vue and React
 "utils": "workspace:*"

// React
import { isEmpty } from 'utils';

  useEffect(() => {
    fetch('http://localhost:5000')
      .then((res) => res.json())
      .then((msg) => console.log({ msg }));
  }, []);


// Vue
import { isEmpty } from 'utils';

onMounted(() => {
  fetch('http://localhost:5000')
    .then((res) => res.json())
    .then((msg) => console.log({ msg }));
});

<pre>{isEmpty({})}</pre>
<pre>{isEmpty(null)}</pre>


```

pnpm add -D eslint-plugin-prettier -w
