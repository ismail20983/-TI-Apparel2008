import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ArrowUpRight,
  Send,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================

export type Category = 'All' | 'Cargo' | 'Chinos' | 'Denim' | 'Formal' | 'Joggers';

export interface Product {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  price: number;
  originalPrice: number;
  isBestSeller: boolean;
  image: string;
  hoverVideo: string;
  colors: string[];
  sizes: { [size: string]: number }; // e.g. { 'W28': 3, 'W30': 7, ... }
  description: string;
  fabric: string;
}

export interface CartItem {
  cartId: string;
  productId: string;
  title: string;
  price: number;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  image: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  mediaUrl?: string;
  verified: boolean;
  status: 'approved' | 'pending';
}

export interface Order {
  id: string;
  trackingCode: string;
  customerName: string;
  mobile: string;
  address: string;
  district: string;
  deliveryZone: 'Inside Dhaka' | 'Outside Dhaka';
  deliveryCharge: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'bKash' | 'Nagad';
  trxId: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

// Initial Mock Inventory
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Tactical Obsidian Stealth Cargo Pants',
    category: 'Cargo',
    price: 2450,
    originalPrice: 3200,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    hoverVideo: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-dark-street-41712-large.mp4',
    colors: ['#1A1A1A', '#3C3D37', '#1E201E'],
    sizes: { 'W28': 2, 'W30': 4, 'W32': 8, 'W34': 3, 'W36': 0, 'W38': 5 },
    description: 'Heavyweight ripstop cotton with 8 modular magnetic tactical pockets, reinforced knees, and water-repellent coating.',
    fabric: '98% Luxury Combed Twill, 2% Spandex'
  },
  {
    id: 'prod-2',
    title: 'Monarch Royal Tailored Chinos',
    category: 'Chinos',
    price: 2150,
    originalPrice: 2800,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    hoverVideo: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-black-clothes-41589-large.mp4',
    colors: ['#D4AF37', '#1C1C1C', '#2C3E50'],
    sizes: { 'W28': 5, 'W30': 3, 'W32': 2, 'W34': 6, 'W36': 4, 'W38': 2 },
    description: 'Custom slim-fit sartorial chinos cut from Mercerized Egyptian cotton with horn buttons and silk piping.',
    fabric: 'Mercerized Egyptian Cotton'
  },
  {
    id: 'prod-3',
    title: 'Vanguard Raw Selvedge Denim',
    category: 'Denim',
    price: 2950,
    originalPrice: 3800,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    hoverVideo: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-sitting-on-a-bench-looking-at-his-cell-41708-large.mp4',
    colors: ['#0B1B3D', '#151515'],
    sizes: { 'W28': 1, 'W30': 3, 'W32': 5, 'W34': 2, 'W36': 0, 'W38': 1 },
    description: '14.5oz Japanese shuttle-loom woven deep indigo selvedge denim with 24K gold-plated rivets and brass hardware.',
    fabric: '14.5oz Indigo Shuttle-Loom Denim'
  },
  {
    id: 'prod-4',
    title: 'Diplomat Italian Pleated Formal Trousers',
    category: 'Formal',
    price: 2650,
    originalPrice: 3500,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    hoverVideo: 'https://assets.mixkit.co/videos/preview/mixkit-confident-businessman-walking-in-modern-office-41315-large.mp4',
    colors: ['#1E1E1E', '#3A3B3C', '#2B1B17'],
    sizes: { 'W28': 4, 'W30': 6, 'W32': 9, 'W34': 4, 'W36': 2, 'W38': 3 },
    description: 'Single inverted pleat, side-adjuster clasps, and half-lined viscose interior for formal Dhaka gala wear.',
    fabric: 'Fine Wool-Blend Crease-Resistant Weave'
  },
  {
    id: 'prod-5',
    title: 'HyperFlex Athletic Stealth Joggers',
    category: 'Joggers',
    price: 1850,
    originalPrice: 2400,
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80',
    hoverVideo: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-tying-his-sneakers-before-running-41588-large.mp4',
    colors: ['#0F0F0F', '#242424'],
    sizes: { 'W28': 3, 'W30': 2, 'W32': 1, 'W34': 4, 'W36': 5, 'W38': 0 },
    description: 'Thermal regulating 4-way stretch fabric with waterproof zip stash pockets and tapered ribbed ankle cuffs.',
    fabric: 'Modal-Spandex UltraSoft Matrix'
  }
];

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'Tanvir Hossain (Gulshan-2)',
    rating: 5,
    comment: 'Material and cut is 10/10. Tactical pockets are sturdy and look genuinely high-end. Delivered inside Dhaka in 24 hours!',
    date: '2026-09-12',
    verified: true,
    status: 'approved'
  },
  {
    id: 'rev-2',
    productId: 'prod-3',
    customerName: 'Mahmudur Rahman (Uttara)',
    rating: 5,
    comment: 'Raw selvedge denim of this caliber is rare in Bangladesh. Premium gold rivet finish is next level.',
    date: '2026-09-14',
    verified: true,
    status: 'approved'
  }
];

const SALES_TOAST_POOL = [
  { name: 'Imran', location: 'Dhanmondi, Dhaka', product: 'Tactical Obsidian Stealth Cargo Pants', time: '14 mins ago' },
  { name: 'Zubair', location: 'Uttara Sector 7, Dhaka', product: 'Vanguard Raw Selvedge Denim', time: '8 mins ago' },
  { name: 'Shahriar', location: 'Chittagong GEC', product: 'Monarch Royal Tailored Chinos', time: '22 mins ago' },
  { name: 'Nafis', location: 'Sylhet Kumarpara', product: 'Diplomat Italian Pleated Formal Trousers', time: '35 mins ago' },
  { name: 'Fahim', location: 'Mirpur DOHS, Dhaka', product: 'HyperFlex Athletic Stealth Joggers', time: '6 mins ago' }
];

export default function TIApparelApp() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // App navigation state
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('');
  const [adminPinError, setAdminPinError] = useState<string>('');

  // Catalog & Inventory state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Sizing and Fit Calculator Modal
  const [isFitCalculatorOpen, setIsFitCalculatorOpen] = useState<boolean>(false);
  const [fitCalcHeightFt, setFitCalcHeightFt] = useState<number>(5);
  const [fitCalcHeightIn, setFitCalcHeightIn] = useState<number>(9);
  const [fitCalcWeightKg, setFitCalcWeightKg] = useState<number>(72);
  const [calculatedSizeRecommendation, setCalculatedSizeRecommendation] = useState<string>('W32');

  // Customer Reviews state
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewMediaUrl, setNewReviewMediaUrl] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({
    'prod-1': 'W30',
    'prod-2': 'W32',
    'prod-3': 'W32',
    'prod-4': 'W32',
    'prod-5': 'W30'
  });
  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: string }>({
    'prod-1': '#1A1A1A',
    'prod-2': '#D4AF37',
    'prod-3': '#0B1B3D',
    'prod-4': '#1E1E1E',
    'prod-5': '#0F0F0F'
  });

  // Checkout and Order State
  const [deliveryZone, setDeliveryZone] = useState<'Inside Dhaka' | 'Outside Dhaka' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDistrict, setCustomerDistrict] = useState('Dhaka');
  const [trxId, setTrxId] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  // Post Order Success State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);

  // Admin orders state
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-101',
      trackingCode: 'TI-98241',
      customerName: 'Kazi Ashfaqur Rahman',
      mobile: '01711223344',
      address: 'House 42, Road 11, Banani',
      district: 'Dhaka',
      deliveryZone: 'Inside Dhaka',
      deliveryCharge: 100,
      items: [
        {
          cartId: 'c-1',
          productId: 'prod-1',
          title: 'Tactical Obsidian Stealth Cargo Pants',
          price: 2450,
          selectedColor: '#1A1A1A',
          selectedSize: 'W32',
          quantity: 2,
          image: INITIAL_PRODUCTS[0].image
        }
      ],
      subtotal: 4900,
      discount: 100,
      total: 4900,
      paymentMethod: 'bKash',
      trxId: 'BK9X245103',
      status: 'Processing',
      createdAt: '2026-09-15 19:40'
    }
  ]);
  const [adminCourierFilter, setAdminCourierFilter] = useState<'All' | 'Inside Dhaka' | 'Outside Dhaka'>('All');

  // Video reel active playback state
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isReelMuted, setIsReelMuted] = useState(true);

  // Live FOMO Toast
  const [currentToast, setCurrentToast] = useState<{ name: string; location: string; product: string; time: string } | null>(null);

  // Web Audio Context Synthesizer (Crystal Ding Chime)
  const playCrystalOrderDing = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Frequencies for a sparkling gold chime chord (E6, G#6, B6, E7)
      const freqs = [1318.51, 1661.22, 1975.53, 2637.02];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25 - idx * 0.05, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.7);
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Automated FOMO Toast interval
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentToast(SALES_TOAST_POOL[index % SALES_TOAST_POOL.length]);
      index++;
      setTimeout(() => {
        setCurrentToast(null);
      }, 7000);
    }, 45000);

    // Initial toast after 5 seconds
    const initialTimer = setTimeout(() => {
      setCurrentToast(SALES_TOAST_POOL[0]);
      setTimeout(() => setCurrentToast(null), 6000);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  // Automated Fit Calculator Recommendation Logic
  useEffect(() => {
    const totalInches = fitCalcHeightFt * 12 + fitCalcHeightIn;
    let recommended = 'W32';

    if (fitCalcWeightKg < 58) {
      recommended = 'W28';
    } else if (fitCalcWeightKg >= 58 && fitCalcWeightKg < 66) {
      recommended = totalInches > 68 ? 'W30' : 'W28';
    } else if (fitCalcWeightKg >= 66 && fitCalcWeightKg < 74) {
      recommended = 'W32';
    } else if (fitCalcWeightKg >= 74 && fitCalcWeightKg < 83) {
      recommended = 'W34';
    } else if (fitCalcWeightKg >= 83 && fitCalcWeightKg < 92) {
      recommended = 'W36';
    } else {
      recommended = 'W38';
    }
    setCalculatedSizeRecommendation(recommended);
  }, [fitCalcHeightFt, fitCalcHeightIn, fitCalcWeightKg]);

  // Cart financial calculations
  const cartItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  // Automated Tiered Discount Rules:
  // 1 Item = Regular Price | 2 Items = ৳100 Flat OFF | 3+ Items = ৳150 Flat OFF
  const tieredDiscount = useMemo(() => {
    if (cartItemCount === 2) return 100;
    if (cartItemCount >= 3) return 150;
    return 0;
  }, [cartItemCount]);

  const deliveryFee = deliveryZone === 'Inside Dhaka' ? 100 : deliveryZone === 'Outside Dhaka' ? 150 : 0;
  const cartFinalTotal = Math.max(0, cartSubtotal - tieredDiscount + deliveryFee);
  const freeDeliveryThreshold = 4500;
  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  // Cart operations
  const handleAddToCart = (product: Product, requestedSize?: string, requestedColor?: string) => {
    const size = requestedSize || selectedSizes[product.id] || 'W32';
    const color = requestedColor || selectedColors[product.id] || product.colors[0];
    const stockAvailable = product.sizes[size] ?? 0;

    if (stockAvailable <= 0) {
      alert(`দুঃখিত, ${size} সাইজের স্টক শেষ! অনুগ্রহ করে অন্য সাইজ সিলেক্ট করুন।`);
      return;
    }

    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.productId === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        const newItem: CartItem = {
          cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          title: product.title,
          price: product.price,
          selectedColor: color,
          selectedSize: size,
          quantity: 1,
          image: product.image
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // High-Security Masked Admin Auth Validation
  // Obfuscated: btoa('2008') === 'MjAwOA=='
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (btoa(adminPin.trim()) === 'MjAwOA==') {
      setIsAdminAuthenticated(true);
      setAdminPinError('');
      setAdminPin('');
    } else {
      setAdminPinError('Invalid Security Passcode. Access Denied.');
      setAdminPin('');
    }
  };

  // Checkout submission with hard validations
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (cart.length === 0) {
      setCheckoutError('আপনার শপিং কার্ট খালি!');
      return;
    }
    if (!customerName.trim() || !customerMobile.trim() || !customerAddress.trim()) {
      setCheckoutError('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা পূরণ করুন।');
      return;
    }
    if (!deliveryZone) {
      setCheckoutError('ডেলিভারি এরিয়া (Inside Dhaka অথবা Outside Dhaka) সিলেক্ট করা বাধ্যতামূলক!');
      return;
    }
    if (!trxId.trim()) {
      setCheckoutError('অগ্রিম ডেলিভারি চার্জ পরিশোধের পর প্রাপ্ত TrxID প্রদান করা বাধ্যতামূলক!');
      return;
    }

    // Deduct stock from products
    setProducts(prev =>
      prev.map(p => {
        const updatedSizes = { ...p.sizes };
        cart.forEach(item => {
          if (item.productId === p.id && updatedSizes[item.selectedSize] !== undefined) {
            updatedSizes[item.selectedSize] = Math.max(0, updatedSizes[item.selectedSize] - item.quantity);
          }
        });
        return { ...p, sizes: updatedSizes };
      })
    );

    const trackingCode = `TI-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      trackingCode,
      customerName: customerName.trim(),
      mobile: customerMobile.trim(),
      address: customerAddress.trim(),
      district: customerDistrict.trim() || (deliveryZone === 'Inside Dhaka' ? 'Dhaka' : 'Outside Dhaka'),
      deliveryZone,
      deliveryCharge: deliveryFee,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: tieredDiscount,
      total: cartFinalTotal,
      paymentMethod,
      trxId: trxId.trim().toUpperCase(),
      status: 'Pending',
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
    };

    setOrders(prev => [newOrder, ...prev]);
    setConfirmedOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    setIsOrderSuccessModalOpen(true);
    playCrystalOrderDing();

    // Reset fields
    setCustomerName('');
    setCustomerMobile('');
    setCustomerAddress('');
    setTrxId('');
    setDeliveryZone(null);
  };

  // Format WhatsApp Order Dispatch String
  const formatWhatsAppMessage = (order: Order) => {
    const itemLines = order.items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.title}*\n   Size: ${it.selectedSize} | Qty: ${it.quantity} | Unit: ৳${it.price}`
      )
      .join('\n');

    const msg = `*--- T&I APPAREL OFFICIAL ORDER ---*
*Order Tracking:* #${order.trackingCode}
*Customer:* ${order.customerName}
*Phone:* ${order.mobile}
*Address:* ${order.address}, ${order.district}
*Delivery Zone:* ${order.deliveryZone} (৳${order.deliveryCharge})

*Order Items:*
${itemLines}

*Subtotal:* ৳${order.subtotal}
*Tiered Discount:* -৳${order.discount}
*Delivery Charge:* +৳${order.deliveryCharge}
*Total Payable:* ৳${order.total}

*Payment Gateway:* ${order.paymentMethod}
*Verified TrxID:* ${order.trxId}
*Status:* Order Awaiting Verification`;

    return encodeURIComponent(msg);
  };

  // Client PDF / Printable Invoice Generator
  const handlePrintOrDownloadInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate and download your PDF invoice.');
      return;
    }

    const itemsHtml = order.items
      .map(
        item => `
        <tr style="border-bottom: 1px solid #222;">
          <td style="padding: 12px 8px; font-weight: 600;">${item.title}<br><span style="font-size: 11px; color: #888;">Size: ${item.selectedSize}</span></td>
          <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right;">৳${item.price}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 600;">৳${item.price * item.quantity}</td>
        </tr>
      `
      )
      .join('');

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>T&I Apparel - Tax Invoice #${order.trackingCode}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0D0D0D; color: #E5E5E5; margin: 0; padding: 40px; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #D4AF37; padding: 40px; background: #141414; border-radius: 8px; }
            .header-gold { color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-size: 28px; }
            .tagline { color: #A0A0A0; font-size: 12px; margin-top: 4px; }
            .meta-grid { display: flex; justify-content: space-between; margin: 30px 0; border-top: 1px solid #333; border-bottom: 1px solid #333; padding: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #222; color: #D4AF37; padding: 12px 8px; text-align: left; font-size: 13px; text-transform: uppercase; }
            .total-row { font-size: 16px; font-weight: bold; color: #D4AF37; }
            .footer-note { text-align: center; margin-top: 40px; font-size: 12px; color: #777; border-top: 1px solid #222; padding-top: 20px; }
            @media print {
              body { background: #fff !important; color: #000 !important; padding: 0 !important; }
              .invoice-box { border: 1px solid #ccc !important; background: #fff !important; }
              .header-gold { color: #8A6D3B !important; }
              th { background: #f0f0f0 !important; color: #000 !important; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h1 class="header-gold">T&I APPAREL</h1>
                <div class="tagline">Tailored for the Relentless • Dhaka, Bangladesh</div>
                <div style="font-size: 12px; color: #999; margin-top: 8px;">
                  Official Helpline: +8801725037564<br>
                  Email: ismailfahad202@gmail.com
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 20px; font-weight: bold; color: #D4AF37;">INVOICE</div>
                <div style="font-size: 13px; color: #ccc;">Tracking Code: #${order.trackingCode}</div>
                <div style="font-size: 12px; color: #888;">Date: ${order.createdAt}</div>
                <div style="font-size: 12px; color: #22c55e; margin-top: 4px;">TrxID: ${order.trxId} (${order.paymentMethod})</div>
              </div>
            </div>

            <div class="meta-grid">
              <div>
                <strong style="color: #D4AF37; font-size: 13px;">BILLED TO:</strong><br>
                <span style="font-size: 15px; font-weight: bold;">${order.customerName}</span><br>
                ${order.address}<br>
                ${order.district}, Bangladesh<br>
                Phone: ${order.mobile}
              </div>
              <div style="text-align: right;">
                <strong style="color: #D4AF37; font-size: 13px;">DISPATCH SPECIFICATIONS:</strong><br>
                Zone: ${order.deliveryZone}<br>
                Target Delivery: 5 - 6 Business Days<br>
                Status: Verified Advance Courier Paid
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Apparel Specification</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-left: auto; width: 300px; margin-top: 24px;">
              <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px;">
                <span>Subtotal:</span>
                <span>৳${order.subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #22c55e;">
                <span>Tiered Multi-Buy Discount:</span>
                <span>-৳${order.discount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px;">
                <span>Delivery Charge (${order.deliveryZone}):</span>
                <span>৳${order.deliveryCharge}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #D4AF37; margin-top: 8px;" class="total-row">
                <span>Final Balance:</span>
                <span>৳${order.total}</span>
              </div>
            </div>

            <div class="footer-note">
              Thank you for trusting T&I Apparel. For dispatch tracking, WhatsApp us directly at +8801725037564 with your Order Code #${order.trackingCode}.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  // Courier CSV Exporter for Pathao / Steadfast / RedX APIs
  const handleExportCourierCSV = () => {
    const filteredOrders = orders.filter(ord => {
      if (adminCourierFilter === 'All') return true;
      return ord.deliveryZone === adminCourierFilter;
    });

    const headers = [
      'Order Tracking ID',
      'Recipient Name',
      'Recipient Phone',
      'Recipient Address',
      'District',
      'Delivery Zone',
      'Delivery Fee (BDT)',
      'Total COD Amount (BDT)',
      'Item Summary',
      'Payment TrxID',
      'Order Status'
    ];

    const rows = filteredOrders.map(ord => [
      ord.trackingCode,
      `"${ord.customerName.replace(/"/g, '""')}"`,
      ord.mobile,
      `"${ord.address.replace(/"/g, '""')}"`,
      `"${ord.district}"`,
      ord.deliveryZone,
      ord.deliveryCharge,
      ord.total,
      `"${ord.items.map(i => `${i.title} (${i.selectedSize} x${i.quantity})`).join(', ')}"`,
      ord.trxId,
      ord.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TI_Apparel_Courier_Sheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      productId: products[0].id,
      customerName: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().slice(0, 10),
      mediaUrl: newReviewMediaUrl.trim() || undefined,
      verified: true,
      status: 'approved'
    };

    setReviews(prev => [newRev, ...prev]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewMediaUrl('');
    setReviewSubmitSuccess(true);
    setTimeout(() => setReviewSubmitSuccess(false), 4000);
  };

  // Product Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Video reels sample data
  const VIDEO_REELS = [
    {
      id: 'reel-1',
      title: 'Tactical Cargo Real-World Water Repellent Test',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-dark-street-41712-large.mp4',
      modelStats: 'Height: 5ft 11in | Wearing: W32',
      customerTag: '@fahim_dhk'
    },
    {
      id: 'reel-2',
      title: 'Monarch Chinos 360 Drapery & Fit',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-black-clothes-41589-large.mp4',
      modelStats: 'Height: 6ft 1in | Wearing: W34',
      customerTag: '@saif_style'
    },
    {
      id: 'reel-3',
      title: '14.5oz Raw Selvedge Heavy Cuff Styling',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-sitting-on-a-bench-looking-at-his-cell-41708-large.mp4',
      modelStats: 'Height: 5ft 9in | Wearing: W30',
      customerTag: '@tanvir_denim'
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 selection:bg-[#D4AF37] selection:text-black ${
        isDarkMode ? 'bg-[#0D0D0D] text-[#EAEAEA]' : 'bg-[#FAFAFA] text-[#111111]'
      }`}
    >
      {/* ========================================================
          STICKY ULTRA-LUXURY GLASSMORPHIC HEADER
      ======================================================== */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDarkMode ? 'bg-[#0D0D0D]/80 border-[#262626]' : 'bg-white/80 border-[#E5E5E5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Motto */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveCategory('All')}>
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#F5D061] via-[#D4AF37] to-[#AA7C11] p-[1.5px] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center">
              <div
                className={`w-full h-full rounded-[6.5px] flex items-center justify-center font-black tracking-tighter text-lg ${
                  isDarkMode ? 'bg-[#0D0D0D] text-[#D4AF37]' : 'bg-white text-black'
                }`}
              >
                T&I
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-widest bg-gradient-to-r from-[#FFFFFF] via-[#E2C775] to-[#D4AF37] bg-clip-text text-transparent uppercase">
                T&I APPAREL
              </span>
              <p className="text-[9px] tracking-[0.25em] text-[#D4AF37] font-semibold uppercase hidden sm:block">
                Tailored for the Relentless • Dhaka
              </p>
            </div>
          </div>

          {/* Search bar on desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search premium cargo, chinos, raw denim..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs transition-all focus:outline-none border ${
                isDarkMode
                  ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200 focus:border-[#D4AF37] placeholder-zinc-500'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-800 focus:border-[#D4AF37] placeholder-zinc-400'
              }`}
            />
          </div>

          {/* Action Hub & Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Fit Guide Trigger */}
            <button
              onClick={() => setIsFitCalculatorOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Smart Fit Guide</span>
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme"
              className={`p-2.5 rounded-full border transition-all ${
                isDarkMode
                  ? 'bg-zinc-900 border-zinc-800 text-[#D4AF37] hover:border-[#D4AF37]'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:border-black'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-lg shadow-[#D4AF37]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-[#D4AF37] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#D4AF37]">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          HERO BANNER: HIGH-IMPACT VIDEO DISPLAY
      ======================================================== */}
      <section className="relative h-[85vh] sm:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Looping Video with luxury gradient overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-[0.45] scale-105 filter contrast-125"
            poster="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1600&q=80"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-dark-street-41712-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D0D0D]/30 to-[#0D0D0D]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/50 bg-black/60 backdrop-blur-md mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase">
              2026 Sartorial Dhaka Drop • Ultra-Luxury Matrix
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.08] mb-6">
            Tailored For The <br />
            <span className="bg-gradient-to-r from-[#FFE599] via-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent">
              Relentless
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 font-light mb-8 leading-relaxed">
            Architectural men's trousers engineered with Mercerized Egyptian cotton, heavy Japanese selvedge denim, and
            magnetic stealth cargo utility. Handcrafted in Dhaka for the modern visionary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#F5D061] via-[#D4AF37] to-[#B38715] text-black font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-[#D4AF37]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Collection</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFitCalculatorOpen(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-sm uppercase tracking-wider hover:bg-[#D4AF37]/15 transition-all flex items-center justify-center space-x-2"
            >
              <Ruler className="w-4 h-4" />
              <span>Smart Fit Calculator</span>
            </button>
          </div>

          {/* Quick Perks Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-4xl mx-auto pt-6 border-t border-zinc-800/80 text-left">
            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>Dhaka Express 24-48h</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>100% Selvedge & Twill</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span>৳150 Multi-Buy Discount</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Discreet Luxury Box</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CATALOG SECTION & INTERACTIVE SIZING
      ======================================================== */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Curated Haute Drops</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">Men's Trouser Arsenal</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {(['All', 'Cargo', 'Chinos', 'Denim', 'Formal', 'Joggers'] as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/30 scale-105'
                    : isDarkMode
                    ? 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    : 'bg-zinc-200 text-zinc-700 hover:text-black border border-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid with 3D Parallax & Video Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => {
            const currentSelectedSize = selectedSizes[product.id] || 'W32';
            const availableStock = product.sizes[currentSelectedSize] ?? 0;
            const isScarcityTriggered = availableStock > 0 && availableStock < 5;

            return (
              <div
                key={product.id}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  isDarkMode
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-[#D4AF37]/60 hover:shadow-[#D4AF37]/10'
                    : 'bg-white border-zinc-200 hover:border-[#D4AF37] hover:shadow-xl'
                }`}
              >
                {/* Image & Hover MP4 Video Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
                  {/* Default Static Hero Image */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* 5-Second Video Preview on Hover (Desktop) */}
                  <video
                    loop
                    muted
                    playsInline
                    onMouseEnter={e => {
                      try {
                        e.currentTarget.play();
                      } catch {}
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-auto"
                  >
                    <source src={product.hoverVideo} type="video/mp4" />
                  </video>

                  {/* Best Seller Dynamic Badge */}
                  {product.isBestSeller && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                      <span>Best Seller 🔥</span>
                    </div>
                  )}

                  {/* Quick Fit Guide Trigger on Card */}
                  <button
                    onClick={() => {
                      setSelectedProductForModal(product);
                      setIsFitCalculatorOpen(true);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all border border-[#D4AF37]/40"
                    title="Interactive Sizing Chart"
                  >
                    <Ruler className="w-4 h-4" />
                  </button>

                  {/* Scarcity Countdown Engine Badge */}
                  {isScarcityTriggered && (
                    <div className="absolute bottom-3 left-3 right-3 bg-red-950/90 border border-red-600/70 text-red-200 text-xs px-3 py-1.5 rounded-lg backdrop-blur-md font-semibold flex items-center space-x-2 animate-bounce">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>⚡ আর মাত্র {availableStock}টি প্যান্ট স্টকে আছে! দ্রুত অর্ডার করুন।</span>
                    </div>
                  )}

                  {availableStock === 0 && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-900/80 border border-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-md">
                        Sold Out in Size {currentSelectedSize}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Meta & Actions */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span className="uppercase tracking-widest font-semibold text-[#D4AF37]">{product.category}</span>
                    <span>{product.fabric.split(',')[0]}</span>
                  </div>

                  <h3 className="font-extrabold text-base mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  {/* Price Tag with Strikethrough Savings */}
                  <div className="flex items-baseline space-x-2.5 mb-4">
                    <span className="text-xl font-black text-[#D4AF37]">৳{product.price.toLocaleString()}</span>
                    <span className="text-xs text-zinc-500 line-through">৳{product.originalPrice.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                      SAVE ৳{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </div>

                  {/* Dynamic Waist Size Selector (W28 to W38) */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-zinc-400">Select Waist (Inches):</span>
                      <span className="text-[#D4AF37] font-bold">{currentSelectedSize}</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {['W28', 'W30', 'W32', 'W34', 'W36', 'W38'].map(size => {
                        const count = product.sizes[size] ?? 0;
                        const isSelected = currentSelectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                            disabled={count === 0}
                            className={`py-1.5 text-xs font-bold rounded transition-all relative ${
                              isSelected
                                ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/30'
                                : count === 0
                                ? 'bg-zinc-800/40 text-zinc-600 line-through cursor-not-allowed border border-transparent'
                                : isDarkMode
                                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add To Cart Button with Golden Liquid Shimmer */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={availableStock === 0}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 ${
                      availableStock === 0
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#F5D061] via-[#D4AF37] to-[#AA7C11] text-black hover:shadow-lg hover:shadow-[#D4AF37]/25 active:scale-[0.98]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{availableStock === 0 ? 'Out of Stock' : 'Order Now • Add to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          VERTICAL VIDEO REVIEW SLIDER (TIKTOK / REELS CAROUSEL)
      ======================================================== */}
      <section className={`py-16 border-t ${isDarkMode ? 'bg-[#111111] border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
                <Play className="w-3.5 h-3.5" />
                <span>Real Bangladeshi Verified Fit Reel</span>
              </div>
              <h2 className="text-3xl font-extrabold uppercase">Customer Try-On Reels</h2>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => setIsReelMuted(!isReelMuted)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-zinc-700 text-xs font-semibold hover:border-[#D4AF37]"
              >
                {isReelMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isReelMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
              </button>
            </div>
          </div>

          {/* Reels Slider View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {VIDEO_REELS.map((reel, idx) => (
              <div
                key={reel.id}
                className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-black shadow-2xl group border border-zinc-800"
              >
                <video
                  loop
                  autoPlay
                  muted={isReelMuted}
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={reel.videoUrl} type="video/mp4" />
                </video>

                {/* Reel Info Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-[#D4AF37]">
                    LIVE VERIFIED
                  </span>
                  <span className="text-white text-xs font-bold drop-shadow">{reel.customerTag}</span>
                </div>

                <div className="absolute bottom-5 left-4 right-4">
                  <h4 className="text-white font-bold text-sm mb-1">{reel.title}</h4>
                  <p className="text-[#D4AF37] text-xs font-mono">{reel.modelStats}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          COMMUNITY REVIEWS & VERIFIED SUBMISSION ENGINE
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-7">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-2">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
              <span>Authentic Social Proof</span>
            </div>
            <h2 className="text-3xl font-extrabold uppercase mb-6">Customer Reviews & Ratings</h2>

            <div className="space-y-4">
              {reviews
                .filter(r => r.status === 'approved')
                .map(rev => (
                  <div
                    key={rev.id}
                    className={`p-5 rounded-xl border transition-all ${
                      isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm">{rev.customerName}</span>
                          {rev.verified && (
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-zinc-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Review Submission Form */}
          <div className="lg:col-span-5">
            <div
              className={`p-6 rounded-2xl border ${
                isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-lg'
              }`}
            >
              <h3 className="text-lg font-extrabold uppercase mb-1">Leave A Verified Review</h3>
              <p className="text-xs text-zinc-400 mb-6">Your feedback directly shapes our future Dhaka drops.</p>

              {reviewSubmitSuccess && (
                <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs rounded-lg flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>ধন্যবাদ! আপনার রিভিউ সফলভাবে যুক্ত হয়েছে।</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Your Full Name & Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Karim (Banani)"
                    value={newReviewAuthor}
                    onChange={e => setNewReviewAuthor(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-[#D4AF37]' : 'bg-zinc-50 border-zinc-300 focus:border-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Star Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReviewRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Detailed Review</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the fabric quality, waist fit, stitching, and courier speed..."
                    value={newReviewComment}
                    onChange={e => setNewReviewComment(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-[#D4AF37]' : 'bg-zinc-50 border-zinc-300 focus:border-black'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Optional Photo/Media URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newReviewMediaUrl}
                    onChange={e => setNewReviewMediaUrl(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${
                      isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white focus:border-[#D4AF37]' : 'bg-zinc-50 border-zinc-300 focus:border-black'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Submit Verified Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SLIDE-OUT CART DRAWER & CHECKOUT ENGINE
      ======================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div
              className={`w-screen max-w-md border-l flex flex-col shadow-2xl ${
                isDarkMode ? 'bg-[#0F0F0F] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'
              }`}
            >
              {/* Cart Drawer Header */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="font-extrabold uppercase tracking-tight text-lg">Your Luxury Arsenal</h2>
                  <span className="text-xs bg-[#D4AF37] text-black font-bold px-2 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Dynamic Progress Bar */}
              <div className="px-5 py-3 bg-[#171717] border-b border-zinc-800 text-xs">
                <div className="flex justify-between font-bold mb-1.5">
                  <span>Free Express Courier Threshold:</span>
                  <span className="text-[#D4AF37]">
                    {freeDeliveryRemaining === 0 ? 'FREE EXPRESS UNLOCKED! 🚀' : `Add ৳${freeDeliveryRemaining} more`}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-[#D4AF37] h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
                    <p className="text-sm font-semibold text-zinc-400">আপনার শপিং কার্ট খালি!</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 px-6 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-full"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.cartId}
                      className={`p-3 rounded-xl border flex space-x-3 ${
                        isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-lg" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold leading-snug line-clamp-1">{item.title}</h4>
                            <button
                              onClick={() => handleRemoveFromCart(item.cartId)}
                              className="text-zinc-500 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-zinc-400">Size: {item.selectedSize}</span>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-black text-[#D4AF37]">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>

                          {/* Quantity selectors */}
                          <div className="flex items-center space-x-2 bg-zinc-800 rounded-lg px-2 py-0.5">
                            <button
                              onClick={() => handleUpdateQuantity(item.cartId, -1)}
                              className="text-zinc-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-1">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.cartId, 1)}
                              className="text-zinc-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Form & Financial Summary */}
              {cart.length > 0 && (
                <div className={`p-5 border-t ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-300'}`}>
                  {/* Tiered Discount Badge */}
                  {tieredDiscount > 0 && (
                    <div className="mb-3 p-2 bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 text-xs rounded-lg flex justify-between font-bold">
                      <span>Tiered Multi-Buy Discount Applied:</span>
                      <span>-৳{tieredDiscount}</span>
                    </div>
                  )}

                  {/* Mandatory Delivery Selector */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5">
                      Delivery Zone <span className="text-red-400">* (বাধ্যতামূলক)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('Inside Dhaka')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                          deliveryZone === 'Inside Dhaka'
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : isDarkMode
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            : 'bg-white border-zinc-300 text-zinc-800'
                        }`}
                      >
                        Inside Dhaka <br />
                        <span className="text-[10px] font-normal">৳100 Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryZone('Outside Dhaka')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                          deliveryZone === 'Outside Dhaka'
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : isDarkMode
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            : 'bg-white border-zinc-300 text-zinc-800'
                        }`}
                      >
                        Outside Dhaka <br />
                        <span className="text-[10px] font-normal">৳150 Delivery</span>
                      </button>
                    </div>
                  </div>

                  {/* bKash & Nagad Advance Payment Gateway UI */}
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-amber-600/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase">Advance Delivery Charge Gateway</span>
                      <div className="flex space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('bKash')}
                          className={`px-2 py-0.5 text-[10px] font-black rounded ${
                            paymentMethod === 'bKash' ? 'bg-[#D12053] text-white' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          bKash
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Nagad')}
                          className={`px-2 py-0.5 text-[10px] font-black rounded ${
                            paymentMethod === 'Nagad' ? 'bg-[#F7941D] text-white' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          Nagad
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-300 space-y-1 mb-2 bg-black/50 p-2.5 rounded-lg border border-zinc-800">
                      <div className="flex justify-between">
                        <span>{paymentMethod} Send Money Number:</span>
                        <span className="font-mono font-bold text-[#D4AF37]">
                          {paymentMethod === 'bKash' ? '01725037564' : '01827265742'}
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-300/80">
                        ডেলিভারি চার্জ অগ্রিম পাঠাতে এই নম্বরে সেন্ড মানি করুন।
                      </p>
                    </div>

                    {/* Warning Notice Banner */}
                    <div className="text-[10px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-800/60 leading-tight mb-3">
                      ⚠️ নোটিশ: অর্ডার কনফার্ম করার জন্য পেমেন্ট মেথড সিলেক্ট করে ডেলিভারি চার্জ অগ্রিম পাঠিয়ে TrxID প্রদান করুন।
                    </div>

                    {/* Customer Inputs */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="আপনার নাম (Full Name)"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="tel"
                        placeholder="মোবাইল নম্বর (01XXXXXXXXX)"
                        value={customerMobile}
                        onChange={e => setCustomerMobile(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="text"
                        placeholder="সম্পূর্ণ ডেলিভারি ঠিকানা (House, Road, Area)"
                        value={customerAddress}
                        onChange={e => setCustomerAddress(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="text"
                        placeholder="পেমেন্ট TrxID (e.g. BK9X245103)"
                        value={trxId}
                        onChange={e => setTrxId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded bg-zinc-900 border border-amber-500/80 text-amber-300 font-mono focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  {/* Validation Error Notice */}
                  {checkoutError && (
                    <div className="mb-3 p-2 bg-red-950 border border-red-600 text-red-200 text-xs rounded">
                      {checkoutError}
                    </div>
                  )}

                  {/* Financial Total & Place Order Button */}
                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span>৳{cartSubtotal}</span>
                    </div>
                    {tieredDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Tiered Discount</span>
                        <span>-৳{tieredDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Delivery Charge</span>
                      <span>{deliveryZone ? `+৳${deliveryFee}` : 'Select Zone'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-[#D4AF37] pt-2 border-t border-zinc-800">
                      <span>Final Total Payable</span>
                      <span>৳{cartFinalTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckoutSubmit}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F5D061] via-[#D4AF37] to-[#AA7C11] text-black font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#D4AF37]/25"
                  >
                    Confirm Order & Verify Advance Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          INTERACTIVE FIT CALCULATOR & SIZE GUIDE MODAL
      ======================================================== */}
      {isFitCalculatorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsFitCalculatorOpen(false)}
          />

          <div
            className={`relative max-w-lg w-full rounded-2xl border p-6 shadow-2xl z-10 ${
              isDarkMode ? 'bg-[#121212] border-zinc-800 text-white' : 'bg-white border-zinc-200 text-black'
            }`}
          >
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-extrabold uppercase text-lg">AI Sartorial Fit Calculator</h3>
              </div>
              <button onClick={() => setIsFitCalculatorOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-6">
              Enter your physical metrics. Our dynamic Dhaka tailoring algorithm computes your perfect waist fit.
            </p>

            {/* Input sliders */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Height:</span>
                  <span className="text-[#D4AF37]">
                    {fitCalcHeightFt} feet {fitCalcHeightIn} inches
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={fitCalcHeightFt}
                    onChange={e => setFitCalcHeightFt(Number(e.target.value))}
                    className="p-2 rounded bg-zinc-800 text-xs border border-zinc-700 text-white"
                  >
                    {[5, 6].map(ft => (
                      <option key={ft} value={ft}>
                        {ft} Feet
                      </option>
                    ))}
                  </select>
                  <select
                    value={fitCalcHeightIn}
                    onChange={e => setFitCalcHeightIn(Number(e.target.value))}
                    className="p-2 rounded bg-zinc-800 text-xs border border-zinc-700 text-white"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i}>
                        {i} Inches
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Weight:</span>
                  <span className="text-[#D4AF37]">{fitCalcWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="110"
                  value={fitCalcWeightKg}
                  onChange={e => setFitCalcWeightKg(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
              </div>
            </div>

            {/* Algorithmic Output */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-[#D4AF37]/50 text-center mb-6">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Recommended T&I Cut
              </span>
              <div className="text-3xl font-black text-[#D4AF37] my-1">{calculatedSizeRecommendation}</div>
              <p className="text-xs text-zinc-300">Standard Length: 39" - 41" (Tailored for Bangladesh Average Stature)</p>
            </div>

            {/* Official Size Chart Table */}
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-[#D4AF37]">
                    <th className="py-1">Size</th>
                    <th className="py-1">Waist (Inches)</th>
                    <th className="py-1">Thigh (Inches)</th>
                    <th className="py-1">Length</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-1 font-bold text-white">W28</td>
                    <td>28 - 29"</td>
                    <td>22.5"</td>
                    <td>39"</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-1 font-bold text-white">W30</td>
                    <td>30 - 31"</td>
                    <td>23.5"</td>
                    <td>40"</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-1 font-bold text-white">W32</td>
                    <td>32 - 33"</td>
                    <td>24.5"</td>
                    <td>40.5"</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-1 font-bold text-white">W34</td>
                    <td>34 - 35"</td>
                    <td>25.5"</td>
                    <td>41"</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-1 font-bold text-white">W36</td>
                    <td>36 - 37"</td>
                    <td>26.5"</td>
                    <td>41.5"</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold text-white">W38</td>
                    <td>38 - 39"</td>
                    <td>27.5"</td>
                    <td>42"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsFitCalculatorOpen(false)}
              className="mt-6 w-full py-2.5 rounded-lg bg-[#D4AF37] text-black font-extrabold text-xs uppercase"
            >
              Apply Size & Return
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          POST-ORDER CONFIRMATION & WHATSAPP DISPATCH MODAL
      ======================================================== */}
      {isOrderSuccessModalOpen && confirmedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setIsOrderSuccessModalOpen(false)}
          />

          <div
            className={`relative max-w-lg w-full rounded-2xl border p-6 sm:p-8 shadow-2xl z-10 text-center ${
              isDarkMode ? 'bg-[#121212] border-[#D4AF37]/50 text-white' : 'bg-white border-[#D4AF37] text-black'
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
              Order Registered Successfully!
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              আপনার অর্ডারটি সিস্টেমে সংরক্ষিত হয়েছে। আমাদের ডিসপ্যাচ টিম ভেরিফাই করার জন্য প্রস্তুত।
            </p>

            {/* Tracking & Timeline Box */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Order Tracking Code:</span>
                <span className="font-mono font-bold text-[#D4AF37] text-sm">#{confirmedOrder.trackingCode}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Delivery Timeline:</span>
                <span className="text-zinc-200 font-semibold">5 - 6 Days (Dhaka & Nationwide)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Payment TrxID:</span>
                <span className="font-mono text-emerald-400">{confirmedOrder.trxId}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-zinc-800 pt-2 font-bold">
                <span>Total Amount:</span>
                <span className="text-[#D4AF37]">৳{confirmedOrder.total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* WhatsApp Direct Dispatch */}
              <a
                href={`https://wa.me/8801725037564?text=${formatWhatsAppMessage(confirmedOrder)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Dispatch Itemized Receipt via WhatsApp</span>
              </a>

              {/* Client PDF Invoice Generator */}
              <button
                onClick={() => handlePrintOrDownloadInvoice(confirmedOrder)}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 border border-zinc-700 transition-all"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Generate Client PDF Invoice</span>
              </button>

              <button
                onClick={() => setIsOrderSuccessModalOpen(false)}
                className="w-full py-2 text-xs text-zinc-400 hover:text-white"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          HIGH-SECURITY ADMIN PANEL MODAL & DASHBOARD
      ======================================================== */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-lg"
            onClick={() => setIsAdminOpen(false)}
          />

          <div className="relative w-full max-w-5xl rounded-2xl border border-zinc-800 bg-[#0E0E0E] text-white p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider">
                    T&I Executive Command Engine
                  </h2>
                  <p className="text-[10px] text-zinc-400">Dhaka Central Operations & Courier Logistics</p>
                </div>
              </div>
              <button onClick={() => setIsAdminOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High Security Passcode Gateway */}
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold uppercase mb-2">Security Verification Required</h3>
                <p className="text-xs text-zinc-400 mb-6">
                  Enter master administrative passcode to decrypt customer dispatch data and courier logs.
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input
                    type="password"
                    maxLength={10}
                    placeholder="••••"
                    value={adminPin}
                    onChange={e => setAdminPin(e.target.value)}
                    className="w-48 mx-auto text-center tracking-[1em] font-mono text-xl py-2 px-4 rounded-lg bg-zinc-900 border border-zinc-700 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
                  />

                  {adminPinError && (
                    <p className="text-xs text-red-500 font-semibold">{adminPinError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full max-w-xs mx-auto block py-2.5 rounded-lg bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110"
                  >
                    Authenticate Secure Session
                  </button>
                </form>
              </div>
            ) : (
              /* Authenticated Admin Control Room */
              <div className="space-y-8">
                {/* Metrics Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Total Orders</span>
                    <div className="text-2xl font-black text-white">{orders.length}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Gross Revenue</span>
                    <div className="text-2xl font-black text-[#D4AF37]">
                      ৳{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Pending Verification</span>
                    <div className="text-2xl font-black text-amber-400">
                      {orders.filter(o => o.status === 'Pending').length}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Sound Dispatch Bell</span>
                    <button
                      onClick={playCrystalOrderDing}
                      className="mt-1 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold rounded flex items-center space-x-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Test Ding</span>
                    </button>
                  </div>
                </div>

                {/* Courier Filter & CSV Export Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold uppercase">Courier Logistics Filter:</span>
                    <div className="flex space-x-1">
                      {(['All', 'Inside Dhaka', 'Outside Dhaka'] as const).map(zone => (
                        <button
                          key={zone}
                          onClick={() => setAdminCourierFilter(zone)}
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            adminCourierFilter === zone
                              ? 'bg-[#D4AF37] text-black'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {zone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Automated Courier CSV Export formatted for Steadfast, Pathao, RedX */}
                  <button
                    onClick={handleExportCourierCSV}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center space-x-2 transition-all shadow-md"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export Courier CSV (Pathao/Steadfast)</span>
                  </button>
                </div>

                {/* Real-time Order Data Table */}
                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-900 text-[#D4AF37] uppercase font-bold border-b border-zinc-800">
                        <tr>
                          <th className="p-3">Tracking Code</th>
                          <th className="p-3">Customer & Contact</th>
                          <th className="p-3">Zone & Address</th>
                          <th className="p-3">Gateway & TrxID</th>
                          <th className="p-3">Payable</th>
                          <th className="p-3">Status Controller</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-zinc-900/40">
                            <td className="p-3 font-mono font-bold text-[#D4AF37]">#{order.trackingCode}</td>
                            <td className="p-3">
                              <div className="font-bold text-white">{order.customerName}</div>
                              <div className="text-zinc-400">{order.mobile}</div>
                            </td>
                            <td className="p-3 max-w-[200px]">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  order.deliveryZone === 'Inside Dhaka'
                                    ? 'bg-blue-900/50 text-blue-300'
                                    : 'bg-amber-900/50 text-amber-300'
                                }`}
                              >
                                {order.deliveryZone}
                              </span>
                              <div className="text-zinc-400 truncate mt-0.5">{order.address}</div>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-zinc-300">{order.paymentMethod}</span>
                              <div className="font-mono text-emerald-400 font-bold">{order.trxId}</div>
                            </td>
                            <td className="p-3 font-bold text-white">৳{order.total}</td>
                            <td className="p-3">
                              <select
                                value={order.status}
                                onChange={e => {
                                  const newStatus = e.target.value as Order['status'];
                                  setOrders(prev =>
                                    prev.map(o => (o.id === order.id ? { ...o, status: newStatus } : o))
                                  );
                                }}
                                className="bg-zinc-800 border border-zinc-700 text-xs rounded px-2 py-1 text-white focus:outline-none focus:border-[#D4AF37]"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Review Moderation Table */}
                <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40">
                  <h3 className="text-sm font-bold uppercase text-[#D4AF37] mb-3">Customer Review Moderation Grid</h3>
                  <div className="space-y-2">
                    {reviews.map(rev => (
                      <div
                        key={rev.id}
                        className="flex items-center justify-between p-2.5 bg-zinc-900 rounded-lg text-xs"
                      >
                        <div>
                          <span className="font-bold text-white">{rev.customerName}</span> ({rev.rating}★): "{rev.comment}"
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setReviews(prev =>
                                prev.map(r =>
                                  r.id === rev.id ? { ...r, status: r.status === 'approved' ? 'pending' : 'approved' } : r
                                )
                              )
                            }
                            className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                          >
                            {rev.status === 'approved' ? 'Unapprove' : 'Approve'}
                          </button>
                          <button
                            onClick={() => setReviews(prev => prev.filter(r => r.id !== rev.id))}
                            className="px-2 py-1 rounded bg-red-900/60 text-red-300 hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          DYNAMIC FOMO SALES TOAST
      ======================================================== */}
      {currentToast && (
        <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 max-w-sm bg-black/90 border border-[#D4AF37]/50 text-white p-3.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-3 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 font-bold text-xs">
            {currentToast.name[0]}
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">
              {currentToast.name} from <span className="text-[#D4AF37]">{currentToast.location}</span>
            </p>
            <p className="text-zinc-400 text-[11px] truncate max-w-[220px]">Ordered {currentToast.product}</p>
            <span className="text-[10px] text-zinc-500 font-mono">{currentToast.time}</span>
          </div>
        </div>
      )}

      {/* ========================================================
          PINNED FLOATING WHATSAPP SUPPORT WIDGET
      ======================================================== */}
      <a
        href="https://wa.me/8801725037564?text=Hi%20T%26I%20Apparel%20Dhaka%2C%20I%20need%20quick%20support%20with%20my%20order."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 p-3.5 rounded-full bg-[#25D366] text-black shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        title="24/7 WhatsApp Dispatch Concierge"
      >
        <MessageCircle className="w-6 h-6 fill-black" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
          Dhaka Concierge (+8801725037564)
        </span>
      </a>

      {/* ========================================================
          NATIVE MOBILE BOTTOM NAVIGATION BAR
      ======================================================== */}
      <nav
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden border-t backdrop-blur-xl ${
          isDarkMode ? 'bg-[#0D0D0D]/90 border-zinc-800 text-zinc-400' : 'bg-white/90 border-zinc-200 text-zinc-600'
        }`}
      >
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => {
              setActiveCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-[10px] font-bold hover:text-[#D4AF37]"
          >
            <Sparkles className="w-4 h-4 mb-1" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-[10px] font-bold hover:text-[#D4AF37]"
          >
            <Layers className="w-4 h-4 mb-1" />
            <span>Trousers</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center text-[10px] font-bold text-[#D4AF37] relative"
          >
            <ShoppingBag className="w-4 h-4 mb-1" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute top-2 right-4 bg-black text-[#D4AF37] border border-[#D4AF37] rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-black">
                {cartItemCount}
              </span>
            )}
          </button>

          <a
            href="https://wa.me/8801725037564"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center text-[10px] font-bold text-[#25D366]"
          >
            <Phone className="w-4 h-4 mb-1" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex flex-col items-center justify-center text-[10px] font-bold hover:text-white"
          >
            <Lock className="w-4 h-4 mb-1" />
            <span>Admin</span>
          </button>
        </div>
      </nav>

      {/* ========================================================
          LUXURY FOOTER WITH DISCREET ADMIN TRIGGER
      ======================================================== */}
      <footer
        className={`border-t pt-16 pb-24 md:pb-16 ${
          isDarkMode ? 'bg-[#080808] border-zinc-900 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <span className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-white via-[#E2C775] to-[#D4AF37] bg-clip-text text-transparent uppercase">
                T&I APPAREL
              </span>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Dhaka's benchmark in high-calibre menswear. Handcrafted heavy selvedge, modular cargos, and sartorial formal trousers tailored for the relentless.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Concierge</h4>
              <ul className="text-xs space-y-2">
                <li>Direct Dispatch: +8801725037564</li>
                <li>Support Email: ismailfahad202@gmail.com</li>
                <li>Live Hub: Dhaka, Bangladesh</li>
                <li>Hours: 24/7 Order Acceptance Engine</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Accepted Gateways</h4>
              <ul className="text-xs space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#D12053]" />
                  <span>bKash Send Money (01725037564)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#F7941D]" />
                  <span>Nagad Send Money (01827265742)</span>
                </li>
                <li>Courier: Steadfast / Pathao / RedX</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Quality Guarantee</h4>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                Every trouser undergoes high-precision stress testing and is dispatched in a sealed luxury matte box.
              </p>
              <div className="flex items-center space-x-2 text-xs text-[#D4AF37]">
                <Shield className="w-4 h-4" />
                <span>Verified Bangladeshi Craftsmanship</span>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600">
            <p>© 2026 T&I Apparel. Dhaka, Bangladesh. All Rights Reserved.</p>
            <div className="flex items-center space-x-4 mt-3 sm:mt-0">
              {/* Discreet Admin Access trigger */}
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-zinc-400 transition-colors flex items-center space-x-1"
                title="Staff Console"
              >
                <Lock className="w-3 h-3 text-zinc-700 hover:text-zinc-400" />
                <span className="text-[10px] text-zinc-700 hover:text-zinc-400">Staff Portal</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Extra helper component for Layers icon
function Layers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
  }
