import { View } from "react-native";
import { 
  VictoryChart,
  VictoryTheme,
  VictoryStack,
  VictoryArea,
} from "victory";

const sampleData1 = [
  { x: 1, y: 0 },
  { x: 2, y: 18 },
  { x: 3, y: 11 },
  { x: 4, y: 22 },
  { x: 5, y: 55 },
];

const sampleData2 = [
  { x: 1, y: 0 },
  { x: 2, y: 25 },
  { x: 3, y: 12 },
  { x: 4, y: 24 },
  { x: 5, y: 35 },
];

const sampleData3 = [
  { x: 1, y: 0 },
  { x: 2, y: 57 },
  { x: 3, y: 15 },
  { x: 4, y: 0 },
  { x: 5, y: 0 },
];

const sampleData4 = [
  { x: 1, y: 0 },
  { x: 2, y: 16 },
  { x: 3, y: 15 },
  { x: 4, y: 32 },
  { x: 5, y: 61 },
];

export default function Chart2() {
  return (
        <View style={{ flex: 1 }}>
            <VictoryChart
                events={[
                    {
                    childName: "all",
                    target: "data",
                    eventHandlers: {
                        onClick: () => {
                        return [
                            {
                            childName: "area-2",
                            target: "data",
                            mutation: (props) => ({
                                style: Object.assign(
                                {},
                                props.style,
                                { fill: "gold", },
                                ),
                            }),
                            },
                            {
                            childName: "area-3",
                            target: "data",
                            mutation: (props) => ({
                                style: Object.assign(
                                {},
                                props.style,
                                { fill: "orange", },
                                ),
                            }),
                            },
                            {
                            childName: "area-4",
                            target: "data",
                            mutation: (props) => ({
                                style: Object.assign(
                                {},
                                props.style,
                                { fill: "red", },
                                ),
                            }),
                            },
                        ];
                        },
                    },
                    },
                ]}
                theme={VictoryTheme.clean}
                >
                <VictoryStack>
                    <VictoryArea
                    name="area-1"
                    data={sampleData1}
                    />
                    <VictoryArea
                    name="area-2"
                    data={sampleData2}
                    />
                    <VictoryArea
                    name="area-3"
                    data={sampleData3}
                    />
                    <VictoryArea
                    name="area-4"
                    data={sampleData4}
                    />
                </VictoryStack>
            </VictoryChart>
        </View>
  );
}
