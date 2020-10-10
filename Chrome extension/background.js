console.log("RPAN comments background is running");

chrome.browserAction.onClicked.addListener(buttonClicked);

let endpoint;

function buttonClicked(tab) {

    if (tab.url.startsWith("https://www.reddit.com/rpan")) {
        let port = chrome.tabs.connect(tab.id, { name: "RPAN" });
        port.onMessage.addListener((msg) => endpoint?.postMessage(msg));
    } else {
        endpoint = chrome.tabs.connect(tab.id, { name: "endpoint" });
        endpoint.onDisconnect.addListener(() => endpoint = null);
    }
}
