module Shell exposing (Content, view, viewHeader)

import Browser
import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)


type alias Content msg =
    { title : String
    , showHeader : Bool
    , header : Maybe (Html msg)
    , main : Html msg
    }


view : Bool -> (a -> msg) -> Content a -> Browser.Document msg
view navOpen toMsg content =
    { title =
        content.title ++ " – Tradity"
    , body =
        [ toUnstyled <|
            div []
                [ Html.map toMsg <|
                    viewHeader navOpen <|
                        Maybe.withDefault (span [] [ text content.title ]) content.header
                , Html.map toMsg <|
                    main_ [] [ content.main ]
                ]
        ]
    }


viewHeader : Bool -> Html msg -> Html msg
viewHeader navOpen content =
    header
        [ css
            [ displayFlex
            , flexWrap Css.wrap
            , justifyContent spaceBetween
            , padding2 (px 13) (px 20)
            , color (hex "#170804")
            ]
        ]
        [ a [ attribute "role" "button" ] []
        , content
        , a [] []
        ]
