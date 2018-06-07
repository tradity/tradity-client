module Page.Login exposing (view, Model, Msg, update, initalModel)

import Html exposing (..)


type alias Model =
    { username : String
    , password : String
    }


initalModel : Model
initalModel =
    { username = ""
    , password = ""
    }


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Login" ]
        ]


type Msg
    = SetUsername String
    | SetPassword String

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetUsername username ->
            ( { model | username = username}, Cmd.none )
        SetPassword password ->
            ( { model | password = password}, Cmd.none )