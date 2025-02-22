import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const SocialFeedItem = ({ purchase }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(purchase.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <View style={styles.socialFeedItem}>
      <View style={styles.feedHeader}>
        <View style={styles.feedUserInfo}>
          <Image source={{ uri: purchase.userAvatar }} style={styles.feedUserAvatar} />
          <View>
            <Text style={styles.feedUserName}>{purchase.userName}</Text>
            <Text style={styles.feedTimestamp}>{purchase.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-h" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.purchaseInfo}>
        <View style={styles.storeInfo}>
          <View style={styles.storeIconContainer}>
            <FontAwesome name={purchase.storeIcon} size={20} color="#8134AF" />
          </View>
          <View>
            <Text style={styles.storeName}>{purchase.storeName}</Text>
            <Text style={styles.purchaseAmount}>Spent ${purchase.amount.toFixed(2)}</Text>
          </View>
        </View>
        {purchase.items && (
          <Text style={styles.purchaseItems}>
            Bought: {purchase.items.join(', ')}
          </Text>
        )}
        {purchase.review && (
          <Text style={styles.purchaseReview}>{purchase.review}</Text>
        )}
      </View>

      <View style={styles.feedActions}>
        <TouchableOpacity 
          style={styles.feedAction}
          onPress={handleLike}
        >
          <FontAwesome 
            name={isLiked ? "heart" : "heart-o"} 
            size={20} 
            color={isLiked ? "#FF4B4B" : "#666"} 
          />
          <Text style={styles.feedActionText}>{likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.feedAction}
          onPress={() => setShowComments(!showComments)}
        >
          <FontAwesome name="comment-o" size={20} color="#666" />
          <Text style={styles.feedActionText}>{purchase.comments.length} Comments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedAction}>
          <FontAwesome name="share" size={20} color="#666" />
          <Text style={styles.feedActionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          {purchase.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <Text style={styles.commentUserName}>{comment.userName}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <Text style={styles.commentTime}>{comment.time}</Text>
              </View>
            </View>
          ))}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.sendButton}>
              <FontAwesome name="paper-plane" size={16} color="#8134AF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default function SocialScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const socialFeed = [
    {
      id: 1,
      userName: 'Emma Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
      timestamp: '2 hours ago',
      storeName: 'Starbucks Coffee',
      storeIcon: 'coffee',
      amount: 12.50,
      items: ['Caramel Macchiato', 'Chocolate Croissant'],
      review: 'Perfect afternoon pick-me-up! ☕️✨',
      likes: 24,
      comments: [
        {
          userName: 'Alice Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
          text: 'Love their croissants! 🥐',
          time: '1h ago'
        },
        {
          userName: 'David Kim',
          userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120',
          text: 'Great choice! Their caramel macchiato is the best',
          time: '30m ago'
        }
      ]
    },
    {
      id: 2,
      userName: 'Pablo Silva',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      timestamp: '5 hours ago',
      storeName: 'Whole Foods Market',
      storeIcon: 'shopping-basket',
      amount: 85.30,
      items: ['Organic Produce', 'Plant-based Protein', 'Kombucha'],
      review: 'Stocking up on healthy essentials! 🥗🌱 Their organic selection is amazing.',
      likes: 18,
      comments: [
        {
          userName: 'Veronica Chen',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
          text: 'Try their new kombucha flavors! 🍹',
          time: '3h ago'
        }
      ]
    },
    {
      id: 3,
      userName: 'Anouk Graaf',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      timestamp: 'Yesterday',
      storeName: 'Nike Store',
      storeIcon: 'shopping-bag',
      amount: 129.99,
      items: ['Running Shoes', 'Sports Socks'],
      review: 'Ready for my marathon training! 🏃‍♀️👟 These new Nikes are so comfortable!',
      likes: 45,
      comments: [
        {
          userName: 'Ruben Martinez',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
          text: 'Great choice! I have the same ones 👟',
          time: '12h ago'
        }
      ]
    },
    // Add more feed items here...
  ];

  const FilterButton = ({ title, active }) => (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.activeFilterButton]}
      onPress={() => setActiveFilter(title.toLowerCase())}
    >
      <Text style={[styles.filterText, active && styles.activeFilterText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Feed</Text>
        <TouchableOpacity style={styles.headerButton}>
          <FontAwesome name="sliders" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search posts..."
            placeholderTextColor="#666"
          />
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <FilterButton title="All" active={activeFilter === 'all'} />
          <FilterButton title="Friends" active={activeFilter === 'friends'} />
          <FilterButton title="Popular" active={activeFilter === 'popular'} />
          <FilterButton title="Recent" active={activeFilter === 'recent'} />
        </ScrollView>

        {/* Feed */}
        <View style={styles.feedContainer}>
          {socialFeed.map((purchase) => (
            <SocialFeedItem key={purchase.id} purchase={purchase} />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButton: {
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
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(129, 52, 175, 0.1)',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#8134AF',
  },
  filterText: {
    color: '#8134AF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  feedContainer: {
    padding: 20,
    paddingTop: 0,
  },
  socialFeedItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
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
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  feedUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  feedTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  purchaseInfo: {
    marginBottom: 12,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  purchaseAmount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  purchaseItems: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  purchaseReview: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  feedActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  feedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  feedActionText: {
    fontSize: 14,
    color: '#666',
  },
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 8,
  },
  commentInput: {
    flex: 1,
    height: 36,
    color: '#000',
    fontSize: 14,
    marginLeft: 8,
  },
  sendButton: {
    padding: 8,
  },
});