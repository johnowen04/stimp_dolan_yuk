import React from "react"
import { StyleSheet, Button, Text, View, TextInput, NativeModules } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker"
import DropDownPicker from 'react-native-dropdown-picker';
import ValidationComponent from 'react-native-form-validator';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default class JadwalBaru extends ValidationComponent {
    constructor(props) {
        super(props);

        this.state = {
            isDateTimePickerVisible: false,
            isTimePickerVisible: false,
            dd_open: false,
            chosen_dolan: '',
            daftarDolanan: [],
            tanggal: '',
            jam: '',
            lokasi: '',
            alamat: '',
            minimalMember: '0',
            roomMaster: '',
            dolan_id: 0,
        }

        this.cekEmail().then((item) => {
            this.setState({
                roomMaster: item
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
        this.fetchDolanan();
    }

    fetchDolanan = () => {
        const options = {
            method: 'GET',
        };

        try {
            fetch('https://ubaya.me/flutter/160420016/dolan_yuk/daftardolan.php',
                options
            ).then((response) => response.ok ? response.json() : Promise.reject()).then((json) => {
                this.setState(
                    this.state = {
                        daftarDolanan: json.data,
                    }
                )
            }).catch((error) => console.error(error));
        } catch (error) {
            console.log(error);
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    handleDatePicked = date => {
        this.setState(
            {
                tanggal: date.getFullYear() + "-" +
                    (date.getMonth() + 1) + "-" +
                    date.getDate()
            }
        );
        this.hideDateTimePicker();
    };

    showTimePicker = () => {
        this.setState({ isTimePickerVisible: true });
    };
    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };
    handleTimePicked = time => {
        this.setState(
            {
                jam: time.getHours() + ":" +
                    time.getMinutes() + ":" +
                    time.getSeconds()
            }
        );
        this.hideTimePicker();
    };

    setOpen = open => {
        this.setState({
            dd_open: open
        });
    }

    setValue = callback => {
        this.setState(state => ({
            dolan_id: callback(state.value),
            chosen_dolan: callback(state.label)
        }));
    }

    _onSubmit() {
        if (this.validate({
            roomMaster: { required: true },
            tanggal: { required: true },
            jam: { required: true },
            lokasi: { required: true },
            alamat: { required: true },
            minimalMember: { required: true },
            dolan_id: { required: true },
        })) {
            // alert(this.state.roomMaster + " " + this.state.tanggal + " " + this.state.jam + " " + this.state.lokasi + " " + this.state.alamat + " " + this.state.minimalMember + " " + this.state.dolan_id);
            this.doBuatJadwal(this.state.roomMaster, this.state.tanggal, this.state.jam, this.state.lokasi, this.state.alamat, this.state.minimalMember, this.state.dolan_id);
        }
    }

    doBuatJadwal = async (roomMaster, tanggal, jam, lokasi, alamat, minimalMember, dolan_id) => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "tanggal=" + tanggal + "&jam=" + jam + "&lokasi=" + lokasi + "&alamat=" + alamat + "&minimal_member=" + minimalMember + "&dolan_id=" + dolan_id + "&room_master=" + roomMaster
        };

        const response = await fetch('https://ubaya.me/flutter/160420016/dolan_yuk/newjadwal.php',
            options);
        const json = await response.json();

        if (json.result == 'success') {

            try {
                alert('Jadwal berhasil dibuat');
                this.props.navigation.navigate("Main");
                NativeModules.DevSettings.reload();
            } catch (e) {
                alert(e);
            }
        }
        else {
            alert('Jadwal gagal dibuat')
        }
    }

    render() {
        return (
            <View>
                <Text>Tanggal</Text>
                <View style={styles.viewRow}>
                    <Text style={styles.input3}>{this.state.tanggal}</Text>
                    <Button title="..." onPress={this.showDateTimePicker} />
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                />
                <Text>Jam</Text>
                <View style={styles.viewRow}>
                    <Text style={styles.input3}>{this.state.jam}</Text>
                    <Button title="..." onPress={this.showTimePicker} />
                </View>
                <DateTimePicker mode="time"
                    isVisible={this.state.isTimePickerVisible}
                    onConfirm={this.handleTimePicked}
                    onCancel={this.hideTimePicker}
                />
                <View style={styles.space} />
                <View style={styles.viewRow}>
                    <Text>Lokasi </Text>
                    <TextInput style={styles.input3}
                        onChangeText={(lokasi) => this.setState({ lokasi })} />
                </View>
                <View style={styles.space} />
                <View style={styles.viewRow}>
                    <Text>Alamat </Text>
                    <TextInput style={styles.input3}
                        onChangeText={(alamat) => this.setState({ alamat })} />
                </View>
                <View style={styles.space} />
                <DropDownPicker
                    schema={{
                        label: 'nama',
                        value: 'id'
                    }}
                    open={this.state.dd_open}
                    value={this.state.dolan_id}
                    items={this.state.daftarDolanan}
                    setOpen={this.setOpen}
                    setValue={this.setValue}
                />
                <View style={styles.space} />
                <View style={styles.viewRow}>
                    <Text>Minimal Member </Text>
                    <TextInput keyboardType='numeric' style={styles.input3} value={this.state.minimalMember.toString()}
                        onChangeText={(minimalMember) => this.setState({ minimalMember })} />
                </View>
                <View style={styles.space} />
                <View style={styles.viewRow}>
                    <Button style={styles.button} title="Buat Jadwal" onPress={() => this._onSubmit()} />
                </View>

                <Text>
                    {this.getErrorMessages()}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        paddingRight: 50,
        margin: 3
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
    },
    input3: {
        height: 40,
        width: 200,
        borderWidth: 1,
        padding: 10,
    },
    space: {
        width: 20,
        height: 10,
    },
});