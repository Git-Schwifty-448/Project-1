/**
 * @file: event.js
 * @date: September 2017
 * @brief: Event object description
 */

var crypto = require('crypto');

/* The fields Event has:
 * name: string
 * description: string
 * time_slots: array
 * attendees: array
 * Note: We can't verify the types of these fields, just their existence
 */

/**
 * Event()
 * @pre: nothing
 * @post: the fields are set to their defaults
 * @return: an Event object
 */
function Event() {
    this.name        = "";
    this.description = "";
    this.times       = [];
    this.owner       = "";
    this.attendees   = [];
    this.uid         = "";
} // end of function Event

/**
 * Event#new_hash()
 * @pre: nothing
 * @post: nothing
 * @return: a sha256 hash unique to the event name and time
 */
Event.prototype.new_hash = function() {
    let sha256 = crypto.createHash('sha256');
    sha256.update(this.name);
    sha256.update(this.description);
    sha256.update("" + (Math.random() * Math.pow(2, 32))); // nonce
    this.times.forEach(function(ele, idx) {
        sha256.update("" + ele);
    });

    return sha256.digest('hex');
} // end of function Event#new_hash


module.exports = Event;