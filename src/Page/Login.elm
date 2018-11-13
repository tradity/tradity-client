module Page.Login exposing (Model, Msg, init, update, view)

import Browser.Navigation as Nav
import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import Icons
import Route
import Session
import Shell
import Svg.Styled.Attributes as SA
import User
import Views.Form as Form


type alias Model =
    { navKey : Nav.Key
    , username : String
    , password : String
    , stayLoggedIn : Bool
    }


init : Nav.Key -> Model
init navKey =
    { navKey = navKey
    , username = ""
    , password = ""
    , stayLoggedIn = False
    }


view : Model -> Shell.Content Msg
view model =
    { title = "Login"
    , showHeader = False
    , header = Nothing
    , main =
        div
            [ css
                [ displayFlex
                , flexDirection column
                , alignItems center
                ]
            ]
            [ Icons.logo
                [ SA.css
                    [ Css.width (px 100)
                    , Css.height (px 100)
                    , marginTop (px 60)
                    ]
                ]
                []
            , h1
                [ css
                    [ margin3 (px 30) zero (px 36)
                    , fontSize (px 20)
                    , fontWeight (int 900)
                    , lineHeight (px 24)
                    , color (hex "#170804")
                    ]
                ]
                [ text "Welcome back!" ]
            , Form.form
                [ onSubmit SubmitForm ]
                [ Form.input
                    [ type_ "text"
                    , placeholder "Username"
                    , autofocus True
                    , onInput SetUsername
                    ]
                , Form.input
                    [ type_ "password"
                    , placeholder "Password"
                    , onInput SetPassword
                    ]
                , Form.checkbox ToggleStayLoggedIn model.stayLoggedIn "Remember me"
                , Form.button [ type_ "submit" ] [ text "Log in" ]
                ]
            , div
                [ css [ marginTop (px 20) ] ]
                [ a [ css [ color (hex "#F1592A") ] ] [ text "Forgot password?" ]
                , text " · "
                , a [ css [ color (hex "#F1592A") ] ] [ text "Create account" ]
                ]
            ]
    }


type Msg
    = SetUsername String
    | SetPassword String
    | ToggleStayLoggedIn
    | SubmitForm
    | LoginResponse (Result Http.Error String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetUsername username ->
            ( { model | username = username }, Cmd.none )

        SetPassword password ->
            ( { model | password = password }, Cmd.none )

        ToggleStayLoggedIn ->
            ( { model | stayLoggedIn = not model.stayLoggedIn }, Cmd.none )

        SubmitForm ->
            ( model
            , Http.send LoginResponse <|
                User.login model.username model.password model.stayLoggedIn
            )

        LoginResponse (Err error) ->
            ( model, Cmd.none )

        LoginResponse (Ok authToken) ->
            ( model, Session.storeSession (Just authToken) )
