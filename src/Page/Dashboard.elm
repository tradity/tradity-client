module Page.Dashboard exposing (Model, Msg, OutMsg(..), init, update, view)

import Api
import Browser.Navigation as Nav
import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import Shell
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


type OutMsg
    = NoMsg
    | SetUser User.User


init : String -> ( Model, Cmd Msg )
init session =
    ( { session = session
      , user = Loading
      }
    , Http.send ReceivedUser <|
        User.getOwnUser session
    )


view : Model -> Shell.Content Msg
view model =
    { title = "Dashboard"
    , showHeader = True
    , header = Nothing
    , main =
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
    }


type Msg
    = ReceivedUser (Result Http.Error User.User)


update : Msg -> Model -> ( Model, Cmd Msg, OutMsg )
update msg model =
    case msg of
        ReceivedUser (Err error) ->
            ( { model | user = Failed }, Api.handleError error, NoMsg )

        ReceivedUser (Ok user) ->
            ( { model | user = Loaded user }, Cmd.none, SetUser user )
