function SensorFactory() 
{
	this.createSensor = function (blenderObject, babylonObject, scene) 
	{		
		var sensor;
		
		//get type so we know which sensor to create
		var type = blenderObject.type;
		
		//store the actuators from the blenderLogic for this sensor so we can pass it for our sense function
		var actuators = blenderObject.setActuators;
		
		//create senor based on blender Object's type
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
		else if (type == "MESSAGE")
		{
			sensor = new MessageSensor();
		}
		else if (type === "PROPERTY") 
		{
			sensor = new PropertySensor();
		}
		else
		{
			//keep that until we have support for all Sensors
			sensor = new GenSensor();
		}
		
		//store whether this sensor is given to us as active or not
		sensor.active = blenderObject.active;
		
		sensor.start = function()
		{
			//only sense if sensor is active
			if (sensor.active)
			{
				this.sense(babylonObject, actuators, blenderObject, scene);
			}
		}
		return sensor;
	}// end createSensor
}// end SensorFactory

//use keyboard array along side everyFrame event to create a sensor for the given Blender Logic.
var KeyboardSensor = function()
{
	
	this.sense = function(babylonObject, actuators, object, sceneForKey)
	{
		var key = object.key;
		var tap = object.tap;
		var inverted = object.invert;

		sceneForKey.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
		{
			//if key in blender logic is down
			if (keysDown[BlenderKeyConversion[object.key]])
			{
				//if tap is true only do this once regardless if key is still down
				if (tap)
				{
					if (tapped)
					{
						//activate all actuators connected to this Sensor
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec();
						}
						tapped = false;
					}

				}
				//else act normally
				else 
				{
					//activate all actuators connected to this Sensor
					for (i=0; i < actuators.length; i++)
					{
						actuators[i].exec();
					}
				}
			}
			
			// if blender logic key is not being pressed reset tap and check if inverted
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
			
		}));// end onEveryFrame
	}// end sense function
}//end KeyboardSensor

 var CollisionSensor = function()
{
	this.sense = function(babylonObject, actuators, object, scene)
	{
		var tap = object.tap;
		var inverted = object.invert;
		var tapped = true;
		
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
		{
			//check all collisions for every collider this sensor has, which we get with getColliders in blenderExport.html
			for (a=0; a < object.colliders.length; a++)
			{
				//if tap is set, check if tapped or not, if tapped go as normal except check for tapped bool so it will only go once until reset.
				if (tap)
				{
					if (tapped)
					{
						//if object colliding with one of the colliders
						if (babylonObject.intersectsMesh(object.colliders[a], true))
						{
							//set tapped to false so it won't run again until reset
							tapped = false;
							
							//go through and check to see if the collider has the correct property, if so exec actuators
							for (i =0; i < object.colliders[a].blender.properties.length; i++)
							{
								if (object.colliders[a].blender.properties[i].name == object.property)
								{
									for (i=0; i < actuators.length; i++)
									{
										actuators[i].exec();
									}
								}// end if property is equal

							}//end properties for loop

						}// end intersect if
						else
						{
							//if not colliding reset tapped
							tapped = true;
							
							//if inverted and not colliding exec actuators
							if (inverted)
							{
								for (i=0; i < actuators.length; i++)
								{
									actuators[i].exec();
								}
							}
						}// end intersect else
					}// end if tapped
				}// end tap if
				
				// run normally
				else
				{
					//if one of the colliders is colliding with our parent object
					if (babylonObject.intersectsMesh(object.colliders[a], true))
					{
						//go through and check if that collider has the property we're looking for, if so exec actuators
						for (i =0; i < object.colliders[a].blender.properties.length; i++)
						{
							if (object.colliders[a].blender.properties[i].name == object.property)
							{
								for (i=0; i < actuators.length; i++)
								{
									actuators[i].exec();
								}
							}// end if properties are equal

						}// end properties for loop

					}// end intersects if
				}// end else 	
			}//end colliders for loop
		
			//if sensor has no colliders and is set to be inverted, run actuators
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
			}//end if collider length is 0
		}));//end onEveryFrame event
	}// end sense function
}//end CollisionSensor

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
						//exec actuators
						for (i=0; i < actuators.length; i++)
						{
							actuators[i].exec();
						}
						tapped = false;
					}
				}
				
				//else run actuators every frame
				else
				{
					for (i=0; i < actuators.length; i++)
					{
						actuators[i].exec();
					}
				}
				
			}));
		}// end else inverted
	}//end sense function
}//end AlwaysSensor

var MessageSensor = function()
{
	this.sense = function(babylonObject, actuators, object, scene)
	{
		var inverted = object.invert;
		
		//it seems message is auto tapped in blender, so find a way to only do this once call
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
		{
			// if .readFromMessage is defined means it has been set, otherwise it hasn't been set, so no point in continuing
			if (typeof babylonObject.readFromMessage != 'undefined')
			{
				// if .readFromMessage subject is equal to what we're looking for run, or if our sensor's subject is empty except any message given to us
				if(babylonObject.readFromMessage.subject == object.subject || object.subject == "")
				{
					for (i=0; i < actuators.length; i++)
					{
						actuators[i].exec();
					}
				}
				
				//else no message is accepted so if inverted run actuators
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
			}// end typeof if	
			
			//if inverted is set and .readFromMessage is undefined, run actuators
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
		}));//end everyFrame event
	}//end sense function
}// end MessageSensor

var PropertySensor = function()
{
	this.sense = function(babylonObject, actuators, object, scene)
	{
		scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt)
		{
			//go through all of the objects properties, if any of them equal to the sensors property, check if meets the sensors conditional, if so run actuators
			for (i = 0; i < babylonObject.blender.properties.length; i++)
			{
				if (babylonObject.blender.properties[i].name == object.property)
				{
					//check for eval type
					if (babylonObject.blender.properties[i].mode == "PROPNEQUAL")
					{
						if (babylonObject.blender.properties[i].value != object.value)
						{
							for (j=0; j < actuators.length; j++)
							{
								actuators[i].exec();
							}	
						}
					}
					
					else if (babylonObject.blender.properties[i].mode == "PROPEQUAL")
					{
						
						if (babylonObject.blender.properties[i].value == object.value)
						{
							for (j=0; j < actuators.length; j++)
							{
								actuators[i].exec();
							}	
						}
						
					}
					
					else if (babylonObject.blender.properties[i].mode == "PROPINTERVAL")
					{
						//not implementated yet
					}
					
					else if (babylonObject.blender.properties[i].mode == "PROPCHANGED")
					{
						//not implementated yet
					}
					
					else if (babylonObject.blender.properties[i].mode == "PROPLESSTHAN")
					{
						if (babylonObject.blender.properties[i].value < object.value)
						{
							for (j=0; j < actuators.length; j++)
							{
								actuators[i].exec();
							}	
						}
					}
					
					else if (babylonObject.blender.properties[i].mode == "PROPGREATERTHAN")
					{
						if (babylonObject.blender.properties[i].value > object.value)
						{
							for (j=0; j < actuators.length; j++)
							{
								actuators[i].exec();
							}	
						}
					}//end PROPGREATERTHAN if					
					
				}// end property equal
			}// end properties for loop
		}));//end onEveryFrame event
	}// end sense function
}//end PropertySensor


//empty general sensor to prevent error if a sensor that we do not support is in the blenderLogic.json
var GenSensor = function()
{
	 this.sense = function(babylonObject, actuators, object, sceneForKey)
	{
	}
}