module Route exposing (Route(..), redirect, route)

import Browser.Navigation as Nav
import Url.Parser exposing (Parser, map, oneOf, s, top)


type Route
    = Dashboard
    | Login


route : Parser (Route -> Route) Route
route =
    oneOf
        [ map Dashboard top
        , map Login (s "login")
        ]


routeToString : Route -> String
routeToString page =
    let
        pieces =
            case page of
                Dashboard ->
                    []

                Login ->
                    [ "login" ]
    in
    String.join "/" pieces


redirect : Nav.Key -> Route -> Cmd msg
redirect key =
    Nav.pushUrl key << routeToString
