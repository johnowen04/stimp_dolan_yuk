import React from "react";
import { StyleSheet, View, Text, NativeModules } from "react-native";

export default class CariJadwal extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Cari Jadwal</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
        fontSize: 30,
    }
  });
  