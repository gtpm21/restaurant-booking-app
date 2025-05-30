// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../api/api';

type HomeScreenNavigationProp = any;

interface Restaurant {
  restaurant_id: number;
  name: string;
  location: string;
  description?: string;
  image_url?: string;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching restaurants...');
      const response = await api.get('/restaurants');
      console.log('Restaurants fetched:', response.data);
      setRestaurants(response.data);
    } catch (err: any) {
      console.error('Failed to fetch restaurants:', err.response?.data || err.message);
      setError('Failed to load restaurants. Please try again.');
      if (err.response?.status === 401) { // Unauthenticated
        Alert.alert('Session Expired', 'Please login again.', [
          { text: 'OK', onPress: () => handleLogout() },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRestaurants();
      return () => {
        setRestaurants([]);
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

  const handleSelectRestaurant = (restaurant: Restaurant) => {
        navigation.navigate('Booking', {
        restaurantId: restaurant.restaurant_id,
        restaurantName: restaurant.name,
        });
    };


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading restaurants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchRestaurants} />
        <Button title="Logout" onPress={handleLogout} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Restaurants</Text>
      </View>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectRestaurant(item)}>
            <LinearGradient
              colors={['#3494E6', '#EC6EAD']}
              style={styles.itemContainer}
              start={{x: 0, y: 0}} end={{x: 0, y: 1}}
            >
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemLocation}>{item.location}</Text>
              {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No restaurants found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    color: '#000000',
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemLocation: {
    fontSize: 14,
    color: '#000000',
    marginTop: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#000000',
    marginTop: 6,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default HomeScreen;
