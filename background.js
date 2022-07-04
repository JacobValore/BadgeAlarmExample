chrome.runtime.onInstalled.addListener((details) => {
	//When extension is installed or updated, set or reset the count variable in storage
	if(details.reason==="update" || details.reason==="install"){
		chrome.storage.local.set({
			count: 0
		});
		//This will start the alarm when the extension is first installed.
		startAlarm();
	}
});

//This will start the alarm when the browser is closed and re-opened.
chrome.runtime.onStartup.addListener(() => {
	startAlarm();
});

chrome.alarms.onAlarm.addListener((alarm) => {
	//This should fire approximately every 1 minute.
	if(alarm.name==="badgeUpdate"){
		queryAPI();
	}
});

//If this is called and the alarm already exists, then the old alarm will be cancelled
//    and replaced by the new one. Effectively just restarting the timer.
function startAlarm(){
	//This alarm will fire after 1 minute has elapsed. I query the api immediately so
	//    the user doesn't wait a minute after startup before receiving the first notification.
	queryAPI();
	//Instead, I set the badge text immediately
	chrome.alarms.create("badgeUpdate", {delayInMinutes: 1, periodInMinutes: 1});
}

//Obviously, not querying an actual API here, instead, just consider
//    chrome.storage.local.get to be the API.
function queryAPI(){
	//Do the "API query", and then put chrome.action.setBadgeText() inside of the query's callback.
	chrome.storage.local.get(['count'], (data) => {
		//Get the count variable from storage, then, in this callback I can call setBadgeText.
		chrome.action.setBadgeText({text: data.count+""});

		//Then I want to increment it, so I need to add 1 and then save it into storage again.
		data.count+=1;
		chrome.storage.local.set({count: data.count});
	});
}
