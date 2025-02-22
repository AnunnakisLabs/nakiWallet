import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

const StoreCard = ({ store, onSelect, isSelected }) => (
  <TouchableOpacity 
    style={[styles.storeCard, isSelected && styles.selectedStoreCard]} 
    onPress={() => onSelect(store)}
  >
    <View style={styles.storeIconContainer}>
      <FontAwesome name={store.icon} size={24} color="#8134AF" />
    </View>
    <View style={styles.storeInfo}>
      <Text style={styles.storeName}>{store.name}</Text>
      <Text style={styles.storeType}>{store.type}</Text>
    </View>
    <FontAwesome 
      name={isSelected ? "check-circle" : "chevron-right"} 
      size={20} 
      color={isSelected ? "#4BB543" : "#666"} 
    />
  </TouchableOpacity>
);

const ProductCard = ({ product, onSelect, isSelected }) => (
  <TouchableOpacity 
    style={[styles.productCard, isSelected && styles.selectedProductCard]}
    onPress={() => onSelect(product)}
  >
    <Image source={{ uri: product.image }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
    </View>
    {isSelected && (
      <View style={styles.selectedBadge}>
        <FontAwesome name="check" size={12} color="#fff" />
      </View>
    )}
  </TouchableOpacity>
);

export default function StorePaymentScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [socialPost, setSocialPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPurchaseQR, setShowPurchaseQR] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);

  const stores = [
    {
      id: 1,
      name: "Starbucks Coffee",
      type: "Coffee & Pastries",
      icon: "coffee",
      products: [
        { id: 1, name: "Caramel Macchiato", price: 4.95, image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400" },
        { id: 2, name: "Chocolate Croissant", price: 3.50, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
        { id: 3, name: "Iced Latte", price: 4.25, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400" },
      ]
    },
    {
      id: 2,
      name: "Whole Foods Market",
      type: "Grocery Store",
      icon: "shopping-basket",
      products: [
        { id: 4, name: "Organic Bananas", price: 2.99, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400" },
        { id: 5, name: "Avocado Pack", price: 5.99, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400" },
        { id: 6, name: "Fresh Bread", price: 3.99, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
      ]
    },
    {
      id: 3,
      name: "Nike Store",
      type: "Sportswear",
      icon: "shopping-bag",
      products: [
        { id: 7, name: "Running Shoes", price: 129.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
        { id: 8, name: "Sports Socks", price: 14.99, image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400" },
        { id: 9, name: "Training Shirt", price: 34.99, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400" },
      ]
    }
  ];

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setSelectedProducts([]);
  };

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce((total, product) => total + product.price, 0);
  };

  const handlePayment = async () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const totalAmount = getTotalAmount();
      const purchase = {
        storeId: selectedStore.id,
        storeName: selectedStore.name,
        amount: totalAmount,
        products: selectedProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        })),
        timestamp: new Date().toISOString(),
        socialPost: socialPost,
      };

      setPurchaseData(purchase);
      setShowPurchaseQR(true);
      
      const message = `Payment of $${totalAmount.toFixed(2)} at ${selectedStore.name} was successful!`;
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePurchaseQR = () => {
    setShowPurchaseQR(false);
    setPurchaseData(null);
    setSelectedProducts([]);
    setSelectedStore(null);
    setSocialPost('');
    router.back();
  };

  if (showPurchaseQR && purchaseData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Purchase Successful!</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={JSON.stringify(purchaseData)}
              size={200}
              color="#000"
              backgroundColor="#fff"
            />
          </View>
          <Text style={styles.qrDescription}>
            Scan this QR code to view purchase details
          </Text>
          <View style={styles.purchaseSummary}>
            <Text style={styles.summaryText}>
              Store: {purchaseData.storeName}
            </Text>
            <Text style={styles.summaryText}>
              Amount: ${purchaseData.amount.toFixed(2)}
            </Text>
            <Text style={styles.summaryText}>
              Items: {purchaseData.products.length}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClosePurchaseQR}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Store Payment</Text>
          <View style={styles.placeholder} />
        </View>

        {!selectedStore ? (
          <>
            {/* Store Search */}
            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search stores..."
                placeholderTextColor="#666"
              />
            </View>

            {/* Stores List */}
            <View style={styles.storesList}>
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onSelect={handleStoreSelect}
                  isSelected={selectedStore?.id === store.id}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Store Header */}
            <View style={styles.storeHeader}>
              <View style={styles.selectedStoreInfo}>
                <View style={styles.storeIconContainer}>
                  <FontAwesome name={selectedStore.icon} size={24} color="#8134AF" />
                </View>
                <View>
                  <Text style={styles.selectedStoreName}>{selectedStore.name}</Text>
                  <Text style={styles.selectedStoreType}>{selectedStore.type}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.changeStoreButton}
                onPress={() => setSelectedStore(null)}
              >
                <Text style={styles.changeStoreText}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Products Grid */}
            <View style={styles.productsContainer}>
              <Text style={styles.sectionTitle}>Select Products</Text>
              <View style={styles.productsGrid}>
                {selectedStore.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={handleProductSelect}
                    isSelected={selectedProducts.some(p => p.id === product.id)}
                  />
                ))}
              </View>
            </View>

            {selectedProducts.length > 0 && (
              <>
                {/* Order Summary */}
                <View style={styles.summarySection}>
                  <Text style={styles.sectionTitle}>Order Summary</Text>
                  {selectedProducts.map((product) => (
                    <View key={product.id} style={styles.summaryItem}>
                      <Text style={styles.summaryItemName}>{product.name}</Text>
                      <Text style={styles.summaryItemPrice}>${product.price.toFixed(2)}</Text>
                    </View>
                  ))}
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>${getTotalAmount().toFixed(2)}</Text>
                  </View>
                </View>

                {/* Social Post */}
                <View style={styles.socialPostContainer}>
                  <Text style={styles.socialPostLabel}>Share on Social Feed</Text>
                  <TextInput
                    style={styles.socialPostInput}
                    value={socialPost}
                    onChangeText={setSocialPost}
                    placeholder="Write something about your purchase..."
                    placeholderTextColor="#666"
                    multiline
                  />
                </View>

                {/* Error Message */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Pay Button */}
                <TouchableOpacity
                  style={[styles.payButton, isLoading && styles.payButtonDisabled]}
                  onPress={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.payButtonText}>
                      Pay ${getTotalAmount().toFixed(2)}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </>
        )}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
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
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
  selectedStoreCard: {
    borderColor: '#8134AF',
    borderWidth: 2,
  },
  storeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  storeType: {
    fontSize: 14,
    color: '#666',
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedStoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedStoreName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  selectedStoreType: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  changeStoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  changeStoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  productsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  productCard: {
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
  selectedProductCard: {
    borderColor: '#8134AF',
    borderWidth: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#8134AF',
    fontWeight: '600',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8134AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItemName: {
    fontSize: 14,
    color: '#000',
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8134AF',
  },
  socialPostContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  socialPostLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  socialPostInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    color: '#000',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    margin: 20,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 14,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#8134AF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8134AF',
    marginBottom: 30,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
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
  qrDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  purchaseSummary: {
    backgroundColor: '#F8F4FF',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
  },
  summaryText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#8134AF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});