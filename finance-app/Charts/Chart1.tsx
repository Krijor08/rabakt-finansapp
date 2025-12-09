import { View } from "react-native";
import { 
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
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
        </View>
  );
}
