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
    this.event.task_list = this.event.task_list.split(',');
    this.attendee_task_list = [];
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

    // CREATE TABLE HEADER INFORMATION
    for(let i = 0; i < this.event.times.length; i++) {
      for (let k = 0; k<this.event.times[i].length; k++) {
        if(k == 0 && i == 0 || k == 1 && i != 0 ) {
          let date_cell = document.createElement('th')
          date_cell.setAttribute("colspan",this.event.times[i].length)
          date_cell.innerHTML = (this.event.dates[i])
          date_cell.style.textAlign = 'left';
          date_cell.style.fontWeight = 'bold'
          date_row.appendChild(date_cell)  
        } else if( k == 0 ) {
          let date_cell = document.createElement('th')
          date_cell.style.width = '10px';
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

    // CREATE EACH ATTENDEE ROW WITH ATTENDANCE INFORMATION
    for (let j = 0; j < this.event.attendees.length; j++) {

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

    // CREATE SPACER ROW
    let str = document.createElement('tr');
    let std = document.createElement('td');

    std.appendChild(document.createElement('br'));
    std.appendChild(document.createTextNode("Sign Up"));
    std.appendChild(document.createElement('br'));
    std.className = "owner"
    str.appendChild(std);
    tbody.appendChild(str)

    // SET UP REGISTRATION DATA
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

        tbody.appendChild(ttr)
        */
        
    t_cont.appendChild(table)
    return t_cont
  }

  /**
   * Creates the Register button
   * @return {Element} button for registering a new attendee
   */
  createSignupButton() {
    let button = document.createElement('button')
    button.innerHTML = 'Register'
    button.className = 'submit button is-dark'

    button.addEventListener('click', event => {

      let payload = {}
      payload.event_uid = this.event.uid
      payload.all_attendees = this.event.attendees;

      payload.name = this.name.value
      payload.times = [Array.from($('input[type="checkbox"][value]:checked')).map(el => +el.value)]
      payload.attendee_task_list = this.attendee_task_list;
      payload.new_event_task_list = this.event.task_list.filter(x => this.attendee_task_list.indexOf(x) == -1);
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
   * Creates the task list button
   * @return {Element} button for registering for a task
   */
  createTaskButton() {
    let button = document.createElement('button')
    button.innerHTML = 'Help Out'
    button.className = 'submit button is-small'
    return button
  }

  /**
   * Creates a div that contains the Attendee table and Register Button
   * @return {Element} div containing page contents
   */
  createEventInfo() {
    let eventInfo = document.createElement('div')
    eventInfo.appendChild(this.createAttendeeTable())

    let task_list = document.createElement('div');
    eventInfo.appendChild(task_list);

    // If there are requests, create the request form
    if(this.event.task_list.length > 0 && this.event.task_list[0].length > 1) {
      let task_button = document.createElement('div');
      let task_list_button = this.createTaskButton()
      task_button.appendChild(task_list_button)
      eventInfo.appendChild(task_button);

      task_list_button.addEventListener('click', event => {
        eventInfo.removeChild(task_button);
        let header = document.createElement('div')
        header.innerHTML = "Select tasks"
        task_list.appendChild(header);

        let task_button_container = document.createElement('div');
        task_button_container.className = "field is-grouped is-grouped-multiline";
        let tasks = [];

        for(let i in this.event.task_list) {
          let task = document.createElement('p')
          task.className = "control button is-small";
          task.innerHTML = this.event.task_list[i];
          task_button_container.appendChild(task);
          tasks.push(task);
        }

        for(let i in tasks) {
          tasks[i].addEventListener('click', event => {

            if(!this.attendee_task_list.includes(tasks[i].innerHTML)) {
              tasks[i].className = "control button is-dark is-small";
              this.attendee_task_list.push(tasks[i].innerHTML)
            } else {
              tasks[i].className = "control button is-small task";
              let loc = this.attendee_task_list.indexOf(tasks[i].innerHTML);
              this.attendee_task_list.splice(loc,1)
            }
          })
        }
        task_list.appendChild(task_button_container);
    })

    } else {
      eventInfo.appendChild(document.createTextNode("All requests have been met."))
    }

    // Submit the form
    let submit_button = document.createElement('div');
    submit_button.className = "submit_container";
    submit_button.appendChild(this.createSignupButton())

    eventInfo.appendChild(submit_button);

    let task_table = document.createElement('div');
    eventInfo.appendChild(task_table);

    let info_tab = document.createElement('div');
    info_tab.innerHTML = "<a class='has-text-grey-light'>Clear here to see what people are already bringing</a>";
    eventInfo.appendChild(info_tab)

    info_tab.addEventListener( "click", event => {
      eventInfo.removeChild(info_tab);

      let task_list_table = document.createElement('table')
      task_list_table.style.width = "66%"
      let tr = document.createElement('tr')
      let td_attendee = document.createElement('td')
      td_attendee.innerHTML = "Attendee"
      td_attendee.style.fontWeight = "bold"
      td_attendee.setAttribute("colspan",2)
      tr.appendChild(td_attendee)
      task_list_table.appendChild(tr)

      for(let i in this.event.attendees) {

        let atr = document.createElement('tr')
        let atd = document.createElement('td')
        atd.innerHTML = this.event.attendees[i].name
        atd.style.width = "30%"
        
        let ttd = document.createElement('td')
        
        if(this.event.attendees[i].task_list == undefined || this.event.attendees[i].task_list == "") {
          ttd.innerHTML = "&nbsp;-"
        } else {
          ttd.innerHTML = this.event.attendees[i].task_list
        }
        ttd.style.width = "70%"
        task_list_table.appendChild(atr)

        // style the table
        if (i % 2 == 0){
          atd.style.backgroundColor = "#fcfcfc"
          atr.style.backgroundColor = "#fcfcfc"
        }
        atd.style.borderWidth = "1px";
        atd.style.borderColor = "#fff";
        atd.style.borderStyle = "solid";
        ttd.style.borderWidth = "1px";
        ttd.style.borderColor = "#fff";
        ttd.style.borderStyle = "solid";
        
        atr.appendChild(atd)
        atr.appendChild(ttd)
      }
      task_table.appendChild(task_list_table)
    })
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
    let event_page = new EventPage(event)
    $('h1.titleext')[0].appendChild(document.createTextNode(event.name))
    $('h2.event_date')[0].appendChild(document.createTextNode("Starting " + event.dates[0]))
    $('h2.subtitleext')[0].appendChild(document.createTextNode(event.description))
    $('.content_card')[0].appendChild(event_page.createEventInfo(event))
  })
})