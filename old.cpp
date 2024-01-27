// simple_cpp_service_server.cpp
#include "ros/ros.h"
#include "simple_cpp_service/SimpleService.h"
#include <bits/stdc++.h>
using namespace std;
vector<double> findBin(simple_cpp_service::SimpleService::Request &req)
{
    // 1=trash,2=wall,3=bin,-1=obstacle,0=nothing

    ROS_INFO("hello");
    vector<double> output = {};

    // Invalidate input, if arguments of req are not equal in length
    set<int> size;
    size.insert(req.angle.size());
    size.insert(req.clock.size());
    size.insert(req.trash.size());
    size.insert(req.distance.size());
    if (size.size() != 1)
    {
        output.push_back(-1.0);
        return output;
    }

    // checking if an req.angle is bigger than 90 degrees
    for (int i = 0; i < req.angle.size(); i++)
    {
        if (req.angle[i] > 90.0)
        {
            req.angle.erase(req.angle.begin() + i);
            req.clock.erase(req.clock.begin() + i);
            req.trash.erase(req.trash.begin() + i);
            req.distance.erase(req.distance.begin() + i);
        }
    }

    // checking of the we have a wall or a bin among the req.trashs detected.
    bool wall = false;
    bool bin = false;
    if (find(req.trash.begin(), req.trash.end(), 2) != req.trash.end())
    {
        wall = true;
    }

    if (find(req.trash.begin(), req.trash.end(), 3) != req.trash.end())
    {
        bin = true;
    }

    // movement if there is no bin or walls, just trash and obstacles.
    if (!bin && !wall)
    {
        double maxDistance = 0;
        for (int i = 0; i < req.distance.size(); i++)
        {
            maxDistance = max(maxDistance, req.distance[i]);
        }

        auto i = find(req.distance.begin(), req.distance.end(), maxDistance);
        int index = distance(req.distance.begin(), i);
        double stopDistance = maxDistance * (5 / 100.0);
        double newDistance = maxDistance - stopDistance;
        output.push_back(req.clock[index]);
        output.push_back(req.angle[index]);
        output.push_back(newDistance);
    }

    // movement if there is a bin detected.
    if (bin)
    {
        auto i = find(req.trash.begin(), req.trash.end(), 3);
        int binIndex = distance(req.trash.begin(), i);
        double stopDistance = req.distance[binIndex] * (5 / 100.0);
        double newDistance = req.distance[binIndex] - stopDistance;
        output.push_back(req.clock[binIndex]);
        output.push_back(req.angle[binIndex]);
        output.push_back(newDistance);
    }

    // movement if there is a wall detected while the bin is not found.
    if (!bin && wall)
    {
        double minDistanceWall = DBL_MAX;
        for (int ind = 0; ind < req.distance.size(); ind++)
        {
            if (req.trash[ind] == 2)
            {
                minDistanceWall = min(minDistanceWall, req.distance[ind]);
            }
        }
        auto i = find(req.distance.begin(), req.distance.end(), minDistanceWall);
        int wallIndex = distance(req.distance.begin(), i);
        double stopDistance = req.distance[wallIndex] * (5.0 / 100.0);
        double newDistance = req.distance[wallIndex] - stopDistance;
        output.push_back(req.clock[wallIndex]);
        output.push_back(req.angle[wallIndex]);
        output.push_back(newDistance);
    }

    return output;
}

bool handleStep1(simple_cpp_service::SimpleService::Request &req, simple_cpp_service::SimpleService::Response &res)
{

    for (size_t i = 0; i < req.angle.size(); i++)
    {
        ROS_INFO("angle[%d] = %f", i, req.angle[i]);
        ROS_INFO("clock[%d] = %s", i, req.clock[i] ? "True" : "False");
        ROS_INFO("trash[%d] = %s", i, req.trash[i] ? "True" : "False");
        ROS_INFO("distance[%d] = %f", i, req.distance[i]);
    }

    // Process the request and populate the response (dummy response in this example)
    res.output = findBin(req);
    res.success = true;
    res.message = "it worked";

    return true;
}

bool handleStep2(simple_cpp_service::SimpleService::Request &req, simple_cpp_service::SimpleService::Response &res)
{
    
    return true;
}

int main(int argc, char **argv)
{
    ros::init(argc, argv, "simple_cpp_service");
    ros::NodeHandle nh;

    ros::ServiceServer step1 = nh.advertiseService("simple_cpp_service/step1", handleStep1);
    ros::ServiceServer step2 = nh.advertiseService("simple_cpp_service/step2", handleStep2);
    ROS_INFO("Ready to handle service requests.");

    ros::spin();

    return 0;
}
