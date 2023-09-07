import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import { useState, useEffect } from "react";
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
} from "./utils/nativewind-styled";

const initialData = { x: 0, y: 0, z: 0 };

export default function App() {
  const [data, setData] = useState<AccelerometerMeasurement>(initialData);
  const [subscription, setSubscription] = useState<any>(null);
  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(500);
  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    Accelerometer.removeAllListeners();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <StyledView className="flex-1 justify-center items-center">
      <StyledView className="mb-4 items-center">
        <StyledText className="text-2xl text-gray-600">Acceleration</StyledText>
        <StyledText className="text-7xl font-bold text-purple-600">
          {magnitude(data)}
        </StyledText>
      </StyledView>

      <DisplayAcceleration data={data} />

      <StyledView className="flex-row gap-2 mt-3">
        <StyledTouchableOpacity
          onPress={subscription ? _unsubscribe : _subscribe}
          className="bg-purple-400 p-3 rounded-full"
        >
          <StyledText className="text-white text-lg">
            {subscription ? "On" : "Off"}
          </StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={_slow}
          className="bg-purple-400 p-3 rounded-full"
        >
          <StyledText className="text-white text-lg">Slow</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity
          onPress={_fast}
          className="bg-purple-400 p-3 rounded-full"
        >
          <StyledText className="text-white text-lg">Fast</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
}

interface DisplayLocationProps {
  data: AccelerometerMeasurement | null;
}

function DisplayAcceleration({ data }: DisplayLocationProps) {
  if (!data) return <StyledView />;
  return (
    <StyledView className="bg-gray-100 p-4 rounded-xl flex-col">
      <ListItem title="X" value={data.x.toFixed(4)} />
      <ListItem title="Y" value={data.y.toFixed(4)} />
      <ListItem title="Z" value={data.z.toFixed(4)} />
    </StyledView>
  );
}

interface ListItemProps {
  title: string;
  value: string | number | null | undefined;
}

function ListItem({ title, value }: ListItemProps) {
  const valueTxt = value?.toString() ?? "Unknown";
  return (
    <StyledView className="flex-row items-center my-2 gap-2">
      <StyledText className="bg-gray-400 text-white px-2 py-1 rounded-lg font-bold">
        {title}
      </StyledText>
      <StyledText className="">{valueTxt}</StyledText>
    </StyledView>
  );
}

function magnitude(data: AccelerometerMeasurement) {
  const value = Math.sqrt(
    Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)
  );
  return value.toFixed(4);
}
