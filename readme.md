This cpp service is responsible for robot path planning, it handles the state and
commands the robot to move where

The robot will send what it sees right now around it
The service will save a state of the whole map
The service will send back what the robot should do

#1
**Input of the path planning**
The robot will provide what he can see infront of him as an array of objects.
{
    angleOfObject,
    counterClockWiseOfObject,
    trashType,
}
