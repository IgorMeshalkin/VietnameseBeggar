import {TouchableOpacity, Image, StyleSheet, Text, View} from 'react-native';
import RUSflag from '../images/RUS.png'
import VNDflag from '../images/VND.png'
import USDflag from '../images/USD.png'
import EURflag from '../images/EUR.png'

export default function RateButton({currency, onPress}) {
    //возвращает нужный флаг исходя из объекта 'currency' (курс валюты)
    const getFlagByCurrency = (currency) => {
        switch (currency.name) {
            case 'RUB':
                return RUSflag;
            case 'VND':
                return VNDflag;
            case 'USD':
                return USDflag;
            case 'EUR':
                return EURflag;
        }
    }

    //Возвращает округлённый курс текущей валюты. Количество знаков после запятой отличается для разных валют.
    const getRoundedRate = (currency) => {
        if (currency.name === 'VND') {
            return currency.rate.toFixed(4)
        } else if (currency.name === 'RUB') {
            return currency.rate
        } else {
            return currency.rate.toFixed(2)
        }
    }

    return (
        <TouchableOpacity onPress={() => onPress(currency)}>
            <View style={currency.isActive ? styles.mainBlock : styles.mainBlockNotActive}>
                <View style={styles.nameAndFlagContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.text}>{currency.name}</Text>
                    </View>
                    <View style={styles.flagContainer}>
                        <View style={styles.flagCircle}>
                            <Image style={styles.flag} source={getFlagByCurrency(currency)}/>
                        </View>
                    </View>
                </View>
                <View  style={styles.rateContainer}>
                    <Text style={styles.text}>{getRoundedRate(currency)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainBlock: {
        width: '80%',
        height: 60,
        backgroundColor: 'rgba(90, 144, 33, .8)',
        borderRadius: 10,
    },
    mainBlockNotActive: {
        width: '80%',
        height: 60,
        backgroundColor: 'rgba(180, 180, 180, 1)',
        borderRadius: 10,
        opacity: .6
    },
    nameAndFlagContainer: {
        height: '50%',
        width: '100%',
        flexDirection: 'row',
    },
    nameContainer: {
        width: '60%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flagContainer: {
        width: '40%',
        height: '100%',
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
    flagCircle: {
        borderRadius: 10,
        width: 20,
        height: 20,
        overflow: "hidden",
        justifyContent: 'center',
        alignItems: "center"
    },
    flag: {
        borderRadius: 10,
        width: 30,
        height: 20,
    },
    rateContainer: {
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});