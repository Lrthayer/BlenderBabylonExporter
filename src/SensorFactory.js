function SensorFactory() {
        this.createSensor = function (blenderObject, babylonObject, handler) {
						
			var sensor;
            var type = blenderObject.type;
			var actuators = blenderObject.setActuators;
			var tap = blenderObject.tap;
            if (type === "KEYBOARD") {
                sensor = new KeyboardSensor();
            } 
			else if (type === "ALWAYS") 
			{
                sensor = new AlwaysSensor();
            } 
			else if (type === "COLLISION") 
			{
                sensor = new CollisionSensor();
            }
			else if (type === "MOUSE")
			{
                sensor = new GenSensor();
            }
			else if (type == "MESSAGE")
			{
				sensor = new MessageSensor();
			}
			else if (type === "JOYSTICK")
			{
                sensor = new GenSensor();
            }
			else if (type === "RAY") 
			{
                sensor = new GenSensor();
            }
			else
			{
				sensor = new GenSensor();
			}

            sensor.type = type;
			sensor.active = blenderObject.active;

            sensor.start = function()
            {
				//only sense if sensor is active
				if (sensor.active)
				{
					this.sense(babylonObject, actuators, blenderObject, handler);
				}
            }
            return sensor;
        }
    }

    var KeyboardSensor = function()
    {
		
        this.sense = function(babylonObject, actuators, object, sceneForKey)
        {
            var key = object.key;
			var tap = object.tap;
			var inverted = object.invert;

			sceneForKey.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
			{
				if (keysDown[BlenderKeyConversion[object.key]])
				{
					//if tap is true only do this once regardless if key is still down
					if (tap)
					{
						if (tapped)
						{
							for (i=0; i < actuators.length; i++)
							{
								actuators[i].exec();
							}
							tapped = false;
						}

					}
				}
				else if (currentKey == null)
				{
					tapped = true;
					
					//if key not pressed and inverted then run sensor
					if (inverted)
					{
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec();
						}
					}
				}
				
			}));
        }
    }

    var CollisionSensor = function()
    {
		this.sense = function(babylonObject, actuators, object, scene)
        {
			var tap = object.tap;
			var inverted = object.invert;
			
			for (a=0; a < object.colliders.length; a++)
			{
				scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
				{
					if (babylonObject.intersectsMesh(object.colliders[a-1], false))
					{

						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec(object.colliders[a-1]);
						}
					}
					else
					{
						if (inverted)
						{
							for (i=0; i < actuators.length; i++)
							{
								actuators[i].exec(object.colliders[a-1]);
							}
						}
					}
					
				}));
			}
			if (object.colliders.length == 0)
			{
				if (inverted)
				{
					scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
					{
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec(object.colliders[a-1]);
						}
					}));						
				}
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
	
	var MessageSensor = function()
	{
		 this.sense = function(babylonObject, actuators, object, scene)
        {
				scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
				{
					if (typeof babylonObject.readFromMessage != 'undefined')
					{
						if(babylonObject.readFromMessage.subject == object.subject || object.subject == "")
						{
							for (i=0; i < actuators.length; i++)
							{
								actuators[i].exec();
							}
						}
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
				
			//}));
        }
	}
