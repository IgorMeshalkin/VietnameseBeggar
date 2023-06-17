import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function UpdateButton({onPress}) {

    return (
        <TouchableOpacity onPress={onPress} style={styles.mainBlock}>
            <Text style={styles.text}>ОБНОВИТЬ</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainBlock: {
        padding: 10,
        backgroundColor: 'rgba(90, 144, 33, .8)',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 16,
        textShadowColor: 'white',
        textShadowRadius: 5,
        margin: 'auto'
    },
});