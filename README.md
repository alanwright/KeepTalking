# Keep Talking Helper
A very simple SPA running on AngularJS to aid in module solving for the game Keep Talking and Nobody Explodes.

## Demo
[Github Pages](http://alanwright.github.io/KeepTalking)

## Supported Modules
1. Complicated wires
2. Passwords

## TODO
1. Move to TypeScript - The project is getting large enough that it would really benefit from being in TypeScript.
2. Add UT functionality for all the benefits that come with UTs :) as well as making it easier for others to contribute.
3. Move reset buttons to a custom directive.

## Contributing
### Adding new module
Please use the ng-switch in the index.html to add new modules - follow the pattern I established there by adding a new module enum. Each module should have its own directive.

### Tests
Coming soon (after the move to TypeScript)

### Install to run Locally
1. Fork the code
2. Install npm
3. Install nodejs
4. From command line run:
`http-server -o`