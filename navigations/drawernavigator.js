import React from "react";

import { Text, NativeModules } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

import BottomTabNavigator from "./bottomtabnavigator";
import CariJadwal from "../screens/carijadwal";
import Profil from "../screens/profil";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

doLogout = async () => {
    try {
        await AsyncStorage.removeItem('email');
        alert('Log out sukses');
        NativeModules.DevSettings.reload();
    } catch (e) {
        alert(e);
    }
}

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label={() => <Text>Logout</Text>}
                onPress={() => { doLogout();}}
            />
        </DrawerContentScrollView>
    );
}

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName="Main">
            <Drawer.Screen name="Utama" component={BottomTabNavigator}
                options={{
                    drawerLabel: 'Jadwal',
                    title: '',
                    headerShown: true,
                }} />
            <Drawer.Screen name="Cari Jadwal" component={CariJadwal} />
            <Drawer.Screen name="Profil" component={Profil} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;