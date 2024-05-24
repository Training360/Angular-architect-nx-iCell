# Angular-architect-nx

Architect-level Angular course about Nx workspaces

## Base setup for Angular

`npx nx@latest init`
or
`npx create-nx-workspace@latest angular-monorepo --preset=angular-monorepo`

✔ Where should your workspace be created? · false

> NX Let's create a new workspace [https://nx.dev/getting-started/intro]

✔ Where would you like to create your workspace? · airfield
✔ Which stack do you want to use? · angular
✔ Integrated monorepo, or standalone project? · integrated
✔ Application name · airfield
✔ Which bundler would you like to use? · esbuild
✔ Default stylesheet format · scss
✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? · No

✔ Test runner to use for end to end (E2E) tests · playwright
✔ Enable distributed caching to make your CI faster · Yes

### Angular code generation

[code generation](https://nx.dev/angular-tutorial/1-code-generation)

### Graph

npx nx graph

### List all of commands

npx nx help
npx nx list @nx/angular

### CheetSheet

![CheetSheet](./CHEATSHEET.md)

### Serving

- npx nx serve --project <projectname>  
  or
- npx nx serve <projectname>

### Building

- npx nx build --project <projectname>  
  or
- npx nx build <projectname>

---

## Nx - Environment variables

- [Documentation](https://nx.dev/recipes/angular/use-environment-variables-in-angular)
- `npx nx@latest init` create a new Angular app as standalone with webpack builder
- Open the new project: `code airfield-env -r`
- Install @types/node for using process.env variables

```shell
npm install -D @types/node
```

- Update [project.json](./airfield-env/project.json)

```json
{
  "build": {
    // NOTE: change the executor to one that supports custom webpack config.
    "executor": "@nx/angular:webpack-browser",
    // snip
    "options": {
      // NOTE: This file needs to be created.
      "customWebpackConfig": {
        "path": "apps/{projectName}/webpack.config.js"
      }
      // snip
    }
  },
  "serve": {
    // NOTE: use dev-server that supports custom webpack config.
    "executor": "@nx/angular:dev-server"
    // snip
  }
}
```

- Create [webpack.config.js](./airfield-env/webpack.config.js)

```javascript
const webpack = require("webpack");

function getClientEnvironment() {
  // Grab NX_* environment variables and prepare them to be injected
  // into the application via DefinePlugin in webpack configuration.
  const NX_APP = /^NX_/i;

  const raw = Object.keys(process.env)
    .filter((key) => NX_APP.test(key))
    .reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});

  // Stringify all values so we can feed into webpack DefinePlugin
  return {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
}

module.exports = (config, options, context) => {
  // Overwrite the mode set by Angular if the NODE_ENV is set
  config.mode = process.env.NODE_ENV || config.mode;
  config.plugins.push(new webpack.DefinePlugin(getClientEnvironment()));
  return config;
};
```

- Create [.env](./airfield-env/.env)

```env
NX_API_URL=http://localhost:3333
NX_API_HOST=localhost
```

- Update tsconfig.app.json and tsconfig.spec.json

```json
"types": ["node"]
```

- Get an environment variable

```typescript
console.log(">>> NX_API_URL", process.env["NX_API_URL"]);
console.log(">>> NX_API_HOST", process.env["NX_API_HOST"]);
```

- Generate a service:
- `npx nx g @nx/angular:service user --project=p-env`
- Use environment variables in the service. TADA
---

## Module Federation ------------------------>

### Create an empty workspace

npx create-nx-workspace@latest

- Settings:

```shell
✔ Where would you like to create your workspace? · nx-mf
✔ Which stack do you want to use? · none
✔ Package-based monorepo, integrated monorepo, or standalone project? · integrated
✔ Enable distributed caching to make your CI faster · Yes
```

### Install the framework specific plugin

- code nx-mf
- npm i -D @nx/angular

### Generating host and remote applications

- npx nx g @nx/angular:host store --ssr --remotes=product,checkout --directory apps

### Serving the store app

- `npx nx serve-ssr store` watching the store
- `npx nx serve-ssr store --devRemotes=checkout` watching the checkout too

- __Server ports are in the corresponding project.json file!__

### Dynamic Federation ----------------------------->

- npx create-nx-workspace ng-mf
- Setup:

```shell
Need to install the following packages:
create-nx-workspace@17.2.8
Ok to proceed? (y) y

 >  NX   Let's create a new workspace [https://nx.dev/getting-started/intro]

✔ Which stack do you want to use? · angular
✔ Integrated monorepo, or standalone project? · integrated
✔ Application name · angular-mf
✔ Which bundler would you like to use? · webpack
✔ Default stylesheet format · css
✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? · No

✔ Test runner to use for end to end (E2E) tests · none
✔ Enable distributed caching to make your CI faster · Yes
```

### Create the host end the remotes

- code angular-mf
- npx nx g @nx/angular:host dashboard
- Setup:

```shell
npx nx g @nx/angular:host dashboard

>  NX  Generating @nx/angular:host

✔ Which stylesheet format would you like to use? · css
✔ Which E2E test runner would you like to use? · none
✔ What should be the project name and where should it be generated? · dashboard @ dashboard
```

- Login app: `npx nx g @nx/angular:remote login --host=dashboard`
- Login app and module-federation.config.js files are created.
- Check:
  -- [login/module-federation.config.js](./angular-mf/login/module-federation.config.ts)
  -- [login/webpack.config.js](./angular-mf/login/webpack.config.ts)
  -- [dashboard/module-federation.config.js](./angular-mf/dashboard/module-federation.config.ts)
- Create a new Angular lib
- `npx nx g @nx/angular:lib shared/data-access-user`
- Create an Angular Service
- `npx nx g @nx/angular:service user --project=data-access-user`

```typescript
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class UserService {
  private isUserLoggedIn = new BehaviorSubject(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();
  checkCredentials(username: string, password: string) {
    if (username === "demo" && password === "demo") {
      this.isUserLoggedIn.next(true);
    }
  }
  logout() {
    this.isUserLoggedIn.next(false);
  }
}
```

- [index.ts](./angular-mf/shared/data-access-user/src/index.ts) add this:

```typescript
export * from "./lib/user.service";
```

### Login Application

- Update [entry.component.ts](./angular-mf/login/src/app/remote-entry/entry.component.ts)

```typescript
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UserService } from "shared/data-access-user/src/lib/user.service";
@Component({
  selector: "angular-mf-login-entry",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-app">
      <form class="login-form" (ngSubmit)="login()">
        <label>
          Username:
          <input type="text" name="username" [(ngModel)]="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" [(ngModel)]="password" />
        </label>
        <button type="submit">Login</button>
      </form>
      <div *ngIf="isLoggedIn$ | async">User is logged in!</div>
    </div>
  `,
  styles: [
    `
      .login-app {
        width: 30vw;
        border: 2px dashed black;
        padding: 8px;
        margin: 0 auto;
      }
      .login-form {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 0 auto;
        padding: 8px;
      }
      label {
        display: block;
      }
    `,
  ],
})
export class RemoteEntryComponent {
  username = "";
  password = "";
  isLoggedIn$ = this.userService.isUserLoggedIn$;
  constructor(private userService: UserService) {}
  login() {
    this.userService.checkCredentials(this.username, this.password);
  }
}
```

- Run dev server: `npx nx run login:serve`
- Test the login component: http://localhost:4201

### Dashboard Application

- IMPORTANT UPDATES [entry.component.ts](./angular-mf/login/src/app/remote-entry/entry.component.ts), [app.component.ts](./angular-mf/dashboard/src/app/app.component.ts):

```typescript
import { UserService } from "@angular-mf/data-access-user";
```

### Converting the Dashboard to dynamic loading

- Steps:
  - fetch the remote definitions
  - set the remote defs for Webpack
  - change loading method

* Add [module-federation.manifest.json](./angular-mf/dashboard/src/assets/module-federation.manifest.json)
```json
{
  "login": "http://localhost:4201"
}
```

* Update [main.ts](./angular-mf/dashboard/src/main.ts)

```typescript
import { setRemoteDefinitions } from "@nx/angular/mf";

fetch("/assets/module-federation.manifest.json")
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import("./bootstrap").catch((err) => console.error(err)));
```

- Update [module-federation.config.ts](./angular-mf/dashboard/module-federation.config.ts)

```typescript
module.exports = {
  name: "dashboard",
  remotes: [],
};
```

- Update [app.routes.ts](./angular-mf/dashboard/src/app/app.routes.ts)

```typescript
{
    path: 'login',
    loadChildren: () =>
      loadRemoteModule('login', './Routes').then((m) => m.remoteRoutes),
  },
```
- Run: `npx nx serve dashboard --devRemotes=login`

- Watch the service from the dashboard:
```typescript
import { UserService } from "@p-df/shared/data-access-user";
// ...
userService = inject(UserService);
isLoggedIn$ = this.userService.isUserLoggedIn$;
```
- app.component.html:

```html
@if (isLoggedIn$ | async) {
  <h2>User is logged in</h2>
}
```

## Conclusion

- Angular module federation is hard, but it's fun!
