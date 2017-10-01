/**
 * @file: database.js
 * @date: September 2017
 * @brief: Database object description
 */

var sqlite3 = require('sqlite3').verbose();

var Event   = require('./event.js');
var Attendee   = require('./attendee.js');

/**
 * Database(path, callback)
 * @pre: nothing
 * @post: a database is created on disk at path
 * @return: a Database object
 * @param: 'path', the path for the database
 */
function Database(path, callback) {
    this.path = path;

    // Create the events table
    const create_events_table = "CREATE TABLE IF NOT EXISTS tb_events"
                              + "("
                              + "uid TEXT NOT NULL, "
                              + "name TEXT NOT NULL, "
                              + "description TEXT NOT NULL, "
                              + "owner TEXT NOT NULL, "
                              + "dates TEXT NOT NULL, "
                              + "times TEXT NOT NULL, "
                              + "task_list TEXT, "
                              + "attendee_list TEXT "
                              + ");";

    let obj = this;

    // Create the database and then add the two tables
    this.db = new sqlite3.Database(path, () => {
        obj.db.run(create_events_table, () => {
            if(callback) callback();
        })
    })


}; // end of function Database

/**
 * Database#delete_event(event_uid)
 * @pre: the db is initialized properly
 * @post: the event with event_uid is deleted
 * @return: nothing
 * @param: 'event_uid', event to delete
 */
Database.prototype.delete_event = function(event_uid) {
    let query = "DELETE FROM tb_events WHERE uid = '" + event_uid + "';";
    this.db.run(query);
} // end of Database#delete_event

/**
 * Database#keyval_parse(event, key, value, payload)
 * @pre: nothing
 * @post: the event parameter is modified
 * @param: 'event' is the event to modify, 'key' and 'value' are the given keyval pair, 'payload' is an optional payload
 * @return: nothing
 */
Database.prototype.keyval_parse = function(event, key, value, payload) {
    if (key == "name") {
        event.name = value;
    }
    if (key == "description") {
        event.description = value;
    }
    if (key == "date") {
        event.date = value;
    }
    if (key == "task_list") {
        event.task_list = value;
    }
    if (key == "times") {
        event.times = value;
    }
    if (key == "owner") {
        event.owner = value;
    }
    if (key == "attendee") {
        let attendee = {};
        attendee.name  = value;
        payload = payload.split('|');
        attendee.task_list = payload[1].split(',');
        attendee.times = payload[0]?payload[0].split(',').map(a=>+a):[];
        event.attendees.push(attendee);
    }
}; // end of function Database#keyval_parse

/**
 * Database#read_event(uid, callback)
 * @pre: the db being initialized
 * @post: the db is read
 * @param: 'uid' is the event uid to get, callback' is a function called when the read is complete
 * @return: nothing
 */
Database.prototype.read_event = function(uid, callback) {
    let event = new Event();
    let obj   = this;

    this.db.each("SELECT * FROM tb_events WHERE uid = ? ;", [uid], function(err, row) {
        event.uid           = uid;
        event.name          = row.name;
        event.description   = row.description;
        event.task_list     = row.task_list;
        event.dates         = row.dates;
        event.times         = row.times;
        event.attendees     = row.attendee_list;
        event.owner         = row.owner;

    }, function(err, rows) {
        if (rows != undefined && rows != 0) {
            callback(event);
        } else {
            callback(null);
        }
    });
}; // end of Database#read_event


/**
 * Database#read_events(callback)
 * @pre: the db being initialized
 * @post: the db is read
 * @param: 'callback' is a function called when the read is complete
 * @return: an array of the event objects read. if the db wasn't initialized, an
 *          empty array is returned
 */
Database.prototype.read_events = function(callback) {
    let events = [];

    let obj = this;
    events = new Array();

    // Get all distinct event UIDs
    this.db.all("SELECT DISTINCT uid FROM tb_events", function(uid_err, uid_rows) {
        if (uid_rows.length == 0) {
            callback([]);
        }

        // Iterate through each UID
        uid_rows.forEach(function(uid_row) {
            // Get the event object with this UID from the db
            obj.read_event(uid_row.uid, function(event) {
                events.push(event);
                if (events.length == uid_rows.length) {
                    callback(events);
                }
            });
        });
    });
}; // end of Database#read_events

/**
 * Database#register(attendee)
 * @pre: the db is initialized properly
 * @post: attendee is registered the given event
 * @return: nothing
 * @param: 'attendee', the person to register
 */
Database.prototype.register = function(uid, task_list,attendees) {
    // this.db.run(
    //   "INSERT INTO tb_events (uid, attendee) VALUES ( ? , ? );",
    //   [attendee.event, JSON.stringify(attendee)]
    // );

    this.db.run(
        "UPDATE tb_events SET task_list = ? , attendee_list = ? WHERE uid = ?;",
        [task_list.toString(),attendees,uid]
    )
} // end of Database#register


// Database#write_event(event)
// @pre: the db is initialized properly
// @post: event is written to the db
// @return: nothing
// @param: 'event', the object to be written to the db

Database.prototype.write_event = function(event) {
    let obj = this;

    // Add the event to the event table
    obj.db.run(
        "INSERT INTO tb_events (uid, name, description, owner, dates, times, task_list, attendee_list) VALUES ( ? , ? , ? , ? , ? , ? , ?, ?);",
        [event.uid, event.name, event.description, event.owner, event.dates, event.times, event.task_list, event.attendees]
    );

}; // end of function Database#write_event

module.exports = Database;
