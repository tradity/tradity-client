module Page.Dashboard exposing (Model, Msg, init, update, view)

import Api
import Browser.Navigation as Nav
import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import User
import Views.ValueList as ValueList


type alias Model =
    { session : String
    , user : Status User.User
    }


type Status a
    = Loading
    | Loaded a
    | Failed


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
    case model.user of
        Loading ->
            text "Loading user…"

        Failed ->
            text "Failed to load user"

        Loaded user ->
            ValueList.view
                [ ( "Total value", String.fromFloat (toFloat user.totalValue / 10000) ++ " €" )
                , ( "Cash", String.fromFloat (toFloat user.freeMoney / 10000) ++ " €" )
                , ( "Portfolio", String.fromFloat (toFloat (user.totalValue - user.freeMoney) / 10000) ++ " €" )
                , ( "Time left", "–" )
                ]


type Msg
    = ReceivedUser (Result Http.Error User.User)


update : Msg -> Model -> Nav.Key -> ( Model, Cmd Msg )
update msg model navKey =
    case msg of
        ReceivedUser (Err error) ->
            ( { model | user = Failed }, Api.handleError error navKey )

        ReceivedUser (Ok user) ->
            ( { model | user = Loaded user }, Cmd.none )
