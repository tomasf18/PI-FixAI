import copy
from typing import Dict, Any

# Mensagem base
BASE_MESSAGE: Dict[str, Any] = {
    "fields": {
        "cam": {
            "camParameters": {
                "basicContainer": {
                    "referencePosition": {
                        "altitude": {
                            "altitudeConfidence": 15,
                            "altitudeValue": 0.0
                        },
                        "latitude": 0.0,
                        "longitude": 0.0,
                        "positionConfidenceEllipse": {
                            "semiMajorConfidence": 4095,
                            "semiMajorOrientation": 0.0,
                            "semiMinorConfidence": 4095
                        }
                    },
                    "stationType": 6
                },
                "highFrequencyContainer": {
                    "basicVehicleContainerHighFrequency": {
                        "accelerationControl": {
                            "accEngaged": False,
                            "brakePedalEngaged": False,
                            "collisionWarningEngaged": False,
                            "cruiseControlEngaged": False,
                            "emergencyBrakeEngaged": False,
                            "gasPedalEngaged": True,
                            "speedLimiterEngaged": False
                        },
                        "curvature": {
                            "curvatureConfidence": 7,
                            "curvatureValue": 1023
                        },
                        "curvatureCalculationMode": 1,
                        "driveDirection": 0,
                        "heading": {
                            "headingConfidence": 127.0,
                            "headingValue": 0.0
                        },
                        "lanePosition": 0,
                        "lateralAcceleration": {
                            "lateralAccelerationConfidence": 102.0,
                            "lateralAccelerationValue": 161.0
                        },
                        "longitudinalAcceleration": {
                            "longitudinalAccelerationConfidence": 102.0,
                            "longitudinalAccelerationValue": 0.0
                        },
                        "performanceClass": 0,
                        "speed": {
                            "speedConfidence": 127.0,
                            "speedValue": 0.0
                        },
                        "steeringWheelAngle": {
                            "steeringWheelAngleConfidence": 127,
                            "steeringWheelAngleValue": 512
                        },
                        "vehicleLength": {
                            "vehicleLengthConfidenceIndication": 3,
                            "vehicleLengthValue": 1.0
                        },
                        "vehicleWidth": 0.3,
                        "verticalAcceleration": {
                            "verticalAccelerationConfidence": 102.0,
                            "verticalAccelerationValue": 161.0
                        },
                        "yawRate": {
                            "yawRateConfidence": 8,
                            "yawRateValue": 0.0
                        }
                    }
                },
                "lowFrequencyContainer": {
                    "basicVehicleContainerLowFrequency": {
                        "exteriorLights": {
                            "daytimeRunningLightsOn": False,
                            "fogLightOn": False,
                            "highBeamHeadlightsOn": False,
                            "leftTurnSignalOn": False,
                            "lowBeamHeadlightsOn": False,
                            "parkingLightsOn": False,
                            "reverseLightOn": False,
                            "rightTurnSignalOn": False
                        },
                        "pathHistory": None,
                        "vehicleRole": 1
                    }
                },
                "specialVehicleContainer": {
                    "publicTransportContainer": {
                        "embarkationStatus": 0
                    }
                }
            },
            "generationDeltaTime": 100
        },
        "header": {
            "messageID": 2,
            "protocolVersion": 2,
            "stationID": 148
        }
    },
    "newInfo": True,
    "packet_size": 110,
    "receiverID": 6,
    "receiverType": 15,
    "rssi": -86,
    "stationID": 148,
    "test": {
        "json_timestamp": 0.0
    },
    "timestamp": 0.0
}


def generate_message(latitude: float, longitude: float, heading: float, speed: float) -> Dict[str, Any]:
    message = copy.deepcopy(BASE_MESSAGE)
    message["fields"]["cam"]["camParameters"]["basicContainer"]["referencePosition"]["latitude"] = latitude
    message["fields"]["cam"]["camParameters"]["basicContainer"]["referencePosition"]["longitude"] = longitude
    message["fields"]["cam"]["camParameters"]["highFrequencyContainer"]["basicVehicleContainerHighFrequency"]["heading"]["headingValue"] = heading
    message["fields"]["cam"]["camParameters"]["highFrequencyContainer"]["basicVehicleContainerHighFrequency"]["speed"]["speedValue"] = speed
    return message
