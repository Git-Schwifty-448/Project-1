console.log("start");


let payload = {
    name: "448 Test Event",
    description: "This is a simple event desc",
    task_list: ['string','Requests','array'],
    times: [22, 23],
    date: "Mon Oct 02 2017", 
    owner: "abe"
  }

//   console.log(payload)

fetch("/api/events/new/", {

    headers: {'Content-Type': 'application/json'},
    method: "POST",

    body: JSON.stringify(payload)


  }).then(res => res.json()).then(res => {
    if (res.status != "ok") {
      alert("Could not contact server, please try again")
      return
    }
    // window.location.href = '/event/?id='+res.uid
    // console.log('/event/?id='+res.uid);
  })

// NOW RECALL EVENTS FROM DATABSE

let event = null;

fetch('/api/events/').then(res => res.json()).then(event_list => {
        // console.log(event_list);

        
        event = event_list[0];
        add_attendee();
  })


  function add_attendee() {

    console.log(event);
    //   uid = event_list[0].

    let attendee = {}
    attendee.uid = event.uid
    attendee.name = "Dick"
    attendee.times = [22]
    attendee.task_list = ['string']

    console.log(attendee);

    fetch('/api/events/register/', {
          headers: {'Content-Type': 'application/json'},
          method: "POST",
          body: JSON.stringify(attendee)
        }).then(res => res.json()).then(res => {
          if (res.status != "ok") {
            alert("Could not contact server, please try again")
            return
          }
          
          //reprint to console

          fetch('/api/events/').then(res => res.json()).then(el => {console.log(el) })
        })

  }

// THE GOAL IS TO ADD A NEW ATTENDEE AND THEN UPDATE THE TASK LIST IF THEY CHOOSE A TASK
// FROM A DROP DOWN BOX OF AVAILIABLE THINGS TO BRING