(function(){
	'use strict';
    var controllerId = 'RemoteControl';
    angular.module('MadAmpApp').controller(controllerId, ['MadAmpAPIservice', '$scope', viewModel]);
    function viewModel(MadAmpAPIservice, $scope){
    	
	
		$scope.zoneSettings = "",
		$scope.sourceSettings = "",
		$scope.attributeSettings = "";
	
		var	sendCommand = "<",
		    sendQuery = "?",
		    stringCmd = "",
		    resp = "";

		//hard coded because of hardware constraints
		$scope.controlStatus =
		{
		    ObjectCode:
		    {
		        unit: 1,
		        zone: 1
		    },
		
		    Power: 0,
		    Source: 1,
		    Volume: 1,		
		    Bass: 2,
		    Treble: 3,
		    Balance: 4,
		    Mute: 0
		};
		
		// on load of window set zone_select to first zone and query status
		// from MonoAmp use result to set powerOn variable and all other
		// parameters
				
		document.getElementById("zone_select").value = "11";
		stringCmd =
		    sendQuery
		    + "11"
		console.log("App start - Query status Zone 1:"+stringCmd);
		serCmd(stringCmd);	// POST serial request for zone data
			
		// POST mysql request for zone names
		var settings = MadAmpAPIservice.getSettings().then(function(resp){
			parseMenuSettings(resp.data)
			}, function(resp){
				console.log("error importing app settings")
			});
		
		$scope.toggleButton = function (button){
		        //if power is on, send message to turn off
		        //DO NOT SET BUTTON UNTIL RECIEVE A RESPONSE
		        console.log("Toggle Pressed: " + button.displayName);
		        
		
		        if ($scope.controlStatus[button.displayName]) {
		            //disable source selection and power off selected zone
		            stringCmd =
		                sendCommand
		                + $scope.controlStatus.ObjectCode.unit + "" + $scope.controlStatus.ObjectCode.zone
		                + button.control
		                + "00"; 
		        } else {
		            stringCmd =
		                sendCommand
		                + $scope.controlStatus.ObjectCode.unit + "" + $scope.controlStatus.ObjectCode.zone
		                + button.control
		                + "01";
		        }
		
		        console.log("Command to Post:" + stringCmd);
		        serCmd(stringCmd);
		}
		
	      $scope.rangeControlClick = function (rangeControl, buttonDirection) {
		        console.log("Button Pressed: " + rangeControl.displayName + "_" + buttonDirection);
		        var controlValue = $scope.controlStatus[rangeControl.displayName];
		
		        if (buttonDirection == "UP") {
		            if (controlValue + 1 <= rangeControl.max) {
		                stringCmd =
		                    sendCommand
		                    + $scope.controlStatus.ObjectCode.unit + "" + $scope.controlStatus.ObjectCode.zone
		                    + rangeControl.control
		                    + getValueString(controlValue + 1);
		                console.log("Scale button action to Post: " + stringCmd);
		                serCmd(stringCmd);
		            } else {
		                console.log("Scale command out of range");
		            }
		        } else { //button direction is down
		            if (controlValue - 1 >= rangeControl.min) {
		                stringCmd =
							sendCommand 
							+ $scope.controlStatus.ObjectCode.unit + "" + $scope.controlStatus.ObjectCode.zone 
							+ rangeControl.control
							+ getValueString(controlValue - 1);
						console.log("Scale button action to Post: " + stringCmd);
						serCmd(stringCmd);
		            } else {
		                console.log("Scale command out of range");
		            }
		        }
		    }
		
		function serCmd(stringCmd){
			// use API service to issue a command to blah
		    MadAmpAPIservice.sendCommand(stringCmd).success(function(resp) 
		    {
		    	setControlStatus(resp);
		    });
		}

		$scope.assignZone = function (){
		    //$scope.controlStatus.ObjectCode.zone = document.getElementById("zone_select").value;
			stringCmd =
		        sendQuery
		        + $scope.controlStatus.ObjectCode.unit + "" + $scope.controlStatus.ObjectCode.zone;
			console.log("Command to Post:"+stringCmd);
			serCmd(stringCmd);	// POST serial command to php
		}
		
		$scope.assignSource = function (){
		    //$scope.controlStatus.Source.value = document.getElementById("source_select").value;
			if ($scope.controlStatus.Power){
			    stringCmd = 
		            sendCommand 
		            + $scope.controlStatus.ObjectCode.unit + "" + $scope.controlStatus.ObjectCode.zone 
		            + $scope.globalSourceSettings.control
		            + getValueString($scope.controlStatus.Source);
				console.log("Command to post:" + stringCmd);
				serCmd(stringCmd);  // POST Source to php serial
				}
			else{
				console.log("No Zone selected or Power for zone is off");
			}
		}
		
		function setPower(newPowerState) {
		    var powerButton = document.getElementById("TOGGLE_Power");
		    //powerOn is the last state of the button
		    //if powerOn is the same as the new state, no need to do anything
		    if (newPowerState) {
		        powerButton.className = powerButton.className.replace("powerOff", "powerOn");
		        powerButton.textContent = powerButton.textContent.replace("OFF", "ON");
		        $scope.controlStatus.Power = 1;
		    } else {
		        powerButton.className = powerButton.className.replace("powerOn", "powerOff");
		        powerButton.textContent = powerButton.textContent.replace("ON", "OFF");
		        $scope.controlStatus.Power = 0;
		    }    
		}
		
		function getValueString(value) {
		    return (value >= 10) ? value.toString() : "0" + value.toString();
		}
			
		function parseMenuSettings(resp)
		{
			$scope.zoneSettings = resp.slice(0,6);
			$scope.sourceSettings = resp.slice(6,12);
			var attributes = resp.slice(12,resp.length);
			$scope.powerSettings = $(attributes).filter(function (i,n){return n.control==='PR'})[0];
			$scope.muteSettings = $(attributes).filter(function (i,n){return n.control==='MU'})[0];
			$scope.globalSourceSettings = $(attributes).filter(function (i,n){return n.control==='CH'})[0]; 
			$scope.rangeControls = $(attributes).filter(function (i,n){return n.type==='range'});
			$scope.controlStatus.ObjectCode.zone = $scope.zoneSettings[0].positionAddress;
			$scope.controlStatus.Source = $scope.sourceSettings[0].positionAddress;
		}
		
		function setControlStatus(resp)
		{// This is the best way to perform an SQL query
		// For more examples, see mysql_real_escape_string()
		    var n = resp.length;
		    console.log ("Reply length is: " + n);
		    if (n == 31) {
		        //splitting the zone into unit and zone
		        //control object code are what these values represent as a pair
		        $scope.controlStatus.ObjectCode.unit = parseInt(resp.substr(5, 1));
		        $scope.controlStatus.ObjectCode.zone = parseInt(resp.substr(6, 1));
		 
		        setPower(parseInt(resp.substr(9, 2)));
		
		        $scope.controlStatus.Mute = parseInt(resp.substr(11, 2));
		        $scope.controlStatus.Volume = parseInt(resp.substr(15, 2));
		        $scope.controlStatus.Treble = parseInt(resp.substr(17, 2));
		        $scope.controlStatus.Bass = parseInt(resp.substr(19, 2));
		        $scope.controlStatus.Balance = parseInt(resp.substr(21, 2));		
		        $scope.controlStatus.Source = parseInt(resp.substr(23, 2));
		
		        //log the $scope.controlStatus object
		        console.log("[setting controls] Zone is: " + $scope.controlStatus.ObjectCode.unit
		            + "" + $scope.controlStatus.ObjectCode.zone);
		        console.log("[setting controls] Power (PR) is: " + $scope.controlStatus.Power);
		        console.log("[setting controls] Mute (MU) is: " + $scope.controlStatus.Mute);
		        console.log("[setting controls] Volume (VO) is: " + $scope.controlStatus.Volume);
		        console.log("[setting controls] Treble (TR) is: " + $scope.controlStatus.Treble);
		        console.log("[setting controls] Bass (BS) is: " + $scope.controlStatus.Bass);
		        console.log("[setting controls] Balance (BL) is: " + $scope.controlStatus.Balance);
		        console.log("[setting controls] Source (CH) is: " + $scope.controlStatus.Source);
		    } else {
		        console.log("Response is incorrect format!");
		    }
		}
	}
})();
