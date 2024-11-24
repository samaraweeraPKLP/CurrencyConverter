import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform, ImageBackground, Switch, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import lightBackgroundImage from './assets/light mode.png';
import darkBackgroundImage from './assets/dark mode.png';


const FIXER_API_KEY = '4473563b59db3a6f87bc9e32386f968b'; // Replace with Fixer.io API Key
const FIXER_API_URL = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`;


export default function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rates, setRates] = useState({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(FIXER_API_URL);
        if (response.data.success) {
          setRates(response.data.rates);
          setErrorMessage('');
        } else {
          setErrorMessage('Error fetching rates from Fixer.io');
        }
      } catch (error) {
        setErrorMessage('Network error. Please try again later.');
      }
    };


    fetchRates();
  }, []);


  const convertCurrency = () => {
    if (amount && !isNaN(amount)) {
      if (rates[baseCurrency] && rates[targetCurrency]) {
        const rate = rates[targetCurrency] / rates[baseCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
        setErrorMessage('');
      } else {
        setErrorMessage('Currency rates not available.');
        setConvertedAmount(null);
      }
    } else {
      setErrorMessage('Invalid input. Please enter a valid number.');
      setConvertedAmount(null);
    }
  };


  const swapCurrencies = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });


    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const themeStyles = isDarkMode ? darkTheme : lightTheme;


  return (
    <ImageBackground
      source={isDarkMode ? darkBackgroundImage : lightBackgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.darkModeContainer}>
        <Text style={[styles.darkModeText, { color: isDarkMode ? '#fff' : '#000' }]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode(!isDarkMode)}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      <KeyboardAvoidingView
        style={[styles.container, themeStyles.container]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <Text style={[styles.title, themeStyles.title]}>Currency Converter</Text>
        <View
          style={[
            styles.midcontainer,
            themeStyles.midcontainer,
            { marginTop: keyboardVisible ? 10 : 50 },
          ]}
        >
          <View style={styles.row}>
            <View style={[styles.inlineContainer, themeStyles.inlineContainer, { marginRight: 5 }]}>
              <Text style={[styles.label, themeStyles.label]}>Base Currency</Text>
              <Picker
                selectedValue={baseCurrency}
                onValueChange={(itemValue) => setBaseCurrency(itemValue)}
                style={[styles.picker, themeStyles.picker]}
              >
                {Object.keys(rates).map((currency) => (
                  <Picker.Item key={currency} label={currency} value={currency} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity onPress={swapCurrencies} style={[styles.swapButton, themeStyles.swapButton]}>
              <Text style={[styles.swapButtonText, themeStyles.swapButtonText]}>⇆</Text>
            </TouchableOpacity>

            <View style={[styles.inlineContainer, themeStyles.inlineContainer, { marginLeft: 5 }]}>
              <Text style={[styles.label, themeStyles.label]}>Target Currency</Text>
              <Picker
                selectedValue={targetCurrency}
                onValueChange={(itemValue) => setTargetCurrency(itemValue)}
                style={[styles.picker, themeStyles.picker]}
              >
                {Object.keys(rates).map((currency) => (
                  <Picker.Item key={currency} label={currency} value={currency} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={[styles.AmountContainer, themeStyles.AmountContainer]}>
            <Text style={[styles.label, themeStyles.label]}>Enter Amount ({baseCurrency})</Text>
            <TextInput
              style={[styles.input, themeStyles.input]}
              placeholder={`Enter amount in ${baseCurrency}`}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <TouchableOpacity onPress={convertCurrency} style={[styles.convertButton, themeStyles.convertButton]}>
            <Text style={[styles.convertButtonText, themeStyles.convertButtonText]}>Convert</Text>
          </TouchableOpacity>

          <View style={[styles.ConvertAmountContainer, themeStyles.ConvertAmountContainer]}>
            <Text style={[styles.AmountText, themeStyles.AmountText]}>
              Converted Amount ({targetCurrency})
            </Text>
            <TextInput
              style={[styles.ConvertedAmount, themeStyles.ConvertedAmount]}
              value={
                convertedAmount !== null && convertedAmount !== 'Invalid Input'
                  ? `${convertedAmount} ${targetCurrency}`
                  : convertedAmount
              }
              editable={false}
            />
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginLeft: '65%',
  },
  darkModeText: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
  },
  midcontainer: {
    backgroundColor: '#f2e7b6',
    padding: 10,
    borderRadius: 10,
    width: '95%',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 5,
  },
  AmountText: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 5,
    fontSize: 17,
  },
  ConvertedAmount: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 5,
    backgroundColor: '#4f4a35',
    color: '#fffefa',
    fontSize: 17,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  inlineContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  picker: {
    width: '100%',
    fontSize: 17,
  },
  swapButton: {
    padding: 10,
    borderRadius: "30%",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  swapButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  convertButton: {
    marginTop: 10,
    width: '50%',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
    borderWidth: 2,
  },
  convertButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  AmountContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  ConvertAmountContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    borderWidth: 2,
  },

});

const lightTheme = {
  title: { color: '#1c1b18' },
  midcontainer: { backgroundColor: '#f2e7b6' },
  label: { color: "#d6d5d2" },
  AmountText: { color: "#1c1b18" },
  input: { borderColor: '#ccc', backgroundColor: '#d1cebe' },
  ConvertedAmount: { borderColor: '#ccc', backgroundColor: '#403f3d', color: "#fffefa" },
  inlineContainer: { backgroundColor: '#403f3d' },
  picker: { backgroundColor: '#d1cebe', color: "#1c1b18" },
  swapButton: { backgroundColor: '#f0cd09', borderColor: '#1c1b18' },
  swapButtonText: { color: '#1c1b18' },
  convertButton: { backgroundColor: '#f0cd09', borderColor: '#1c1b18' },
  convertButtonText: { color: '#1c1b18' },
  AmountContainer: { backgroundColor: '#403f3d' },
  ConvertAmountContainer: { backgroundColor: '#d1cebe', borderColor: '#1c1b18' },
};

const darkTheme = {
  title: { color: '#f0cd09' },
  midcontainer: { backgroundColor: '#595957' },
  label: { color: "#1c1b18" },
  AmountText: { color: "#d6d5d2" },
  input: { borderColor: '#ccc', backgroundColor: '#8c8c8b', color: "#f2f2f0" },
  ConvertedAmount: { borderColor: '#ccc', backgroundColor: '#e0e0de', color: "#1c1b18" },
  inlineContainer: { backgroundColor: '#e0e0de' },
  picker: { backgroundColor: '#8c8c8b', color: "#f2f2f0" },
  swapButton: { backgroundColor: '#1c1b18', borderColor: '#f0cd09' },
  swapButtonText: { color: '#f0cd09' },
  convertButton: { backgroundColor: '#1c1b18', borderColor: '#f0cd09' },
  convertButtonText: { color: '#f0cd09' },
  AmountContainer: { backgroundColor: '#e0e0de' },
  ConvertAmountContainer: { backgroundColor: '#403f3d', borderColor: '#e0e0de' },
};
