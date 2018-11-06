port module Session exposing (onSessionChange, storeSession)


port onSessionChange : (Maybe String -> msg) -> Sub msg


port storeSession : Maybe String -> Cmd msg
