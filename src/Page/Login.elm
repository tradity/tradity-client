module Page.Login exposing (Model, Msg, initalModel, update, view)

import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Events exposing (..)
import Html.Styled.Attributes exposing (..)


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
        [ img [ title "Tradity", alt "Tradity", src "/img/tradity_symbol.png" ] []
        , h2 [] [ text "Welcome back!" ]
        , Html.form []
            [ input
                [ type_ "text"
                , placeholder "Username"
                , autofocus True
                , onInput SetUsername
                ]
                []
            , input
                [ type_ "password"
                , placeholder "Password"
                , onInput SetPassword
                ]
                []
            , button [ type_ "submit" ] [ text "Log in" ]
            ]
        ]


type Msg
    = SetUsername String
    | SetPassword String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetUsername username ->
            ( { model | username = username }, Cmd.none )

        SetPassword password ->
            ( { model | password = password }, Cmd.none )
