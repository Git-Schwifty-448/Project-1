/**
 * @file: database_test.js
 * @date: September 2017
 * @brief: Database object testing
 */

var assert      = require('assert');

var Database    = require('../src/database.js');
var sqlite3     = require('sqlite3').verbose();

var Event       = require('../src/event.js');

describe('Database', function() {

    // Example event for testing
    let event         = new Event();
    event.name        = 'EECS 448 presentation';
    event.description = 'Presenting our first project';
    event.time_slots  = [22, 23];
    event.attendees   = ['Ben^2', 'Jacob'];


    describe('#write_event', function() {
        it('should write an event to the database', function(done) {

            let database = new Database(':memory:', function() {
                database.write_event(event);

                database.db.get('SELECT * FROM tb_events WHERE name=\'EECS 448 presentation\';', function(err, row) {
                    assert.notEqual(row, undefined);

                    assert.equal(row.name,        event.name);
                    assert.equal(row.description, event.description);
                    assert.equal(row.time_slots,  event.time_slots);
                    assert.equal(row.attendees,   event.attendees);

                    done();
                });
            });
        });
    });

    describe('#read_events', function() {
        it('should read the events from the database', function(done) {
            let database = new Database(':memory:', function() {
                const size = 4;

                for(let i = 0; i < size; ++i) {
                    database.write_event(event);
                }

                database.read_events(function(events) {
                    assert.equal(events.length, size);

                    for(let i = 0; i < size; ++i) {
                        assert.equal(events[i].name,        event.name);
                        assert.equal(events[i].description, event.description);
                        assert.equal(events[i].time_slots,  event.time_slots);
                        assert.equal(events[i].attendees,   event.attendees);
                    }

                    done();
                });
            });
        });
    });
});