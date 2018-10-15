module User exposing (User, decoder, getOwnUser, login)

import Http
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Encode


type alias User =
    { id : Int
    , schoolId : Int
    , name : String
    , email : String
    , emailVerified : Bool
    , freeMoney : Int
    , profilePic : String
    , totalValue : Int
    }


decoder : Decode.Decoder User
decoder =
    Decode.succeed User
        |> required "uid" Decode.int
        |> required "dschoolid" Decode.int
        |> required "name" Decode.string
        |> required "email" Decode.string
        |> required "email_verif" Decode.bool
        |> required "freemoney" Decode.int
        |> required "profilepic" Decode.string
        |> required "totalvalue" Decode.int


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


getOwnUser : String -> Http.Request User
getOwnUser session =
    Decode.field "data" decoder
        |> Http.get "https://dev.tradity.de/api/v1/user/$self"
