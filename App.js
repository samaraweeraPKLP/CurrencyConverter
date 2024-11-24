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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <View style={styles.pickerContainer}>
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

          <View style={styles.pickerContainer}>
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

        {/* Enter Amount Field */}
        <Text style={styles.label}>Enter Amount ({baseCurrency})</Text>
        <TextInput
          style={styles.input}
          placeholder={`Enter amount in ${baseCurrency}`}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Convert Button */}
        <TouchableOpacity onPress={convertCurrency} style={styles.convertButton}>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>

        {/* Converted Amount Field */}
        <Text style={styles.label}>Converted Amount ({targetCurrency})</Text>
        <TextInput
          style={styles.input}
          value={`Converted Amount: ${
            convertedAmount !== null && convertedAmount !== 'Invalid Input'
              ? `${convertedAmount} ${targetCurrency}`
              : convertedAmount
          }`}
          editable={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  midcontainer: {
    backgroundColor: '#79a9b5',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    marginHorizontal: 15,
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: '90%',
  },
  swapButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  convertButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    width: '50%',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
