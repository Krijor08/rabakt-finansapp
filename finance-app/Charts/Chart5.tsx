import { View } from "react-native";
import { 
  VictoryChart,
  VictoryTheme,
  VictoryPolarAxis,
  VictoryBar,
} from "victory";

export default function Chart5() {
  return (
        <View style={{ flex: 1 }}>
             <VictoryChart
                polar
                theme={VictoryTheme.clean}
                startAngle={0}
                endAngle={180}
            >
                <VictoryPolarAxis
                tickValues={[0, 45, 90, 135, 180]}
                labelPlacement="vertical"
                />
                <VictoryBar
                data={[
                    { x: 0, y: 2 },
                    { x: 45, y: 3 },
                    { x: 90, y: 5 },
                    { x: 135, y: 4 },
                    { x: 180, y: 7 },
                ]}
                />
            </VictoryChart>
        </View>
  );
}
