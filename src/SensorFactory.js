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
			else if (type === "ACTUATOR")
			{
                sensor = new ActuatorSensor();
                console.log("wut");
            }
			else if (type === "PROPERTY") 
			{
                sensor = new PropertySensor();
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
					else 
					{
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec();
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
			var tapped = true;
			
			scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
			{
				for (a=0; a < object.colliders.length; a++)
				{
					//console.log(object.name);
					if (tap)
					{
						if (tapped)
						{
							if (babylonObject.intersectsMesh(object.colliders[a], false))
							{
								tapped = false;
								console.log('once');
								for (i=0; i < actuators.length; i++)
								{
									actuators[i].exec();
								}
							}
							else
							{
								tapped = true;
								if (inverted)
								{
									for (i=0; i < actuators.length; i++)
									{
										actuators[i].exec();
									}
								}
							}
						}
					}
					else
					{
						if (babylonObject.intersectsMesh(object.colliders[a], false))
						{
							for (i=0; i < actuators.length; i++)
							{
								actuators[i].exec();
							}
						}
					}
				
					
				}
			}));
			if (object.colliders.length == 0)
			{
				if (inverted)
				{
					scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
					{
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec(object.colliders[a]);
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
			var tap = object.tap;
			var inverted = object.invert;
			var tapped = true;
			//since this is an always sensor if inverted don't even set up event
			if (inverted)
			{
				//do nothing
			}
			else
			{
				sceneForKey.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
				{
					//if tapped just do once, don't worry about reseting tabbed
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
					else
					{
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec();
						}
					}

					
				}));
			}

        }
    }
	
	var MessageSensor = function()
	{
		this.sense = function(babylonObject, actuators, object, scene)
        {
			var inverted = object.invert;
			
			//it seems message is auto tapped in blender, so find a way to only do this once per pulse
			scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
			{
				if (typeof babylonObject.readFromMessage != 'undefined')
				{
					if(babylonObject.readFromMessage.subject == object.subject || object.subject == "")
					{
						console.log();
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec();
						}
					}
					//else means inverted would run
					else
					{
						if (inverted)
						{
							for (i=0; i < actuators.length; i++)
							{
								actuators[i].exec();
							}
						}
					}
				}				
			}));
        }
	}
	
	var ActuatorSensor = function()
	{
		this.sense = function(babylonObject, actuators, object, sceneForKey)
        {
			for (i =0; i < actuators.length; i++)
			{
				//console.log(object.actuatorSense);
				if (object.actuatorSense == actuators[i].name)
				{
					for (j=0; j < actuators.length; j++)
					{
						actuators[i].exec();
					}
				}
			}
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
	
	var PropertySensor = function()
	{
		 this.sense = function(babylonObject, actuators, object, scene)
        {
			scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
			{
				for (i = 0; i < babylonObject.blender.properties.length; i++)
				{
					console.log(babylonObject.blender.properties[i].value);
					console.log(object.value);
					if (babylonObject.blender.properties[i].name == object.property)
					{
						console.log("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW" + babylonObject.blender.properties[i].value);
						console.log(object.value);
						//console.log(babylonObject.blender.properties[i].value);
						if (babylonObject.blender.properties[i].value == object.value)
						{
							console.log("WWWWWWWWWWWWWWWWWWWWWHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
							for (j=0; j < actuators.length; j++)
							{
								actuators[i].exec();
							}	
						}
					}
				}
			}));
        }
	}