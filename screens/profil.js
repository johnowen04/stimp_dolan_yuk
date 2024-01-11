import { Image } from "@rneui/base";
import React from "react";
import { StyleSheet, View, Text, TextInput, Button, NativeModules } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import ValidationComponent from 'react-native-form-validator';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Profil extends ValidationComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            fullName: '',
            photoUrl: '',
        };

        this.cekEmail().then((item) => {
            this.setState({
                email: item
            });
        });

        this.cekFullName().then((item) => {
            this.setState({
                fullName: item
            });
        });

        this.cekPhoto().then((item) => {
            this.setState({
                photoUrl: item
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

    cekFullName = async () => {
        try {
            const value = await AsyncStorage.getItem('fullName');
            if (value !== null) {
                return value;
            }
        } catch (e) {
            // error reading value
        }
    }

    cekPhoto = async () => {
        try {
            const value = await AsyncStorage.getItem('photoUrl');
            if (value !== null) {
                return value;
            }
        } catch (e) {
            // error reading value
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight
                    style={[styles.profileImgContainer, { borderColor: 'green', borderWidth: 1 }]}>
                    <Image source={{ uri: this.state.photoUrl ? this.state.photoUrl : "https://ubaya.me/flutter/160420016/dolan_yuk/assets/img/default.jpg" }} style={styles.profileImg} />
                </TouchableHighlight>
                <View style={styles.viewRow}>
                    <Text>Email </Text>
                    <TextInput style={styles.input} value={this.state.email} editable={false} disabled={true} />
                </View>
                <View style={styles.viewRow}>
                    <Text>Nama Lengkap </Text>
                    <TextInput style={styles.input} value={this.state.fullName}
                        onChangeText={(fullName) => this.setState({ fullName })} />
                </View>
                <View style={styles.space} />
                <View style={styles.viewRow}>
                    <Button style={styles.button} title="Update" onPress={() => this._onSubmit()} />
                </View>
            </View >
        );
    }

    _onSubmit() {
        if (this.validate({
            fullName: { required: true },
            email: { email: true },
        })) {
            this.doUpdate(this.state.email, this.state.fullName);
        }
    }

    doUpdate = async (email, fullName) => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email=" + email + "&full_name=" + fullName
        };

        const response = await fetch('https://ubaya.me/flutter/160420016/dolan_yuk/updateprofile.php',
            options);
        const json = await response.json();

        if (json.result == 'success') {

            try {
                alert('Update profile berhasil');
            } catch (e) {
                alert(e);
            }
        }
        else {
            alert('update gagal')
        }
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 200,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    text: {
        fontSize: 30,
    },
    space: {
        width: 20,
        height: 20,
    },
    profileImgContainer: {
        marginLeft: 8,
        height: 150,
        width: 150,
        borderRadius: 75,
    },
    profileImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
    },
});
