// src/screens/RegisterScreen.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import api from '../api/api';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

type RegisterScreenNavigationProp = any;

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      console.log('Attempting registration with:', {name, email, password});
      await api.post('/users/register', {name, email, password});
      Alert.alert('Success', 'Registration successful! Please login.', [
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    } catch (error: any) {
      console.error(
        'Registration error:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'An error occurred.',
      );
    }
  };

  return (
    <LinearGradient
      colors={['#3494E6', '#EC6EAD']}
      style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Button title="Register" onPress={handleRegister} />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('Login')}
          color="gray"
        />
      </View>
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
  },
});

export default RegisterScreen;
