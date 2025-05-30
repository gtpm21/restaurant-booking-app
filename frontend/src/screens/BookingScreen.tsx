// src/screens/BookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../api/api';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;

const BookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<BookingScreenRouteProp>();

  const { restaurantId, restaurantName } = route.params;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [peopleCount, setPeopleCount] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const formatDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (t: Date): string => {
    const hours = t.getHours().toString().padStart(2, '0');
    const minutes = t.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleBooking = async () => {
    if (!peopleCount) {
      Alert.alert('Error', 'Please enter the number of people.');
      return;
    }
    if (parseInt(peopleCount) > 30) {
      Alert.alert('Error', 'Cannot book for more than 30 people.');
      return;
    }
    if (isNaN(parseInt(peopleCount)) || parseInt(peopleCount) <= 0) {
        Alert.alert('Error', 'Number of people must be a valid number greater than 0.');
        return;
    }
    setIsBooking(true);
    try {
        // ... (api.post) ...
        Alert.alert('Success!', '...');
    } catch (error: any) {
        // ... (error handling) ...
    } finally {
        setIsBooking(false);
    }

    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);

    try {
      console.log('Attempting to book:', {
        restaurant_id: restaurantId,
        reservation_date: formattedDate,
        reservation_time: formattedTime,
        people_count: parseInt(peopleCount),
      });

      await api.post('/reservations', {
        restaurant_id: restaurantId,
        reservation_date: formattedDate,
        reservation_time: formattedTime,
        people_count: parseInt(peopleCount),
      });

      Alert.alert('Success!', `Your booking at ${restaurantName} for ${formattedDate} at ${formattedTime} is confirmed.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Booking error:', error.response?.data || error.message);
      Alert.alert('Booking Failed', error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
        <LinearGradient
          colors={['#3494E6', '#EC6EAD']}
          style={styles.container}
        >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book a Table at</Text>
      <Text style={styles.restaurantName}>{restaurantName}</Text>
      <Text style={styles.label}>Select Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>{formatDate(date)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
      <Text style={styles.label}>Select Time:</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.pickerButton}>
        <Text style={styles.pickerButtonText}>{formatTime(time).substring(0,5)}</Text> 
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
      <Text style={styles.label}>Number of People:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 4"
        value={peopleCount}
        onChangeText={setPeopleCount}
        keyboardType="numeric"
      />
      <View style={{marginTop: 20}}>
        <Button title="Book Now" onPress={handleBooking} disabled={isBooking}/>
        {isBooking && <ActivityIndicator style={{marginTop: 10}} size="small" />}
      </View>
    </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
  },
  restaurantName: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
    color: 'white',
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  pickerButton: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BookingScreen;
