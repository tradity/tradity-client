module Views.Chart exposing (view)

import LineChart
import LineChart.Area as Area
import LineChart.Axis as Axis
import LineChart.Axis.Intersection as Intersection
import LineChart.Colors as Colors
import LineChart.Container as Container
import LineChart.Dots as Dots
import LineChart.Events as Events
import LineChart.Grid as Grid
import LineChart.Interpolation as Interpolation
import LineChart.Junk as Junk
import LineChart.Legends as Legends
import LineChart.Line as Line
import Svg.Styled exposing (Svg, fromUnstyled)
import User
import Time

view : List User.UserValue -> Maybe User.UserValue -> (Maybe User.UserValue -> msg) -> Svg msg
view values hovered hoverMsg =
    (LineChart.viewCustom
        { x = Axis.time Time.utc 350 "Time" (\data -> toFloat (data.time * 1000))
        , y = Axis.full 350 "Total value" (\data -> (toFloat (.totalValue data)) / 10000)
        , container = Container.responsive "line-chart-1"
        , interpolation = Interpolation.default
        , intersection = Intersection.default
        , legends = Legends.none
        , events = Events.hoverOne hoverMsg
        , junk =
            Junk.hoverOne hovered
                [ ( "Time", String.fromInt << (*) 1000 << .time )
                , ( "Total value", String.fromFloat << (*) 0.0001 << toFloat << .totalValue )
                ]
        , grid = Grid.default
        , area = Area.default
        , line = Line.default
        , dots = Dots.hoverOne hovered
        }
        [ LineChart.line Colors.blueLight Dots.circle "Value" values
        ])
        |> fromUnstyled