chrome.runtime.onConnect.addListener(butonPressed);

function butonPressed(port) {
    if (port.name == "RPAN") {
        observer(port);
    } else {
        console.log(" - Connected to RPAN comments -");

        port.onMessage.addListener((comment) => {
            console.log(comment);
            document.dispatchEvent(new CustomEvent("onComment", {
                detail: { user: comment.user, text: comment.text, time: comment.time, }
            }));

        });
    }
}



function observer(port) {
    console.log("- Connected to RPAN comments -");

    let initialDate = new Date();

    let comment = { user: null, text: null, time: 0 };

    let target = document.querySelectorAll('[aria-label="chat window"]')[0];

    const config = { attributes: true, childList: true, subtree: true };

    function callback() {
        let commentData = target?.childNodes[0]?.childNodes[1]?.lastChild;

        let user = commentData?.childNodes[0]?.childNodes[0]?.getElementsByTagName("a")[0]?.textContent;
        let text = commentData?.childNodes[2]?.getElementsByTagName("p")[0]?.textContent;

        let date = new Date();

        if (user && text) {

            if (comment.user != user || comment.text != text || date.getTime() - initialDate.getTime() > comment.time + 10000) {
                comment = { user: user, text: text, time: date.getTime() - initialDate.getTime() };
                port.postMessage(comment);
                console.log(comment);
            }
        }
    }

    const observer = new MutationObserver(callback);

    observer.observe(target, config);
}