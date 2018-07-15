module Request.User exposing (login)

import Http
import Json.Decode as Decode
import Json.Encode as Encode


login : String -> String -> Bool -> Http.Request String
login username password stayLoggedIn =
    let
        body =
            Encode.object
                [ ( "name", Encode.string username )
                , ( "pw", Encode.string password )
                , ( "stayloggedin", Encode.bool stayLoggedIn )
                ]
                |> Http.jsonBody
    in
    Decode.field "key" Decode.string
        |> Http.post "https://dev.tradity.de/api/v1/login" body
