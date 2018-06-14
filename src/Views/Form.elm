module Views.Form exposing (form, input)

import Css exposing (..)
import Css.Colors exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (css)


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
                , lineHeight (px 15)
                , letterSpacing (px 2)
                , color (hex "#170804")
                , backgroundColor white
                , inputChild
                , removeChromiumAutofillColor
                ]
             ]
                ++ attrs
            )
            []
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
