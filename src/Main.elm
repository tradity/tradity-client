module Main exposing (Model, Msg, init, subscriptions, update, view)

import Browser
import Browser.Navigation as Nav
import Html.Styled as Html exposing (..)
import Page.Login as Login
import Route
import Url
import Url.Parser


main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = SetRoute
        }


type Page
    = Dashboard
    | Login Login.Model


type alias Model =
    { page : Page
    , session : String
    , navKey : Nav.Key
    }


type Msg
    = SetRoute Url.Url
    | LinkClicked Browser.UrlRequest
    | LoginMsg Login.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( SetRoute url, _ ) ->
            ( setRoute url model, Cmd.none )

        ( LinkClicked urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.navKey (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

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


view : Model -> Browser.Document Msg
view model =
    { title = "Tradity"
    , body =
        [ toUnstyled <|
            case model.page of
                Dashboard ->
                    h1 [] [ text "Dashboard" ]

                Login loginModel ->
                    Login.view loginModel
                        |> Html.map LoginMsg
        ]
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url navKey =
    ( setRoute url
        { page = Dashboard
        , session = ""
        , navKey = navKey
        }
    , Cmd.none
    )


setRoute : Url.Url -> Model -> Model
setRoute url model =
    let
        route =
            Url.Parser.parse Route.route url
                |> Maybe.withDefault Route.Dashboard
    in
    case route of
        Route.Dashboard ->
            { model | page = Dashboard }

        Route.Login ->
            { model | page = Login (Login.init model.navKey) }
