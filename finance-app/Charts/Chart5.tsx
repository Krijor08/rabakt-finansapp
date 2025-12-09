import { View, Text, ScrollView } from "react-native";
import { 
  VictoryChart,
  VictoryTheme,
  VictoryPolarAxis,
  VictoryBar,
} from "victory";

export default function Chart5() {
  return (
    <ScrollView style={{ flex: 1, maxHeight: 600 }}>
        <View style={{ flex: 1 }}>
            <Text>Beta 1:</Text>
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

            <Text>Beta 2:</Text>

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
                    { x: 0, y: 9 },
                    { x: 45, y: 5 },
                    { x: 90, y: 4 },
                    { x: 135, y: 1 },
                    { x: 180, y: 7 },
                ]}
                />
            </VictoryChart>

            <Text>Beta 3:</Text>

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
                    { x: 0, y: 1 },
                    { x: 45, y: 2 },
                    { x: 90, y: 2 },
                    { x: 135, y: 8 },
                    { x: 180, y: 9 },
                ]}
                />
            </VictoryChart>
            
            <Text>Beta 4:</Text>

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
                    { x: 0, y: 9 },
                    { x: 45, y: 8 },
                    { x: 90, y: 9 },
                    { x: 135, y: 4 },
                    { x: 180, y: 2 },
                ]}
                />
            </VictoryChart>
            
            <Text>Beta 5:</Text>

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
                    { x: 0, y: 1 },
                    { x: 45, y: 3 },
                    { x: 90, y: 4 },
                    { x: 135, y: 8 },
                    { x: 180, y: 5 },
                ]}
                />
            </VictoryChart>

            <Text>Beta 6:</Text>

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
                    { x: 0, y: 8 },
                    { x: 45, y: 7 },
                    { x: 90, y: 2 },
                    { x: 135, y: 4 },
                    { x: 180, y: 5 },
                ]}
                />
            </VictoryChart>
        </View>
    </ScrollView>
  );
}
