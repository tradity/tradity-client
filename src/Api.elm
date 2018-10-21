module Api exposing (get, handleError, post)

import Http
import Json.Decode exposing (Decoder)


get : String -> Maybe String -> Decoder a -> Http.Request a
get endpoint maybeSession decoder =
    Http.request
        { method = "GET"
        , headers =
            case maybeSession of
                Just session ->
                    [ Http.header "authorization" session ]

                Nothing ->
                    []
        , url = "https://dev.tradity.de/api/v1" ++ endpoint
        , body = Http.emptyBody
        , expect = Http.expectJson decoder
        , timeout = Nothing
        , withCredentials = False
        }


post : String -> Maybe String -> Http.Body -> Decoder a -> Http.Request a
post endpoint maybeSession body decoder =
    Http.request
        { method = "POST"
        , headers =
            case maybeSession of
                Just session ->
                    [ Http.header "authorization" session ]

                Nothing ->
                    []
        , url = "https://dev.tradity.de/api/v1" ++ endpoint
        , body = body
        , expect = Http.expectJson decoder
        , timeout = Nothing
        , withCredentials = False
        }


handleError : Http.Error -> Cmd msg
handleError error =
    let
        _ =
            Debug.log "Error: " error
    in
    Cmd.none
