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
    , session : String
    }


initialModel : Model
initialModel =
    { page = Dashboard
    , session = ""
    }


type Msg
    = SetRoute Location
    | LoginMsg Login.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( SetRoute location, _ ) ->
            ( setRoute location model, Cmd.none )

        ( LoginMsg loginMsg, Login loginModel ) ->
            let
                ( ( newLoginModel, cmd ), msgFromPage ) =
                    Login.update loginMsg loginModel

                newModel =
                    case msgFromPage of
                        Login.NoMsg ->
                            model

                        Login.SetSession session ->
                            { model | session = session }
            in
            ( { newModel | page = Login newLoginModel }, Cmd.map LoginMsg cmd )

        ( _, _ ) ->
            -- Ignore messages arriving for the wrong page
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
