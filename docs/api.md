# API Documentation

All POST requests are closed without redirecting the page.

### GET `/api/events`
Retrieves events from the server.

| Request variable | Type | Description | 
| --- | --- | --- |
| `uid` | string | The server-assigned event UID. If empty, the server returns every event. |

The return data is a JSON object formatted as:

| Key | Type | Description | 
| --- | --- | --- |
| `name` | string | Name of the event |
| `description` | string | Description of the event |
| `date` | string | Date of the event (format agnostic) |
| `times` | array | Integer array of the time of the event (0-47) |
| `owner` | string | Name of the event owner/creator |
| `attendees` | array | An array of JS objects with two keys: `name` (string), `times` (integer array), which describes the attendees and what times they are attending |

### POST `/api/events/new`
Creates a new event on the server.

| Request variable | Type | Description | 
| --- | --- | --- |
| `name` | string | Name of the event |
| `description` | string | Description of the event |
| `date` | string | Date of the event (format agnostic) |
| `times` | array | Integer array of the time of the event (0-47) |
| `owner` | string | The person who created the event |

### POST `/api/events/register`

Registers a person to attend an event

| Request variable | Type | Description | 
| --- | --- | --- |
| `uid` | string | UID of the event |
| `name` | string | Name of the attendee |
| `times` | array | Integer array of the times the user is attending |

### POST `/api/events/delete`
Deletes a given event from the server.

| Request variable | Type | Description | 
| --- | --- | --- |
| `uid` | string | UID of the event to delete. |
