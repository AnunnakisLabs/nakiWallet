import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LineChart, PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function ExpensesScreen() {
  const router = useRouter();

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [1800, 2200, 1950, 2400, 2100, 2300],
      },
    ],
  };

  const categoryData = [
    {
      name: 'Housing',
      amount: 1200,
      color: '#FF6B6B',
      legendFontColor: '#666',
      legendFontSize: 12,
    },
    {
      name: 'Food',
      amount: 500,
      color: '#4ECDC4',
      legendFontColor: '#666',
      legendFontSize: 12,
    },
    {
      name: 'Transport',
      amount: 300,
      color: '#45B7D1',
      legendFontColor: '#666',
      legendFontSize: 12,
    },
    {
      name: 'Shopping',
      amount: 200,
      color: '#96CEB4',
      legendFontColor: '#666',
      legendFontSize: 12,
    },
    {
      name: 'Others',
      amount: 100,
      color: '#D4A5A5',
      legendFontColor: '#666',
      legendFontSize: 12,
    },
  ];

  const recentExpenses = [
    {
      id: 1,
      description: 'Grocery Shopping',
      amount: 85.50,
      date: 'Today',
      category: 'Food',
    },
    {
      id: 2,
      description: 'Uber Ride',
      amount: 24.75,
      date: 'Yesterday',
      category: 'Transport',
    },
    {
      id: 3,
      description: 'Netflix Subscription',
      amount: 15.99,
      date: '2 days ago',
      category: 'Entertainment',
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(129, 52, 175, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: Platform.select({
      web: {
        r: '6',
        strokeWidth: '2',
        stroke: '#8134AF',
      },
      default: {
        r: 6,
        strokeWidth: 2,
        stroke: '#8134AF',
      },
    }),
    propsForBackgroundLines: Platform.select({
      web: {
        strokeWidth: '1',
        stroke: 'rgba(0, 0, 0, 0.1)',
      },
      default: {
        strokeWidth: 1,
        stroke: 'rgba(0, 0, 0, 0.1)',
      },
    }),
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expenses Analysis</Text>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Total Expenses Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Expenses (2024)</Text>
          <Text style={styles.totalAmount}>$12,750.00</Text>
          <View style={styles.percentageContainer}>
            <FontAwesome name="arrow-down" size={12} color="#FF4B4B" />
            <Text style={styles.percentageText}>8.3% vs last year</Text>
          </View>
        </View>

        {/* Monthly Trend */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Trend</Text>
          <LineChart
            data={monthlyData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            fromZero={true}
          />
        </View>

        {/* Expenses by Category */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Expenses by Category</Text>
          <PieChart
            data={categoryData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={true}
          />
        </View>

        {/* Recent Expenses */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {recentExpenses.map((expense) => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseCategory}>{expense.category}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
              </View>
              <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
            </View>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  totalCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    color: '#FF4B4B',
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 15,
    marginVertical: 8,
  },
  recentSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4B4B',
  },
});