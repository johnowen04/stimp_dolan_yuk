import React from "react";
import { Card } from '@rneui/themed';
import { StyleSheet, View, Text, TextInput, Button, NativeModules } from "react-native";
import ValidationComponent from 'react-native-form-validator';

export default class Register extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            fullName: '',
            password: '',
            repeatPassword: '',
        };
    }

    render() {
        return (
            <Card>
                <Card.Title>Silakan Daftar</Card.Title>
                <Card.Divider />
                <View style={styles.viewRow}>
                    <Text>Email </Text>
                    <TextInput style={styles.input}
                        onChangeText={(email) => this.setState({ email })} />
                </View>
                <View style={styles.viewRow}>
                    <Text>Nama Lengkap </Text>
                    <TextInput style={styles.input}
                        onChangeText={(fullName) => this.setState({ fullName })} />
                </View>
                <View style={styles.viewRow}>
                    <Text>Password </Text>
                    <TextInput secureTextEntry={true} style={styles.input}
                        onChangeText={(password) => this.setState({ password })} />
                </View>
                <View style={styles.viewRow}>
                    <Text>Ulangi Password </Text>
                    <TextInput secureTextEntry={true} style={styles.input}
                        onChangeText={(repeatPassword) => this.setState({ repeatPassword })} />
                </View>
                <View style={styles.viewRow}>
                    <Button style={styles.button} title="Register" onPress={() => this._onSubmit()} />
                </View>
                <Text>
                    {this.getErrorMessages()}
                </Text>
            </Card>
        );
    }

    _onSubmit() {
        if (this.validate({
            fullName: { required: true },
            email: { email: true },
            password: { required: true, equalPassword: this.state.repeatPassword },
        })) {
            this.doRegister(this.state.email, this.state.password, this.state.fullName);
        }
    }

    doRegister = async (email, password, fullName) => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "email=" + email + "&password=" + password + "&full_name=" + fullName
        };

        const response = await fetch('https://ubaya.me/flutter/160420016/dolan_yuk/signup.php',
            options);
        const json = await response.json();

        if (json.result == 'success') {

            try {
                alert('Daftar berhasil');
                this.props.navigation.navigate('Login');
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
    }
})