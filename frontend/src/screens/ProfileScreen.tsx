// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

interface UserReservation {
  reservation_id: number;
  reservation_date: string;
  reservation_time: string;
  people_count: number;
  status: string;
  restaurant_name: string;
}

type ProfileScreenNavigationProp = any; // Για την πλοήγηση στο Logout

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching user reservations...');
      const response = await api.get('/reservations/myreservations');
      console.log('User reservations fetched:', response.data);
      setReservations(response.data);
    } catch (err: any) {
      console.error('Failed to fetch user reservations:', err.response?.data || err.message);
      setError('Failed to load your reservations.');
       if (err.response?.status === 401) { // Unauthenticated
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = (reservationId: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this reservation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(`Attempting to delete reservation ID: ${reservationId}`);
              await api.delete(`/reservations/${reservationId}`);
              Alert.alert('Success', 'Reservation deleted successfully.');
              fetchUserReservations();
            } catch (err: any) {
              console.error('Failed to delete reservation:', err.response?.data || err.message);
              Alert.alert('Error', 'Could not delete the reservation. Please try again.');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserReservations();
      return () => {
        setReservations([]);
      };
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], 
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading your reservations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchUserReservations} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>My Reservations</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.reservation_id.toString()}
        renderItem={({ item }) => (
        <TouchableOpacity>
          <LinearGradient
            colors={['#3494E6', '#EC6EAD']}
            style={styles.itemContainer}
            start={{x: 0, y: 0}} end={{x: 0, y: 1}}
          >
            <View style={styles.itemContainer}>
              <Text style={styles.itemRestaurantName}>{item.restaurant_name}</Text>
              <Text>Date: {new Date(item.reservation_date).toLocaleDateString()}</Text>
              <Text>Time: {item.reservation_time.substring(0,5)}</Text>
              <Text>People: {item.people_count}</Text>
              <Text>Status: {item.status}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteReservation(item.reservation_id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.centeredText}>You have no reservations yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'ffffff',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  itemRestaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  logoutButtonContainer: {
      margin: 20,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
