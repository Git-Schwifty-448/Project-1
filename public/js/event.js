import $ from '/js/init.js'
import Calendar from '/js/calendar.js'
/**
 * Class for Event Page methods
 */
export class EventPage {
  /**
   * @param {object} event - Contains event information
   */
  constructor(event) {
    /** @member {object} event - Event information */
    this.event = event;
    this.event.attendees = JSON.parse(this.event.attendees);
    this.event.dates = JSON.parse(this.event.dates);
    this.event.times = JSON.parse(this.event.times);

    // console.log(this.event)
  }

  /**
   * Creates the Attendee table
   * @return {Element} div containing the Attendee Table
   */
  createAttendeeTable() {
    let slots = Calendar.time_slots(false)
    let t_cont = document.createElement('div')
    t_cont.className = "table_container"
    let table = document.createElement('table')
    let tbody = document.createElement('tbody')
    let thead = document.createElement('thead')

    let date_row = document.createElement('tr')
    let date_cell = document.createElement('th')
    date_row.appendChild(date_cell);



    let tr = document.createElement('tr')
    let th = document.createElement('th')
    tr.appendChild(th)

    for(let i = 0; i < this.event.times.length; i++) {
      for (let k = 0; k<this.event.times[i].length; k++) {
        if(k == 0 && i == 0 || k == 1 && i != 0 ) {
          let date_cell = document.createElement('th')
          date_cell.innerHTML = (this.event.dates[i])
          date_row.appendChild(date_cell)  
        } else {
          let date_cell = document.createElement('th')
          date_row.appendChild(date_cell)  
        }

        let th = document.createElement('th')
        th.innerHTML = slots[this.event.times[i][k]]
        tr.appendChild(th)
      }
      if(i < this.event.times.length-1) {
        let spacer = document.createElement('th')
        spacer.className = 'spacer'
        tr.appendChild(spacer)
      }
    }

    thead.appendChild(date_row);
    thead.appendChild(tr)
    table.appendChild(thead)
    table.appendChild(tbody)



    for (let j = 0; j < this.event.attendees.length; j++) {
      this.event.attendees[j].times = JSON.parse(this.event.attendees[j].times);

      let tr = document.createElement('tr')
      let name = document.createElement('td')

      if (this.event.attendees[j].name == this.event.attendees[0].name) {
        name.className = "owner"
      }
      name.appendChild(document.createTextNode(this.event.attendees[j].name))
      tr.appendChild(name)
      
      for(let i = 0;i<this.event.times.length; i++) {
        for (let k = 0; k<this.event.times[i].length; k++) {
          let td = document.createElement('td')

          if(k == 0 && i != 0 ) {
            let spacer = document.createElement('td')
            spacer.className = 'spacer'
            tr.appendChild(spacer)
          }

          let checkbox = document.createElement('input')
          checkbox.type = 'checkbox'

          if (this.event.attendees[j].times[i].includes(this.event.times[i][k])) {
            checkbox.checked = "checked"
          }
          checkbox.disabled = true
          td.appendChild(checkbox)
          tr.appendChild(td)
        }
      }
      tbody.appendChild(tr)
    }

    let utr = document.createElement('tr')
    utr.className = 'user-tr'
    let utd = document.createElement('td')
    let uinput = document.createElement('input')
    uinput.className = "input is-small"
    uinput.placeholder = "Your name"
    /** @member {object} name - Text field for user registeration */
    this.name = uinput
    utd.appendChild(uinput)
    utr.appendChild(utd)

    for(let i = 0;i<this.event.times.length; i++) {
      for (let k = 0; k<this.event.times[i].length; k++) {

        if(k == 0 && i != 0 ) {
          let spacer = document.createElement('td')
          spacer.className = 'spacer'
          utr.appendChild(spacer)
        }

        let td = document.createElement('td')
        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.value = this.event.times[i][k]
        td.appendChild(checkbox)
        utr.appendChild(td)

      }
    }
    tbody.appendChild(utr)

    // NOT ENTIRELY SURE THAT THE PARTICIPANTS ROW IS NECCESSARY
    // KNOWN BUG: The participants map in the commented code below does not work
    

        /*
        let ttr = document.createElement('tr')
        let ttd = document.createElement('td')
        ttd.innerHTML = 'Participants'
        ttd.className = 'check_count'
        ttr.appendChild(ttd)

        for(let i = 0;i<this.event.times.length; i++) {
          for (let k = 0; k<this.event.times[i].length; k++) {
            if(k == 0 && i != 0 ) {
              let spacer = document.createElement('td')
              spacer.className = 'spacer'
              ttr.appendChild(spacer)
            }
            let td = document.createElement('td')
            td.className = 'check_count'
            console.log(this.event.attendees);

            td.innerHTML = [].concat(...this.event.attendees.map(a=>a.times)).filter(a=>a==this.event.times[i]).length
            ttr.appendChild(td)
          }
        }

        // tbody.appendChild(ttr)
        t_cont.appendChild(table)
        return t_cont
      }
      */


      
  /**
   * Creates the Register button
   * @return {Element} button for registering a new attendee
   */
  createSignupButton() {
    let button = document.createElement('button')
    button.innerHTML = 'Register'
    button.className = 'button is-primary'
    button.addEventListener('click', event => {
      let payload = {}
      payload.uid = this.event.uid
      payload.name = this.name.value
      payload.task_list = []
      payload.times = Array.from($('input[type="checkbox"][value]:checked')).map(el => +el.value)
      if (!payload.name) {
        alert("You must enter your name!")
        return
      }
      fetch('/api/events/register/', {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify(payload)
      }).then(res => res.json()).then(res => {
        if (res.status != "ok") {
          alert("Could not contact server, please try again")
          return
        }
        window.location.reload()
      })
    })
    return button
  }

  /**
   * Creates a div that contains the Attendee table and Register Button
   * @return {Element} div containing page contents
   */
  createEventInfo() {
    let eventInfo = document.createElement('div')

    eventInfo.appendChild(this.createAttendeeTable())
    eventInfo.appendChild(this.createSignupButton())

    return eventInfo
  }
}

$(() => {
  let event_id = (new URLSearchParams(window.location.search)).get('id')
  fetch('/api/events/?uid='+event_id).then(res => res.json()).then(event => {
    if (!event) {
      $('.content_card')[0].innerHTML = "This event does not exist"
      return
    }
    // event.owner = JSON.parse(event.owner);
    // event.dates = JSON.parse(event.dates);
    // console.log(event.dates);
    // console.log(event.owner);
    // event.owner = [].concat({name: event.owner, times: event.times}, event.attendees)
    let event_page = new EventPage(event)
    $('h1.title')[0].appendChild(document.createTextNode(event.name))
    $('h2.event_date')[0].appendChild(document.createTextNode("Starting " + event.dates[0]))
    $('h2.subtitle')[0].appendChild(document.createTextNode(event.description))
    $('.content_card')[0].appendChild(event_page.createEventInfo(event))
  })
})
