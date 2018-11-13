module Icons exposing (logo)

import Svg.Styled as Svg exposing (..)
import Svg.Styled.Attributes as Attributes exposing (..)


logo : List (Attribute msg) -> List (Svg msg) -> Svg msg
logo attributes children =
    svg (viewBox "0 0 256 256" :: attributes) [ g [ fill "none", fillRule "evenodd" ] [ Svg.path [ d "M127.9 29c-55 0-99.7 44.2-99.7 98.6a99.2 99.2 0 0 0 99.7 98.7c55 0 99.7-44.2 99.7-98.7A99.2 99.2 0 0 0 127.9 29zm127.6 98.7a127.7 127.7 0 0 1-255.5 0 127.6 127.6 0 0 1 255.5 0z", fill "#283B90" ] [], g [ transform "translate(58.3 52.2)" ] [ Svg.mask [ id "a", fill "#fff" ] [ Svg.path [ d "M132.4 144.3A93.7 93.7 0 0 1 71 167 93.6 93.6 0 0 1 .2 135V15.5c5-5.7 10.5-10.7 16.7-15h108.2c2.5 1.7 5 3.6 7.3 5.6v138.2z" ] [] ], g [ Attributes.mask "url(#a)", fill "#F1592A" ] [ Svg.path [ d "M36.6 98.4c-.4-1.5-8.9-.5-19 2.2-10 2.7-17.8 6-17.4 7.6l.2.3H.2v76.2h36.5V98.4M84.6 67c-.4-1.5-9-.5-19 2.2s-17.9 6.1-17.4 7.6c0 .1 0 .2.2.3h-.3V182h36.6V67h-.1m47.7-30.5c-.4-1.5-8.9-.6-19 2.1-10 2.7-17.9 6.1-17.4 7.6 0 .2 0 .3.2.4H96v140.6h36.5V36.5h-.1" ] [] ], g [ Attributes.mask "url(#a)", fill "#283B90" ] [ Svg.path [ d "M30.7 78c0 8.5-5.8 15.5-13 15.5-7.3 0-13.2-7-13.2-15.6s5.9-15.5 13.1-15.5c7.3 0 13.1 7 13.1 15.5m48-31.3c0 8.6-5.9 15.5-13 15.5-7.3 0-13.2-7-13.2-15.5C52.5 38 58.4 31 65.6 31c7.2 0 13 7 13 15.6M126.4 16c0 8.6-5.9 15.6-13 15.6-7.3 0-13.2-7-13.2-15.6S106.1.4 113.3.4c7.2 0 13.1 7 13.1 15.6" ] [] ] ] ] ]
