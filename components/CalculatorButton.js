import {TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';
import RUSflag from '../images/RUS.png'
import VNDflag from '../images/VND.png'
import USDflag from '../images/USD.png'
import EURflag from '../images/EUR.png'

export default function CalculatorButton({char, onPress}) {
    return (
        <TouchableOpacity onPress={() => onPress(char)} style={styles.mainBlock}>
            <Text style={styles.char}>{char}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainBlock: {
        width: '80%',
        height: '60%',
        backgroundColor: 'rgba(255, 255, 255, .8)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    char: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
    }
});