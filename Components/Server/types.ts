enum ServerMethods {
    REPORT_SURROUNDING_OBJECTS = "report-surrounding-objects",
    REPORT_UNEXEPCTED_OBJECTS = "report-unexpected-objects",
}

enum ClientMethods {
    EXECUTE_COMMAND = "execute-command",
    STOP_CLIENT_EXECUTION = "stop-client-execution"
}

export {
    ServerMethods,
    ClientMethods
}