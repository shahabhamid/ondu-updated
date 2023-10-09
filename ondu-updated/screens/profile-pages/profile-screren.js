import { View } from "react-native";
import ProfileBubble from "../../components/profile-bubble";

export default function ProfileScreen({ navigation, route }) {
  const { data } = route.params;
  return (
    <ProfileBubble
      navigation={navigation}
      route={data.user.email}
    ></ProfileBubble>
  );
}
