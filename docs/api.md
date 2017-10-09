# API Documentation

All POST requests are closed without redirecting the page.

### GET `/api/events`
Retrieves events from the server.

| Request variable | Type | Description | 
| --- | --- | --- |
| `uid` | string | The server-assigned event UID. If empty, the server returns every event. |

The return data is a JSON object formatted as:

| Attribute | Type | Description | 
| --- | --- | --- |
| `name` | string | Name of the event |
| `description` | string | Description of the event |
| `date` | string | Date of the event (format agnostic) |
| `times` | array | Integer array of the time of the event (0-47) |
| `owner` | string | Name of the event owner/creator |
| `task_list` | string | A string of tasks that need assigned |
| `task_list_master` | string | A string of all the tasks assigned to an event |
| `attendees` | array | An array of Attendee objects which describes the attendee and what times they are attending |

### POST `/api/events/new`
Creates a new event on the server.

| Request variable | Type | Description | 
| --- | --- | --- |
| `name` | string | Name of the event |
| `description` | string | Description of the event |
| `date` | string | Date of the event (format agnostic) |
| `times` | array | Integer array of the time of the event (0-47) |
| `task_list` | string | A string of tasks that need assigned |
| `task_list_master` | string | A string of all the tasks assigned to an event |
| `owner` | string | The person who created the event |

### POST `/api/events/register`

Registers a person to attend an event

| Request variable | Type | Description | 
| --- | --- | --- |
| `uid` | string | UID of the event |
| `task_list` | string | Updated task list of the parent event |
| `attendee` | Attendee Obj | Instance of Attendee that includes updated task_list |

### POST `/api/events/delete`
Deletes a given event from the server.

| Request variable | Type | Description | 
| --- | --- | --- |
| `uid` | string | UID of the event to delete. |
