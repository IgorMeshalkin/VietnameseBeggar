import {StyleSheet, Text, View} from 'react-native';
import RateButton from "./RateButton";
import {getDateString, getTimeString} from "../Utils/usefullFunctions";
import {useEffect, useState} from "react";
import UpdateButton from "./UpdateButton";

export default function ButtonsBar({date, currencies, updateCurrenciesActive, timeOfWorking, updateCurrencies}) {
    //сообщение о том от какой даты курс отображается в приложении.
    const [dateMessage, setDateMessage] = useState()

    //при каждом обновлении даты, сообщение содержащее дату меняется.
    useEffect(() => {
        setDateMessage('Курсы к рублю по ставке ЦБ РФ на ' + getDateString(date))
    }, [date])

    return (
        <View style={styles.mainBlock}>
            <View style={styles.halfMainBlock}>
                <View style={styles.messageContainer}>
                    <Text style={styles.message}>{dateMessage}</Text>
                </View>
                <View style={styles.buttonsLine}>
                    {
                        currencies.map(currency =>
                            <View style={styles.buttonContainer} key={currency.key}>
                                <RateButton
                                    currency={currency}
                                    onPress={updateCurrenciesActive}
                                />
                            </View>
                        )
                    }
                </View>
            </View>
            <View style={styles.halfMainBlock}>
                <View style={styles.messageContainer}>
                    <Text style={styles.message}>Курсы обновлялись {getTimeString(timeOfWorking)}</Text>
                </View>
                <View style={styles.buttonsLine}>
                    <UpdateButton
                        onPress={updateCurrencies}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainBlock: {
        width: '100%',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    halfMainBlock: {
        width: '100%',
        height: '45%',
    },
    messageContainer: {
        paddingBottom: 10,
        width: '100%',
        flexDirection: 'column',

    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        textShadowColor: 'white',
        textShadowRadius: 3,
        color: '#4c4c4c',
        fontWeight: 'bold',
    },
    buttonsLine: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
});