
import { Button, Card } from '@rneui/base';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import { FlatList } from 'react-native-gesture-handler';

export default class PartyChat extends ValidationComponent {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            jadwalId: 0,
            is_fetched: false,
            dataChat: [],
            chat: '',
        };
    }

    componentDidMount() {
        this.setState({
            jadwalId: this.props.route.params.jadwalId,
            email: this.props.route.params.email
        })
        this.fetchData();
    }

    fetchData = () => {
        try {
            fetch('https://ubaya.me/flutter/160420016/dolan_yuk/chat.php?jadwal_id=' + this.state.jadwalId, { method: 'GET' })
                .then(response => response.json())
                .then(resjson => {
                    this.setState(
                        this.state = {
                            is_fetched: true,
                            dataChat: resjson.data
                        })
                });
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
                    <Card.Title>{item.user.full_name}</Card.Title>
                    <View style={styles.space} />
                    <Text style={styles.text}>{item.chat}</Text>
                </Card>
            )}
        />
    }

    _onSubmit() {
        if (this.validate({
            chat: { required: true },
        })) {
            this.doSend(this.state.jadwalId, this.state.email, this.state.chat);
        }
    }

    doSend = async (jadwalId, email, chat) => {
        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "jadwal_id=" + jadwalId + "&email=" + email + "&chat=" + chat
        };

        const response = await fetch('https://ubaya.me/flutter/160420016/dolan_yuk/chat.php',
            options);
        const json = await response.json();

        if (json.result == 'success') {
            try {
                this.setState({ chat: '' });
            } catch (e) {
                alert(e);
            }
        }
        else {
            alert('email atau paassword salah')
        }
    }

    render() {
        if (!this.state.is_fetched) {
            this.state.jadwalId = this.props.route.params.jadwalId;
            this.fetchData();
        } else {
            return <View style={styles.vparent}>
                {this.showData(this.state.dataChat)}
                <View style={styles.space} />
                <View style={styles.viewRow}>
                    <TextInput style={styles.input} value={this.state.chat}
                        onChangeText={(chat) => this.setState({ chat })} />
                    <View style={styles.spaceVert} />
                    <Button style={styles.button} title="Kirim" onPress={() => this._onSubmit()} />
                </View>

                <Text>
                    {this.getErrorMessages()}
                </Text>
            </View >
        }
    }
}

const styles = StyleSheet.create({
    vparent: {
        marginBottom: 90,
    },
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
    viewRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: 'center',
        paddingRight: 50,
        margin: 3
    },
    text: {
        fontSize: 24,
    },
    space: {
        width: 20,
        height: 10,
    },
    spaceVert: {
        width: 30,
        height: 10,
    },
});