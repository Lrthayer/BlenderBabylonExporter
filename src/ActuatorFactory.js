function ActuatorFactory() {
        this.createActuator = function (blenderObject, babylonObject) {
			var actuator;
            type = blenderObject.type;
			
            if (type === "MOTION") {
                actuator = new MotionActuator();
            } else if (type === "VISIBILITY") {
                actuator = new VisibilityActuator();
			}
            actuator.type = type;

            actuator.say = function () {
                this.act(blenderObject, babylonObject);
            }
            return actuator;
        }
    }

    var MotionActuator = function()
    {
        this.act = function(object, babylonObject)
        {
			//console.log(object);
           //apply offset (if none exists it should work regardless)
		   console.log(object.offsetLocation[1]);
		   console.log(object.offsetLocation[0]);
		   console.log(object.offsetLocation[2]);
			babylonObject.position.x = babylonObject.position.x + object.offsetLocation[0];
			babylonObject.position.y = babylonObject.position.y + object.offsetLocation[2];
			babylonObject.position.z = babylonObject.position.z + object.offsetLocation[1];
        }
    }

    var VisibilityActuator = function()
    {
        this.act = function(object, babylonObject)
        {
			babylonObject.visibility = false;
			console.log(babylonObject.visibility);
        }
    }
