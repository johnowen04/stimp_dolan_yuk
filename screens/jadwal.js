import { Card, Icon } from "@rneui/base";
import React from "react";
import { StyleSheet, View, Button, Text, NativeModules } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAB } from "@rneui/themed";

export default class Jadwal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            dataJadwal: [],
        }

        this.cekEmail().then((item) => {
            this.setState({
                email: item
            });

        });
    }

    cekEmail = async () => {
        try {
            const value = await AsyncStorage.getItem('email');
            if (value !== null) {
                return value;
            }
        } catch (e) {
            // error reading value
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email=" + this.state.email
        };

        try {
            fetch('https://ubaya.me/flutter/160420016/dolan_yuk/daftarjadwal.php',
                options
            ).then((response) => response.ok ? response.json() : Promise.reject()).then((json) => {
                this.setState(
                    this.state = {
                        dataJadwal: json.data,
                    }
                )
            }).catch((error) => console.error(error));
        } catch (error) {
            console.log(error);
        }
    }

    showData(data) {
        return <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <Card>
                    <Card.Title style={styles.text}>Dolan {item.dolan.nama}</Card.Title>
                    <Card.Image style={styles.imgavatar}
                        source={{
                            uri:
                                "https://plus.unsplash.com/premium_photo-1670183859029-99a0a2c1912b?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        }} />
                    <View style={styles.space} />
                    <Text>{item.tanggal}</Text>
                    <Text>{item.jam}</Text>
                    <View style={styles.space} />
                    <Button
                        icon={
                            <Icon
                                name="react"
                                size={15} />
                        }
                        title={item.jumlah_member + "/" + item.minimal_member}
                    />
                    <View style={styles.space} />
                    <Text>{item.lokasi}</Text>
                    <Text>{item.alamat}</Text>
                    <View style={styles.space} />
                    <Button
                        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                        title='Party Chat'
                        onPress={() => {
                            const { navigation } = this.props;
                            navigation.navigate("PartyChat", { jadwalId: item.id, email: this.state.email })
                        }
                        }
                    />
                </Card>
            )}
        />
    }

    render() {
        return (
            <View style={styles.container}>
                {this.showData(this.state.dataJadwal)}
                <FAB
                    style={styles.fab}
                    visible={true}
                    placement="right"
                    icon={{ name: 'add', color: 'white' }}
                    color="green"
                    onPress={() => { alert('FAB pressed') }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 32,
        right: 0,
        bottom: 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
    },
    space: {
        width: 20,
        height: 10,
    },
});
