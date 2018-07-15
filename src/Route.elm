module Route exposing (Route(..), route, redirect)

import Navigation
import UrlParser exposing (Parser, map, oneOf, s, top)


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


redirect : Route -> Cmd msg
redirect =
    Navigation.newUrl << routeToString
