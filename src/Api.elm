module Api exposing (decodeIntAsBool, get, handleError, post)

import Browser.Navigation as Nav
import Http
import Json.Decode as Decode
import Route

get : String -> Maybe String -> Decode.Decoder a -> Http.Request a
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


post : String -> Maybe String -> Http.Body -> Decode.Decoder a -> Http.Request a
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


handleError : Http.Error -> Nav.Key -> Cmd msg
handleError error navKey =
    let
        _ =
            Debug.log "Error: " error
    in
    case error of
        Http.BadStatus response ->
            if response.status.code == 401 then
                Route.redirect navKey Route.Login
            else Cmd.none
        
        Http.BadPayload err response ->
            Cmd.none

        _ ->
            Cmd.none


decodeIntAsBool : Decode.Decoder Bool
decodeIntAsBool =
    Decode.int
        |> Decode.andThen
            (\val ->
                case val > 0 of
                    True ->
                        Decode.succeed True

                    False ->
                        Decode.succeed False
            )
