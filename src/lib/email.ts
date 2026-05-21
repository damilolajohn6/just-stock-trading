import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

// Initialize Resend Client
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Currency Formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
};

// Base HTML layout template (advanced, premium, modern 2026 design system)
const getEmailLayout = (title: string, bodyContent: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #f9fafb;
            padding: 40px 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid #f3f4f6;
          }
          .header {
            background-color: #111827;
            padding: 32px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.025em;
          }
          .content {
            padding: 40px 32px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #f3f4f6;
          }
          .footer p {
            font-size: 13px;
            color: #6b7280;
            margin: 0 0 8px 0;
            line-height: 1.5;
          }
          .footer a {
            color: #111827;
            text-decoration: underline;
            font-weight: 500;
          }
          .btn {
            display: inline-block;
            background-color: #111827;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 16px;
            text-align: center;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .badge-confirmed {
            background-color: #dcfce7;
            color: #15803d;
          }
          .badge-shipped {
            background-color: #dbeafe;
            color: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>THRIFT MARKETPLACE</h1>
            </div>
            <div class="content">
              ${bodyContent}
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Thrift Marketplace. All rights reserved.</p>
              <p>Need support? Contact us at <a href="mailto:support@thriftmarketplace.com">support@thriftmarketplace.com</a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Fetch complete order details using the admin supabase client (bypasses RLS)
 */
async function getOrderDetailsForEmail(orderId: string) {
  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      user:profiles (
        email,
        full_name
      ),
      items:order_items (
        id,
        quantity,
        unit_price,
        total_price,
        product_snapshot
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    console.error("Error fetching order details for email:", error);
    return null;
  }

  return order;
}

/**
 * Sends order confirmation email to user
 */
export async function sendOrderConfirmationEmail(orderId: string): Promise<boolean> {
  try {
    const order = await getOrderDetailsForEmail(orderId);
    if (!order) return false;

    const userEmail = (order.user as any)?.email;
    const userName = (order.user as any)?.full_name || "Valued Customer";

    if (!userEmail) {
      console.warn(`No email found for order user on order ID ${orderId}`);
      return false;
    }

    const itemsHtml = (order.items as any[]).map((item) => {
      const snapshot = item.product_snapshot as any;
      const sizeStr = snapshot?.size ? `Size: ${snapshot.size}` : "";
      const colorStr = snapshot?.color ? `Color: ${snapshot.color}` : "";
      const variantStr = [sizeStr, colorStr].filter(Boolean).join(", ");
      
      return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #f3f4f6; text-align: left;">
            <div style="font-weight: 600; color: #111827; font-size: 15px;">${snapshot?.name || "Product Item"}</div>
            ${variantStr ? `<div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${variantStr}</div>` : ""}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #f3f4f6; text-align: center; color: #4b5563; font-size: 14px;">
            ${item.quantity}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #111827; font-size: 15px;">
            ${formatCurrency(item.total_price)}
          </td>
        </tr>
      `;
    }).join("");

    const shippingAddress = order.shipping_address as any;
    const addressHtml = shippingAddress
      ? `
        <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
          <strong>${shippingAddress.first_name} ${shippingAddress.last_name}</strong><br>
          ${shippingAddress.address_line1}<br>
          ${shippingAddress.address_line2 ? `${shippingAddress.address_line2}<br>` : ""}
          ${shippingAddress.city}, ${shippingAddress.postal_code}<br>
          ${shippingAddress.country}
        </p>
      `
      : "Not provided";

    const bodyContent = `
      <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 8px;">Order Confirmed!</h2>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.5; margin-top: 0; margin-bottom: 24px;">
        Hi ${userName},<br>
        Thank you for shopping with us! Your payment was successful, and we are preparing your order.
      </p>

      <!-- Order Metadata Card -->
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #f3f4f6; margin-bottom: 32px;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; padding-bottom: 8px;">Order Number:</td>
            <td style="text-align: right; font-weight: 600; color: #111827; padding-bottom: 8px;">#${order.order_number}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 8px;">Date:</td>
            <td style="text-align: right; color: #111827; padding-bottom: 8px;">${new Date(order.created_at).toLocaleDateString("en-GB", { dateStyle: "medium" })}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 8px;">Payment Status:</td>
            <td style="text-align: right; padding-bottom: 8px;">
              <span class="badge badge-confirmed">Paid</span>
            </td>
          </tr>
          <tr>
            <td style="color: #6b7280;">Payment Method:</td>
            <td style="text-align: right; text-transform: capitalize; color: #111827;">${order.payment_method}</td>
          </tr>
        </table>
      </div>

      <!-- Order Items -->
      <h3 style="font-size: 16px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr>
            <th style="padding-bottom: 12px; text-align: left; font-size: 12px; font-weight: 700; color: #6b7280; border-bottom: 2px solid #f3f4f6; text-transform: uppercase;">Item</th>
            <th style="padding-bottom: 12px; text-align: center; font-size: 12px; font-weight: 700; color: #6b7280; border-bottom: 2px solid #f3f4f6; text-transform: uppercase;">Qty</th>
            <th style="padding-bottom: 12px; text-align: right; font-size: 12px; font-weight: 700; color: #6b7280; border-bottom: 2px solid #f3f4f6; text-transform: uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Order Totals -->
      <div style="width: 100%; max-width: 280px; margin-left: auto; margin-bottom: 32px;">
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr>
            <td style="color: #6b7280; padding: 6px 0;">Subtotal:</td>
            <td style="text-align: right; color: #111827; padding: 6px 0;">${formatCurrency(order.subtotal)}</td>
          </tr>
          ${order.discount > 0 ? `
          <tr>
            <td style="color: #15803d; padding: 6px 0;">Discount:</td>
            <td style="text-align: right; color: #15803d; padding: 6px 0;">-${formatCurrency(order.discount)}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="color: #6b7280; padding: 6px 0;">Shipping:</td>
            <td style="text-align: right; color: #111827; padding: 6px 0;">${order.shipping_cost === 0 ? "Free" : formatCurrency(order.shipping_cost)}</td>
          </tr>
          <tr style="border-top: 1px solid #f3f4f6;">
            <td style="font-weight: 700; color: #111827; padding: 12px 0 0 0; font-size: 16px;">Total:</td>
            <td style="text-align: right; font-weight: 700; color: #111827; padding: 12px 0 0 0; font-size: 18px;">${formatCurrency(order.total)}</td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; margin-bottom: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Address</h3>
        ${addressHtml}
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" class="btn">View Order Details</a>
      </div>
    `;

    const html = getEmailLayout(`Order Confirmation #${order.order_number}`, bodyContent);

    if (resend) {
      const response = await resend.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: `Order Confirmation: #${order.order_number}`,
        html,
      });

      if (response.error) {
        console.error("Resend send error:", response.error);
        return false;
      }
      
      console.log(`Order confirmation email sent to ${userEmail} via Resend`);
      return true;
    } else {
      console.log("\n================ [MOCK EMAIL SERVICE] ================");
      console.log(`To: ${userEmail}`);
      console.log(`Subject: Order Confirmation: #${order.order_number}`);
      console.log(`Body (Truncated):`);
      console.log(`Hi ${userName}, thank you for your order #${order.order_number} of total ${formatCurrency(order.total)}.`);
      console.log("====================================================\n");
      return true;
    }
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
}

/**
 * Sends order status update email to user (e.g. Shipped, Out for Delivery)
 */
export async function sendOrderStatusUpdateEmail(
  orderId: string,
  newStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
): Promise<boolean> {
  try {
    const order = await getOrderDetailsForEmail(orderId);
    if (!order) return false;

    const userEmail = (order.user as any)?.email;
    const userName = (order.user as any)?.full_name || "Valued Customer";

    if (!userEmail) {
      console.warn(`No email found for order user on order ID ${orderId}`);
      return false;
    }

    let statusTitle = "Order Updated";
    let statusText = `Your order status has been updated to: ${newStatus}.`;
    let badgeClass = "badge-confirmed";

    switch (newStatus) {
      case "confirmed":
        statusTitle = "Order Confirmed!";
        statusText = "Your order has been confirmed and we are preparing the items.";
        badgeClass = "badge-confirmed";
        break;
      case "processing":
        statusTitle = "Order in Processing";
        statusText = "Our team is currently sorting and packing your items.";
        badgeClass = "badge-confirmed";
        break;
      case "shipped":
        statusTitle = "Order Shipped!";
        statusText = "Exciting news! Your package has been handed over to the courier and is on its way to you.";
        badgeClass = "badge-shipped";
        break;
      case "delivered":
        statusTitle = "Order Delivered!";
        statusText = "Your order has been successfully delivered. We hope you love your thrifted finds!";
        badgeClass = "badge-confirmed";
        break;
      case "cancelled":
        statusTitle = "Order Cancelled";
        statusText = "Your order has been cancelled. If this was a mistake, please reach out to our team.";
        badgeClass = "badge-cancelled";
        break;
    }

    const bodyContent = `
      <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 8px;">${statusTitle}</h2>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.5; margin-top: 0; margin-bottom: 24px;">
        Hi ${userName},<br>
        We have an update regarding your order <strong>#${order.order_number}</strong>.
      </p>

      <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; border: 1px solid #f3f4f6; text-align: center; margin-bottom: 32px;">
        <span class="badge ${badgeClass}" style="padding: 6px 16px; font-size: 14px; margin-bottom: 12px;">${newStatus}</span>
        <p style="font-size: 15px; color: #1f2937; line-height: 1.5; font-weight: 500; margin: 0;">
          ${statusText}
        </p>
      </div>

      <div style="border-top: 1px solid #f3f4f6; padding-top: 24px; margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #6b7280; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Order Details</h3>
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="color: #6b7280; padding-bottom: 8px;">Order:</td>
            <td style="text-align: right; font-weight: 600; color: #111827; padding-bottom: 8px;">#${order.order_number}</td>
          </tr>
          <tr>
            <td style="color: #6b7280;">Total amount:</td>
            <td style="text-align: right; font-weight: 600; color: #111827;">${formatCurrency(order.total)}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}" class="btn">Track Your Order</a>
      </div>
    `;

    const html = getEmailLayout(statusTitle, bodyContent);

    if (resend) {
      const response = await resend.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: `Update on Order #${order.order_number}: ${statusTitle}`,
        html,
      });

      if (response.error) {
        console.error("Resend send error:", response.error);
        return false;
      }

      console.log(`Order status update email sent to ${userEmail} via Resend`);
      return true;
    } else {
      console.log("\n================ [MOCK EMAIL SERVICE] ================");
      console.log(`To: ${userEmail}`);
      console.log(`Subject: Update on Order #${order.order_number}: ${statusTitle}`);
      console.log(`Body (Truncated):`);
      console.log(`Hi ${userName}, order #${order.order_number} status updated to ${newStatus}.`);
      console.log("====================================================\n");
      return true;
    }
  } catch (error) {
    console.error("Error sending order status email:", error);
    return false;
  }
}

/**
 * Sends welcome email to new users
 */
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  try {
    const bodyContent = `
      <h2 style="font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 8px;">Welcome to Thrift Marketplace!</h2>
      <p style="font-size: 15px; color: #4b5563; line-height: 1.5; margin-top: 0; margin-bottom: 24px;">
        Hi ${userName},<br>
        We're thrilled to have you here. Your account has been successfully created.
      </p>

      <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
        Thrift Marketplace is your home for high-quality vintage, second-hand clothing, and bulk kilo bundles. By shopping with us, you are not only saving money but also making an eco-friendly choice to support sustainable fashion!
      </p>

      <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; border: 1px solid #f3f4f6; margin-bottom: 32px;">
        <h4 style="font-size: 14px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 8px;">Here's what you can do next:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563; line-height: 1.6;">
          <li style="margin-bottom: 8px;">Browse our unique items and kilo sales.</li>
          <li style="margin-bottom: 8px;">Save items to your wishlist for later.</li>
          <li style="margin-bottom: 0;">Add shipping addresses for a faster checkout.</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" class="btn">Start Shopping</a>
      </div>
    `;

    const html = getEmailLayout("Welcome to Thrift Marketplace", bodyContent);

    if (resend) {
      const response = await resend.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: "Welcome to Thrift Marketplace!",
        html,
      });

      if (response.error) {
        console.error("Resend send error:", response.error);
        return false;
      }

      console.log(`Welcome email sent to ${userEmail} via Resend`);
      return true;
    } else {
      console.log("\n================ [MOCK EMAIL SERVICE] ================");
      console.log(`To: ${userEmail}`);
      console.log(`Subject: Welcome to Thrift Marketplace!`);
      console.log(`Body (Truncated):`);
      console.log(`Hi ${userName}, welcome to Thrift Marketplace!`);
      console.log("====================================================\n");
      return true;
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}
