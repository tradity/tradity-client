module Main exposing (Model, Msg, init, subscriptions, update, view)

import Browser
import Browser.Navigation as Nav
import Html.Styled as Html exposing (..)
import Page.Dashboard as Dashboard
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
    = Loading
    | Dashboard Dashboard.Model
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
    | DashboardMsg Dashboard.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( SetRoute url, _ ) ->
            setRoute url model

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

        ( DashboardMsg dashboardMsg, Dashboard dashboardModel ) ->
            let
                ( newDashboardModel, cmd ) =
                    Dashboard.update dashboardMsg dashboardModel model.navKey
            in
            ( { model | page = Dashboard newDashboardModel }, Cmd.map DashboardMsg cmd )

        ( _, _ ) ->
            -- Ignore messages arriving for the wrong page
            ( model, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = "Tradity"
    , body =
        [ toUnstyled <|
            case model.page of
                Loading ->
                    text "Loading…"

                Dashboard dashboardModel ->
                    Dashboard.view dashboardModel
                        |> Html.map DashboardMsg

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
    setRoute url
        { page = Loading
        , session = ""
        , navKey = navKey
        }


setRoute : Url.Url -> Model -> ( Model, Cmd Msg )
setRoute url model =
    let
        route =
            Url.Parser.parse Route.route url
                |> Maybe.withDefault Route.Dashboard
    in
    case route of
        Route.Dashboard ->
            let
                ( newModel, cmd ) =
                    Dashboard.init model.session
            in
            ( { model | page = Dashboard newModel }, Cmd.map DashboardMsg cmd )

        Route.Login ->
            ( { model | page = Login (Login.init model.navKey) }, Cmd.none )
