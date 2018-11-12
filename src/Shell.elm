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


view : Bool -> msg -> (subMsg -> msg) -> Content subMsg -> Browser.Document msg
view navOpen toggleNav toMsg content =
    { title =
        content.title ++ " – Tradity"
    , body =
        [ toUnstyled <|
            div []
                [ if content.showHeader then
                    viewHeader navOpen toggleNav toMsg content

                  else
                    text ""
                , main_ [] [ content.main ]
                    |> Html.map toMsg
                ]
        ]
    }


viewHeader : Bool -> msg -> (subMsg -> msg) -> Content subMsg -> Html msg
viewHeader navOpen toggleNav toMsg content =
    header
        [ css
            [ displayFlex
            , flexWrap Css.wrap
            , justifyContent spaceBetween
            , alignItems center
            , padding2 (px 15) (px 20)
            , color (hex "#170804")
            , lineHeight (int 0)
            ]
        ]
        [ a
            [ attribute "role" "button"
            , onClick toggleNav
            ]
            [ Svg.fromUnstyled <| Material.Icons.Navigation.menu Color.black 25 ]
        , case content.header of
            Just header ->
                Html.map toMsg header

            Nothing ->
                h1
                    [ css
                        [ fontSize (px 25)
                        , fontWeight (int 900)
                        , margin (px 0)
                        ]
                    ]
                    [ text content.title ]
        , a [] [ Svg.fromUnstyled <| Material.Icons.Action.search Color.black 25 ]
        , div
            [ css
                ([ Css.property "transition-duration" "1s"
                 , Css.width (pct 100)
                 , displayFlex
                 , flexDirection column
                 , alignItems center
                 , boxSizing borderBox
                 ]
                    ++ (if navOpen then
                            [ Css.height (vh 100)
                            , paddingTop (px 15)
                            , visibility visible
                            , opacity (int 1)
                            ]

                        else
                            [ Css.height zero
                            , visibility Css.hidden
                            , opacity zero
                            ]
                       )
                )
            ]
            []
        ]
