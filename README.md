# Star Wars 5e
This application is my attempt at making a compendium/web tool for those utilizing my Star Wars 5e conversion. It is a simple web application with quite a few useful features, including a force-directed graph/map of the Star Wars universe, a carousing generator, a magic items/force ability/monster compendium and look-up tool, and a combat tracker.

## Installing
Simply download git repo, `cd` into it, and do an npm install:

```
npm install
```

## Running
You can run the application locally by doing one of the following:

### Multiple Servers
One way to run the application is with multiple servers (or on one computer with multiple terminal windows).

Terminal 1:
```
npm run start-client
```

Terminal 2:
```
npm start
```

### XAMMP
If you are using a tool like XAMMP to serve a folder, use these instructions. First, run the build tool packaged with the Angular CLI.

```
node_modules/@angular/cli/bin/ng build --prod
```

When you have completed this, you should see a folder titled `dist` in the main application folder. This folder should become your web app root. You should then run `npm start` and navigate to your XAMMP instance and it should be working fine!