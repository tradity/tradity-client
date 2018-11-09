module Shell exposing (Content, view, viewHeader)

import Browser
import Color
import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (..)
import Html.Styled.Events exposing (..)
import Material.Icons.Action
import Material.Icons.Navigation
import Svg.Styled as Svg

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
            , alignItems center
            , padding2 (px 15) (px 20)
            , color (hex "#170804")
            , fontSize (px 25)
            , fontWeight (int 900)
            , lineHeight (int 0)
            ]
        ]
        [ a [ attribute "role" "button" ] [ Svg.fromUnstyled <| Material.Icons.Navigation.menu Color.black 25 ]
        , content
        , a [] [ Svg.fromUnstyled <| Material.Icons.Action.search Color.black 25 ]
        ]
