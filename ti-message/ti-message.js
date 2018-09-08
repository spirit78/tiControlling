var RED = require(process.env.NODE_RED_HOME + "/red/red");
var node = null;
var mqtt = require('mqtt')

module.exports = function(RED) {
    function tiMessageNode(config) {
        RED.nodes.createNode(this,config);
        node = this;

	//this.amqpConfig = config.amqp;
	this.status({fill:"green", shape:"dot", text:"not connected"});

        this.inFlight ={};

        // receiving message from NodeRed flow
        this.on('input', function(msg) {
            var msgID = node._generator();  //Mesage ID should be date / time combination
            console.log("MsgID:" + msgID);

            //msg.payload = msg.payload.toLowerCase();
            message = msg.payload.cmd;

            /*var message = '{"@class":"org.timeit.apps.core.Msg",
                "destination":"TI.DEV.RASP.UNITS.LICHTINNEN",
                "replyTo"
                "param0":"getValueFULL",
                "paramX":{"value" : "0"},
                "sender":"CONTROLLER" }';
            */

            //{"@class":"org.timeit.apps.core.Msg","correlationCmd":"log","correlationID":"TI.ICHWILLDIENACHRICHTZURUECK","curTaskOwner":"","curTaskSeq":0,"dateTime":"2016/04/10 17:00:58","destAddress":"","destination":"TI.GREENHOUSE.RASP.UNITS.PUMP2","destinationChannel":"","event":"cmd","execPlan":[],"instruction":"","msgID":"2016/04/10 17:00:50_631","msgIDExt":"","msgString":"","param0":"turnOn","paramX":{"interval":"5"},"replyTo":"","sender":"TI.ICHWILLDIENACHRICHTZURUECK","senderChannel":"","srcAddress":"","srcOriAddress":"","Stat":0,"status":0,"statusMessage":"","statusMsg":"","timestamp":"2016/04/10 17:00:50"}

    	    // Change MsgId and Correlation ID

	        this.log('Initial Message:' + message);
	        json_message = JSON.parse(message);
	        json_message.msgID = msgID;
	        json_message.correlationID = msgID;
            json_message.replyTo = "topic://" + config.intopic;
	        message = JSON.stringify(json_message);
	        this.log('Final Message:' + message);

            var MQclient = mqtt.connect(config.mqserver);

            MQclient.on('connect', function () {
                MQclient.subscribe(config.intopic);
                MQclient.publish(config.outtopic, message);
                //MQclient.subscribe("TI_CONTROLLER");
                //MQclient.publish("TI_CMD", message);
            });

            MQclient.on('message', function (topic, message) {
                var obj = JSON.parse(message.toString());
                console.log("CorrelationID:" + obj.correlationID);

                if (obj.correlationID === msgID) {
                    msg.payload = message.toString();
                    node.send(msg);
                    console.log('got it back');
                    MQclient.end();
                }
            });

            /*console.log('input');
            console.log(config.mqserver);
            console.log(config.intopic);
            console.log(config.outtopic);*/
        });

	    this.on('close', function() {
	        //tidy up
	        this.log('close');
    	});

        this._generator = function () {
            var date = new Date();
            date += " " + Math.floor(Math.random() * 10000);
            return date;
        };
    }

    RED.nodes.registerType("ti-message",tiMessageNode,{
	    credentials: {

	    }
    });
}

