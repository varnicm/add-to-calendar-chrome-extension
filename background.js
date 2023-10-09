chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addToAppleCalendar",
        title: "Add to Apple Calendar",
        contexts: ["selection"]
    });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToAppleCalendar") {
        const text = info.selectionText;

        // Open the popup.html in a new "popup" window
        chrome.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 350,
            height: 250
        }, function(newWindow) {
            // After creating the window, we can send a message to its tab
            const tabId = newWindow.tabs[0].id;
            chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, changeInfo) {
                if (tabIdUpdated === tabId && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tabId, {
                        action: "getSelectedText",
                        text: text
                    });
                }
            });
        });
    }
});



function addToAppleCalendar(text) {
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

    // This will prompt the user to open the .ics with their default calendar app
    chrome.tabs.create({ url: dataUrl });
}

