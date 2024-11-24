import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ImageBackground,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import lightBackgroundImage from './assets/light mode.png'; // Import your light background image
import darkBackgroundImage from './assets/dark mode.png'; // Import your dark background image


export default function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // New state to track dark mode


  // Hardcoded exchange rates (example, replace with API data if needed)
  const rates = {
    USD: { EUR: 0.85, GBP: 0.75, INR: 75 },
    EUR: { USD: 1.18, GBP: 0.88, INR: 88 },
    GBP: { USD: 1.33, EUR: 1.14, INR: 100 },
    INR: { USD: 0.013, EUR: 0.011, GBP: 0.01 },
  };


  const convertCurrency = () => {
    if (amount && !isNaN(amount)) {
      const rate = rates[baseCurrency][targetCurrency];
      setConvertedAmount((amount * rate).toFixed(2));
    } else {
      setConvertedAmount('Invalid Input');
    }
  };


  const swapCurrencies = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };


  // Track keyboard visibility
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


  return (
    <ImageBackground
      source={isDarkMode ? darkBackgroundImage : lightBackgroundImage} // Change background based on mode
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark Mode Switch */}
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
      <Text style={styles.title}>Currency Converter</Text>
      <View
        style={[
          styles.midcontainer,
          { marginTop: keyboardVisible ? 10 : 50 }, // Adjust spacing dynamically
        ]}
      >
        {/* Row for Currency Selection and Swap Button */}
        <View style={styles.row}>
          {/* Base Currency Container */}
          <View style={[styles.inlineContainer, { marginRight: 5 }]}>
            <Text style={styles.label}>Base Currency</Text>
            <Picker
              selectedValue={baseCurrency}
              onValueChange={(itemValue) => setBaseCurrency(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="GBP" value="GBP" />
              <Picker.Item label="INR" value="INR" />
            </Picker>
          </View>


          {/* Swap Button */}
          <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
            <Text style={styles.swapButtonText}>⇆</Text>
          </TouchableOpacity>


          {/* Target Currency Container */}
          <View style={[styles.inlineContainer, { marginLeft: 5 }]}>
            <Text style={styles.label}>Target Currency</Text>
            <Picker
              selectedValue={targetCurrency}
              onValueChange={(itemValue) => setTargetCurrency(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="USD" value="USD" />
              <Picker.Item label="EUR" value="EUR" />
              <Picker.Item label="GBP" value="GBP" />
              <Picker.Item label="INR" value="INR" />
            </Picker>
          </View>
        </View>


        {/* Enter Amount Container */}
        <View style={styles.AmountContainer}>
          <Text style={styles.label}>Enter Amount ({baseCurrency})</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter amount in ${baseCurrency}`}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>


        {/* Convert Button */}
        <TouchableOpacity onPress={convertCurrency} style={styles.convertButton}>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>


        {/* Converted Amount Field */}
        <View style={styles.ConvertAmountContainer}>
        <Text style={styles.AmountText}>Converted Amount ({targetCurrency})</Text>
        <TextInput
          style={styles.ConvertedAmount}
          value={`${
            convertedAmount !== null && convertedAmount !== 'Invalid Input'
              ? `${convertedAmount} ${targetCurrency}`
              : convertedAmount
          }`}
          editable={false}
        />
        </View>
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
    marginLeft: "65%",
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
    fontWeight:"500",
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 5,
    color:"#ededeb",
  },
  AmountText: {
    fontSize: 20,
    fontWeight:"500",
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 5,
    color:"#1c1b18",
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 5,
    backgroundColor: '#d1cebe',
    color:"#1c1b18",
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
    color:"#fffefa",
    fontSize: 17,


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
    backgroundColor: '#4f4a35',
    padding: 10,
    borderRadius: 10,
    //alignItems: 'center',
  },
  picker: {
    width: '100%',
    backgroundColor: '#d1cebe',
    color:"#1c1b18",
    fontSize: 17,
  },
  swapButton: {
    padding: 10,
    backgroundColor: '#f0cd09',
    borderRadius: "30%",
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1c1b18',
    borderWidth: 2,
  },
  swapButtonText: {
    fontSize: 30,
    color: '#1c1b18',
    fontWeight: 'bold',
  },
  convertButton: {
    marginTop: 20,
    backgroundColor: '#f0cd09',
    width: '50%',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
    borderColor: '#1c1b18',
    borderWidth: 2,
  },
  convertButtonText: {
    color: '#1c1b18',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  AmountContainer: {
    backgroundColor: '#4f4a35',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',


  },
  ConvertAmountContainer: {
    backgroundColor: '#d1cebe',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    borderColor: '#1c1b18',
    borderWidth: 2,
  },
});


