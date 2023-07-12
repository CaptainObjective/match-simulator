### How to run

1. Ensure you have NodeJs installed, I was using version v18.12.0 but any version compatible with NestJS v10 should work
2. Run `npm install` from app root
3. Run `npm start` to start the app
4. You can now emit events to `ws://localhost:3000/football-simulation`

To run test use `npm test`

### How to use
App responds to following events under namespace `football-simulation` (using socketIO standard):
- `start` - allows user to create new simulation, also subscribes user to created simulation
- `stop`- allows user to stop running simulation, 
- `subscribe` - allows user to listen for score-updates of particular simulation 
- `restart` - allows user to restart already finished simulation, also subscribes user to restarted simulation

App also emits `score-update` event for every running simulation to clients that are subscribed to given simulation

### About solution
Each module in the app belongs to one of three categories/type
- app - entrypoint to the application, main module
- feature - modules that are/will be responsible for implementing particular features
- shared - modules that are to be used by feature modules to abstract common infrastructure aspects (i.e: handling websockets)

In football-simulation modules basic data flow looks like this `gateways`->`services`->`domain`. Responsibility for gateways is to handle traffic coming through websocket port and handle exception. Service is responsible for orchestrating action of domain objects. Domain objects are responsible solely for handling business logic of simulations.