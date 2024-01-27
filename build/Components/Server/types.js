"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMethods = exports.ServerMethods = void 0;
var ServerMethods;
(function (ServerMethods) {
    ServerMethods["REPORT_SURROUNDING_OBJECTS"] = "report-surrounding-objects";
    ServerMethods["REPORT_UNEXEPCTED_OBJECTS"] = "report-unexpected-objects";
})(ServerMethods || (exports.ServerMethods = ServerMethods = {}));
var ClientMethods;
(function (ClientMethods) {
    ClientMethods["EXECUTE_COMMAND"] = "execute-command";
    ClientMethods["STOP_CLIENT_EXECUTION"] = "stop-client-execution";
})(ClientMethods || (exports.ClientMethods = ClientMethods = {}));
//# sourceMappingURL=types.js.map