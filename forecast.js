
socketNotificationReceived: function(notification, payload) {
        if (notification === "WORD_RESULT") { 
            this.processWORD(payload);
        } else {
        this.updateDom(loaddelay);
		}
		 this.updateDom();
    }















/* Magic Mirror
 * Module: MMM-WOTD2
 *
 * By Cowboysdude
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
const fs = require('fs');
const exec = require('child_process').exec;

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting module: " + this.name);
    },

    getDate: function() {
        return (new Date()).toLocaleDateString();
    },

    getWORD: function() {
    if (fs.existsSync("modules/MMM-WOTD2/wotd.json")) {
        var temp = JSON.parse(fs.readFileSync("modules/MMM-WOTD2/wotd.json", "utf8"));
        if (temp.timestamp === this.getDate()) {
			console.log("File exists, sending data now");
            this.sendSocketNotification('WORD_RESULT', temp);
        } else {
            console.log("file isn't right, creating new file now");
            child = exec("node modules/MMM-WOTD2/index.js",
                (error, stdout, stderr) => {
                    var temp = JSON.parse(fs.readFileSync("modules/MMM-WOTD2/wotd.json", 'utf8'));
                    setTimeout(() => {
                        this.sendSocketNotification("WORD_RESULT", temp)
                    }, 200);
                });
        }
    } else {
        console.log("file does not exist, creating it now");
        child = exec("node modules/MMM-WOTD2/index.js",
            (error, stdout, stderr) => {
                var temp = JSON.parse(fs.readFileSync("modules/MMM-WOTD2/wotd.json", 'utf8'));
                setTimeout(() => {
                    this.sendSocketNotification("WORD_RESULT", temp)
                }, 200);
            });
    }
},

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_WORD') {
            this.getWORD(payload);
        }
    }
});
