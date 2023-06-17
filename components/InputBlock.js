import {Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import RUSflag from '../images/RUS.png'
import VNDflag from '../images/VND.png'
import USDflag from '../images/USD.png'
import EURflag from '../images/EUR.png'
import React, {useEffect, useRef, useState} from "react";
import Calculator from "./Calculator";

export default function InputBlock({currency, value, onChangeText}) {

    const inputRef = useRef()

    //активен ли инпут в настоящий момент
    const [isActive, setIsActive] = useState(false)
    //открыто ли модальное окно
    const [modalVisible, setModalVisible] = useState(false)

    //изменяет значение в инпуте (через методы родителя, подвергая строку обработке (разбивке по три знака))
    const updateInputContent = (text) => {
        onChangeText(text, currency)
    }

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

    const closeCalculator = (text) => {
        updateInputContent(text)
        setModalVisible(false)
        setIsActive(false)
    }

    return (
        <View style={styles.mainBlock}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                    <Calculator
                        setIsOpen={closeCalculator}
                    />
                </View>
            </Modal>

            <View style={styles.nameAndFlagContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{currency.name}</Text>
                </View>
                <Image style={styles.flag} source={getFlagByCurrency(currency)}/>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    inputMode={'numeric'}
                    value={value}
                    style={styles.ibInput}
                    onChangeText={updateInputContent}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                />
                {
                    isActive ?
                        <TouchableOpacity style={styles.calcButton} onPress={() => setModalVisible(true)}>
                            <Text style={styles.calcButtonText}>+ − × ÷</Text>
                        </TouchableOpacity> : null
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainBlock: {
        width: '100%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    nameAndFlagContainer: {
        width: '20%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 10,
    },
    nameContainer: {
        flex: 2,
    },
    inputContainer: {
        width: '80%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ibInput: {
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 18,
        width: '90%',
        height: 35,
        borderRadius: 5,
        opacity: .7
    },
    name: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 18,
        textShadowColor: 'white',
        textShadowRadius: 5,
    },
    flag: {
        flex: 3,
        borderRadius: 5,
        width: '80%',
        resizeMode: 'contain',
    },
    calcButton: {
        position: 'absolute',
        bottom: -10,
        right: 30,
    },
    calcButtonText: {
        fontSize: 18,
        textShadowColor: 'white',
        textShadowRadius: 3,
        color: '#4c4c4c',
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});