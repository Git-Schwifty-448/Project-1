import $ from '/js/init.js'
import Calendar from '/js/calendar.js'

/**
 * Class for creating days
 */

export class Day {

	constructor() {
		this.test = "test"
		this.slot_adder = new SlotAdder()
		this.date_input_field = undefined
		this.id = 0
		this.copy = false
	}

	create(day_id) {
		this.id = day_id

		if (day_id > 1) {
			this.copy = true
		}

		// Create the container for the day
		let day_div = document.createElement('div')
		day_div.appendChild(document.createElement('br'))

		let title = document.createElement('label')
		title.className = "label"
		title.innerText = "Day " + day_id
		day_div.appendChild(title)

		let day_info = document.createElement('div')
		day_info.className = "content_card box"

		// Get the date field
		day_info.appendChild(this.date_div())

		// Get the time fields
		day_info.appendChild(this.time_div())

		day_div.appendChild(day_info)
		return day_div
	}

	date_div() {
		let date_field = document.createElement('div')
		date_field.className = "field"

		// Create the date label
		let date_label = document.createElement('label')
		date_label.className = "label"
		date_label.innerText = "Date"

		date_field.appendChild(date_label)

		// Create the date field
		let date_input_field_div = document.createElement('div')
		date_input_field_div.className = "field has-addons"

		let date_control = document.createElement('div')
		date_control.className = "control"

		this.date_input_field = document.createElement('input')
		this.date_input_field.className = "date input"
		this.date_input_field.disabled = true

		date_control.appendChild(this.date_input_field)
		date_input_field_div.appendChild(date_control)
		date_field.appendChild(date_input_field_div)

		// Create the date picker button
		let button_control = document.createElement('div')
		button_control.className = "control"

		let date_button = document.createElement('button')
		date_button.className = "button"
		date_button.setAttribute("id", "date_picker")
		date_button.innerText = "Choose Date"

		button_control.appendChild(date_button)
		date_input_field_div.appendChild(button_control)

		let picker = new Pikaday({ field: this.date_input_field, minDate: new Date(), trigger: date_button })


		return (date_field)
	}

	time_div() {
		let time_field = document.createElement('div')

		let slot_field = document.createElement('div')
		time_field.appendChild(slot_field)

		if (!this.copy) {
			time_field.appendChild(this.slot_adder.createInitial())
		}
		time_field.appendChild(this.slot_adder.createButton(slot_field))

		if (this.copy) {
			time_field.appendChild(this.slot_adder.createCopyButton(slot_field))
		}

		return time_field
	}

	get_day_information() {
		let date = this.date_input_field.value
		let times = this.slot_adder.getTimes()
		return [date, times]
	}

}

/**
 * Class for managing process of adding days
 */
export class DayAdder {
    /**
     * Initialize the slot adder
     */
	constructor() {
		/** @member {Element[]} slots - Array of groups of time slot selectors */
		this.days = []
		this.day_count = 0


	}

    /**
     * Creates the button that adds a group of time selectors
     * @return {Element} button that adds a group of time selectors
     */
	createButton(div) {
		let button = document.createElement('button')
		button.className = "button"
		button.innerHTML = 'Add Another Day'
		button.style.marginTop = "3%"
		button.addEventListener('click', event => {
			let day = new Day()
			this.days.push(day)
			this.day_count++
			div.appendChild(day.create(this.day_count))

		})
		return button
	}

	createInitial() {
		let day = new Day()
		this.days.push(day)
		this.day_count++
		return (day.create(this.day_count))
	}

    /**
     * Creates array of all times slots that fall inside time slot ranges
     * @return {int[]} Array of all times slots that fall inside time slot ranges
     */
	getDays() {

		let day_info = []

		for (let i in this.days) {
			day_info.push(this.days[i].get_day_information())
		}

		return day_info
	}
}

/**
 * Class for creating time slots
 */
export class Slot {
    /**
     * @param {boolean} is24 - True: 24 hour time, False: 12 hour
     */
	constructor(is24) {
		/** @member {boolean} is24 - True: 24 hour time, False: 12 hour */
		this.is24 = is24

		/** @member {object} selectors - Group of selectors */
		this.selectors = {}

		/** @member {Element} group - Element that stores selectors */
		this.group = document.createElement('div')
		this.group.className = "pair"

		/** @member {Element} start_span - span to contain start-time selector */
		this.start_span = document.createElement('span')
		this.start_span.className = "select"
		this.start_span.appendChild(this.createStartSlot())
		this.group.appendChild(this.start_span)

		/** @member {Element} end_span - span to contain end-time selector */
		this.end_span = document.createElement('span')
		this.end_span.className = "select"
		this.end_span.appendChild(this.createEndSlot(1))
		this.group.appendChild(this.end_span)
	}

    /**
     * Creates a selector for selecting a time slot
     * @param {int} exclude - How many time slots to exclude from the selector
     * @param {int} def - default value of selector
     * @return {Element} Time slot selector
     */
	createSlotSelector(exclude = 0, def) {
		let slots = Calendar.time_slots(this.is24)
		let select = document.createElement('select')
		for (let i in slots) {
			if (i < exclude || (exclude == -1 && i == slots.length - 1)) continue
			let option = document.createElement('option')
			option.value = i
			option.innerHTML = slots[i]
			select.appendChild(option)
		}
		if (def && def >= exclude) select.value = def
		return select
	}

    /**
     * Creates the selector for the start time
     * @return {Element} Time slot selector
     */
	createStartSlot() {
		let slotsel = this.createSlotSelector(-1)
		slotsel.addEventListener('change', event => {
			let prevTime = +this.selectors.end.value
			this.selectors.end.remove()
			this.end_span.appendChild(this.createEndSlot(+slotsel.value + 1, Math.max(prevTime, +slotsel.value + 1)))
		})
		this.selectors.start = slotsel
		return slotsel
	}

    /**
     * Creates the selector for the end time
     * @param {int} exclude - How many time slots to exclude from the selector
     * @param {int} def - default value of selector
     * @return {Element} Time slot selector
     */
	createEndSlot(exclude = 0, def) {
		let slotsel = this.createSlotSelector(exclude, def)
		this.selectors.end = slotsel
		return slotsel
	}

    /**
     * Get element that stores selectors
     * @return {Element} Element that stores selectors
     */
	getSlotGroup() {
		return this.group
	}

    /**
     * Get range of time slots
     * @return {int[]} range of time slots
     */
	getRange() {
		return [+this.selectors.start.value, +this.selectors.end.value]
	}
}

/**
 * Class for managing button that adds time slots
 */
export class SlotAdder {
    /**
     * Initialize the slot adder
     */
	constructor() {
		/** @member {Element[]} slots - Array of groups of time slot selectors */
		this.slots = []

		/** @member {boolean} is24 - True: 24 hour time, False: 12 hour */
		this.is24 = false

		this.times_button = undefined
		this.request_button = undefined
	}

    /**
     * Creates the button that adds a group of time selectors
     * @return {Element} button that adds a group of time selectors
     */
	createButton(div) {
		let button = document.createElement('button')
		button.className = "button"
		button.innerHTML = 'Add a Time'
		button.style.marginRight = "2%"
		button.style.marginTop = "2%"
		button.addEventListener('click', event => {
			let slot = new Slot(this.is24)
			this.slots.push(slot)
			div.appendChild(slot.getSlotGroup())
		})
		this.times_button = button

		return button
	}

	createCopyButton(div) {
		let button = document.createElement('button')
		button.className = "button is-dark"
		button.innerHTML = 'Use Same Times as First Day'
		button.style.marginTop = "2%"
		this.times_button.disabled = true
		this.toggleSlots(div)
		button.addEventListener('click', event => {
			if (button.className == "button") {
				button.className = "button is-dark"
				this.times_button.disabled = true
				this.toggleSlots(div)
			} else {
				button.className = "button"
				this.times_button.disabled = false
			}
		})
		return button
	}

	toggleSlots(parentDiv) {
		this.slots = []
		while (parentDiv.hasChildNodes()) {
			parentDiv.removeChild(parentDiv.lastChild)
		}
	}

	createInitial(div) {
		let slot = new Slot(this.is24)
		this.slots.push(slot)
		return (slot.getSlotGroup())
	}

    /**
     * Creates array of all times slots that fall inside time slot ranges
     * @return {int[]} Array of all times slots that fall inside time slot ranges
     */
	getTimes() {
		if (this.copy) {
			return []
		}

		// Here be dragons
		return Array.from(new Set([].concat(...this.slots.map(x => Array.from({ length: x.getRange()[1] - x.getRange()[0] }, (n, i) => i + x.getRange()[0]))))).sort((a, b) => a - b)
	}
}



/**
 * Class for creating request slots
 */
export class RSlot {

	constructor(id, parent) {
		this.identifier = id

		// generate html
		this.request_div = document.createElement('div');
		this.request_input = document.createElement('input');
		this.request_input.className = "request input " + id;
		this.request_button = document.createElement('button')
		this.request_button.innerHTML = 'X'
		this.request_button.className = 'button'
		this.request_button.addEventListener('click', event => {
			parent.deleteRequest(this);
			this.request_div.parentNode.removeChild(this.request_div);
		})

		//input and button each get their own div
		this.request_input_div = document.createElement('div');
		this.request_input_div.style.marginBottom = "1%"
		this.request_input_div.style.float = 'left'
		this.request_input_div.style.width = '88%'
		this.request_input_div.appendChild(this.request_input)
		this.request_button_div = document.createElement('div');
		this.request_button_div.style.float = 'right'
		this.request_button_div.appendChild(this.request_button)

		this.request_div.appendChild(this.request_input_div)
		this.request_div.appendChild(this.request_button_div)
	}

    /**
     * Get element that stores the request
     * @ret {Element} Element that stores requests
     */
	getSlotGroup() {
		return this.request_div
	}

	getValue() {
		return this.request_input.value;
	}

}

/**
 * Class for managing button that adds request slots
 * and returning the strings of requests entered by the user
 */
export class RSlotAdder {

	// Initialize the slot adder
	constructor() {
		// Array of requests elements
		this.slots = []
		this.identifier_prefix = "req"
		this.identifier_number = 0;
	}

    /**
     * Creates the button that adds a request slot
     * @return {Element} button that adds a request slot
     */
	createButton() {
		let button = document.createElement('button')

		button.className = "button"
		button.innerHTML = 'Add a Request'
		button.addEventListener('click', event => {
			let slot = new RSlot(this.identifier_prefix + this.identifier_number, this);
			this.identifier_number++;
			this.slots.push(slot)
			$('.r_slots')[0].appendChild(slot.getSlotGroup())
		})
		return button
	}

	deleteRequest(request) {
		this.slots.splice(this.slots.indexOf(request), 1);
	}

    /**
     * Creates array of all requests entered by the user
     * @ret: {string[]} Array of all requests
     */
	getRequests() {
		let requests = []

		for (let i = 0; i < this.slots.length; i++) {
			requests.push(this.slots[i].getValue());
		}
		return (requests)
	}
}

export class Error {
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

}

$(() => {
	// let slot_adder = new SlotAdder()
	let rslot_adder = new RSlotAdder()

	$('.is24')[0].addEventListener('click', event => {
		// slot_adder.is24 = true
		$('.is12')[0].className = 'button is12'
		$('.is24')[0].className = 'button is24 is-info'
		let times = Calendar.time_slots(true)
		$('select').forEach(select => {
			Array.from(select.children).forEach(option => {
				option.innerHTML = times[option.value]
			})
		})
	})

	$('.is12')[0].addEventListener('click', event => {
		// slot_adder.is24 = false
		$('.is12')[0].className = 'button is12 is-info'
		$('.is24')[0].className = 'button is24'
		let times = Calendar.time_slots(false)
		$('select').forEach(select => {
			Array.from(select.children).forEach(option => {
				option.innerHTML = times[option.value]
			})
		})
	})

	$('.rslot_button_wrap')[0].appendChild(rslot_adder.createButton())

	let new_day = new DayAdder()
	$('.dates')[0].appendChild(new_day.createInitial())

	$('.dates_button')[0].appendChild(new_day.createButton($('.dates')[0]))

	$('button.submit')[0].addEventListener("click", event => {
		let error = new Error()

		// Process date and time information
		let unprocessed_days = new_day.getDays()

		for (let i in unprocessed_days) {
			if (unprocessed_days[i][1].length == 0) {
				unprocessed_days[i][1] = unprocessed_days[0][1]
			}
		}

		unprocessed_days.sort(function (a, b) { return new Date(a[0]) - new Date(b[0]) });

		let date_array = []
		let time_array = []

		for (let i in unprocessed_days) {
			date_array.push(unprocessed_days[i][0])
			time_array.push(unprocessed_days[i][1])

		}

		let processed_days = [date_array, time_array]

		// Error handling
		if ($('input.intitle')[0].value == "") {
			error.createErrorModal($('.error_container')[0], "You must enter a name for the event!")
			return
		}

		if ($('input.description')[0].value == "") {
			error.createErrorModal($('.error_container')[0], "You must enter a description for the event!")
			return
		}

		if ($('input.name')[0].value == "") {
			error.createErrorModal($('.error_container')[0], "You must enter an owner name for the event!")
			return
		}

		for (let i in date_array) {
			if (date_array[i] == "") {
				error.createErrorModal($('.error_container')[0], "You must select a date for Day " + (parseInt(i) + 1) + "!")
				return
			}
		}

		let duplicate = function hasDuplicates(array) {
			return (new Set(array)).size !== array.length;
		}
		
		if (duplicate(date_array)) {
			error.createErrorModal($('.error_container')[0], "You have selected the same date twice!")
			return
		}



		// Posting
		let payload = {
			name: $('input.intitle')[0].value,
			description: $('input.description')[0].value,
			task_list: rslot_adder.getRequests(),
			dates: processed_days[0],
			owner: $('input.name')[0].value,
			times: processed_days[1]
		}

		fetch("/api/events/new/", {
			headers: { 'Content-Type': 'application/json' },
			method: "POST",
			body: JSON.stringify(payload)
		}).then(res => res.json()).then(res => {
			if (res.status != "ok") {
				alert("Could not contact server, please try again")
				return
			}
			window.location.href = '/event/?id=' + res.uid
		})
	})
})
