"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Book {
  id: string;
  title: string;
  author: string;
  edition?: string;
  price: number;
  condition: "Like New" | "Good" | "Fair" | "Worn";
  rating?: number;
  coverColor?: string;
  category: string;
  sellerId: string;
  sellerName: string;
  sellerRating?: number;
  description: string;
  university: string;
  isbn?: string;
}

export interface CartItem {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  price: number;
  sellerId: string;
  sellerName: string;
  coverColor?: string;
  condition: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  role: "student" | "admin";
  balance: number;
  blocked?: boolean;
}

export interface Order {
  id: string;
  bookId: string;
  bookTitle: string;
  price: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: "Pending" | "Completed" | "Cancelled";
  date: string;
  paymentMethod?: "balance" | "bkash";
  bkashNumber?: string;
}

export interface Message {
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  bookId: string;
  bookTitle: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  messages: Message[];
}

export interface Notification {
  id: string;
  text: string;
  type: "info" | "success" | "alert";
  read: boolean;
  timestamp: string;
}

export interface Report {
  id: string;
  bookId: string;
  bookTitle: string;
  reportedBy: string;
  reason: string;
  status: "Pending" | "Resolved";
  date: string;
}

interface AppContextType {
  currentUser: User | null;
  books: Book[];
  booksLoading: boolean;
  booksError: string;
  wishlist: string[];
  wishlistBooks: Book[];
  wishlistLoading: boolean;
  wishlistError: string;
  cart: CartItem[];
  cartLoading: boolean;
  cartError: string;
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string;
  chats: ChatThread[];
  notifications: Notification[];
  reports: Report[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, university: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshBooks: () => Promise<void>;
  addBook: (book: Omit<Book, "id" | "sellerId" | "sellerName" | "university">) => Promise<{ success: boolean; error?: string; book?: Book }>;
  deleteBook: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (book: Book) => Promise<{ success: boolean; error?: string }>;
  removeFromWishlist: (bookId: string) => Promise<{ success: boolean; error?: string }>;
  toggleWishlist: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshCart: () => Promise<void>;
  addToCart: (book: Book) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (bookId: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  cartTotal: number;
  cartCount: number;
  placeOrder: (bookId: string, paymentMethod?: "balance" | "bkash", bkashNumber?: string) => { success: boolean; error?: string };
  placeCartOrder: (paymentMethod: "balance" | "bkash", bkashNumber?: string) => Promise<{ success: boolean; error?: string; total?: number; count?: number }>;
  refreshOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  completeOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  sendChatMessage: (bookId: string, text: string) => string;
  replyToChatMessage: (threadId: string, text: string) => void;
  markNotificationsRead: () => void;
  addNotification: (text: string, type: "info" | "success" | "alert") => void;
  reportBook: (bookId: string, reason: string) => void;
  resolveReport: (reportId: string) => void;
  deleteBookAdmin: (bookId: string) => void;
  toggleBlockUser: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type ApiUser = {
  id: string;
  name: string;
  email: string;
  university: string;
  role: "STUDENT" | "ADMIN" | string;
  status?: string;
  balance: number;
};

type ApiBook = {
  id: string;
  title: string;
  author: string;
  edition?: string | null;
  price: number;
  condition: string;
  rating?: number | null;
  coverColor?: string | null;
  coverImage?: string | null;
  category: string;
  description: string;
  university: string;
  isbn?: string | null;
  sellerId: string;
  seller?: ApiUser;
};

type ApiCartItem = {
  bookId: string;
  book: ApiBook;
};

type ApiWishlistItem = {
  bookId: string;
  book: ApiBook | null;
};

type ApiOrder = {
  id: string;
  bookId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: string;
  paymentMethod?: string | null;
  bkashNumber?: string | null;
  createdAt: string;
  book?: ApiBook | null;
  buyer?: Pick<ApiUser, "id" | "name" | "email" | "university"> | null;
  seller?: Pick<ApiUser, "id" | "name" | "email" | "university"> | null;
};

function mapApiUser(user: ApiUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    university: user.university,
    role: user.role === "ADMIN" ? "admin" : "student",
    balance: user.balance,
    blocked: user.status === "BLOCKED",
  };
}

async function readApiError(response: Response) {
  try {
    const result = await response.json();
    return typeof result?.error === "string" ? result.error : "Request failed.";
  } catch {
    return "Request failed.";
  }
}

function mapApiBook(book: ApiBook): Book {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    edition: book.edition || undefined,
    price: book.price,
    condition: book.condition as Book["condition"],
    rating: book.rating || undefined,
    coverColor: book.coverColor || undefined,
    category: book.category,
    sellerId: book.sellerId,
    sellerName: book.seller?.name || "Campus Correspondent",
    sellerRating: 5.0,
    description: book.description,
    university: book.university || book.seller?.university || "",
    isbn: book.isbn || undefined,
  };
}

function mapApiCartItem(item: ApiCartItem): CartItem {
  return {
    bookId: item.bookId,
    bookTitle: item.book.title,
    bookAuthor: item.book.author,
    price: item.book.price,
    sellerId: item.book.sellerId,
    sellerName: item.book.seller?.name || "Campus Correspondent",
    coverColor: item.book.coverColor || undefined,
    condition: item.book.condition,
  };
}

function mapApiOrder(order: ApiOrder): Order {
  return {
    id: order.id,
    bookId: order.bookId,
    bookTitle: order.book?.title || "Unavailable Book",
    price: order.price,
    buyerId: order.buyerId,
    buyerName: order.buyer?.name || "Buyer",
    sellerId: order.sellerId,
    sellerName: order.seller?.name || "Seller",
    status:
      order.status === "COMPLETED"
        ? "Completed"
        : order.status === "CANCELLED"
        ? "Cancelled"
        : "Pending",
    date: new Date(order.createdAt).toLocaleDateString(),
    paymentMethod: order.paymentMethod === "BKASH" ? "bkash" : "balance",
    bkashNumber: order.bkashNumber || undefined,
  };
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Derived cart stats
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cart.length;

  const refreshBooks = async () => {
    setBooksLoading(true);
    setBooksError("");
    try {
      const response = await fetch("/api/books", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(await readApiError(response));
      }
      const result = await response.json();
      setBooks((result?.data?.books || []).map(mapApiBook));
    } catch (error) {
      setBooksError(error instanceof Error ? error.message : "Could not load book listings.");
      setBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };

  const refreshCart = async () => {
    setCartLoading(true);
    setCartError("");
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (response.status === 401) {
        setCart([]);
        return;
      }
      if (!response.ok) {
        throw new Error(await readApiError(response));
      }
      const result = await response.json();
      setCart((result?.data?.cart || []).map(mapApiCartItem));
    } catch (error) {
      setCart([]);
      setCartError(error instanceof Error ? error.message : "Could not load your cart.");
    } finally {
      setCartLoading(false);
    }
  };

  const refreshWishlist = async () => {
    setWishlistLoading(true);
    setWishlistError("");
    try {
      const response = await fetch("/api/wishlist", { cache: "no-store" });
      if (response.status === 401) {
        setWishlist([]);
        setWishlistBooks([]);
        return;
      }
      if (!response.ok) {
        throw new Error(await readApiError(response));
      }
      const result = await response.json();
      const items = (result?.data?.wishlist || []) as ApiWishlistItem[];
      const availableBooks = items
        .map((item) => item.book)
        .filter((book): book is ApiBook => Boolean(book))
        .map(mapApiBook);
      setWishlistBooks(availableBooks);
      setWishlist(availableBooks.map((book) => book.id));
    } catch (error) {
      setWishlist([]);
      setWishlistBooks([]);
      setWishlistError(error instanceof Error ? error.message : "Could not load your wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const refreshOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (response.status === 401) {
        setOrders([]);
        return;
      }
      if (!response.ok) {
        throw new Error(await readApiError(response));
      }
      const result = await response.json();
      setOrders(((result?.data?.orders || []) as ApiOrder[]).map(mapApiOrder));
    } catch (error) {
      setOrders([]);
      setOrdersError(error instanceof Error ? error.message : "Could not load your orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Read browser-only state and restore authenticated user from the backend session.
  useEffect(() => {
    setIsClient(true);
    localStorage.removeItem("bb_user");
    fetch("/api/auth/me")
      .then(async (response) => {
        if (!response.ok) return null;
        const result = await response.json();
        return result?.data?.user ? mapApiUser(result.data.user) : null;
      })
      .then((user) => {
        setCurrentUser(user);
        if (user) {
          refreshCart();
          refreshWishlist();
          refreshOrders();
        } else {
          setCart([]);
          setCartLoading(false);
          setOrders([]);
          setOrdersLoading(false);
          setWishlist([]);
          setWishlistBooks([]);
          setWishlistLoading(false);
        }
      })
      .catch(() => {
        setCurrentUser(null);
        setCart([]);
        setCartLoading(false);
        setOrders([]);
        setOrdersLoading(false);
        setWishlist([]);
        setWishlistBooks([]);
        setWishlistLoading(false);
      });
    localStorage.removeItem("bb_books");
    localStorage.removeItem("bb_cart");
    localStorage.removeItem("bb_wishlist");
    localStorage.removeItem("bb_orders");
    refreshBooks();
    const storedChats = localStorage.getItem("bb_chats");
    if (storedChats) {
      setChats(JSON.parse(storedChats));
    }
    const storedNotifications = localStorage.getItem("bb_notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Mock initial notifications
      const initNotes: Notification[] = [
        {
          id: "n1",
          text: "Welcome to BookBazar! Search or upload books to get started.",
          type: "info",
          read: false,
          timestamp: new Date().toLocaleDateString(),
        }
      ];
      setNotifications(initNotes);
      localStorage.setItem("bb_notifications", JSON.stringify(initNotes));
    }
    const storedReports = localStorage.getItem("bb_reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  // Save utility
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    const result = await response.json();
    const user = mapApiUser(result.data.user);
    setCurrentUser(user);
    await refreshCart();
    await refreshWishlist();
    await refreshOrders();
    addNotification(`Logged in successfully as ${user.name}!`, "success");
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    university: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, university, password }),
    });

    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    const result = await response.json();
    const user = mapApiUser(result.data.user);
    setCurrentUser(user);
    await refreshCart();
    await refreshWishlist();
    await refreshOrders();
    addNotification(`Welcome ${user.name}! Your student account is active.`, "success");
    return { success: true };
  };

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setCurrentUser(null);
    setCart([]);
    setCartError("");
    setCartLoading(false);
    setOrders([]);
    setOrdersError("");
    setOrdersLoading(false);
    setWishlist([]);
    setWishlistBooks([]);
    setWishlistError("");
    setWishlistLoading(false);
    localStorage.removeItem("bb_user");
    localStorage.removeItem("bb_cart");
    localStorage.removeItem("bb_wishlist");
    localStorage.removeItem("bb_orders");
    addNotification("Logged out successfully.", "info");
  };

  const addBook = async (newBookData: Omit<Book, "id" | "sellerId" | "sellerName" | "university">) => {
    if (!currentUser) return { success: false, error: "You must be logged in to upload a book." };

    const response = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBookData),
    });

    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    const result = await response.json();
    const book = mapApiBook(result.data.book);
    setBooks((current) => [book, ...current.filter((item) => item.id !== book.id)]);
    addNotification(`Book "${book.title}" listed successfully!`, "success");
    return { success: true, book };
  };

  const deleteBook = async (id: string) => {
    const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    setBooks((current) => current.filter((b) => b.id !== id));
    addNotification("Listing removed successfully.", "info");
    return { success: true };
  };

  const addToWishlist = async (book: Book): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      addNotification("Please sign in to bookmark books.", "alert");
      return { success: false, error: "Please sign in to bookmark books." };
    }
    if (currentUser.id === book.sellerId) {
      addNotification("You cannot bookmark your own listing.", "alert");
      return { success: false, error: "You cannot bookmark your own listing." };
    }
    if (!wishlist.includes(book.id)) {
      setWishlist((current) => [...current, book.id]);
      setWishlistBooks((current) => [book, ...current.filter((item) => item.id !== book.id)]);
    }

    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: book.id }),
    });

    if (!response.ok && response.status !== 409) {
      const error = await readApiError(response);
      await refreshWishlist();
      addNotification(error, "alert");
      return { success: false, error };
    }

    await refreshWishlist();
    if (response.status !== 409) {
      addNotification(`"${book.title}" added to bookmarks!`, "success");
    }
    return { success: true };
  };

  const removeFromWishlist = async (bookId: string): Promise<{ success: boolean; error?: string }> => {
    setWishlist((current) => current.filter((item) => item !== bookId));
    setWishlistBooks((current) => current.filter((book) => book.id !== bookId));

    const response = await fetch(`/api/wishlist/${bookId}`, { method: "DELETE" });
    if (!response.ok) {
      const error = await readApiError(response);
      await refreshWishlist();
      addNotification(error, "alert");
      return { success: false, error };
    }

    await refreshWishlist();
    return { success: true };
  };

  const toggleWishlist = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const book = books.find((item) => item.id === id) || wishlistBooks.find((item) => item.id === id);
    if (!book) {
      addNotification("Book not found.", "alert");
      return { success: false, error: "Book not found." };
    }

    if (wishlist.includes(id)) {
      return removeFromWishlist(id);
    }

    return addToWishlist(book);
  };

  // ─── Cart Methods ───────────────────────────────────────────────────────────
  const addToCart = async (book: Book): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Please sign in to add items to your cart." };
    }
    if (currentUser.id === book.sellerId) {
      return { success: false, error: "You cannot add your own listing to cart." };
    }
    if (cart.find((c) => c.bookId === book.id)) {
      return { success: false, error: "This book is already in your cart." };
    }

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: book.id }),
    });

    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    await refreshCart();
    addNotification(`"${book.title}" added to cart!`, "success");
    return { success: true };
  };

  const removeFromCart = async (bookId: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`/api/cart/${bookId}`, { method: "DELETE" });
    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    await refreshCart();
    return { success: true };
  };

  const clearCart = async (): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch("/api/cart", { method: "DELETE" });
    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    setCart([]);
    return { success: true };
  };

  // ─── Order Methods ─────────────────────────────────────────────────────────
  const placeOrder = (
    bookId: string,
    paymentMethod: "balance" | "bkash" = "balance",
    bkashNumber?: string
  ): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: "Please log in to purchase books." };
    }

    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) {
      return { success: false, error: "Book not found." };
    }

    if (currentUser.id === targetBook.sellerId) {
      return { success: false, error: "You cannot purchase your own listed book." };
    }

    if (paymentMethod === "balance" && currentUser.balance < targetBook.price && currentUser.role !== "admin") {
      return { success: false, error: `Insufficient funds. Cost is ৳${targetBook.price}, you have ৳${currentUser.balance}.` };
    }

    if (paymentMethod === "bkash" && (!bkashNumber || bkashNumber.length < 11)) {
      return { success: false, error: "Please enter a valid bKash number (11 digits)." };
    }

    // Deduct balance if paying with balance
    if (paymentMethod === "balance") {
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance - targetBook.price,
      };
      setCurrentUser(updatedUser);
      saveState("bb_user", updatedUser);
    }

    // Create Order
    const newOrder: Order = {
      id: "ord_" + Date.now(),
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      price: targetBook.price,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: targetBook.sellerId,
      sellerName: targetBook.sellerName,
      status: "Pending",
      date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod,
      bkashNumber: paymentMethod === "bkash" ? bkashNumber : undefined,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveState("bb_orders", updatedOrders);

    // Remove book from catalog
    const updatedBooks = books.filter((b) => b.id !== bookId);
    setBooks(updatedBooks);

    removeFromWishlist(bookId).catch(() => undefined);

    // Remove from cart if present
    if (cart.find((c) => c.bookId === bookId)) {
      const updatedCart = cart.filter((c) => c.bookId !== bookId);
      setCart(updatedCart);
      fetch(`/api/cart/${bookId}`, { method: "DELETE" }).catch(() => undefined);
    }

    const paymentLabel = paymentMethod === "bkash" ? `via bKash (${bkashNumber})` : "from wallet balance";
    addNotification(`Successfully bought "${targetBook.title}" for ৳${targetBook.price} ${paymentLabel}!`, "success");

    return { success: true };
  };

  const placeCartOrder = async (
    paymentMethod: "balance" | "bkash",
    bkashNumber?: string
  ): Promise<{ success: boolean; error?: string; total?: number; count?: number }> => {
    if (!currentUser) {
      return { success: false, error: "Please log in to checkout." };
    }
    if (cart.length === 0) {
      return { success: false, error: "Your cart is empty." };
    }

    if (paymentMethod === "bkash" && (!bkashNumber || bkashNumber.length < 11)) {
      return { success: false, error: "Please enter a valid bKash number (11 digits)." };
    }

    if (paymentMethod === "balance" && currentUser.balance < cartTotal && currentUser.role !== "admin") {
      return { success: false, error: `Insufficient funds. Cart total is ৳${cartTotal}, you have ৳${currentUser.balance}.` };
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod,
        bkashNumber: paymentMethod === "bkash" ? bkashNumber : undefined,
      }),
    });

    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    const result = await response.json();
    const total = Number(result?.data?.total ?? cartTotal);
    const count = Array.isArray(result?.data?.orders) ? result.data.orders.length : cart.length;

    if (paymentMethod === "balance" && currentUser.role !== "admin") {
      setCurrentUser((user) => user ? { ...user, balance: user.balance - total } : user);
    }

    await refreshCart();
    await refreshBooks();
    await refreshOrders();

    const paymentLabel = paymentMethod === "bkash" ? `via dummy bKash (${bkashNumber})` : "from wallet balance";
    addNotification(`Order placed for ${count} book(s) totalling ৳${total} ${paymentLabel}!`, "success");

    return { success: true, total, count };
  };

  const cancelOrder = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`/api/orders/${orderId}/cancel`, { method: "PATCH" });
    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    await refreshOrders();
    await refreshBooks();
    await refreshCart();
    addNotification("Order was cancelled.", "info");
    return { success: true };
  };

  const completeOrder = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
    const response = await fetch(`/api/orders/${orderId}/complete`, { method: "PATCH" });
    if (!response.ok) {
      return { success: false, error: await readApiError(response) };
    }

    await refreshOrders();
    addNotification("Order marked as completed and finalized!", "success");
    return { success: true };
  };

  const sendChatMessage = (bookId: string, text: string): string => {
    if (!currentUser) return "";

    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) return "";

    const existingThread = chats.find(
      (c) => c.bookId === bookId && c.buyerId === currentUser.id
    );

    const newMessage: Message = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let threadId = "";

    if (existingThread) {
      threadId = existingThread.id;
      const updatedChats = chats.map((c) => {
        if (c.id === existingThread.id) {
          return {
            ...c,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      });
      setChats(updatedChats);
      saveState("bb_chats", updatedChats);
    } else {
      threadId = "ch_" + Date.now();
      const newThread: ChatThread = {
        id: threadId,
        bookId: targetBook.id,
        bookTitle: targetBook.title,
        sellerId: targetBook.sellerId,
        sellerName: targetBook.sellerName,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        messages: [newMessage],
      };
      const updatedChats = [...chats, newThread];
      setChats(updatedChats);
      saveState("bb_chats", updatedChats);
    }

    addNotification(`Sent message to ${targetBook.sellerName} regarding "${targetBook.title}"`, "info");
    return threadId;
  };

  const replyToChatMessage = (threadId: string, text: string) => {
    if (!currentUser) return;

    const thread = chats.find((c) => c.id === threadId);
    if (!thread) return;

    const newMessage: Message = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChats = chats.map((c) => {
      if (c.id === threadId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
        };
      }
      return c;
    });

    setChats(updatedChats);
    saveState("bb_chats", updatedChats);
  };

  const addNotification = (text: string, type: "info" | "success" | "alert") => {
    const newNote: Notification = {
      id: "note_" + Date.now(),
      text,
      type,
      read: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => {
      const updated = [newNote, ...prev];
      saveState("bb_notifications", updated);
      return updated;
    });
  };

  const markNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveState("bb_notifications", updated);
  };

  const reportBook = (bookId: string, reason: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const newReport: Report = {
      id: "rep_" + Date.now(),
      bookId,
      bookTitle: book.title,
      reportedBy: currentUser ? currentUser.name : "Anonymous Student",
      reason,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    saveState("bb_reports", updated);
    addNotification(`Reported listing "${book.title}" to editorial moderation.`, "alert");
  };

  const resolveReport = (reportId: string) => {
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        return { ...r, status: "Resolved" as const };
      }
      return r;
    });
    setReports(updated);
    saveState("bb_reports", updated);
    addNotification("Editorial report resolved.", "info");
  };

  const deleteBookAdmin = (bookId: string) => {
    const updatedBooks = books.filter((b) => b.id !== bookId);
    setBooks(updatedBooks);

    const updatedReports = reports.map((r) => {
      if (r.bookId === bookId) {
        return { ...r, status: "Resolved" as const };
      }
      return r;
    });
    setReports(updatedReports);
    saveState("bb_reports", updatedReports);
    addNotification(`Admin removed listing ID: ${bookId}.`, "alert");
  };

  const toggleBlockUser = (email: string) => {
    addNotification(`User status updated for ${email}`, "alert");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        books,
        booksLoading,
        booksError,
        wishlist,
        wishlistBooks,
        wishlistLoading,
        wishlistError,
        cart,
        cartLoading,
        cartError,
        orders,
        ordersLoading,
        ordersError,
        chats,
        notifications,
        reports,
        login,
        register,
        logout,
        refreshBooks,
        addBook,
        deleteBook,
        refreshWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        refreshCart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        placeOrder,
        placeCartOrder,
        refreshOrders,
        cancelOrder,
        completeOrder,
        sendChatMessage,
        replyToChatMessage,
        markNotificationsRead,
        addNotification,
        reportBook,
        resolveReport,
        deleteBookAdmin,
        toggleBlockUser,
      }}
    >
      {isClient && children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
}
