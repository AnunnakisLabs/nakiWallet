import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const StoreItem = ({ name, price, image, onPress }) => (
  <TouchableOpacity style={styles.storeItem} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.storeItemImage} />
    <Text style={styles.storeItemName}>{name}</Text>
    <Text style={styles.storeItemPrice}>${price.toFixed(2)}</Text>
  </TouchableOpacity>
);

export default function StorePaymentScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const quickAmounts = ['$5', '$10', '$20', '$50', '$100'];

  const stores = [
    {
      id: 1,
      name: "Joe's Coffee",
      type: "coffee",
      description: "Artisanal coffee and fresh pastries",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
      items: [
        { id: 1, name: "Espresso", price: 3.50, image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400" },
        { id: 2, name: "Latte", price: 4.50, image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400" },
        { id: 3, name: "Croissant", price: 3.00, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
      ]
    },
    {
      id: 2,
      name: "Fresh Market",
      type: "grocery",
      description: "Local organic produce and groceries",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
      items: [
        { id: 1, name: "Fresh Produce", price: 15.99, image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400" },
        { id: 2, name: "Organic Eggs", price: 6.99, image: "https://images.unsplash.com/photo-1569288052389-dac9b0ac9efd?w=400" },
        { id: 3, name: "Artisan Bread", price: 4.99, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
      ]
    },
    {
      id: 3,
      name: "Luna Restaurant",
      type: "restaurant",
      description: "Fine dining with a modern twist",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      items: [
        { id: 1, name: "Pasta", price: 18.99, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400" },
        { id: 2, name: "Steak", price: 29.99, image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400" },
        { id: 3, name: "Salad", price: 12.99, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" },
      ]
    },
    {
      id: 4,
      name: "Sushi Express",
      type: "restaurant",
      description: "Fresh sushi and Japanese cuisine",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
      items: [
        { id: 1, name: "Sushi Roll", price: 14.99, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },
        { id: 2, name: "Ramen", price: 16.99, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400" },
        { id: 3, name: "Tempura", price: 12.99, image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400" },
      ]
    },
    {
      id: 5,
      name: "Corner Bakery",
      type: "coffee",
      description: "Fresh baked goods and coffee",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800",
      items: [
        { id: 1, name: "Muffin", price: 3.99, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400" },
        { id: 2, name: "Cake Slice", price: 5.99, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
        { id: 3, name: "Coffee", price: 2.99, image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400" },
      ]
    },
  ];

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setError(null);
  };

  const handleItemSelect = (item) => {
    setAmount(item.price.toString());
    setNote(`Payment for ${item.name} at ${selectedStore.name}`);
  };

  const handlePayment = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      const message = selectedStore
        ? `Payment of $${amount} to ${selectedStore.name} successful!`
        : `Payment of $${amount} successful!`;

      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }

      // Reset form
      setAmount('');
      setNote('');
      setSelectedStore(null);
      
      // Navigate back
      router.back();
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Store Payment</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/nfc-payment')}
            >
              <FontAwesome name="wifi" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/qr')}
            >
              <FontAwesome name="qrcode" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        {!selectedStore && (
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search stores, categories..."
              placeholderTextColor="#666"
            />
          </View>
        )}

        {/* Stores List */}
        {!selectedStore ? (
          <View style={styles.storesList}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'Popular Stores'}
            </Text>
            {filteredStores.length === 0 ? (
              <View style={styles.noResults}>
                <FontAwesome name="search" size={48} color="#ccc" />
                <Text style={styles.noResultsText}>No stores found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching with different keywords
                </Text>
              </View>
            ) : (
              filteredStores.map((store) => (
                <TouchableOpacity
                  key={store.id}
                  style={styles.storeCard}
                  onPress={() => handleStoreSelect(store)}
                >
                  <Image source={{ uri: store.image }} style={styles.storeImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.storeGradient}
                  >
                    <View style={styles.storeInfo}>
                      <View style={styles.storeHeader}>
                        <Text style={styles.storeName}>{store.name}</Text>
                        <View style={styles.ratingContainer}>
                          <FontAwesome name="star" size={12} color="#FFD700" />
                          <Text style={styles.ratingText}>{store.rating}</Text>
                        </View>
                      </View>
                      <Text style={styles.storeDescription}>{store.description}</Text>
                      <View style={styles.storeType}>
                        <FontAwesome 
                          name={
                            store.type === 'coffee' ? 'coffee' :
                            store.type === 'grocery' ? 'shopping-cart' :
                            'cutlery'
                          } 
                          size={12} 
                          color="#fff" 
                        />
                        <Text style={styles.storeTypeText}>
                          {store.type.charAt(0).toUpperCase() + store.type.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <>
            {/* Selected Store Header */}
            <View style={styles.selectedStoreHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setSelectedStore(null)}
              >
                <FontAwesome name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.selectedStoreName}>{selectedStore.name}</Text>
            </View>

            {/* Store Items */}
            <View style={styles.storeItemsContainer}>
              <Text style={styles.sectionTitle}>Menu Items</Text>
              <View style={styles.storeItemsGrid}>
                {selectedStore.items.map((item) => (
                  <StoreItem
                    key={item.id}
                    {...item}
                    onPress={() => handleItemSelect(item)}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        {/* Manual Payment */}
        <View style={styles.manualPayment}>
          <Text style={styles.sectionTitle}>Manual Payment</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#B39DDB"
            />
          </View>

          {/* Quick Amounts */}
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.replace('$', ''))}
              >
                <Text style={styles.quickAmountText}>{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note Input */}
          <View style={styles.noteContainer}>
            <FontAwesome name="pencil" size={20} color="#666" style={styles.noteIcon} />
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note (optional)"
              placeholderTextColor="#666"
            />
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={[styles.payButton, isLoading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay Now</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Store Payments */}
        <View style={styles.recentPayments}>
          <Text style={styles.sectionTitle}>Recent Store Payments</Text>
          
          <View style={styles.payment}>
            <View style={styles.paymentIcon}>
              <FontAwesome name="coffee" size={20} color="#8134AF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Coffee Shop</Text>
              <Text style={styles.paymentDate}>Today, 10:30 AM</Text>
            </View>
            <Text style={styles.paymentAmount}>-$4.50</Text>
          </View>

          <View style={styles.payment}>
            <View style={styles.paymentIcon}>
              <FontAwesome name="shopping-cart" size={20} color="#8134AF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Grocery Store</Text>
              <Text style={styles.paymentDate}>Yesterday</Text>
            </View>
            <Text style={styles.paymentAmount}>-$65.20</Text>
          </View>

          <View style={styles.payment}>
            <View style={styles.paymentIcon}>
              <FontAwesome name="cutlery" size={20} color="#8134AF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Restaurant</Text>
              <Text style={styles.paymentDate}>2 days ago</Text>
            </View>
            <Text style={styles.paymentAmount}>-$32.80</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8134AF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 4,
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#000',
    fontSize: 16,
  },
  storesList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  storeCard: {
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  storeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  storeInfo: {
    gap: 4,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  storeDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  storeType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  storeTypeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  selectedStoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedStoreName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  storeItemsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  storeItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  storeItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  storeItemImage: {
    width: '100%',
    height: 120,
  },
  storeItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    padding: 10,
  },
  storeItemPrice: {
    fontSize: 14,
    color: '#8134AF',
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  manualPayment: {
    backgroundColor: '#fff',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 14,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dollarSign: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8134AF',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8134AF',
    minWidth: 150,
    textAlign: 'center',
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: '#F8F4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickAmountText: {
    color: '#8134AF',
    fontSize: 16,
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  noteIcon: {
    padding: 10,
  },
  noteInput: {
    flex: 1,
    height: 50,
    color: '#000',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#8134AF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentPayments: {
    backgroundColor: '#fff',
    padding: 20,
  },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4B4B',
  },
});