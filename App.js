import {Alert, ImageBackground, Keyboard, Modal, StyleSheet, View} from 'react-native';
import image from "./images/Background.png";
import {getAmountInRubles, getStringValue} from "./Utils/usefullFunctions";
import React, {useEffect, useState} from "react";
import RateAPI from "./API/RateAPI";
import InputBlock from "./components/InputBlock";
import ButtonsBar from "./components/ButtonsBar";
import Loader from "./components/Loader";
import LessThenTwoWarning from "./components/LessThenTwoWarning";

export default function App() {
    //Значения всех валют в настоящий момент
    const [RUBValue, setRUBValue] = useState()
    const [VNDValue, setVNDValue] = useState()
    const [USDValue, setUSDValue] = useState()
    const [EURValue, setEURValue] = useState()

    //Загружаются ли курсы валют в настоящий момент
    const [isRatesLoading, setIsRatesLoading] = useState(true)
    //Массив объектов "курс валюты"
    const [currencies, setCurrencies] = useState([])
    //Дата обновления курсов валют
    const [date, setDate] = useState(new Date())

    //Делает запрос курсов валют и сохранение их состояние 'currencies'
    const fetchCurrencies = () => {
        setIsRatesLoading(true)
        RateAPI.get().then(res => {
            setDate(new Date(res.data.Date))
            setCurrencies([{key: '1', name: 'RUB', rate: 1, isActive: true}
                , {
                    key: '2',
                    name: 'VND',
                    rate: (res.data.Valute.VND.Value / res.data.Valute.VND.Nominal),
                    isActive: true
                }
                , {
                    key: '3',
                    name: 'USD',
                    rate: (res.data.Valute.USD.Value / res.data.Valute.USD.Nominal),
                    isActive: true
                }
                , {
                    key: '4',
                    name: 'EUR',
                    rate: (res.data.Valute.EUR.Value / res.data.Valute.EUR.Nominal),
                    isActive: false
                }])
            setTimeOfWorking(0)
            setIsRatesLoading(false)
        })
    }

    //При первом запуске делает запрос курсов валют
    useEffect(() => {
        fetchCurrencies()
    }, [])

    //Открыта ли клавиатура в настоящий момент
    const [keyboardStatus, setKeyboardStatus] = useState(false);

    //При первом запуске вешает слушателей на клавиатуру, что бы изменять состояние 'keyboardStatus'
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    //При изменении текста в любом инпуте
    const onChangeText = (text, currency) => {
        const setFunction = getSetValueByCurrency(currency) //получаю функцию для работы с нужной валютой
        setFunction(getStringValue(text)) //кладу в этот инпут преобразованную строку (разбивка по три знака)

        const amountInRubles = getAmountInRubles(text, currency); //получаю значение в рублях

        if (amountInRubles !== null) {
            currencies.filter(i => i.name !== currency.name) //отсеиваю тот инпут в который введена последняя цифра
                .forEach(i => {
                    const setFunction = getSetValueByCurrency(i) //получаю функцию для работы с текущей валютой
                    const newValue = (amountInRubles / i.rate).toFixed(2) //считаю значение для текущей валюты (по курсу)
                    setFunction(getStringValue(newValue)) //присваиваю соответствующему инпуту значение в виде преобразованной строки (разбивка по три знака)
                })
        } else {
            console.log('Нихуя не вышло')
        }
    }

    //возвращает состояние хранящее значение по объекту 'currency' (курс валюты)
    const getValueByCurrency = (currency) => {
        switch (currency.key) {
            case '1':
                return RUBValue;
            case '2':
                return VNDValue;
            case '3':
                return USDValue;
            case '4':
                return EURValue;
        }
    }

    //возвращает функцию для изменения состояния хранящего значение по объекту 'currency' (курс валюты)
    const getSetValueByCurrency = (currency) => {
        switch (currency.key) {
            case '1':
                return setRUBValue;
            case '2':
                return setVNDValue;
            case '3':
                return setUSDValue;
            case '4':
                return setEURValue;
        }
    }

    //Изменяет статус isActive той валюты на которой был вызван метод
    const updateCurrenciesActive = (currency) => {
        const lastActiveStatus = currency.isActive;

        if (currencies.filter(c => c.isActive).length === 2 && lastActiveStatus) {
            setModalVisible(true)
        } else {
            const anotherCurrencies = currencies.filter(c => c.key !== currency.key);
            setCurrencies([...anotherCurrencies, {...currency, isActive: !lastActiveStatus}].sort((a, b) => {
                if (a.key > b.key) {
                    return 1;
                } else {
                    return -1
                }
            }))
        }
    }

    //Счётчик времени работы приложения после последнего обновления курсов валют
    const [timeOfWorking, setTimeOfWorking] = useState(0)

    //Запускает счётчик времени работы приложения
    useEffect(() => {
        const timeOfWorkingInterval = setInterval(() => {
            setTimeOfWorking(prevState => {
                return prevState + 1;
            })
        }, 60000);
        return () => {
            timeOfWorkingInterval.remove();
        };
    }, []);


    const [modalVisible, setModalVisible] = useState(false);

    return (
        <ImageBackground style={styles.centeredView} source={image}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <LessThenTwoWarning
                        closeWindow={setModalVisible}
                    />
                </View>
            </Modal>
            {!isRatesLoading ?
                <>
                    <View style={styles.bang}/>
                    <View style={styles.allInputsContainer}>
                        {currencies.length === 4 ?
                            currencies.map(item =>
                                <View style={item.isActive ? styles.inputItemContainer : styles.notVision}
                                      key={item.key}>
                                    <InputBlock
                                        currency={item}
                                        value={getValueByCurrency(item)}
                                        onChangeText={onChangeText}
                                        keyboardStatus={keyboardStatus}
                                    />
                                </View>
                            )
                            : null
                        }
                    </View>
                    {
                        !keyboardStatus ?
                            <View style={styles.footer}>
                                <ButtonsBar
                                    date={date}
                                    currencies={currencies}
                                    updateCurrenciesActive={updateCurrenciesActive}
                                    timeOfWorking={timeOfWorking}
                                    updateCurrencies={fetchCurrencies}
                                />
                            </View> : null
                    }
                </>
                : <Loader/>
            }
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bang: {
        width: '100%',
        height: 40,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    allInputsContainer: {
        flex: 4,
        width: '100%',
        justifyContent: "center",
        alignItems: 'center',
    },
    inputItemContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    notVision: {
        display: 'none'
    },
    footer: {
        width: '100%',
        flex: 3,
    },
});
