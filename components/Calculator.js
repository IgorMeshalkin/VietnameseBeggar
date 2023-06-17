import {ImageBackground, Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import {useEffect, useRef, useState} from "react";
import CalculatorButton from "./CalculatorButton";
import {getCalculateString, getMathResult} from "../Utils/usefullFunctions";
import image from "../images/Background.png";

export default function Calculator({setIsOpen}) {
    //реферальная ссылка для управления инпутом
    const calcInputRef = useRef()

    //инпут сразу в фокусе после открытия калькулятора
    useEffect(() => {
        calcInputRef.current.focus()
    })

    //математическое выражение в инпуте калькулятора (в виде строки)
    const [stringExpression, setStringExpression] = useState('')
    //строка содержащая ответ на заданное выражение
    const [resultString, setResultString] = useState('0')

    //математические знаки
    const [mathChars, setMathChars] = useState(['+', '−', '×', '÷', '(', ')']) // для кнопок калькулятора
    const [mathCharsWithoutBrackets, setMathCharsWithoutBrackets] = useState(['+', '−', '×', '÷']) // для препятствования ввода подряд
    const [bracketChars, setBracketChars] = useState(['(', ')']) // для препятствования ввода подряд

    //открыта ли скобка в математическом выражении
    const [bracketIsOpen, setBracketIsOpen] = useState(false)

    //нажатие кнопки в калькуляторе (математические знаки)
    const pressCalcButton = (value) => {
        //условия, которые не позволяют ставить подряд некоторые математические знаки и скобки
        const lastChar = stringExpression[stringExpression.length - 1] === ' ' ? stringExpression[stringExpression.length - 2] : stringExpression[stringExpression.length - 1]
        if (mathCharsWithoutBrackets.includes(lastChar) && mathCharsWithoutBrackets.includes(value) //не ставить знаки '+', '−', '×', '÷' подряд
            || bracketChars.includes(lastChar) && bracketChars.includes(value)  //не ставить скобки подряд
            || lastChar === '(' && mathCharsWithoutBrackets.includes(value) //не ставить знаки '+', '−', '×', '÷' сразу после открытой скобки
            || mathCharsWithoutBrackets.includes(lastChar) && value === ')' //не закрывать скобку после знаков '+', '−', '×', '÷'
            || stringExpression.length > 0 && !mathCharsWithoutBrackets.includes(lastChar) && value === '(' //не отрывать скобку если перед ней число, только после знаков '+', '−', '×', '÷', кроме случая когда выражение начинается со скобки
        ) {
            return;
        }

        //код, который выполняется если условия ☝️выполнены
        if (value === '(') {
            setBracketIsOpen(true)
        } else if (value === ')' && bracketIsOpen) {
            setBracketIsOpen(false)
        }
        setStringExpression(prevState => getCalculateString(prevState + value))
    }

    //ввод с клавиатуры
    const changeExpressionByKeyboard = (text) => {
        const textWithoutSpaces = text.replaceAll(' ', '')
        //условие, которое не позволяет вводить цифры сразу после закрытой скобки
        if (textWithoutSpaces[textWithoutSpaces.length - 2] === ')'
            && !mathCharsWithoutBrackets.includes(textWithoutSpaces[textWithoutSpaces.length - 1])) {
            return
        }

        //код, который выполняется если условие ☝️выполнено
        if (text.length < stringExpression.length) {
            if (stringExpression[stringExpression.length - 1] === ')') {
                setBracketIsOpen(true)
            } else if (stringExpression[stringExpression.length - 1] === '(') {
                setBracketIsOpen(false)
            }
            setStringExpression(text)
        } else {
            setStringExpression(getCalculateString(text))
        }
    }

    //обновляет строку содержащую результат при каждом изменении математического выражения
    useEffect(() => {
        if (stringExpression.length > 0) {
            setResultString(getMathResult(stringExpression))
        } else {
            setResultString('0')
        }
    }, [stringExpression])

    function onSearch(e) {
        setIsOpen(resultString)
    }

    return (
        <ImageBackground style={styles.windowForContent} source={image}>
            <View style={styles.inputContainer}>
                <TextInput
                    multiline={true}
                    value={stringExpression}
                    ref={calcInputRef}
                    inputMode={'numeric'}
                    style={styles.ibInput}
                    onChangeText={changeExpressionByKeyboard}
                    onSubmitEditing = {(e) => onSearch(e)}
                    blurOnSubmit={true}
                />
            </View>
            <View style={styles.resultContainer}>
                <View style={styles.resultBackground}>
                    <Text style={bracketIsOpen ? styles.resultTitleOpenBracket : styles.resultTitle}>
                        {
                            bracketIsOpen ?
                                'Открыта скобка!' :
                                'В итоге получается:'
                        }
                    </Text>
                    <Text
                        style={resultString === 'Невозможно посчитать' ? styles.resultValueOpenBracket : styles.resultValue}>{resultString}</Text>
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                {
                    mathChars
                        .filter(c => bracketIsOpen ? c !== '(' : ')')
                        .map(c =>
                            <View style={styles.buttonContainer} key={c}>
                                <CalculatorButton
                                    char={c}
                                    onPress={pressCalcButton}
                                />
                            </View>
                        )
                }
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    windowForContent: {
        height: '100%',
        width: '100%',
    },
    inputContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    ibInput: {
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 18,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        opacity: .8,
        padding: 10
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultBackground: {
        backgroundColor: 'rgba(255, 255, 255, .8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 10,
        paddingBottom: 10
    },
    resultTitle: {
        color: 'black',
        fontSize: 14,
    },
    resultTitleOpenBracket: {
        color: 'red',
        fontSize: 14,
    },
    resultValue: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 20,
        textShadowColor: 'white',
        textShadowRadius: 5,
    },
    resultValueOpenBracket: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 16,
        textShadowColor: 'white',
        textShadowRadius: 5,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    buttonContainer: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});