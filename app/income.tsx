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
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function IncomeScreen() {
  const router = useRouter();

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2500, 3200, 2800, 3500, 3800, 4200],
      },
    ],
  };

  const categoryData = {
    labels: ['Salary', 'Freelance', 'Investments', 'Other'],
    datasets: [
      {
        data: [4200, 1800, 1200, 500],
      },
    ],
  };

  const recentIncome = [
    {
      id: 1,
      source: 'Monthly Salary',
      amount: 4200,
      date: 'Today',
      category: 'Salary',
    },
    {
      id: 2,
      source: 'Freelance Project',
      amount: 850,
      date: 'Yesterday',
      category: 'Freelance',
    },
    {
      id: 3,
      source: 'Stock Dividends',
      amount: 320,
      date: '3 days ago',
      category: 'Investments',
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
        <Text style={styles.headerTitle}>Income Analysis</Text>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Total Income Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Income (2024)</Text>
          <Text style={styles.totalAmount}>$25,700.00</Text>
          <View style={styles.percentageContainer}>
            <FontAwesome name="arrow-up" size={12} color="#4BB543" />
            <Text style={styles.percentageText}>12.5% vs last year</Text>
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

        {/* Income by Category */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Income by Category</Text>
          <BarChart
            data={categoryData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withInnerLines={false}
            flatColor={true}
          />
        </View>

        {/* Recent Income */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Income</Text>
          {recentIncome.map((income) => (
            <View key={income.id} style={styles.incomeItem}>
              <View style={styles.incomeInfo}>
                <Text style={styles.incomeSource}>{income.source}</Text>
                <Text style={styles.incomeCategory}>{income.category}</Text>
                <Text style={styles.incomeDate}>{income.date}</Text>
              </View>
              <Text style={styles.incomeAmount}>+${income.amount.toFixed(2)}</Text>
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
    color: '#4BB543',
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
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  incomeInfo: {
    flex: 1,
  },
  incomeSource: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  incomeCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  incomeDate: {
    fontSize: 12,
    color: '#999',
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4BB543',
  },
});