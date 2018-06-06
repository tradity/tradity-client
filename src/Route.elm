module Route exposing (Route(..), route)

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
