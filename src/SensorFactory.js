function SensorFactory() {
        this.createSensor = function (blenderObject, babylonObject) {
            var sensor;
            type = blenderObject.type;

            if (type === "KEYBOARD") {
                sensor = new KeyboardSensor();
            } else if (type === "ALWAYS") {
                sensor = new AlwaysSensor();
            } else if (type === "COLLISION") {
                sensor = new CollisionSensor();
            }else if (type === "MOUSE") {
                sensor = new CollisionSensor();
            }else if (type === "JOYSTICK") {
                sensor = new CollisionSensor();
            }else if (type === "RAY") {
                sensor = new CollisionSensor();
            }

            sensor.type = type;

            sensor.say = function () {
                this.sense(blenderObject, babylonObject);
            }
            return sensor;
        }
    }

    var KeyboardSensor = function(object)
    {
        this.sense = function(object, babylonObject)
        {

            if (keysDown[BlenderKeyConversion[object.key]])
            {
                console.log("step 1");
                //go through controllers
                for (i=0; i < object.controllers.length; i++)
                {
                    //if active continue to actuator
                    if (object.controllers[i].active)
                    {
                        //go through actuators
                        for (j=0; j < object.controllers[i].actuators.length; j++)
                        {
                            //if actuator is MOTION apply motion
                            if (object.controllers[i].actuators[j].type == "MOTION")
                            {
                                console.log(babylonObject.name);
                                console.log();
                                babylonObject.position.x = babylonObject.position.x + object.controllers[i].actuators[j].offsetLocation[0];
                                babylonObject.position.y = babylonObject.position.y + object.controllers[i].actuators[j].offsetLocation[1];
                                babylonObject.position.z = babylonObject.position.x + object.controllers[i].actuators[j].offsetLocation[2];
                            }
                        }
                    }
                }
            }
        }
    }

    var CollisionSensor = function(object)
    {
        this.sense = function(object)
        {
            if (keysDown[("K_" + object.key)])
            {
                console.log("step 1");
            }
        }
    }
    var AlwaysSensor = function(object)
    {
        this.sense = function(object)
        {
            if (keysDown[("K_" + object.key)])
            {
                console.log("step 1");
            }
        }
    }