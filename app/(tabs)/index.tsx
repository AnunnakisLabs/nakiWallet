import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { usePrivy, getUserEmbeddedWallet } from '@privy-io/expo';
import * as SecureStore from 'expo-secure-store'; // Usamos SecureStore en lugar de AsyncStorage

const CoinBalance = ({ symbol, name, balance, price }) => (
  <TouchableOpacity style={styles.coinCard}>
    <View style={styles.coinHeader}>
      <View style={styles.coinInfo}>
        <View style={[styles.coinIcon, { backgroundColor: '#2775CA20' }]}>
          <Text style={[styles.coinSymbol, { color: '#2775CA' }]}>{symbol}</Text>
        </View>
        <View>
          <Text style={styles.coinName}>{name}</Text>
          <Text style={styles.coinPrice}>${price.toFixed(2)} USD</Text>
        </View>
      </View>
      <View style={styles.coinBalanceContainer}>
        <Text style={styles.coinBalance}>${balance.toFixed(2)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Definimos la interfaz para el tipo de props de QuickAction
interface QuickActionProps {
  icon: string;
  title: string;
  onPress?: () => void;
}

const QuickAction = forwardRef<TouchableOpacity, QuickActionProps>(
  ({ icon, title, onPress }, ref) => (
    <TouchableOpacity ref={ref} style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        <FontAwesome name={icon} size={24} color="#8134AF" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  )
);

QuickAction.displayName = 'QuickAction';

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, isReady } = usePrivy();
  
  // Estado para almacenar los detalles del usuario
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    avatar: 'https://avatars.githubusercontent.com/u/993828?s=400&u=ad62640da5de4fc2433fde838986a6897fe3751a&v=4',
    walletAddress: '',
  });
  
  // Estado para el balance total y transacciones
  const [walletData, setWalletData] = useState({
    totalBalance: 0,
    coin: { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      balance: 0, 
      price: 1.00 
    },
    recentTransactions: [
      // Las transacciones iniciales se mantienen como ejemplo
      {
        id: 1,
        type: 'received',
        amount: 500,
        from: 'Ruben Abarca',
        fromAddress: '0x8765...4321',
        avatar: 'https://avatars.githubusercontent.com/u/164825567?v=4',
        message: '🎨 Commission payment',
        time: '2h ago'
      },
      {
        id: 2,
        type: 'sent',
        amount: 200,
        to: 'Pedro A. González',
        toAddress: '0x9876...5432',
        avatar: 'https://avatars.githubusercontent.com/u/14959399?v=4',
        message: '🍽️ Dinner split',
        time: '5h ago'
      },
      {
        id: 3,
        type: 'received',
        amount: 1000,
        from: 'Veronica Jiménez',
        fromAddress: '0x3456...7890',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
        message: '💼 Project payment',
        time: 'Yesterday'
      },
    ],
  });
  
  const [loading, setLoading] = useState(true);

  // Función para guardar en SecureStore
  async function saveBalance(value: string) {
    await SecureStore.setItemAsync('usdc_balance', value);
  }

  // Función para leer de SecureStore
  async function getBalance() {
    return await SecureStore.getItemAsync('usdc_balance');
  }

  useEffect(() => {
    // Cargar el balance guardado al iniciar
    const loadBalance = async () => {
      try {
        const storedBalance = await getBalance();
        if (storedBalance) {
          const balance = parseFloat(storedBalance);
          setWalletData(prev => ({
            ...prev,
            totalBalance: balance,
            coin: { ...prev.coin, balance: balance }
          }));
        }
      } catch (error) {
        console.error('Error loading balance:', error);
      }
    };
    
    loadBalance();
  }, []);
  
  // Escuchar cambios en los parámetros para actualizar el balance
  // Esto se activaría cuando se vuelve de la pantalla add-money-debit con un nuevo monto
  useEffect(() => {
    if (params?.newAmount && !isNaN(parseFloat(params.newAmount as string))) {
      const amount = parseFloat(params.newAmount as string);
      
      // Actualizar el balance
      setWalletData(prev => {
        const newBalance = prev.totalBalance + amount;
        
        // Guardar el nuevo balance en el almacenamiento
        saveBalance(newBalance.toString())
          .catch(err => console.error('Error saving balance:', err));
        
        // Agregar una nueva transacción
        const newTransaction = {
          id: Date.now(),
          type: 'received',
          amount: amount,
          from: 'Card Purchase',
          fromAddress: '0x0000...0000',
          avatar: 'https://cdn-icons-png.flaticon.com/512/147/147258.png',
          message: '💳 USDC Purchase',
          time: 'Just now'
        };
        
        // Devolver el estado actualizado
        return {
          ...prev,
          totalBalance: newBalance,
          coin: { ...prev.coin, balance: newBalance },
          recentTransactions: [newTransaction, ...prev.recentTransactions.slice(0, 2)]
        };
      });
    }
  }, [params]);

  // Obtener y actualizar la información del usuario y la wallet cuando Privy está listo
  useEffect(() => {
    if (isReady && user) {
      // Obtener la wallet del usuario
      const wallet = getUserEmbeddedWallet(user);
      
      // Obtener el email del usuario si está disponible
      let email = '';
      const emailAccount = user.linked_accounts.find(account => account.type === 'email');
      if (emailAccount && 'address' in emailAccount) {
        email = emailAccount.address;
      }
      
      // Función para extraer nombre de usuario del email
      const extractNameFromEmail = (email: string) => {
        if (!email) return { firstName: 'User', lastName: '' };
        
        // Tomar la parte antes del @ y formatearla
        const namePart = email.split('@')[0];
        
        // Si tiene un punto, dividir en nombre y apellido
        if (namePart.includes('.')) {
          const [first, last] = namePart.split('.');
          return {
            firstName: first.charAt(0).toUpperCase() + first.slice(1),
            lastName: last.charAt(0).toUpperCase() + last.slice(1)
          };
        }
        
        // Si no tiene punto, solo usar el nombre
        return {
          firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
          lastName: ''
        };
      };
      
      const { firstName, lastName } = extractNameFromEmail(email);
      
      // Formatear la dirección de la wallet para mostrarla
      const formatWalletAddress = (address: string | undefined) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      };
      
      // Actualizar los datos del usuario
      setUserData({
        firstName,
        lastName,
        username: `@${firstName.toLowerCase()}${lastName ? lastName.toLowerCase() : ''}`,
        avatar: 'https://avatars.githubusercontent.com/u/993828?s=400&u=ad62640da5de4fc2433fde838986a6897fe3751a&v=4', // Avatar por defecto
        walletAddress: formatWalletAddress(wallet?.address || '')
      });
      
      setLoading(false);
    }
  }, [isReady, user]);

  if (loading && !userData.firstName) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading wallet data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.profileSection}>
              <Image 
                source={{ uri: userData.avatar }} 
                style={styles.profileAvatar} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {userData.firstName} {userData.lastName}
                </Text>
                <View style={styles.profileDetails}>
                  <Text style={styles.profileUsername}>{userData.username}</Text>
                  <Text style={styles.walletAddress}>{userData.walletAddress}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/notifications" asChild>
            <TouchableOpacity style={styles.notificationButton}>
              <FontAwesome name="bell" size={24} color="#fff" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balance}>${walletData.totalBalance.toFixed(2)}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Link href="/payment" asChild>
            <QuickAction icon="paper-plane" title="Send" />
          </Link>
          <Link href="/receive-money" asChild>
            <QuickAction icon="download" title="Receive" />
          </Link>
          <Link href="/add-money" asChild>
            <QuickAction icon="plus" title="Add Money" />
          </Link>
          <Link href="/history" asChild>
            <QuickAction icon="history" title="History" />
          </Link>
        </View>


        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Link href="/history" asChild>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>See All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {walletData.recentTransactions.map((tx: any) => (
            <TouchableOpacity 
              key={tx.id} 
              style={styles.transaction}
              onPress={() => router.push({
                pathname: '/friend-profile',
                params: {
                  name: tx.type === 'received' ? tx.from : tx.to,
                  username: `@${(tx.type === 'received' ? tx.from : tx.to).toLowerCase().replace(' ', '')}`,
                  address: tx.type === 'received' ? tx.fromAddress : tx.toAddress,
                  avatar: tx.avatar
                }
              })}
            >
              <Image 
                source={{ uri: tx.avatar }} 
                style={styles.transactionAvatar}
              />
              <View style={styles.transactionInfo}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionName}>
                    {tx.type === 'received' ? tx.from : tx.to}
                  </Text>
                  <Text style={[
                    styles.transactionValue,
                    { color: tx.type === 'received' ? '#4BB543' : '#FF4B4B' }
                  ]}>
                    {tx.type === 'received' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.transactionAddress}>
                  {tx.type === 'received' ? tx.fromAddress : tx.toAddress}
                </Text>
                <Text style={styles.transactionMessage}>{tx.message}</Text>
                <Text style={styles.transactionTime}>{tx.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 12,
    color: '#E0E0E0',
    marginBottom: 2,
  },
  balanceSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionAction: {
    fontSize: 14,
    color: '#8134AF',
    fontWeight: '600',
  },
  coinCard: {
    backgroundColor: '#F8F4FF',
    borderRadius: 12,
    padding: 15,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  coinPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  coinBalanceContainer: {
    alignItems: 'flex-end',
  },
  coinBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
  },
  profileDetails: {
    flexDirection: 'column',
  },
  walletAddress: {
    fontSize: 11,
    color: '#E0E0E0',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  transactionAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
});