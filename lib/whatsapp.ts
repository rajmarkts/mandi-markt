import { formatCurrency, formatDate } from "./utils";

interface CartItem {
  productName: string;
  variant: {
    unit_name: string;
    price: number;
    unit_weight_kg?: number | null;
  };
  quantity: number;
}

interface OrderDetails {
  retailerName: string;
  retailerShop: string;
  wholesalerName: string;
  wholesalerPhone: string;
  items: CartItem[];
  totalAmount: number;
  orderId?: string;
  notes?: string;
}

/**
 * Generate a clean, formatted WhatsApp order message
 */
export function generateWhatsAppMessage(order: OrderDetails): string {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Header
  let message = `🛒 *NEW ORDER - Kirana Mandi*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Order ID if available
  if (order.orderId) {
    message += `📋 Order #: ${order.orderId}\n`;
  }
  
  // From/To
  message += `👤 From: ${order.retailerName}\n`;
  if (order.retailerShop) {
    message += `🏪 Shop: ${order.retailerShop}\n`;
  }
  message += `📅 Date: ${formatDate(new Date())}\n\n`;
  
  // Items
  message += `*ORDER ITEMS*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  
  order.items.forEach((item, index) => {
    const itemTotal = item.variant.price * item.quantity;
    message += `\n${index + 1}. *${item.productName}*\n`;
    message += `   ${item.variant.unit_name} x ${item.quantity}\n`;
    message += `   💰 ${formatCurrency(item.variant.price)} each = *${formatCurrency(itemTotal)}*\n`;
    
    // Show per-kg price if available
    if (item.variant.unit_weight_kg && item.variant.unit_weight_kg > 0) {
      const perKg = item.variant.price / item.variant.unit_weight_kg;
      message += `   📊 ₹${perKg.toFixed(2)}/kg\n`;
    }
  });
  
  // Total
  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL: ${formatCurrency(order.totalAmount)}*\n`;
  message += `📦 Items: ${totalItems}\n`;
  
  // Payment method
  message += `\n💳 Payment: Cash on Delivery / Khata\n`;
  
  // Notes
  if (order.notes) {
    message += `\n📝 Notes: ${order.notes}\n`;
  }
  
  // Footer
  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📱 Sent via Kirana Mandi\n`;
  message += `✅ Please confirm availability`;
  
  return message;
}

/**
 * Open WhatsApp with the order message
 * Returns true if successfully opened, false otherwise
 */
export function sendOrderViaWhatsApp(order: OrderDetails): boolean {
  try {
    const message = generateWhatsAppMessage(order);
    const encodedMessage = encodeURIComponent(message);
    
    // Clean phone number (remove +, spaces, dashes)
    const cleanPhone = order.wholesalerPhone.replace(/[^\d]/g, "");
    
    // WhatsApp URL scheme
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Open in new tab/window
    window.open(whatsappUrl, "_blank");
    
    return true;
  } catch (error) {
    console.error("Failed to open WhatsApp:", error);
    return false;
  }
}

/**
 * Generate a short order summary for quick sharing
 */
export function generateShortOrderSummary(items: CartItem[], total: number): string {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemList = items.map(item => 
    `${item.productName} (${item.variant.unit_name}) x${item.quantity}`
  ).join(", ");
  
  return `Order: ${itemList}. Total: ${formatCurrency(total)} (${itemCount} items)`;
}
