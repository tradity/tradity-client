module Main exposing (Model, Msg, init, subscriptions, update, view)

import Html.Styled as Html exposing (..)
import Navigation exposing (Location)
import Page.Login as Login
import Route
import UrlParser


main : Program Never Model Msg
main =
    Navigation.program SetRoute
        { init = init
        , view = view >> toUnstyled
        , update = update
        , subscriptions = subscriptions
        }


type Page
    = Dashboard
    | Login Login.Model


type alias Model =
    { page : Page
    }


initialModel : Model
initialModel =
    { page = Dashboard
    }


type Msg
    = SetRoute Location
    | LoginMsg Login.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetRoute location ->
            ( setRoute location model, Cmd.none )

        LoginMsg loginMsg ->
            case model.page of
                Login loginModel ->
                    let
                        ( newLoginModel, cmd ) =
                            Login.update loginMsg loginModel
                    in
                    ( { model | page = Login newLoginModel }, Cmd.map LoginMsg cmd )

                _ ->
                    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    case model.page of
        Dashboard ->
            h1 [] [ text "Dashboard" ]

        Login loginModel ->
            Login.view loginModel
                |> Html.map LoginMsg


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


init : Location -> ( Model, Cmd Msg )
init location =
    ( setRoute location initialModel, Cmd.none )


setRoute : Location -> Model -> Model
setRoute location model =
    let
        route =
            UrlParser.parsePath Route.route location
                |> Maybe.withDefault Route.Dashboard
    in
    case route of
        Route.Dashboard ->
            { model | page = Dashboard }

        Route.Login ->
            { model | page = Login Login.initalModel }
