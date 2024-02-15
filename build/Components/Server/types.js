"use strict";
// // MethodName is event emitted from server to client
// // MethodReply is event emitted from client to server
// [
//   {
//     methodName: "",
//     methodReply: "register-robot-view",
//     description: `Register robot view to server, aka the items you are seeing infront of you`,
//     input: [
//       {
//         angle: 0, // 0-360 degrees, impossible to be more than 180. But just in case
//         distance: 1, // In cm (ultrasonic sensor reading)
//         type: ItemsTypes.Trash, // (String) enum of [Trash,Wall,Bin,Obstacle,Unknown] or 1,2,3,4,5 respectively
//         size: ItemSize.SMALL, // (String) enum of [SMALL,MEDIUM,LARGE] (Hard code it for now) to all items
//       },
//       {},
//       // ....
//     ],
//   },
//   {
//     methodName: "rotate-robot",
//     methodReply: "robot-rotated",
//     description: `
//       Do not store any previous state just rotate as the server say
//       For example if robot says rotate 180 just do it always clockwise
//       More info: if 90 then just do motor.run(90) or whatever`,
//     input: {
//       angle: 90, // 0-360 degrees
//     },
//   },
//   {
//     methodName: "move-robot",
//     methodReply: "robot-moved",
//     description: `Just drive in the current direction for x distance`,
//     input: {
//       distance: 10, // distance is in CM
//     },
//   },
//   {
//     methodName: "stop-robot",
//     methodReply: "robot-stopped",
//     description: `Stop the robot immedietly from all executions, including drop, pickup, rotate, move`,
//     input: {},
//   },
//   {
//     methodName: "",
//     methodReply: "register-unexpected-movement",
//     description: `Register unexpected movement of the robot, aka the robot hasd to move independently from the server`,
//     input: {
//       distance: 10,
//     },
//   },
//   {
//     methodName: "pickup-item",
//     methodReply: "item-pickedup",
//     description: `Pickup the item that is infront of you (If you have to move the robot to pickup the item, then register that movement as well)`,
//     input: {},
//   },
// ];
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMethods = exports.ServerMethods = void 0;
var ServerMethods;
(function (ServerMethods) {
    ServerMethods["REPORT_SURROUNDING_OBJECTS"] = "scan_mode";
    ServerMethods["REPORT_UNEXEPCTED_OBJECTS"] = "report-unexpected-objects";
    ServerMethods["PICKUP_ITEM"] = "pickup-item";
    ServerMethods["MOVE_ROBOT"] = "move_robot";
    ServerMethods["ROTATE_ROBOT"] = "rotate_robot";
})(ServerMethods || (exports.ServerMethods = ServerMethods = {}));
var ClientMethods;
(function (ClientMethods) {
    ClientMethods["READY"] = "ready";
    ClientMethods["EXECUTE_COMMAND"] = "execute-command";
    ClientMethods["STOP_CLIENT_EXECUTION"] = "stop-client-execution";
    ClientMethods["ITEM_PICKEDUP"] = "item-pickedup";
    ClientMethods["REGISTER_UNEXPECTED_MOVEMENT"] = "register-unexpected-movement";
    ClientMethods["TEST_ROBOT_MOVEMENT"] = "test-robot-movement";
    ClientMethods["ROBOT_MOVED"] = "robot_moved";
    ClientMethods["ROBOT_ROTATED"] = "robot_rotated";
    ClientMethods["REGISTER_VIEW_OBJECTS"] = "register-view-objects";
})(ClientMethods || (exports.ClientMethods = ClientMethods = {}));
//# sourceMappingURL=types.js.map