import { View } from "react-native";
import { 
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryBar,
} from "victory";

export default function Chart6() {
  return (
        <View style={{ flex: 1 }}>
            <VictoryChart
                theme={VictoryTheme.clean}
                domainPadding={{ x: 40 }}
            >
                <VictoryBar
                data={[
                    { x: 1, y: 2 },
                    { x: 2, y: 4.5 },
                    { x: 3, y: 6.75 },
                    { x: 4, y: 5.9 },
                    { x: 5, y: 7.8 },
                    { x: 6, y: 2 },
                ]}
                />
            </VictoryChart>
        </View>
  );
}
