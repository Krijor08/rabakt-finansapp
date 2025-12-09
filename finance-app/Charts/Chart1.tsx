import { View } from "react-native";
import { 
  VictoryChart, 
  VictoryLine, 
  VictoryAxis, 
  VictoryTheme,
  VictoryBar,
  VictoryPolarAxis,
} from "victory";

export default function Chart1() {
  return (
    <View style={{ flex: 1 }}>
      <VictoryChart theme={VictoryTheme.clean}>
        <VictoryAxis />
        <VictoryLine
          data={[
            { x: 1, y: 0 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 4, y: 3 },
            { x: 5, y: 3 },
            { x: 6, y: 2 },
          ]}
        />
      </VictoryChart>
      <VictoryChart
    polar
    theme={VictoryTheme.clean}
    startAngle={90}
    endAngle={450}
  >
    <VictoryPolarAxis
      tickValues={[
        0,
        45,
        90,
        135,
        180,
        225,
        270,
        315,
      ]}
      labelPlacement="vertical"
    />
    <VictoryBar
      style={{ data: { width: 30 } }}
      data={[
        { x: 0, y: 25 },
        { x: 60, y: 31 },
        { x: 120, y: 53 },
        { x: 180, y: 44 },
        { x: 240, y: 42 },
        { x: 300, y: 47 },
      ]}
    />
  </VictoryChart>
    </View>
  );
}
