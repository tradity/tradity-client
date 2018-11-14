module Page.Portfolio exposing (Model, Msg, init, update, view)

import Html.Styled as Html exposing (..)
import Shell


type alias Model =
    { tab : Tab }


type Msg
    = ReceivedPositions


type Tab
    = Positions
    | Orders
    | History


init : String -> ( Model, Cmd Msg )
init session =
    ( { tab = Positions }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceivedPositions ->
            ( model, Cmd.none )


view : Model -> Shell.Content Msg
view model =
    { title = "Portfolio"
    , showHeader = True
    , header = Nothing
    , main =
        text ""
    }
