module Views.Tabs exposing (view)

import Css exposing (..)
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (..)


view : List ( String, String, Bool ) -> Html msg
view tabs =
    nav
        [ css
            [ displayFlex
            , borderBottom3 (px 1) solid (rgba 151 151 151 0.37)
            ]
        ]
        (List.map viewTab tabs)


viewTab : ( String, String, Bool ) -> Html msg
viewTab ( title, path, active ) =
    a
        [ href path
        , css
            ([ display inlineFlex
             , Css.height (px 48)
             , flexGrow (int 1)
             , alignItems center
             , justifyContent center
             , textDecoration none
             , color inherit
             , hover
                [ borderBottom3 (px 2) solid (hex "#F1592A")
                , color (hex "#F1592A")
                ]
             ]
                ++ (if active then
                        [ borderBottom3 (px 2) solid (hex "#F1592A")
                        , color (hex "#F1592A")
                        ]

                    else
                        []
                   )
            )
        ]
        [ text title ]
