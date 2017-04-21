function ActuatorFactory()
{
	this.createActuator = function(blenderObject, babylonObject, allObjects)
	{
		var actuator;
		type = blenderObject.type;
		active = blenderObject.active;
		
		if (type === "MOTION") {
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
		else
		{
			actuator = new genActuator();
		}
		
		actuator.exec = function(other)
		{
			//only act if actuator is active
			if (active)
				this.act(blenderObject, babylonObject, other);
		}
		return actuator;
	}
}

var MotionActuator = function()
{
	this.act = function(object, babylonObject)
	{
		console.log("test");
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
			babylonObject.rotation.x = babylonObject.rotation.x + object.offsetRotation[0];
			babylonObject.rotation.y = babylonObject.rotation.y + object.offsetRotation[2];
			babylonObject.rotation.z = babylonObject.rotation.z + object.offsetRotation[1];
		}
		else
		{
			babylonObject.rotate(BABYLON.Axis.X, object.offsetRotation[0], BABYLON.Space.WORLD);
			babylonObject.rotate(BABYLON.Axis.Y, object.offsetRotation[2], BABYLON.Space.WORLD);
			babylonObject.rotate(BABYLON.Axis.Z, object.offsetRotation[1], BABYLON.Space.WORLD);
		}
		//check if force is defined, if it is we know all the physics is on for the motion actuator
		console.log(babylonObject.physicsImposter.getAngularVelocity());
		//babylonObject.physicsImposter.setAngularVelocity(new BABYLON.Quaternion(0,10,0,0));
		//babylonObject.physicsImposter.setLinearVelocity(new BABYLON.Vector3(1,0,0));
		if (typeof object.force != 'undefined')
		{
			babylonObject.physicsImposter.applyImpulse(new BABYLON.Vector3(object.force[0] / 7, object.force[2]/ 7, object.force[1]/ 7), babylonObject.getAbsolutePosition());
			babylonObject.physicsImposter.setAngularVelocity(new BABYLON.Quaternion(object.angularVelocity[0],object.angularVelocity[2],object.angularVelocity[1],0));
			babylonObject.physicsImposter.setLinearVelocity(new BABYLON.Quaternion(object.linearVelocity[0],object.linearVelocity[2],object.linearVelocity[1], 0));
		}
		

	}
}

var VisibilityActuator = function()
{
	this.act = function(object, babylonObject)
	{
		babylonObject.visibility = object.visible;
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
		//get position before setting
		var positionX = babylonObject.getAbsolutePosition();
		babylonObject.parent = allObjects[index];
 		babylonObject.setAbsolutePosition(positionX);
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
				allObjects[i].readFromMessage = {"subject" : object.subject, "body" : object.message}
			}
		}
		else 
		{
			var allObjectsStrings = [];
			for (i =0; i < allObjects.length; i++)
			{
				allObjectsStrings.push(allObjects[i].name);
			}
			index = allObjectsStrings.indexOf(object.to);
			allObjects[index].readFromMessage = {"subject" : object.subject, "body" : object.message}
		}
    }
}

var genActuator = function()
{
	this.act = function(object, babylonObject)
	{
		
	}
}



