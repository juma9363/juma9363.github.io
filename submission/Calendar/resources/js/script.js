function updateLocationOptions() {  
    
    const modalitySelect = document.getElementById('event_modality').value;

    
    const locationFields = document.getElementById('location_fields');
    const remoteFields = document.getElementById('remote_fields');

    
    if (modalitySelect === 'In-Person') {
        locationFields.style.display = 'block';  
        remoteFields.style.display = 'none';   
    }
    
    else if (modalitySelect === 'Remote') {
        locationFields.style.display = 'none';  
        remoteFields.style.display = 'block';   
    }
}


document.addEventListener('DOMContentLoaded', function() {
    updateLocationOptions();
    document.getElementById('event_modality').addEventListener('change', updateLocationOptions);
});



let events = [];

function saveEvent() {

    const name = document.getElementById('event_name').value;
    const category = document.getElementById('event_category').value;  
    const weekday = document.getElementById('event_weekday').value;
    const time = document.getElementById('event_time').value;
    const modality = document.getElementById('event_modality').value;
    const location = modality === 'In-Person' ? document.getElementById('event_location').value : null;
    const remote_url = modality === 'Remote' ? document.getElementById('event_remote_url').value : null;
    const attendees = document.getElementById('event_attendees').value.split(',').map(attendee => attendee.trim());

    
    const eventDetails = {
        name: name,
        category: category, 
        weekday: weekday,
        time: time,
        modality: modality,
        location: location,
        remote_url: remote_url,
        attendees: attendees
    };


    events.push(eventDetails);


    console.log(events);


    addEventToCalendarUI(eventDetails);

    document.getElementById('data-form').reset();
}


function addEventToCalendarUI(eventInfo) {
    console.log("Event added to calendar: ", eventInfo);
    let event_card = createEventCard(eventInfo);
    let dayDiv = document.getElementById(eventInfo.weekday.toLowerCase());
    dayDiv.appendChild(event_card);

}

function createEventCard(eventDetails) {
    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1';
    event_element.setAttribute('data-index', events.indexOf(eventDetails));
    let info = document.createElement('div');
    info.classList = 'event-info'; // css    fot text overflow
    // template literals
    info.innerHTML = `
        <strong>Event Name:</strong><br> ${eventDetails.name}<br>
        <strong>Event Time:</strong><br> ${eventDetails.time}<br>
        <strong>Event Modality:</strong><br> ${eventDetails.modality}<br>
        ${eventDetails.modality === 'In-Person' ? `<strong>Event Location:</strong><br> ${eventDetails.location}<br>` : ''}
        ${eventDetails.modality === 'Remote' ? `<strong>Remote URL:</strong><br> ${eventDetails.remote_url}<br>` : ''}
        <strong>Attendees:</strong><br> ${eventDetails.attendees.join(', ')}
    `;

    let categoryColor;
    switch (eventDetails.category) {
        case 'CU Boulder':
            categoryColor = '#8ebae9ff'; 
            break;
        case 'WtoW':
            categoryColor = '#9bfab1ff'; 
            break;
        case 'Personal':
            categoryColor = '#f6d87fff'; 
            break;
        case 'Social':
            categoryColor = '#f6ad71ff'; 
            break;
        case 'Other':
            categoryColor = '#939aa0ff';
            break;
        default:
            categoryColor = '#fbdbdbff'; 
    }

    // Set the background color of the event element based on category
    event_element.style.backgroundColor = categoryColor;

    // Extra credit
    event_element.addEventListener('click', function() {
        const eventIndex = events.indexOf(eventDetails);
        openEventModal(eventDetails, eventIndex);
    });

    event_element.appendChild(info);
    return event_element;


}
function openEventModal(eventDetails, eventIndex) {
    
    $('#staticBackdrop').modal('show'); 

    
    document.getElementById('event_name').value = eventDetails.name;
    document.getElementById('event_category').value = eventDetails.category; 
    document.getElementById('event_weekday').value = eventDetails.weekday;
    document.getElementById('event_time').value = eventDetails.time;
    document.getElementById('event_modality').value = eventDetails.modality;
    document.getElementById('event_location').value = eventDetails.location || '';  
    document.getElementById('event_remote_url').value = eventDetails.remote_url || ''; 
    document.getElementById('event_attendees').value = eventDetails.attendees.join(', '); 

    
    document.getElementById('save_event_button').onclick = function() {
        saveUpdatedEvent(eventDetails, eventIndex);
    };
}

function saveUpdatedEvent(eventDetails, eventIndex) {
    
    const updatedName = document.getElementById('event_name').value;
    const updatedCategory = document.getElementById('event_category').value;
    const updatedWeekday = document.getElementById('event_weekday').value;
    const updatedTime = document.getElementById('event_time').value;
    const updatedModality = document.getElementById('event_modality').value;
    const updatedLocation = updatedModality === 'In-Person' ? document.getElementById('event_location').value : null;
    const updatedRemoteUrl = updatedModality === 'Remote' ? document.getElementById('event_remote_url').value : null;
    const updatedAttendees = document.getElementById('event_attendees').value.split(',').map(attendee => attendee.trim());
    

    
    const updatedEvent = {
        name: updatedName,
        category: updatedCategory,
        weekday: updatedWeekday,
        time: updatedTime,
        modality: updatedModality,
        location: updatedLocation,
        remote_url: updatedRemoteUrl,
        attendees: updatedAttendees,
        
    };

    const oldDayDiv = document.getElementById(eventDetails.weekday.toLowerCase());
    const oldEventCard = oldDayDiv.querySelector(`.event[data-index="${eventIndex}"]`);

    if (oldEventCard) {
        oldDayDiv.removeChild(oldEventCard);
    }

    events[eventIndex] = updatedEvent;

    
    console.log(events);


    const eventCard = createEventCard(updatedEvent);
    const newDayDiv = document.getElementById(updatedEvent.weekday.toLowerCase());

    newDayDiv.appendChild(eventCard);

    
    $('#staticBackdrop').modal('hide');
}
