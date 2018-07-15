module Page.Login exposing (Model, Msg, ExternalMsg(..), initalModel, update, view)

import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Http
import Request.User
import Route
import Views.Form as Form


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
    div
        [ css
            [ displayFlex
            , flexDirection column
            , alignItems center
            ]
        ]
        [ img
            [ title "Tradity"
            , alt "Tradity"
            , src "/img/tradity_symbol.png"
            , css
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
            , Form.button [ type_ "submit" ] [ text "Log in" ]
            ]
        ]


type Msg
    = SetUsername String
    | SetPassword String
    | SubmitForm
    | LoginResponse (Result Http.Error String)


type ExternalMsg
    = NoMsg
    | SetSession String


update : Msg -> Model -> ( ( Model, Cmd Msg ), ExternalMsg )
update msg model =
    case msg of
        SetUsername username ->
            ( ( { model | username = username }, Cmd.none ), NoMsg )

        SetPassword password ->
            ( ( { model | password = password }, Cmd.none ), NoMsg )

        SubmitForm ->
            ( ( model
              , Http.send LoginResponse <|
                    Request.User.login model.username model.password False
              )
            , NoMsg
            )

        LoginResponse (Err error) ->
            ( ( model, Cmd.none ), NoMsg )

        LoginResponse (Ok authToken) ->
            ( ( model, Route.redirect Route.Dashboard ), SetSession authToken )
