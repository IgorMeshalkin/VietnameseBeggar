import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useState} from "react";

export default function LessThenTwoWarning({closeWindow}) {
    const [message, setMessage] = useState('Если останется одна валюта, даже самая крепкая, её не с чем будет сравнивать.\n\nОставь хотя бы две.')

    return (
        <View style={styles.windowForContent}>
            <View style={styles.bodyContainer}>
                <Text style={styles.body}>{message}</Text>
            </View>
            <TouchableOpacity onPress={() => closeWindow(false)} style={styles.buttonContainer}>
                <Text style={styles.button}>ПОНЯТНО</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    windowForContent: {
        height: '25%',
        width: '80%',
        margin: 'auto',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    body: {
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
    },
    button: {
        color: 'rgba(90, 144, 33, 1)',
        fontWeight: 'bold',
        fontSize: 18
    },
    bodyContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});