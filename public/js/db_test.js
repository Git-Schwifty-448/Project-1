console.log("start");


let payload = {
    name: "448 Test Event",
    description: "This is a simple event desc",
    task_list: ['string','Requests','array'],
    times: [22, 23],
    date: "Mon Oct 02 2017", 
    owner: "abe"
  }

  console.log(payload)

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
    console.log('/event/?id='+res.uid);
  })

// NOW RECALL EVENTS FROM DATABSE

fetch('/api/events/').then(res => res.json()).then(event_list => {
        console.log(event_list)
  })
