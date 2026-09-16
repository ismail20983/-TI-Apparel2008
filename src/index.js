import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  Check,
  Shield,
  Lock,
  Phone,
  MessageCircle,
  Moon,
  Sun,
  Filter,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  AlertTriangle,
  CheckCircle,
  Package,
  Truck,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Ruler,
  Sliders,
  DollarSign,
  ArrowRight,
  Eye,
  FileText
} from 'lucide-react';

// TYPES & DATA STRUCTURES
export type Category = 'All' | 'Cargo' | 'Chinos' | 'Denim' | 'Joggers';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice: number;
  isBestseller: boolean;
  image: string;
  rating: number;
  colors: string[];
  sizes: { size: string; number: number }[];
  fabric: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tactical Cargo Pants',
    category: 'Cargo',
    price: 45,
    originalPrice: 60,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    colors: ['Black', 'Olive', 'Khaki'],
    sizes: [
      { size: 'S', number: 28 },
      { size: 'M', number: 30 },
      { size: 'L', number: 32 },
      { size: 'XL', number: 34 }
    ],
    fabric: 'Cotton Ripstop'
  },
  {
    id: '2',
    name: 'Classic Slim Chinos',
    category: 'Chinos',
    price: 40,
    originalPrice: 50,
    isBestseller: false,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    colors: ['Beige', 'Navy', 'Grey'],
    sizes: [
      { size: 'M', number: 30 },
      { size: 'L', number: 32 },
      { size: 'XL', number: 34 }
    ],
    fabric: '98% Cotton, 2% Elastane'
  },
  {
    id: '3',
    name: 'Urban Denim Jeans',
    category: 'Denim',
    price: 55,
    originalPrice: 75,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1542272604-780c36856d67?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    colors: ['Dark Blue', 'Light Blue', 'Black'],
    sizes: [
      { size: 'S', number: 28 },
      { size: 'M', number: 30 },
      { size: 'L', number: 32 }
    ],
    fabric: 'Heavyweight Denim'
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>T&I Apparel</h1>
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <ShoppingBag size={18} />
          <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
        </button>
      </header>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {(['All', 'Cargo', 'Chinos', 'Denim', 'Joggers'] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ccc',
              borderRadius: '20px',
              background: selectedCategory === cat ? '#000' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{product.name}</h3>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// React App Root Mounting Logic
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
