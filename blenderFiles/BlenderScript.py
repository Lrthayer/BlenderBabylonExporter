import bpy
import io
import json


def write_obj():
    
    listOfObjects = bpy.data.objects
    out2 = io.open('blenderLogic.json', 'w', encoding='utf8')
    sensorType = ''
    test = {'Objects' : []}
    for i in range(0, len(listOfObjects)):
        tempObject = {}
        tempObject['name'] = bpy.data.objects[i].name
        tempObject['type'] = bpy.data.objects[i].type
        tempObject['sensors'] = []
        test['Objects'].append(tempObject)
        
        for j in range(0, len(bpy.data.objects[i].game.sensors)):
            #create Json object for all sensors
            tempSensor = {}
            tempSensor['name'] = bpy.data.objects[i].game.sensors[j].name
            print(bpy.data.objects[i].game.sensors[j].type)
            tempSensor['type'] = bpy.data.objects[i].game.sensors[j].type
            tempSensor['active'] = bpy.data.objects[i].game.sensors[j].active
            tempSensor['invert'] = bpy.data.objects[i].game.sensors[j].invert
            tempSensor['controllers'] = []
            
            if tempSensor['type'] == "KEYBOARD":
                tempSensor['key'] = bpy.data.objects[i].game.sensors[j].key
                tempSensor['allKeys'] = bpy.data.objects[i].game.sensors[j].use_all_keys
                
            elif tempSensor['type'] == "COLLISION":
                tempSensor['material'] = bpy.data.objects[i].game.sensors[j].material
                tempSensor['property'] = bpy.data.objects[i].game.sensors[j].property
                tempSensor['useMaterial'] = bpy.data.objects[i].game.sensors[j].use_material
                
            elif tempSensor['type'] == "MOUSE":
                tempSensor['mouseEvent'] = bpy.data.objects[i].game.sensors[j].mouse_event
                tempSensor['useTap'] = bpy.data.objects[i].game.sensors[j].use_tap
                tempSensor['useXRay'] = bpy.data.objects[i].game.sensors[j].use_x_ray
                
            elif tempSensor['type'] == "RAY":
                tempSensor['axis'] = bpy.data.objects[i].game.sensors[j].axis
                tempSensor['material'] = bpy.data.objects[i].game.sensors[j].material
                tempSensor['property'] = bpy.data.objects[i].game.sensors[j].property
                tempSensor['range'] = bpy.data.objects[i].game.sensors[j].range
                tempSensor['rayType'] = bpy.data.objects[i].game.sensors[j].ray_type
                tempSensor['useXRay'] = bpy.data.objects[i].game.sensors[j].use_x_ray
                
            elif tempSensor['type'] == "JOYSTICK":
                tempSensor['axisDirection'] = bpy.data.objects[i].game.sensors[j].axis_direction
                tempSensor['axisNumber'] = bpy.data.objects[i].game.sensors[j].axis_number
                tempSensor['buttonNumber'] = bpy.data.objects[i].game.sensors[j].button_number
                tempSensor['eventType'] = bpy.data.objects[i].game.sensors[j].event_type
                tempSensor['hatDirection'] = bpy.data.objects[i].game.sensors[j].hat_direction
                tempSensor['hatNumber'] = bpy.data.objects[i].game.sensors[j].hat_number
                tempSensor['joystickIndex'] = bpy.data.objects[i].game.sensors[j].joystick_index
                tempSensor['single_axis_number'] = bpy.data.objects[i].game.sensors[j].single_axis_number
                tempSensor['useAllEvents'] = bpy.data.objects[i].game.sensors[j].use_all_events
            else:
                print()
                
            test['Objects'][i]["sensors"].append(tempSensor)
                
            for k in range(0,len(bpy.data.objects[i].game.sensors[j].controllers)):
                tempController = {} 
                tempController['name'] = bpy.data.objects[i].game.sensors[j].controllers[k].name
                tempController['active'] = bpy.data.objects[i].game.sensors[j].controllers[k].type
                tempController['active'] = bpy.data.objects[i].game.sensors[j].controllers[k].active
                tempController['actuators'] = []
                test['Objects'][i]["sensors"][j]['controllers'].append(tempController)

                for l in range(0, len(bpy.data.objects[i].game.sensors[j].controllers[k].actuators)):
                    tempActuator = {} 
                    tempActuator['name'] = bpy.data.objects[i].game.sensors[j].controllers[k].actuators[l].name
                    tempActuator['type'] = bpy.data.objects[i].game.sensors[j].controllers[k].actuators[l].type
                    if tempActuator['type'] == "MOTION":
                        tempActuator['localLocation'] = bpy.data.objects[i].game.sensors[j].controllers[k].actuators[l].use_local_location
                        #convert Vector to an array
                        tempVector = [bpy.data.objects[i].game.sensors[j].controllers[k].actuators[l].offset_location.x,bpy.data.objects[i].game.sensors[j].controllers[k].actuators[l].offset_location.y, bpy.data.objects[i].game.sensors[j].controllers[k].actuators[l].offset_location.z ] 
                        tempActuator['offsetLocation'] = tempVector
                        #tempActuator['offsetRotation'] = bpy.data.objects[i].game.sensors[j].controllers[k].actuators[l].offset_rotation
                    test['Objects'][i]["sensors"][j]['controllers'][k]['actuators'].append(tempActuator)
    
    print(test)
    print(json.dumps(test, default=lambda o: o.dict))
    out2.write(json.dumps(test, default=lambda o: o.dict))
        
    out2.close()
        
write_obj()