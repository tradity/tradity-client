const { Elm } = require("./Main.elm");

const storageKey = "authKey";

const app = Elm.Main.init({
    flags: localStorage.getItem(storageKey)
});

app.ports.storeSession.subscribe(session => {
    if (session === null) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, session);
    app.ports.onSessionChange.send(session);
});

window.addEventListener("storage", event => {
    if (event.storageArea === localStorage && event.key === storageKey) {
        app.ports.onSessionChange.send(event.newValue);
    }
});