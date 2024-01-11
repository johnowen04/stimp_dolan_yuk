import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from 'react-native-vector-icons/Ionicons';

import Jadwal from "../screens/jadwal";
import CariJadwal from "../screens/carijadwal";
import Profil from "../screens/profil";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    var iconName;
                    if (route.name == 'Jadwal') {
                        iconName = 'calendar';
                        var iconColor = (focused) ? 'blue' : 'gray';
                    }
                    if (route.name == 'Cari Jadwal') {
                        iconName = 'search';
                        var iconColor = (focused) ? 'blue' : 'gray';
                    }
                    if (route.name == 'Profil') {
                        iconName = 'person';
                        var iconColor = (focused) ? 'blue' : 'gray';
                    }
                    return <Ionicons name={iconName} size={30} color={iconColor} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
            })}>
            <Tab.Screen name="Jadwal" component={Jadwal}
                options={{ headerShown: false }} />
            <Tab.Screen name="Cari Jadwal" component={CariJadwal}
                options={{ headerShown: false }} />
            <Tab.Screen name="Profil" component={Profil}
                options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;