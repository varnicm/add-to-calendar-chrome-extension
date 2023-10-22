function extractEventDetails(text) {
    const datePatterns = [
        /\w+,\s\w+\s\d+\w+/,       // Monday, October 23rd
        /\b\w{3}\s\d{1,2}\b/,     // Oct 10
        /\b\w{3}-\d{1,2}-\d{4}\b/, // oct-10-2023
        /\b\d{1,2}-\d{1,2}-\d{4}\b/ // 08-06-2024
    ];

    const timePatterns = [
        /\d+(?:\.\d+)?(am|pm)/i,   // 4pm
        /\d{1,2}:\d{2}\s*(am|pm)?/i // 16:00 or 4:00 PM
    ];

    const locationPattern = /in\s([\w\s\d]+)$/;

    let dateStr = null, timeStr = null;
    
    for (let pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
            dateStr = match[0];
            break;
        }
    }

    for (let pattern of timePatterns) {
        const match = text.match(pattern);
        if (match) {
            timeStr = match[0];
            break;
        }
    }

    const locationMatch = text.match(locationPattern);
    const location = locationMatch ? locationMatch[1] : null;
    const description = text.split(/\w+,\s\w+\s\d+\w+/)[0].trim();

    // Convert date and time to the desired format
    const formattedDate = formatDate(dateStr);
    const formattedTime = formatTime(timeStr);
    
    const formattedDateTime = `${formattedDate}T${formattedTime}`;

    return {
        date: formattedDateTime,
        description,
        location
    };
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
}

function formatTime(timeStr) {
    const isPM = timeStr.toLowerCase().includes('pm');
    let [hour, minutes = "00"] = timeStr.split(":");
    
    hour = parseInt(hour, 10);
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return hour.toString().padStart(2, '0') + minutes.padStart(2, '0') + "00";
}

// const text = "Monday, October 23rd, I will be offering an information session on Curricular Practical Training. The session will be at 4pm in Dean Hall 117";
// const details = extractEventDetails(text);
// console.log(details);





document.getElementById('addEvent').addEventListener('click', function() {
    const text = document.getElementById('eventText').value;
    const details = extractEventDetails(text);
    console.log(details);





    
    const eventDetails = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${text}
DTSTART:20231007T120000Z
DTEND:20231007T130000Z
END:VEVENT
END:VCALENDAR`;

    const encodedData = encodeURIComponent(eventDetails);
    const dataUrl = `data:text/calendar;charset=utf8,${encodedData}`;

    // Create and trigger download
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'event.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// Fetch the selected text from the context menu click and set it in the textarea
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getSelectedText") {
        document.getElementById('eventText').value = request.text;
        document.getElementById('eventDate').value = extractEventDetails(text)
    }
});
