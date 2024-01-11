import React from "react";
import { Card, Icon } from "@rneui/base";
import { StyleSheet, View, Button, Text, TextInput, NativeModules } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class CariJadwal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cari: '',
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
            body: "cari=" + this.state.cari
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
                        title='Join Dolan'
                        onPress={() => {
                            this.doJoin(item.id, this.state.email);
                        }
                        }
                    />
                </Card>
            )}
        />
    }

    doJoin = async (id, email) => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "jadwal_id=" + id + "&email=" + email
        };

        const response = await fetch('https://ubaya.me/flutter/160420016/dolan_yuk/joinjadwal.php',
            options);
        const json = await response.json();

        if (json.result == 'success') {
            try {
                alert('Join berhasil');
                NativeModules.DevSettings.reload();
            } catch (e) {
                alert(e);
            }
        }
        else {
            alert('Anda sudah join pada jadwal ini')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Card>
                    <View style={styles.viewRow} >
                        <Text>Cari </Text>
                        <TextInput style={styles.input}
                            onChangeText={(cari) => this.setState({ cari })}
                            onSubmitEditing={this.fetchData}
                        />
                    </View>
                </Card>
                {this.showData(this.state.dataJadwal)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
    },
    input: {
        height: 40,
        width: 300,
        borderWidth: 1,
        padding: 10,
    },
    space: {
        width: 20,
        height: 10,
    },
});
