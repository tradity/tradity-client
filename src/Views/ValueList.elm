module Views.ValueList exposing (view)

import Css exposing (..)
import Html.Styled as Html exposing (..)
import Html.Styled.Attributes exposing (css)


view : List ( String, String ) -> Html msg
view values =
    div
        [ css
            [ displayFlex
            , flexBasis (pct 100)
            , flexWrap wrap
            , backgroundColor (hex "#2B2D38")
            , padding2 (px 10) zero
            , margin zero
            ]
        ]
        (List.map viewValue values)


viewValue : ( String, String ) -> Html msg
viewValue ( label, value ) =
    div
        [ css
            [ displayFlex
            , flexBasis (pct 50)
            , flexDirection column
            , alignItems center
            , padding2 (px 5) zero
            , margin2 (px 5) zero
            , nthOfType "odd"
                [ flexBasis (calc (pct 50) minus (px 1))
                , borderRight3 (px 1) solid (rgba 151 151 151 0.37)
                ]
            ]
        ]
        [ span
            [ css
                [ fontSize (px 16)
                , lineHeight (px 19)
                , color (hex "#F1592A")
                ]
            ]
            [ text value ]
        , span
            [ css
                [ fontSize (px 10)
                , lineHeight (px 12)
                , color (hex "#FFFFFF")
                ]
            ]
            [ text label ]
        ]
