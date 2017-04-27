function ActuatorFactory()
{
	this.createActuator = function(blenderObject, babylonObject, allObjects, engine, camera)
	{
		var actuator;

		//get type so we know what actuator to createActuator
		type = blenderObject.type;
		
		//store whether this actuator is active at this moment
		active = blenderObject.active;
		
		//create the actuator based on the type
		if (type === "MOTION") 
		{
			actuator = new MotionActuator();
		} 
		else if (type === "VISIBILITY")
		{
			actuator = new VisibilityActuator();
		}
		else if (type == "PARENT")
		{
            actuator = new ParentActuator(allObjects);
		}
		else if (type == "MESSAGE")
		{
            actuator = new MessageActuator(allObjects);
		}
		else if (type == "PROPERTY")
		{
            actuator = new PropertyActuator();
		}
		else if (type == "GAME")
		{
            actuator = new GameActuator(engine, camera);
		}
		else
		{
			//keep that until we have support for all Sensors
			actuator = new genActuator();
		}
		
		actuator.exec = function(other)
		{
			//only act if actuator is active
			if (active)
			{
				blenderObject.going = true;
				this.act(blenderObject, babylonObject, other);
				this.clearAct(blenderObject);
			}
		}
		
		actuator.clearForActuatorSensor = function()
		{
			blenderObject.going = false;
		}
		return actuator;
	}
}

var MotionActuator = function()
{
	this.act = function(object, babylonObject)
	{
		//apply offset (if none exists it should work regardless)
		if (object.localLocation)
		{
			babylonObject.translate(BABYLON.Axis.X, object.offsetLocation[0], BABYLON.Space.LOCAL);
			babylonObject.translate(BABYLON.Axis.Y, object.offsetLocation[2], BABYLON.Space.LOCAL);
			babylonObject.translate(BABYLON.Axis.Z, object.offsetLocation[1], BABYLON.Space.LOCAL);
		}
		else
		{
			//according to babylon's documentation this method works as if using BABYLON.Space.WORLD, but that didn't like sensors having the same axis having different LOCAL/WORLD types.
			babylonObject.position.x = babylonObject.position.x + object.offsetLocation[0];
			babylonObject.position.y = babylonObject.position.y + object.offsetLocation[2];
			babylonObject.position.z = babylonObject.position.z + object.offsetLocation[1];
		}
		
		if (object.localLocation)
		{
			//according to babylon's documentation rotation is the opposite of location in that this method apply rotation locally.
			babylonObject.rotation.x = babylonObject.rotation.x - object.offsetRotation[0];
			babylonObject.rotation.y = babylonObject.rotation.y - object.offsetRotation[2];
			babylonObject.rotation.z = babylonObject.rotation.z - object.offsetRotation[1];
		}
		else
		{
			babylonObject.rotate(BABYLON.Axis.X, -object.offsetRotation[0], BABYLON.Space.WORLD);
			babylonObject.rotate(BABYLON.Axis.Y, -object.offsetRotation[2], BABYLON.Space.WORLD);
			babylonObject.rotate(BABYLON.Axis.Z, -object.offsetRotation[1], BABYLON.Space.WORLD);
		}
		
		//only try to apply the force part of the Motion actuator if we know the physics engine as been turned on
		if (typeof object.force != 'undefined')
		{
			babylonObject.physicsImposter.setAngularVelocity(new BABYLON.Quaternion(object.angularVelocity[0],object.angularVelocity[2],object.angularVelocity[1],0));
			babylonObject.physicsImposter.setLinearVelocity(new BABYLON.Quaternion(object.linearVelocity[0],object.linearVelocity[2],object.linearVelocity[1], 0));
			
			//note this code seems to function without error, everything being not undefined, but doesn't seem to work
			babylonObject.physicsImposter.applyImpulse(new BABYLON.Vector3(object.force[0] / 7, object.force[2]/ 7, object.force[1]/ 7), babylonObject.getAbsolutePosition());
		}
	}
	
	this.clearAct = function(object)
	{
		object.going = false;
	}
}

var VisibilityActuator = function()
{
	//set the visibility of the object to the actuators
	this.act = function(object, babylonObject)
	{
		babylonObject.visibility = object.visible;
	}
	
	this.clearAct = function(object)
	{
		object.going = false;
	}
}

var ParentActuator = function(allObjects)
{
	this.act = function (object, babylonObject)
	{
		//get the object the Parent Actuator is trying to assign as a parent
		var allObjectsStrings = [];
		for (i =0; i < allObjects.length; i++)
		{
			allObjectsStrings.push(allObjects[i].name);
		}
		index = allObjectsStrings.indexOf(object.toBeParent);
		
		//get position before setting parent, then reset it after parent is set
		var positionX = babylonObject.getAbsolutePosition();
		babylonObject.parent = allObjects[index];
 		babylonObject.setAbsolutePosition(positionX);
    }
    
    this.clearAct = function(object)
	{
		object.going = false;
	}
}

var MessageActuator = function(allObjects)
{
	this.act = function (object, babylonObject)
	{
		//if to property is empty broadcast this to all objects
		if (object.to == "")
		{
			for (i =0; i < allObjects.length; i++)
			{
				allObjects[i].readFromMessage = {"subject" : object.subject, "body" : object.message};
			}
		}
		//else broadcast only to the specified reciever
		else 
		{
			//get index of the object we are trying to send a message to
			var allObjectsStrings = [];
			for (i =0; i < allObjects.length; i++)
			{
				allObjectsStrings.push(allObjects[i].name);
			}
			index = allObjectsStrings.indexOf(object.to);
			
			//send that message given the index
			allObjects[index].readFromMessage = {"subject" : object.subject, "body" : object.message};
		}
    }
    
    this.clearAct = function(object)
	{
		object.going = false;
	}
}

var PropertyActuator = function()
{
	this.act = function(object, babylonObject)
	{
		//go through all the objects properties and set the one our actuator wants to set
		for (i = 0; i < babylonObject.blender.properties.length; i++)
		{
			if (babylonObject.blender.properties[i].name == object.property)
			{
				babylonObject.blender.properties[i].value += object.value;
			}
		}
	}
	 
	this.clearAct = function(object)
	{
		object.going = false;
	}
}

var GameActuator = function(engine, camera)
{
	this.act = function(object, babylonObject)
	{
		//act depending on the mode of the Game Actuator
		if (object.mode == "QUIT")
		{
			engine.stopRenderLoop()
		}
		else if (object.mode == "SCREENSHOT")
		{
			//for some reason it will create a png, but it will always be blank
			BABYLON.Tools.CreateScreenshot(engine, camera, { width: 1024, height: 1024 });
		}
		else if(object.mode == "RESTART")
		{
			location.reload();
		}
		
		
		this.clearAct = function(object)
		{
			object.going = false;
		}
	}
}

//do nothing
var genActuator = function()
{
	this.act = function(object, babylonObject)
	{
		
	}
}



