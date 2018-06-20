# Passport

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Build Angular code
Run `ng build` Note: If you have note yet done so, run `npm install` to pull down all needed dependencies.

## Development server (Angular)

Run `ng serve` for a dev server. This will pull down all dependencies listed in package.json, and launch the Angular Dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Node Server
Run `npm api-server`. This will start the Node server via node-ts. As the server code was written using TypeScript.

## Apache or other Web server deployment
Ensure you have Node and MongoDB installed. Move contents of your dist folder to your public folder (for serving files). Create another folder to hold the server folder. Next copy `node_modules\.bin` from your angular folder into the folder that contains your server folder. Ensure all file permissions are set as you need them to be for both server and Angular files. In order to run the Node server as a service, you can use something like Forever.js. Run `npm install -g forever@latest`, then from the folder that contains your server folder, run `forever start ./node_modules/.bin/ts-node ./server/server.ts`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. You can use the `--aot` flag for "Ahead of Time Compilation", but take note this has not been tested for use with this application.

## Tech. stack
MEAN Stack
MongoDB
Express
Node
Angular (version 6)


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
