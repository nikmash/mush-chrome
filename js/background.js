function gcm() {

	chrome.storage.local.get(null, function(result) {
			if (result.gcm || !result.session)
				return;

			var senders = ["955299259154"];
			chrome.gcm.register(senders, function(id) {
				if (chrome.runtime.lastError) {
					console.log(chrome.runtime.lastError)
					return;
				}
				var xhr = new XMLHttpRequest()
				xhr.open("POST", "http://api.ironbay.digital/me/chrome?session=" + result.session, true)
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(JSON.stringify(id))
				chrome.storage.local.set({ gcm : id })
			});

	});

}
gcm()


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	gcm()
});

var cache = {}

chrome.gcm.onMessage.addListener(function(message) {
	var data = message.data
	cache[message.data.id] = data
	if(type == "tag") {
		chrome.notifications.create(message.data.id, {
			type : "basic",
			title : message.data.title,
			message : message.data.content,
			iconUrl : "/img/logo.png",
		})
		return
	}
});

chrome.notifications.onClicked.addListener(function (id) {
	var data = cache[id]
	if (data.type == "tag") {
		chrome.notifications.clear(id)
		window.open(data.url)
		return
	}
})