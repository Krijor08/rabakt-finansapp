import { Text, View } from "react-native";
import { 
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
} from "victory";

export default function Chart4() {
  return (
        <View style={{ flex: 1 }}>
            <Text>Beta Build Consistency:</Text>
            <VictoryChart theme={VictoryTheme.clean}>
                <VictoryAxis />
                <VictoryLine
                data={[
                    { x: 1, y: 5 },
                    { x: 2, y: 5 },
                    { x: 3, y: 4 },
                    { x: 4, y: 3 },
                    { x: 5, y: 8 },
                    { x: 6, y: 7 },
                ]}
                />
            </VictoryChart>
        </View>
  );
}
