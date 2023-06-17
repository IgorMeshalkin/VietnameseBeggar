//возвращает значение в рублях

export const getAmountInRubles = (text, currency) => {
    const intValue = Number(text.replace(',', '.').replaceAll(' ', ''))
    if (!isNaN(intValue)) {
        return intValue * currency.rate
    } else {
        return null;

    }
}

//Преобразует строку для чтения, разбивая по три знака.
export const getStringValue = (value) => {
    const stringValue = value.toString().replaceAll(' ', '');

    let dotIndex = -1;
    if (stringValue.includes('.')) {
        dotIndex = stringValue.indexOf('.')
    } else if (stringValue.includes(',')) {
        dotIndex = stringValue.indexOf(',')
    }

    const dotValue = dotIndex > 0 ? stringValue.slice(dotIndex) : '';
    const mainString = dotIndex > 0 ? stringValue.slice(0, dotIndex) : stringValue;

    const backCharsArray = mainString.split('').reverse();
    let strWithSpaces = ''
    for (let i = backCharsArray.length - 1; i >= 0; i--) {
        strWithSpaces += ((i !== backCharsArray.length - 1) && (i + 1) % 3 === 0 ? ' ' : '') + backCharsArray[i];
    }

    return (strWithSpaces + dotValue).trim()
}

//Возвращает дату в фиде отформатированной строки
export const getDateString = (date) => {
    let result = '' + date.getDate();
    switch (date.getMonth()) {
        case 0:
            result += ' января ';
            break;
        case 1:
            result += ' февраля ';
            break;
        case 2:
            result += ' марта ';
            break;
        case 3:
            result += ' апреля ';
            break;
        case 4:
            result += ' мая ';
            break;
        case 5:
            result += ' июня ';
            break;
        case 6:
            result += ' июля ';
            break;
        case 7:
            result += ' августа ';
            break;
        case 8:
            result += ' сентября ';
            break;
        case 9:
            result += ' октября ';
            break;
        case 10:
            result += ' ноября ';
            break;
        case 11:
            result += ' декабря ';
            break;
    }
    return result + date.getFullYear() + ' г.'
}

//Возвращает время работы приложения в виде отформатированной строки
export const getTimeString = (minutes) => {
    if (minutes === 0) {
        return 'только что'
    } else if (minutes < 60) {
        return minutes + ' мин. назад'
    } else {
        const hours = Math.trunc(minutes / 60)
        const remainderMin = minutes % 60
        return hours + ' ч. ' + remainderMin + ' мин. назад'
    }
}

//возвращает математические знаки с пробелами (в зависимости от знака)
export const getMathCharWithSpaces = (char) => {
    if (char === '(') {
        return ' ' + char
    } else if (char === ')') {
        return char + ' '
    } else {
        return ' ' + char + ' '
    }
}

//возвращает математическое выражение инпута калькулятора в виде отформатированной для пользователя строки (с пробелами)
export const getCalculateString = (text) => {
    const mathChars = ['+', '−', '×', '÷', '(', ')']
    const textWithoutSpaces = text.replaceAll(' ', '')

    let startIndex = 0
    let endIndex = 0
    let isNextNumber = true;
    let numbers = []
    let mathCharsOrder = []
    const isBracketFirst = textWithoutSpaces[0] === '(';

    //разделяю строку на два массива в одном 'numbers' лежат числа, во втором 'mathCharsOrder' лежат математические знаки в нужном порядке
    for (let i = 0; i < textWithoutSpaces.length; i++) {
        if (isBracketFirst) {
            if (mathChars.includes(textWithoutSpaces[i])) {
                mathCharsOrder.push(textWithoutSpaces[i])
                isNextNumber = true
                startIndex = i + 1
            } else {
                if (isNextNumber) {
                    numbers.push(textWithoutSpaces.substring(startIndex, i + 1))
                    mathCharsOrder.push(' ')
                    isNextNumber = false;
                } else {
                    numbers[numbers.length - 1] = (textWithoutSpaces.substring(startIndex, i + 1))
                }
            }
        } else {
            if (mathChars.includes(textWithoutSpaces[i])) {
                if (i > 0) {
                    startIndex = endIndex === 0 ? 0 : endIndex + 1
                    endIndex = i
                    numbers.push(textWithoutSpaces.substring(startIndex, endIndex))
                    mathCharsOrder.push(textWithoutSpaces[i])
                } else {
                    mathCharsOrder.push(textWithoutSpaces[i])
                }
            }
        }
    }
    if (!isBracketFirst) {
        numbers.push(textWithoutSpaces.substring(endIndex === 0 ? 0 : endIndex + 1))
    }

    //собираю из массивов чисел и знаков отформатированную строку.
    if (isBracketFirst) {
        if (mathCharsOrder.length > 1) {
            let resultString = ''
            let numberIndex = 0
            mathCharsOrder.forEach(mc => {
                if (mc !== ' ') {
                    resultString += getMathCharWithSpaces(mc)
                } else {
                    resultString += getStringValue(numbers[numberIndex])
                    numberIndex++
                }
            })
            return resultString.replaceAll('  ', ' ')
        } else {
            return mathCharsOrder[0] + (numbers.length > 0 ? getStringValue(numbers[0]) : '')
        }
    } else {
        if (numbers.length > 1) {
            let resultString = ''
            for (let i = 0; i < numbers.length; i++) {
                resultString += (getStringValue(numbers[i])
                    + (mathCharsOrder.length > i ? getMathCharWithSpaces(mathCharsOrder[i]) : ''))
            }
            return resultString.replaceAll('  ', ' ')
        } else {
            return getStringValue(numbers[0])
        }
    }
}

//возвращает результат математического выражения инпута или строку "Невозможно посчитать"
export const getMathResult = (string) => {
    const stringWithCorrectChars = string.replaceAll(' ', '')
        .replaceAll('−', '-')
        .replaceAll('×', '*')
        .replaceAll('÷', '/')

    let preparedString = ''
    const lastChar = stringWithCorrectChars[stringWithCorrectChars.length - 1]

    if (!isNaN(Number.parseInt(lastChar)) || lastChar === ')') {
        preparedString = stringWithCorrectChars
    } else {
        preparedString = stringWithCorrectChars.substring(0, stringWithCorrectChars.length - 1)
    }

    try {
        let resultString = eval(preparedString).toFixed(2).toString()
        while (resultString[resultString.length - 1] === '0' || resultString[resultString.length - 1] === '.') {
            const lastChar = resultString[resultString.length - 1]
            resultString = resultString.substring(0, resultString.length - 1)
            if (lastChar === '.') {
                break;
            }
        }
        return getStringValue(resultString)
    } catch {
        return 'Невозможно посчитать'
    }
}