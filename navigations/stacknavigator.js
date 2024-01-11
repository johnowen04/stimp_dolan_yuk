import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PartyChat from '../screens/partychat';
import Jadwal from '../screens/jadwal';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={Jadwal} options={{ headerShown: false }} />
            <Stack.Screen name="PartyChat" component={PartyChat} />
        </Stack.Navigator>
    );
}

export default MainStackNavigator;