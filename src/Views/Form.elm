module Views.Form exposing (button, checkbox, form, input)

import Color
import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (css, type_)
import Html.Styled.Events exposing (..)
import Material.Icons.Toggle
import Svg.Styled as Svg


form : List (Attribute msg) -> List (Html msg) -> Html msg
form =
    styled Html.form
        [ display inlineFlex
        , flexWrap wrap
        , margin2 zero (px 50)
        ]


input : List (Attribute msg) -> Html msg
input attrs =
    div
        [ css
            [ width (pct 100)
            , display inlineFlex
            , marginBottom (px 15)
            , padding2 zero (px 12)
            , border3 (px 1) solid (hex "#D8D8D8")
            , borderRadius (px 3)
            , outline none
            ]
        ]
        [ Html.input
            ([ css
                [ flex auto
                , outline none
                , border zero
                , margin2 zero (px 7)
                , fontFamily inherit
                , fontSize (px 12)
                , letterSpacing (px 2)
                , color (hex "#170804")
                , backgroundColor (hex "#ffffff")
                , inputChild
                , removeChromiumAutofillColor
                ]
             ]
                ++ attrs
            )
            []
        ]


button : List (Attribute msg) -> List (Html msg) -> Html msg
button =
    styled Html.button
        [ width (pct 100)
        , height (px 48)
        , backgroundColor (rgba 241 89 42 0.95)
        , boxShadow5 zero (px 2) (px 1) zero (hex "#F1592A")
        , border3 (px 1) solid (rgba 241 89 42 0.97)
        , borderRadius (px 3)
        , color (hex "#ffffff")
        , fontFamily inherit
        , fontSize (px 16)
        ]


checkbox : msg -> Bool -> String -> Html msg
checkbox msg value label =
    Html.label
        [ css
            [ display inlineFlex
            , alignItems center
            , fontSize (px 12)
            , height (px 24)
            , margin4 zero zero (px 15) (px -3)
            ]
        ]
        [ Html.input
            [ type_ "checkbox"
            , onClick msg
            , css
                [ position absolute
                , left (px -10000)
                ]
            ]
            []
        , Svg.fromUnstyled <|
            if value then
                Material.Icons.Toggle.check_box (Color.rgb255 241 89 42) 32

            else
                Material.Icons.Toggle.check_box_outline_blank (Color.rgb255 216 216 216) 32
        , span [ css [ marginLeft (px 6) ] ] [ text label ]
        ]


inputChild : Style
inputChild =
    Css.batch
        [ displayFlex
        , alignItems center
        , height (px 57)
        ]


{-| Hack needed to get rid of Chrome's ugly form autofill colour,
which for some reason is an outstanding bug since 2008 -.-
<https://bugs.chromium.org/p/chromium/issues/detail?id=46543>
-}
removeChromiumAutofillColor : Style
removeChromiumAutofillColor =
    Css.batch
        [ property "-webkit-box-shadow" "0 0 0px 1000px white inset"
        , property "-webkit-text-fill-color" "#170804"
        ]
