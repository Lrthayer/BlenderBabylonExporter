function setupObjects(newScene)
{
	// Attach camera to canvas inputs
	newScene.activeCamera.attachControl(canvas);
	
	//lists for each type of objects
	var blenderMeshes = [];
	var blenderLights = [];
	var blenderCameras = [];
	
	//strings list for indexing
	blenderMeshesStrings = [];
	blenderCamerasStrings = [];
	blenderLightsStrings =[];
	var index;
	
	//divide up blender logic based on objects type
	for (i =0;  i < Blender.Objects.length; i++)
	{
		if (Blender.Objects[i].type == 'MESH' || Blender.Objects[i].type == 'EMPTY')
		{
			blenderMeshes.push(Blender.Objects[i]);
			blenderMeshesStrings.push(Blender.Objects[i].name);
		}
		else if (Blender.Objects[i].type == 'LAMP')
		{
			blenderLights.push(Blender.Objects[i]);
			blenderLightsStrings.push(Blender.Objects[i].name);
		}
		else
		{
			blenderCameras.push(Blender.Objects[i]);
			blenderCamerasStrings.push(Blender.Objects[i].name)
		}
	}

	//meshes
	for (i=0; i < newScene.meshes.length; i++)
	{
		index = blenderMeshesStrings.indexOf(newScene.meshes[i].name);
		newScene.meshes[i].blender = blenderMeshes[index];
		
		//add phsyics here
		addPhysics(newScene.meshes[i],newScene);
	}
	
	//lights
	for (i=0; i < newScene.lights.length; i++)
	{
		index = blenderLightsStrings.indexOf(newScene.lights[i].name);
		newScene.lights[i].blender = blenderLights[index];
	}
	
	//cameras
	for (i=0; i < newScene.cameras.length; i++)
	{
		index = blenderCamerasStrings.indexOf(newScene.cameras[i].name);
		newScene.cameras[i].blender = blenderCameras[index];
	}

	//add everything in one list
	var allObjects = [];
	for (i = 0; i < newScene.meshes.length; i++)
		allObjects.push(newScene.meshes[i]);
		
	for (i = 0; i < newScene.lights.length; i++)
		allObjects.push(newScene.lights[i]);
	
	for (i = 0; i < newScene.cameras.length; i++)
		allObjects.push(newScene.cameras[i]);
	
	return allObjects;
}

function setupSensors(allObjects, newScene)
{				
	var allSensors = [];
	var sensorFactory = new SensorFactory();
	for (i =0; i < allObjects.length; i++)
	{
		for (j = 0; j < allObjects[i].blender.sensors.length; j++)
		{
			allSensors.push(sensorFactory.createSensor(allObjects[i].blender.sensors[j], allObjects[i], newScene));
		}
	}
	
	// Once the scene is loaded, just register a render loop to render it
	for (i = 0; i < allSensors.length; i++)
	{
		allSensors[i].start();
	}
	
}

//go through and add actuators that are set active and are connected via an active controller
function setupActuators(allObjects)
{
	var actuatorFactory = new ActuatorFactory();
	var activeActuators = {"activeActuators" : []};
	var collideObjects = [];
	for (i =0; i < allObjects.length; i++)
	{
		for (j = 0; j < allObjects[i].blender.sensors.length; j++)
		{
			//check for controllers and see if they are active
			for (k=0; k < allObjects[i].blender.sensors[j].controllers.length; k++)
			{
				if (allObjects[i].blender.sensors[j].controllers[k].active)
				{
					for (l=0; l < allObjects[i].blender.sensors[j].controllers[k].actuators.length; l++)
					{
						if (allObjects[i].blender.sensors[j].controllers[k].actuators[l].active)
						{
							activeActuators.activeActuators.push(actuatorFactory.createActuator(allObjects[i].blender.sensors[j].controllers[k].actuators[l], allObjects[i], allObjects));
						}
					}//end actuators loop
				}
			}//end controller loop
			allObjects[i].blender.sensors[j].setActuators = activeActuators.activeActuators;
			activeActuators.activeActuators = [];
		}// end sensors loop
		
		//add list of actuators that we know are runnable to the object's blenderObject
		allObjects[i].blender.setActuators = activeActuators.activeActuators;
	}//end object loop
	
	return allObjects;
}

//add objects colliders for collide sensors
function getColliders(allObjects)
{
	var colliders = [];
	//iterate through all sensors, if their is a collision we'll need to traverse all objects to check their properties to set up the event in SensorFactory
	for (i =0; i < allObjects.length; i++)
	{	
		for (j =0; j < allObjects[i].blender.sensors.length; j++)
		{
			if (allObjects[i].blender.sensors[j].type == "COLLISION")
			{
				//go through and get all objects that have the property
				for (k =0; k < allObjects.length; k++)
				{
					for (l =0; l < allObjects[k].blender.properties.length; l++)
					{
						if (allObjects[k].blender.properties[l].name == allObjects[i].blender.sensors[j].property)
						{
							colliders.push(allObjects[k]);
						}
					}
				}
				allObjects[i].blender.sensors[j].colliders = colliders;
			}
		}
	}
	return allObjects;
}

function addPhysics(meshObject, scene)
{
var strShape = meshObject.blender.shape;
var physicType = meshObject.blender.physics;
var massOfObject = meshObject.blender.mass;
var bounciness = meshObject.blender.elasicity;
var frictionOfObject = meshObject.blender.friction;

console.log(scene);


//Give object a collider based on its mesh shape
if(strShape.substring(0,9) == "Icosphere")
{
   //Give object an imposter based on their physics type
   if(physicType == "STATIC")
   {
	   meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: bounciness, friction: frictionOfObject }, scene);
   }
   else
   {
	  if(physicType != "NO_COLLISION")
	  {
		 meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.SphereImpostor, { mass: (massOfObject*1),restitution: bounciness, friction: frictionOfObject}, scene);
	  }
	 
   }
  
}
else if(strShape.substring(0,6) == "Sphere")
{
   //Give object an imposter based on their physics type
   if(physicType == "STATIC")
   {
	   meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: bounciness, friction: frictionOfObject }, scene);
   }
   else
   {
	  if(physicType != "NO_COLLISION")
	  {
		 meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.SphereImpostor, { mass: (massOfObject*1), restitution: bounciness, friction: frictionOfObject }, scene);
	  }
	 
   }

}
else if(strShape.substring(0,4) == "Cube")
{
   
   //Give object an imposter based on their physics type
   if(physicType == "STATIC")
   {
	   meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: bounciness, friction: frictionOfObject }, scene);
   }
   else
   {
	  if(physicType != "NO_COLLISION")
	  {
		 meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.BoxImpostor, { mass: (massOfObject*1), restitution: bounciness, friction: frictionOfObject}, scene);
	  }
	 
   }
}
else if(strShape.substring(0,5) == "Plane")
{
   //they recommend to use BoxImposter instead of PlaneImposter. In the documentation,it says
   //PlaneImposter simulates an unlimited surface. Like a floor that never ends.
   
   //Give object an imposter based on their physics type
   if(physicType == "STATIC")
   {
	   meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: bounciness, friction: frictionOfObject }, scene);
   }
   else
   {
	  if(physicType != "NO_COLLISION")
	  {
		 meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.BoxImpostor, { mass: (massOfObject*1), restitution: bounciness, friction: frictionOfObject }, scene);
	  }
	 
   }
}
else if(strShape.substring(0,8) == "Cylinder")
{
	//Give object an imposter based on their physics type
   if(physicType == "STATIC")
   {
	   meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0, restitution: bounciness, friction: frictionOfObject }, scene);
   }
   else
   {
	  if(physicType != "NO_COLLISION")
	  {
		 meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: (massOfObject*1), restitution: bounciness, friction: frictionOfObject }, scene);
	  }
	 
   }
}
else
{
	 //Give object an imposter based on their physics type
   if(physicType == "STATIC")
   {
	   meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: bounciness, friction: frictionOfObject }, scene);
   }
   else
   {
	  if(physicType != "NO_COLLISION")
	  {
		 meshObject.physicsImposter = new BABYLON.PhysicsImpostor(meshObject, BABYLON.PhysicsImpostor.BoxImpostor, { mass: (massOfObject*1), restitution: bounciness, friction: frictionOfObject}, scene);
	  } 
   } 
}
}
