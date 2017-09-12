/**
 * @file: database.js
 * @date: September 2017
 * @brief: Database object description
 */

var sqlite3 = require('sqlite3').verbose();

var Event   = require('./event.js');

/**
 * Database(path)
 * @pre: nothing
 * @post: a database is created on disk at path
 * @return: a Database object
 * @param: 'path', the path for the database
 */
function Database(path, callback) {
    this.path        = path;
    this.initialized = false;
    this.query_stack = [];

    const create_table = "CREATE TABLE IF NOT EXISTS tb_events"
                       + "("
                       + "_id INTEGER PRIMARY KEY, "
                       + "hash TEXT NOT NULL, "
                       + "name TEXT NOT NULL, "
                       + "description TEXT, "
                       + "time_slots TEXT, "
                       + "attendees TEXT"
                       + ");";

    let obj = this; // used to access 'this' in the following closure
    
    // create/init connection to db
    this.db = new sqlite3.Database(path, function() {

        // create primary table
        obj.db.run(create_table, function() {
            obj.initialized = true;

            obj.query_stack.forEach(function(ele) {
                obj.db.run(ele);
            });

            if(callback) callback();
        });
    });
} // end of function Database

/**
 * Database#read_events()
 * @pre: the db being initialized
 * @post: the db is read
 * @param: 'callback' is a function called when the read is complete
 * @return: an array of the event objects read. if the db wasn't initialized, an
 *          empty array is returned
 */
Database.prototype.read_events = function(callback) {
    this.db.all("SELECT * FROM tb_events", function(err, rows) {
        let events = [];

        rows.forEach(function(row) {
            let event = new Event();
            event.name        = row.name;
            event.description = row.description;
            event.time_slots  = row.time_slots;
            event.attendees   = row.attendees;

            events.push(event);
        });

        if(callback) callback(events);
    });
} // end of Database#read_events

/**
 * Database#write(query)
 * @pre: the db being initialized
 * @post: the query is written to the db, or put on a queue_stack to be written
 * @return: nothing
 * @param: 'query', the query to execute
 * @note: this function exists because some queries fail if they are ran right
 *        after the db is created. To ensure none fail, if a query is requested
 *        before the db is init'ed, it is put in an array to be handled later
 */
Database.prototype.write = function(query) {
    if(this.initialized) {
        this.db.run(query);
    } else {
        this.query_stack.push(query);
    }
} // end of Database#write

/**
 * Database#write_event(event)
 * @pre: the db is initialized properly
 * @post: event is written to the db
 * @return: nothing
 * @param: 'event', the object to be written to the db
 */
Database.prototype.write_event = function(event) {
    let query = 'INSERT INTO tb_events (hash, name, description, time_slots, attendees) VALUES'
          + '('
          + '\'' + event.hash().substring(0, 8) + '\', '
          + '\'' + event.name + '\', '
          + '\'' + event.description + '\', '
          + '\'' + event.time_slots + '\', '
          + '\'' + event.attendees + '\''
          + ');';

    this.write(query);
} // end of function Database#write_event

module.exports = Database;