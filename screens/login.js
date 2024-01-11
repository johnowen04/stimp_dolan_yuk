import React from "react";
import { Card } from '@rneui/themed';
import { StyleSheet, View, Text, TextInput, Button, NativeModules } from "react-native";
import ValidationComponent from 'react-native-form-validator';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Login extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    render() {
        return (
            <Card>
                <Card.Title>Silakan Login</Card.Title>
                <Card.Divider />
                <View style={styles.viewRow}>
                    <Text>Email </Text>
                    <TextInput style={styles.input}
                        onChangeText={(email) => this.setState({ email })} />
                </View>
                <View style={styles.viewRow}>
                    <Text>Password </Text>
                    <TextInput secureTextEntry={true} style={styles.input}
                        onChangeText={(password) => this.setState({ password })} />
                </View>
                <View style={styles.viewRow}>
                    <Button style={styles.button} title="Register" onPress={() => this.props.navigation.navigate("Register")} />
                    <View style={styles.space} />
                    <Button style={styles.button} title="Login" onPress={() => _onSubmit()} />
                </View>

                <Text>
                    {this.getErrorMessages()}
                </Text>
            </Card>
        );
    }

    _onSubmit() {
        if (this.validate({
            email: { email: true },
            password: { required: true },
        })) {
            this.doLogin(this.state.email, this.state.password);
        }
    }

    doLogin = async (email, password) => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email=" + email + "&password=" + password
        };

        const response = await fetch('https://ubaya.me/flutter/160420016/dolan_yuk/login.php',
            options);
        const json = await response.json();

        if (json.result == 'success') {
            var full_name = await json.data.full_name;
            var photo_url = await json.data.photo_url ? json.data.photo_url : 'https://ubaya.me/flutter/160420016/dolan_yuk/assets/img/default.jpg';

            try {
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('fullName', full_name);
                await AsyncStorage.setItem('photoUrl', photo_url);
                alert('Login berhasil');
                NativeModules.DevSettings.reload();
            } catch (e) {
                alert(e);
            }
        }
        else {
            alert('email atau paassword salah')
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
    button: {
        height: 40,
        width: 200,
    },
    viewRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        paddingRight: 50,
        margin: 3
    },
    space: {
        width: 20,
        height: 20,
    },
})