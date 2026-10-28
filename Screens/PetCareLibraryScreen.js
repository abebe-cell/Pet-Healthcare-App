import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const CARE_CATEGORIES = [
  { id: 1, name: 'Nutrition', icon: 'restaurant', color: '#4caf50' },
  { id: 2, name: 'First Aid', icon: 'medical-services', color: '#f44336' },
  { id: 3, name: 'Grooming', icon: 'brush', color: '#9c27b0' },
  { id: 4, name: 'Training', icon: 'school', color: '#2196f3' },
  { id: 5, name: 'Health', icon: 'favorite', color: '#e91e63' },
  { id: 6, name: 'Behavior', icon: 'pets', color: '#ff9800' },
];

const ARTICLES = [
  {
    id: 1,
    category: 1,
    title: 'Essential Nutrients for Dogs',
    excerpt: 'Learn about the key vitamins, minerals, and proteins your dog needs for optimal health.',
    readTime: '5 min',
    content: `Dogs require a balanced diet containing proteins, fats, carbohydrates, vitamins, and minerals.

**Proteins:** Essential for muscle development and repair. Good sources include chicken, beef, fish, and eggs.

**Fats:** Provide energy and support skin health. Omega-3 and Omega-6 fatty acids are particularly important.

**Carbohydrates:** Offer energy and fiber for digestive health. Rice, sweet potatoes, and oats are excellent options.

**Vitamins & Minerals:** Calcium for bones, Vitamin A for vision, and B vitamins for metabolism.

Always consult with your veterinarian before making significant changes to your pet's diet.`,
  },
  {
    id: 2,
    category: 1,
    title: 'Safe Human Foods for Cats',
    excerpt: 'Discover which human foods are safe to share with your feline friend.',
    readTime: '4 min',
    content: `While cats have specific dietary needs, some human foods are safe in moderation.

**Safe Foods:**
• Cooked chicken, turkey, or lean beef
• Cooked eggs
• Plain cooked rice
• Steamed vegetables (carrots, broccoli)
• Small amounts of cheese

**Foods to AVOID:**
• Chocolate, onions, garlic
• Grapes and raisins
• Caffeine and alcohol
• Raw fish or meat
• Dairy products (many cats are lactose intolerant)

Remember: Treats should only make up 10% of your cat's daily caloric intake.`,
  },
  {
    id: 3,
    category: 2,
    title: 'First Aid Kit Essentials',
    excerpt: 'What every pet owner should have in their emergency kit.',
    readTime: '6 min',
    content: `A well-stocked pet first aid kit can be lifesaving in emergencies.

**Essential Items:**
• Gauze pads and bandages
• Medical tape
• Antiseptic wipes
• Digital thermometer
• Tweezers and scissors
• Disposable gloves
• Emergency contact numbers
• Pet's medical records
• Any prescribed medications

**How to Use:**
1. Stay calm and assess the situation
2. Ensure your safety first
3. Approach your pet carefully
4. Apply first aid if trained
5. Contact your vet immediately

Remember: First aid is temporary care. Always seek professional veterinary help.`,
  },
  {
    id: 4,
    category: 2,
    title: 'Handling Pet Emergencies',
    excerpt: 'Quick response guide for common pet emergencies.',
    readTime: '7 min',
    content: `Knowing how to respond in emergencies can save your pet's life.

**Choking:**
• Check for visible obstruction
• Perform Heimlich maneuver if trained
• Rush to vet immediately

**Bleeding:**
• Apply direct pressure with clean cloth
• Elevate wound if possible
• Don't remove embedded objects

**Poisoning:**
• Identify the substance if possible
• Call poison control immediately
• Do NOT induce vomiting unless instructed

**Heatstroke:**
• Move to cool area
• Apply cool (not cold) water
• Seek veterinary care

Always keep your vet's emergency number handy!`,
  },
  {
    id: 5,
    category: 3,
    title: 'Dog Grooming Basics',
    excerpt: 'Step-by-step guide to keeping your dog clean and healthy.',
    readTime: '8 min',
    content: `Regular grooming keeps your dog healthy and comfortable.

**Brushing:**
• Frequency depends on coat type
• Short coats: Weekly
• Long coats: Daily
• Reduces shedding and matting

**Bathing:**
• Every 4-6 weeks for most dogs
• Use dog-specific shampoo
• Avoid eyes and ears
• Rinse thoroughly

**Nail Trimming:**
• Every 3-4 weeks
• Use proper dog nail clippers
• Cut small amounts at a time
• Watch for the quick (pink area)

**Ear Cleaning:**
• Check weekly for dirt/odor
• Use vet-approved cleaner
• Never insert anything deep into ear canal

**Dental Care:**
• Brush teeth 2-3 times weekly
• Use dog toothpaste only
• Provide dental chews

Professional grooming is recommended every 4-8 weeks for most breeds.`,
  },
  {
    id: 6,
    category: 4,
    title: 'Puppy Training Fundamentals',
    excerpt: 'Essential training tips for new puppy owners.',
    readTime: '10 min',
    content: `Start training your puppy early for best results.

**Basic Commands:**
1. **Sit** - Hold treat above nose, move back
2. **Stay** - Start with short durations
3. **Come** - Use positive reinforcement
4. **Down** - Lure with treat to ground

**House Training:**
• Take puppy out frequently (every 2 hours)
• After meals, naps, and play
• Praise immediately after success
• Never punish accidents

**Socialization:**
• Expose to various people, pets, sounds
• Keep experiences positive
• Start between 3-14 weeks

**Crate Training:**
• Make crate comfortable
• Start with short periods
• Never use as punishment

**Training Tips:**
• Keep sessions short (5-10 minutes)
• Use positive reinforcement
• Be consistent with commands
• Patience is key

Consider enrolling in puppy training classes for additional support.`,
  },
  {
    id: 7,
    category: 5,
    title: 'Recognizing Pain in Pets',
    excerpt: 'Signs your pet may be in pain and what to do.',
    readTime: '5 min',
    content: `Pets often hide pain instinctively. Watch for these signs:

**Behavioral Changes:**
• Decreased activity or play
• Hiding or seeking solitude
• Aggression when touched
• Changes in sleeping patterns
• Loss of appetite

**Physical Signs:**
• Limping or difficulty moving
• Excessive panting or drooling
• Whimpering or vocalization
• Restlessness
• Hunched posture
• Excessive licking of one area

**What to Do:**
1. Note all symptoms
2. Check for visible injuries
3. Monitor temperature
4. Limit activity
5. Contact your veterinarian

**Prevention:**
• Regular vet check-ups
• Maintain healthy weight
• Provide appropriate exercise
• Keep environment safe

Never give human pain medication to pets - many are toxic!`,
  },
  {
    id: 8,
    category: 6,
    title: 'Understanding Cat Behavior',
    excerpt: 'Decode your cat\'s body language and vocalizations.',
    readTime: '6 min',
    content: `Understanding cat behavior helps build a stronger bond.

**Body Language:**
• **Tail up:** Happy, confident
• **Tail puffed:** Frightened or agitated
• **Slow blink:** Trust and affection
• **Ears forward:** Alert and interested
• **Ears flat:** Scared or aggressive
• **Belly exposed:** Trusting (but may not want belly rubs!)

**Vocalizations:**
• **Meow:** Greeting, request for attention
• **Purr:** Usually contentment (sometimes pain)
• **Hiss/Growl:** Fear or aggression
• **Chirp:** Excitement, greeting
• **Yowl:** Distress or mating call

**Common Behaviors:**
• **Kneading:** Comfort, marking territory
• **Head bunting:** Affection, scent marking
• **Scratching:** Marking territory, nail maintenance
• **Zoomies:** Energy release, play

**Problematic Behaviors:**
If your cat shows aggression, inappropriate elimination, or excessive vocalization, consult your vet to rule out medical issues.`,
  },
];

const PetCareLibraryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles = ARTICLES.filter(article => {
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#5a3d2b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Care Library</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              !selectedCategory && styles.categoryChipSelected
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.categoryChipText,
              !selectedCategory && styles.categoryChipTextSelected
            ]}>
              All
            </Text>
          </TouchableOpacity>
          {CARE_CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipSelected,
                selectedCategory === category.id && { backgroundColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <MaterialIcons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? '#fff' : '#666'} 
                style={{ marginRight: 4 }}
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>
          {selectedCategory 
            ? CARE_CATEGORIES.find(c => c.id === selectedCategory)?.name + ' Articles' 
            : 'All Articles'} 
          ({filteredArticles.length})
        </Text>

        {filteredArticles.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="book-open" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No articles found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        ) : (
          filteredArticles.map(article => {
            const category = CARE_CATEGORIES.find(c => c.id === article.category);
            return (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => setSelectedArticle(article)}
              >
                <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                  <MaterialIcons name={category.icon} size={16} color="#fff" />
                  <Text style={styles.categoryBadgeText}>{category.name}</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleExcerpt} numberOfLines={2}>
                  {article.excerpt}
                </Text>
                <View style={styles.articleFooter}>
                  <View style={styles.readTime}>
                    <Feather name="clock" size={14} color="#999" />
                    <Text style={styles.readTimeText}>{article.readTime}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#8b5e3c" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Article Detail Modal */}
      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedArticle(null)}>
                <Feather name="x" size={24} color="#5a3d2b" />
              </TouchableOpacity>
              <Text style={styles.modalHeaderTitle}>Article</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 40 }}>
              {(() => {
                const category = CARE_CATEGORIES.find(c => c.id === selectedArticle.category);
                return (
                  <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                    <MaterialIcons name={category.icon} size={16} color="#fff" />
                    <Text style={styles.categoryBadgeText}>{category.name}</Text>
                  </View>
                );
              })()}
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <View style={styles.modalMeta}>
                <Feather name="clock" size={14} color="#999" />
                <Text style={styles.modalMetaText}>{selectedArticle.readTime} read</Text>
              </View>
              <Text style={styles.modalBody}>{selectedArticle.content}</Text>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5a3d2b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f5f2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3d2b',
    marginBottom: 12,
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f5f2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#8b5e3c',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  articleCard: {
    backgroundColor: '#f8f5f2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0d5c6',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3d2b',
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3d2b',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5a3d2b',
    marginBottom: 12,
    lineHeight: 32,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalMetaText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 6,
  },
  modalBody: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
});

export default PetCareLibraryScreen;