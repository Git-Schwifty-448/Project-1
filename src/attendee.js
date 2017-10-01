/**
 * @file: attendee.js
 * @date: September 2017
 * @brief: Event attendee description
 * @author: Abraham Dick
 */

var crypto = require('crypto');

/* The fields attendee has:
 * uid: strig
 * name: string
 * time_slots: 2d array
 * task_list: array
 * is_owner: bool
 * Note: We can't verify the types of these fields, just their existence
 */

/**
 * Attendee()
 * @pre: nothing
 * @post: the fields are set to their defaults
 * @return: an Attendee object
 */
function Attendee() {
    this.uid         = "";
    this.name        = "";
    this.times       = [];
    this.task_list   = [];
} // end of function Attendee

/**
 * Event#hash()
 * @pre: nothing
 * @post: nothing
 * @return: a sha256 hash unique to the event name and time, randomly nonced
 */
Attendee.prototype.hash = function() {
    let sha256 = crypto.createHash('sha256');
    sha256.update(this.name);
    sha256.update(this.times.join(' '));
    sha256.update("" + (Math.random() * Math.pow(2, 32))); // nonce

    return sha256.digest('hex');
} // end of function Event#hash


module.exports = Attendee;
