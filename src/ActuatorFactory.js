function ActuatorFactory()
{
	this.createActuator = function(blenderObject, babylonObject)
	{
		var actuator;
		type = blenderObject.type;
		
		if (type === "MOTION") {
			actuator = new MotionActuator();
		} 
		else if (type === "VISIBILITY")
		{
			actuator = new VisibilityActuator();
		}
		else
		{
			actuator = new genActuator();
		}
		
		actuator.exec = function()
		{
			this.act(blenderObject, babylonObject);
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
	}
}

var VisibilityActuator = function()
{
	this.act = function(object, babylonObject)
	{
		babylonObject.visibility = object.visible;
	}
}

var genActuator = function()
{
	this.act = function(object, babylonObject)
	{
		
	}
}

