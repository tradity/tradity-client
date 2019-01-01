module User exposing (User, UserDetails, UserValue, getOwnUser, login)

import Api
import Http
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (required)
import Json.Encode as Encode


type alias UserDetails =
    { user : User
    , values : List UserValue
    }


type alias User =
    { id : Int
    , schoolId : Int
    , name : String
    , email : String
    , emailVerified : Bool
    , freeMoney : Int
    , profilePic : Maybe String
    , totalValue : Int
    }


type alias UserValue =
    { time : Int
    , totalValue : Int
    }


decodeUser : Decode.Decoder User
decodeUser =
    Decode.succeed User
        |> required "uid" Decode.int
        |> required "dschoolid" Decode.int
        |> required "name" Decode.string
        |> required "email" Decode.string
        |> required "email_verif" Api.decodeIntAsBool
        |> required "freemoney" Decode.int
        |> required "profilepic" (Decode.nullable Decode.string)
        |> required "totalvalue" Decode.int


decodeValues : Decode.Decoder (List UserValue)
decodeValues =
    Decode.succeed UserValue
        |> required "time" Decode.int
        |> required "totalvalue" Decode.int
        |> Decode.list


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
        |> Api.post "/login" Nothing body


getOwnUser : String -> Http.Request UserDetails
getOwnUser session =
    Decode.succeed UserDetails
        |> required "data" decodeUser
        |> required "values" decodeValues
        |> Api.get "/user/$self" (Just session)
