
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const categories = [
  'Alt',
  'Treningsutstyr',
  'Turutstyr',
  'Solbriller',
];

const products: Product[] = [
  {
    id: '1',
    name: 'Treningsmatte',
    description: 'Komfortabel matte til trening hjemme.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600',
    category: 'Treningsutstyr',
  },
  {
    id: '2',
    name: 'Hantler',
    description: 'Praktiske hantler til styrketrening.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600',
    category: 'Treningsutstyr',
  },
  {
    id: '3',
    name: 'Tursekk',
    description: 'Romslig sekk til turer og friluftsliv.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600',
    category: 'Turutstyr',
  },
  {
    id: '4',
    name: 'Turflaske',
    description: 'Ta med vann på neste tur.',
    price: 149,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    category: 'Turutstyr',
  },
  {
    id: '5',
    name: 'Solbriller',
    description: 'Solbriller til solrike dager.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600',
    category: 'Solbriller',
  },
];

export default function App() {
  const [category, setCategory] = useState('Alt');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [screen, setScreen] = useState<'home' | 'cart'>('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const visibleProducts =
    category === 'Alt'
      ? products
      : products.filter((product) => product.category === category);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  }

  function changeQuantity(productId: string, change: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>NORD SHOP</Text>
          <Text style={styles.subtitle}>Utstyr for dine eventyr</Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setScreen(screen === 'home' ? 'cart' : 'home')}
        >
          <Text style={styles.cartButtonText}>
            {screen === 'home' ? `Kurv (${totalItems})` : '← Butikk'}
          </Text>
        </TouchableOpacity>
      </View>

      {screen === 'home' ? (
        <ScrollView>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Finn ditt neste favorittutstyr</Text>
            <Text style={styles.heroText}>
              Utforsk produkter for trening, tur og solrike dager.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Kategorier</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          >
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  category === item && styles.selectedCategory,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.selectedCategoryText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Produkter</Text>

          <View style={styles.productList}>
            {visibleProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <TouchableOpacity
                  onPress={() => setSelectedImage(product.image)}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.imageHint}>Trykk for større bilde</Text>
                </TouchableOpacity>

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.description}>
                    {product.description}
                  </Text>
                  <Text style={styles.price}>{product.price} kr</Text>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(product)}
                  >
                    <Text style={styles.addButtonText}>Legg i handlekurv</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.cartContent}>
          <Text style={styles.sectionTitle}>Handlekurven din</Text>

          {cart.length === 0 ? (
            <Text style={styles.emptyCart}>
              Handlekurven er tom. Gå til butikken for å velge varer.
            </Text>
          ) : (
            <>
              {cart.map((item) => (
                <View key={item.product.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.productName}>
                      {item.product.name}
                    </Text>
                    <Text>
                      {item.product.price} kr × {item.quantity}
                    </Text>
                    <Text style={styles.price}>
                      {item.product.price * item.quantity} kr
                    </Text>
                  </View>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => changeQuantity(item.product.id, -1)}
                    >
                      <Text style={styles.quantityText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => changeQuantity(item.product.id, 1)}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Totalt ({totalItems} varer)</Text>
                <Text style={styles.totalPrice}>{totalPrice} kr</Text>
              </View>

              <Text style={styles.checkoutNote}>
                Bestillingsoversikt – ingen ekte betaling gjennomføres.
              </Text>
            </>
          )}
        </ScrollView>
      )}

      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.imageModal}>
          <TouchableOpacity
            style={styles.closeImage}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.closeImageText}>Lukk ✕</Text>
          </TouchableOpacity>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.largeImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: '#173F35',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { color: 'white', fontSize: 21, fontWeight: 'bold' },
  subtitle: { color: '#D7E8DF', marginTop: 4 },
  cartButton: {
    backgroundColor: '#E8F0E8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cartButtonText: { color: '#173F35', fontWeight: 'bold' },
  hero: {
    backgroundColor: '#E2ECE5',
    padding: 24,
    margin: 16,
    borderRadius: 16,
  },
  heroTitle: { fontSize: 25, fontWeight: 'bold', color: '#173F35' },
  heroText: { marginTop: 8, color: '#425A50', lineHeight: 21 },
  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    color: '#202B26',
  },
  categoryList: { paddingLeft: 16, marginBottom: 8 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDE3DF',
  },
  selectedCategory: { backgroundColor: '#173F35', borderColor: '#173F35' },
  categoryText: { color: '#35463D', fontWeight: '600' },
  selectedCategoryText: { color: 'white' },
  productList: { padding: 16, paddingTop: 0 },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E3E7E4',
  },
  productImage: { width: '100%', height: 190, backgroundColor: '#E8ECE9' },
  imageHint: {
    fontSize: 11,
    color: '#65766C',
    textAlign: 'center',
    paddingTop: 5,
  },
  productInfo: { padding: 15 },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#202B26' },
  description: { marginTop: 5, color: '#68756D', lineHeight: 20 },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#173F35',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#173F35',
    borderRadius: 8,
    padding: 13,
    marginTop: 12,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  cartContent: { flex: 1, paddingTop: 12, paddingHorizontal: 16 },
  emptyCart: {
    margin: 16,
    color: '#68756D',
    fontSize: 16,
    lineHeight: 23,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartItemInfo: { flex: 1 },
  quantityControls: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#E2ECE5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: { fontSize: 20, color: '#173F35', fontWeight: 'bold' },
  quantity: { marginHorizontal: 12, fontWeight: 'bold' },
  totalBox: {
    marginTop: 8,
    padding: 18,
    backgroundColor: '#E2ECE5',
    borderRadius: 12,
  },
  totalLabel: { color: '#425A50', fontSize: 16 },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#173F35',
    marginTop: 5,
  },
  checkoutNote: { color: '#68756D', marginVertical: 16, lineHeight: 20 },
  imageModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImage: {
    position: 'absolute',
    top: 55,
    right: 20,
    zIndex: 1,
    padding: 12,
  },
  closeImageText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  largeImage: { width: '95%', height: '75%' },
});
