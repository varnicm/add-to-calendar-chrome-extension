document.getElementById('addEvent').addEventListener('click', function() {
    const text = document.getElementById('eventText').value;

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
    }
});
