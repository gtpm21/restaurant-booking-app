import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

type LoginScreenNavigationProp = any;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    try {
      console.log('Attempting login with:', { email, password });
      const response = await api.post('/users/login', { email, password });
      const { token } = response.data;

        if (token) {
            await AsyncStorage.setItem('userToken', token);
            console.log('Login successful, token stored:', token);
            navigation.reset({
                index: 0,
                routes: [{ name: 'AppMain' }],
            });
        } else {
                Alert.alert('Login Failed', 'No token received.');
        }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <LinearGradient
      colors={['#3494E6', '#EC6EAD']}
      style={styles.container}
    >
    <View style={styles.formContainer}>
      <Text style={styles.title}>Restaurant Booking</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
            <View style={{ marginTop: 10 }} />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
        </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: 'white',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.5)',
    color: 'white',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 10,
  }
});

export default LoginScreen;
