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
  ArrowRight,
  Eye,
  FileText,
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

// Full React Application Component Code continues below...
