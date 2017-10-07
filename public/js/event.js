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
		let eventInfo = null
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
		for (let i = 0; i < this.event.times.length; i++) {
			for (let k = 0; k < this.event.times[i].length; k++) {
				if (k == 0 && i == 0 || k == 1 && i != 0) {
					let date_cell = document.createElement('th')
					date_cell.setAttribute("colspan", this.event.times[i].length)
					date_cell.innerHTML = (this.event.dates[i])
					date_cell.style.textAlign = 'left';
					date_cell.style.fontWeight = 'bold'
					date_row.appendChild(date_cell)
				} else if (k == 0) {
					let date_cell = document.createElement('th')
					date_cell.style.width = '10px';
					date_row.appendChild(date_cell)
				}

				let th = document.createElement('th')
				th.innerHTML = slots[this.event.times[i][k]]
				tr.appendChild(th)
			}
			if (i < this.event.times.length - 1) {
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

			for (let i = 0; i < this.event.times.length; i++) {
				for (let k = 0; k < this.event.times[i].length; k++) {
					let td = document.createElement('td')

					if (k == 0 && i != 0) {
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

		// NOT ENTIRELY SURE THAT THE PARTICIPANTS ROW IS NECCESSARY
		// KNOWN BUG: The participants map in the commented code below does not work


		/*
		let ttr = document.createElement('tr')
		let ttd = document.createElement('td')
		ttd.innerHTML = 'Participants'
		ttd.className = 'check_count'
		ttr.appendChild(ttd)

		for (let i = 0; i < this.event.times.length; i++) {
			for (let k = 0; k < this.event.times[i].length; k++) {
				if (k == 0 && i != 0) {
					let spacer = document.createElement('td')
					spacer.className = 'spacer'
					ttr.appendChild(spacer)
				}
				let td = document.createElement('td')
				td.className = 'check_count'
				td.innerHTML = [].concat(...this.event.attendees[i].times.map(a => a.times)).filter(a => a == this.event.times[i][k]).length
				ttr.appendChild(td)
			}
		}

		tbody.appendChild(ttr)
		*/

		// CREATE SPACER ROW
		let str = document.createElement('tr');
		let std = document.createElement('td');

		std.appendChild(document.createElement('br'));
		std.appendChild(document.createTextNode("Sign Up"));
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

		for (let i = 0; i < this.event.times.length; i++) {
			for (let k = 0; k < this.event.times[i].length; k++) {

				if (k == 0 && i != 0) {
					let spacer = document.createElement('td')
					spacer.className = 'spacer'
					utr.appendChild(spacer)
				}

				let td = document.createElement('td')
				let checkbox = document.createElement('input')
				checkbox.type = 'checkbox'
				checkbox.value = i + "," + this.event.times[i][k]
				checkbox.setAttribute("Day", i)
				td.appendChild(checkbox)
				utr.appendChild(td)

			}
		}
		tbody.appendChild(utr)

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

			let unprocessed_times = Array.from($('input[type="checkbox"][value]:checked')).map(el => el.value)
			let time = []

			for (let i in this.event.dates) {
				time[i] = []
			}

			for (let i in unprocessed_times) {
				unprocessed_times[i] = unprocessed_times[i].split(',')
				time[unprocessed_times[i][0]].push(parseInt(unprocessed_times[i][1]))
			}


			let payload = {}
			payload.event_uid = this.event.uid
			payload.all_attendees = this.event.attendees;

			payload.name = this.name.value
			payload.times = time
			payload.attendee_task_list = this.attendee_task_list;
			payload.new_event_task_list = this.event.task_list.filter(x => this.attendee_task_list.indexOf(x) == -1);
			if (!payload.name) {
				this.createErrorModal(this.eventInfo, "You must enter a name.")
				return
			}
			if (payload.times.every((day_array) => {
				if (day_array.length == 0) { return (true) }
			})) {
				this.createErrorModal(this.eventInfo, "You must choose at least one time.")
				return
			}

			console.log(payload);
			fetch('/api/events/register/', {
				headers: { 'Content-Type': 'application/json' },
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
	 * Creates the modal with the table of registered guests
	 * @param {div} div an html div object that gives place to insert the modal
	 */
	createModal(div) {
		let task_table = document.createElement('div');
		div.appendChild(task_table);

		if (this.event.task_list_master.length) {

			let info_tab = document.createElement('div');
			info_tab.innerHTML = "<a class='has-text-grey-light'>Clear here to see what people are already bringing</a>";
			div.appendChild(info_tab)



			info_tab.addEventListener("click", event => {
				let modal = document.createElement('div')
				modal.className = "modal"

				let modal_background = document.createElement('div')
				modal_background.className = "modal-background"

				let modal_content = document.createElement('div')
				modal_content.className = "modal-content"
				modal_content.style.backgroundColor = "#fff"
				modal_content.style.borderRadius = "5px"
				modal_content.style.padding = "2%"

				let header = document.createElement('h1')
				header.className = "title"
				header.textContent = this.event.name + " Guests"
				modal_content.appendChild(header)

				let subheader = document.createElement('h2')
				subheader.className = "subtitle"
				subheader.innerHTML = "Who is bringing what?"
				modal_content.appendChild(subheader)

				let task_list_table = document.createElement('table')
				task_list_table.style.width = "100%"
				let tr = document.createElement('tr')
				let td_attendee = document.createElement('td')
				td_attendee.innerHTML = "Attendee"
				td_attendee.style.fontWeight = "bold"

				td_attendee.setAttribute("colspan", 2)
				tr.appendChild(td_attendee)
				task_list_table.appendChild(tr)

				for (let i in this.event.attendees) {

					let atr = document.createElement('tr')
					let atd = document.createElement('td')
					atd.textContent = this.event.attendees[i].name
					atd.style.width = "30%"

					let ttd = document.createElement('td')

					if (this.event.attendees[i].task_list == undefined || this.event.attendees[i].task_list == "") {
						ttd.innerHTML = "&nbsp;-"
					} else {
						ttd.textContent = this.event.attendees[i].task_list
					}
					ttd.style.width = "70%"
					task_list_table.appendChild(atr)

					// style the table
					if (i % 2 == 0) {
						atd.style.backgroundColor = "#f0f0f0"
						atr.style.backgroundColor = "#f0f0f0"
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

				let modal_close = document.createElement('button')
				modal_close.className = "modal-close is-large"
				modal_close.setAttribute("aria-label", "close")

				modal_close.addEventListener("click", event => {
					modal.className = "modal"
				})

				modal.appendChild(modal_background)
				modal_content.appendChild(task_list_table)
				modal_content.appendChild(modal_close)
				modal.appendChild(modal_content)

				modal.className = "modal is-active"
				task_table.appendChild(modal)
			})
		}
	}

	/**
	 * Creates the modal with the table of registered guests
	 * @param {div} div an html div object that gives place to insert the modal
	 * @param {string} msg a string containing an error message to place in the modal
	 */
	createErrorModal(div, msg) {
		let task_table = document.createElement('div');
		div.appendChild(task_table);

		let info_tab = document.createElement('div');
		div.appendChild(info_tab)

		let modal = document.createElement('div')
		modal.className = "modal"

		let modal_background = document.createElement('div')
		modal_background.className = "modal-background"

		let modal_content = document.createElement('div')
		modal_content.className = "modal-content"
		modal_content.style.backgroundColor = "#fff"
		modal_content.style.borderRadius = "5px"
		modal_content.style.padding = "2%"

		let header = document.createElement('h1')
		header.className = "title"
		header.innerHTML = "Error"
		modal_content.appendChild(header)

		let subheader = document.createElement('h2')
		subheader.className = "subtitle"
		subheader.innerHTML = msg
		modal_content.appendChild(subheader)


		let modal_close = document.createElement('a')
		modal_close.className = "button is-warning"
		modal_close.innerHTML = "Ok"

		modal_close.addEventListener("click", event => {
			modal.className = "modal"
		})

		modal.appendChild(modal_background)
		modal_content.appendChild(modal_close)
		modal.appendChild(modal_content)

		modal.className = "modal is-active"
		task_table.appendChild(modal)
	}


	/**
	 * Create task requests
	 * @param {div} parentDiv an html div object to place the help out button
	 */
	createTaskAdder(parentDiv) {
		let task_list = document.createElement('div');
		parentDiv.appendChild(task_list);

		let task_button = document.createElement('div');
		let task_list_button = this.createTaskButton()
		task_button.appendChild(task_list_button)

		parentDiv.appendChild(task_button);

		task_list_button.addEventListener('click', event => {
			parentDiv.removeChild(task_button);
			let header = document.createElement('div')
			header.innerHTML = "Select tasks"
			task_list.appendChild(header);

			let task_button_container = document.createElement('div');
			task_button_container.className = "field is-grouped is-grouped-multiline";
			let tasks = [];

			for (let i in this.event.task_list) {
				let task = document.createElement('p')
				task.className = "control button is-small";
				task.textContent = this.event.task_list[i];
				task_button_container.appendChild(task);
				tasks.push(task);
			}

			for (let i in tasks) {
				tasks[i].addEventListener('click', event => {
					if (!this.attendee_task_list.includes(tasks[i].innerHTML)) {
						tasks[i].className = "control button is-dark is-small";
						this.attendee_task_list.push(tasks[i].innerHTML)
					} else {
						tasks[i].className = "control button is-small task";
						let loc = this.attendee_task_list.indexOf(tasks[i].innerHTML);
						this.attendee_task_list.splice(loc, 1)
					}
				})
			}
			task_list.appendChild(task_button_container);
		})
	}

	/**
	 * Creates a div that contains the Attendee table, Register Button, and Task List information
	 * @return {Element} div containing page contents
	 */
	createEventInfo() {
		this.eventInfo = document.createElement('div')
		this.eventInfo.appendChild(this.createAttendeeTable())

		// If there are requests still needing assigned, create the button and list 
		// else print that all requests have been met
		if (this.event.task_list.length > 0 && this.event.task_list[0].length > 1) {
			this.createTaskAdder(this.eventInfo);
		} else {
			this.eventInfo.appendChild(document.createTextNode("All requests have been met."))
		}

		// Registration Button
		let submit_button = document.createElement('div');
		submit_button.className = "submit_container";
		submit_button.appendChild(this.createSignupButton())
		this.eventInfo.appendChild(submit_button);

		// Handle modal that holds which requests have been met by attendees
		this.createModal(this.eventInfo)

		return this.eventInfo
	}
}

$(() => {
	let event_id = (new URLSearchParams(window.location.search)).get('id')
	fetch('/api/events/?uid=' + event_id).then(res => res.json()).then(event => {
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