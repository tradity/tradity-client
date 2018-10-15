module Page.Dashboard exposing (Model, Msg, init, update, view)

import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import User


type alias Model =
    { session : String
    , user : Status User.User
    }


type Status a
    = Loading
    | Loaded a


init : String -> ( Model, Cmd Msg )
init session =
    ( { session = session
      , user = Loading
      }
    , Http.send ReceivedUser <|
        User.getOwnUser session
    )


view : Model -> Html Msg
view model =
    h1 [] [ text "Dashboard" ]


type Msg
    = ReceivedUser (Result Http.Error User.User)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceivedUser (Err error) ->
            ( model, Cmd.none )

        ReceivedUser (Ok user) ->
            ( { model | user = Loaded user }, Cmd.none )
