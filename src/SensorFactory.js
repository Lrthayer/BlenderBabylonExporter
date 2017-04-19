function SensorFactory() {
        this.createSensor = function (blenderObject, babylonObject, handler) {
						
			var sensor;
            type = blenderObject.type;
			actuators = blenderObject.setActuators;
			var actuators = blenderObject.setActuators;
            if (type === "KEYBOARD") {
                sensor = new KeyboardSensor();
            } else if (type === "ALWAYS") {
                sensor = new AlwaysSensor();
            } else if (type === "COLLISION") {
                sensor = new CollisionSensor();
            }else if (type === "MOUSE") {
                sensor = new GenSensor();
            }else if (type === "JOYSTICK") {
                sensor = new GenSensor();
            }else if (type === "RAY") {
                sensor = new GenSensor();
            }
			else{
				sensor = new GenSensor();
			}

            sensor.type = type;

            sensor.start = function()
            {
                this.sense(babylonObject, actuators, blenderObject, handler);
            }
            return sensor;
        }
    }

    var KeyboardSensor = function()
    {
		
        this.sense = function(babylonObject, actuators, object, sceneForKey)
        {
            //console.log(object.key);
            var key = object.key;
            //key = key.replace(/^\s+|\s+$/g,"");
			sceneForKey.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
			{
				if (keysDown[BlenderKeyConversion[object.key]])
				{					
					for (i=0; i < actuators.length; i++)
					{
						actuators[i].exec();
					}
				}
				
				
			}));
        }
    }

    var CollisionSensor = function()
    {
        this.sense = function(babylonObject, actuators, object, scene)
        {
			console.log(object.colliders[0]._boundingInfo);
			console.log(babylonObject._boundingInfo);
			console.log(object.colliders.length);
			for (a=0; a < object.colliders.length; a++)
			{
			    //console.log(object.colliders);
			    //console.log(object.colliders[0]);
				scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
				{
				    //console.log(a-1);
                   // console.log(object.colliders[a-1].name);
                    //console.log(babylonObject.name);
					if (babylonObject.intersectsMesh(object.colliders[a-1], false))
					{

						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec(object.colliders[a-1]);
						}
					}
					
				}));
			}
        }
    }
    var AlwaysSensor = function()
    {
        this.sense = function(babylonObject, actuators, object, sceneForKey)
        {
			sceneForKey.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
			{
		
				for (i=0; i < actuators.length; i++)
				{
					actuators[i].exec();
				}
				
			}));

        }
    }
	var GenSensor = function()
	{
		 this.sense = function(babylonObject, actuators, object, sceneForKey)
        {
			babylonObject.actionManager = new BABYLON.ActionManager(sceneForKey);
			//babylonObject.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnIntersectionEnterTrigger, function (evt)
			//{
				//console.log(evt);
				
			//}));
        }
	}
