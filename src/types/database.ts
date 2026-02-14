export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: "user" | "admin";
          is_blocked: boolean;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          is_blocked?: boolean;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          is_blocked?: boolean;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          brand: string | null;
          category_id: string;
          price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          sku: string | null;
          barcode: string | null;
          weight: number | null;
          weight_unit: "kg" | "lb" | "g" | "oz";
          condition: "new" | "like_new" | "good" | "fair";
          material: string | null;
          color: string | null;
          is_featured: boolean;
          is_trending: boolean;
          is_published: boolean;
          meta_title: string | null;
          meta_description: string | null;
          tags: string[];
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          brand?: string | null;
          category_id: string;
          price: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          weight?: number | null;
          weight_unit?: "kg" | "lb" | "g" | "oz";
          condition?: "new" | "like_new" | "good" | "fair";
          material?: string | null;
          color?: string | null;
          is_featured?: boolean;
          is_trending?: boolean;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          tags?: string[];
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          brand?: string | null;
          category_id?: string;
          price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          weight?: number | null;
          weight_unit?: "kg" | "lb" | "g" | "oz";
          condition?: "new" | "like_new" | "good" | "fair";
          material?: string | null;
          color?: string | null;
          is_featured?: boolean;
          is_trending?: boolean;
          is_published?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          tags?: string[];
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          public_id: string;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          public_id: string;
          alt_text?: string | null;
          width?: number | null;
          height?: number | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          public_id?: string;
          alt_text?: string | null;
          width?: number | null;
          height?: number | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          color: string | null;
          sku: string | null;
          price_adjustment: number;
          stock_quantity: number;
          low_stock_threshold: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size: string;
          color?: string | null;
          sku?: string | null;
          price_adjustment?: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          size?: string;
          color?: string | null;
          sku?: string | null;
          price_adjustment?: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          payment_status: "pending" | "paid" | "failed" | "refunded";
          payment_method: "stripe" | "paystack";
          payment_id: string | null;
          payment_intent_id: string | null;
          subtotal: number;
          shipping_cost: number;
          tax: number;
          discount: number;
          total: number;
          currency: string;
          shipping_address: Json;
          billing_address: Json | null;
          shipping_method: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          notes: string | null;
          internal_notes: string | null;
          coupon_code: string | null;
          coupon_discount: number | null;
          paid_at: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          refunded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_method: "stripe" | "paystack";
          payment_id?: string | null;
          payment_intent_id?: string | null;
          subtotal: number;
          shipping_cost?: number;
          tax?: number;
          discount?: number;
          total: number;
          currency?: string;
          shipping_address: Json;
          billing_address?: Json | null;
          shipping_method?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          internal_notes?: string | null;
          coupon_code?: string | null;
          coupon_discount?: number | null;
          paid_at?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          refunded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          status?:
            | "pending"
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_method?: "stripe" | "paystack";
          payment_id?: string | null;
          payment_intent_id?: string | null;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          discount?: number;
          total?: number;
          currency?: string;
          shipping_address?: Json;
          billing_address?: Json | null;
          shipping_method?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          internal_notes?: string | null;
          coupon_code?: string | null;
          coupon_discount?: number | null;
          paid_at?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          refunded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          product_snapshot: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          product_snapshot?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          first_name: string;
          last_name: string;
          company: string | null;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          phone: string | null;
          is_default: boolean;
          is_billing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string | null;
          first_name: string;
          last_name: string;
          company?: string | null;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          phone?: string | null;
          is_default?: boolean;
          is_billing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string | null;
          first_name?: string;
          last_name?: string;
          company?: string | null;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          phone?: string | null;
          is_default?: boolean;
          is_billing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          content: string | null;
          is_verified_purchase: boolean;
          is_approved: boolean;
          is_featured: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          order_id?: string | null;
          rating: number;
          title?: string | null;
          content?: string | null;
          is_verified_purchase?: boolean;
          is_approved?: boolean;
          is_featured?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          order_id?: string | null;
          rating?: number;
          title?: string | null;
          content?: string | null;
          is_verified_purchase?: boolean;
          is_approved?: boolean;
          is_featured?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: "percentage" | "fixed" | "free_shipping";
          value: number;
          min_purchase: number | null;
          max_discount: number | null;
          max_uses: number | null;
          max_uses_per_user: number | null;
          used_count: number;
          applies_to_categories: string[];
          applies_to_products: string[];
          starts_at: string | null;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: "percentage" | "fixed" | "free_shipping";
          value: number;
          min_purchase?: number | null;
          max_discount?: number | null;
          max_uses?: number | null;
          max_uses_per_user?: number | null;
          used_count?: number;
          applies_to_categories?: string[];
          applies_to_products?: string[];
          starts_at?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: "percentage" | "fixed" | "free_shipping";
          value?: number;
          min_purchase?: number | null;
          max_discount?: number | null;
          max_uses?: number | null;
          max_uses_per_user?: number | null;
          used_count?: number;
          applies_to_categories?: string[];
          applies_to_products?: string[];
          starts_at?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupon_usage: {
        Row: {
          id: string;
          coupon_id: string;
          user_id: string;
          order_id: string | null;
          used_at: string;
        };
        Insert: {
          id?: string;
          coupon_id: string;
          user_id: string;
          order_id?: string | null;
          used_at?: string;
        };
        Update: {
          id?: string;
          coupon_id?: string;
          user_id?: string;
          order_id?: string | null;
          used_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coupon_usage_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          is_subscribed: boolean;
          source: string | null;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string | null;
          is_subscribed?: boolean;
          source?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          is_subscribed?: boolean;
          source?: string | null;
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
      recently_viewed: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          viewed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recently_viewed_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recently_viewed_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      flash_sales: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          banner_image: string | null;
          discount_percentage: number;
          starts_at: string;
          ends_at: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          banner_image?: string | null;
          discount_percentage: number;
          starts_at: string;
          ends_at: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          banner_image?: string | null;
          discount_percentage?: number;
          starts_at?: string;
          ends_at?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      flash_sale_products: {
        Row: {
          id: string;
          flash_sale_id: string;
          product_id: string;
          sale_price: number | null;
          max_quantity: number | null;
          sold_quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          flash_sale_id: string;
          product_id: string;
          sale_price?: number | null;
          max_quantity?: number | null;
          sold_quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          flash_sale_id?: string;
          product_id?: string;
          sale_price?: number | null;
          max_quantity?: number | null;
          sold_quantity?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flash_sale_products_flash_sale_id_fkey";
            columns: ["flash_sale_id"];
            isOneToOne: false;
            referencedRelation: "flash_sales";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flash_sale_products_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory_logs: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          previous_quantity: number;
          new_quantity: number;
          change_quantity: number;
          reason: string;
          reference_type: string | null;
          reference_id: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          previous_quantity: number;
          new_quantity: number;
          change_quantity: number;
          reason: string;
          reference_type?: string | null;
          reference_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          previous_quantity?: number;
          new_quantity?: number;
          change_quantity?: number;
          reason?: string;
          reference_type?: string | null;
          reference_id?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inventory_logs_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_activity_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey";
            columns: ["admin_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      page_views: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          page_path: string;
          referrer: string | null;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          page_path: string;
          referrer?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          page_path?: string;
          referrer?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "page_views_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_product_view: {
        Args: {
          product_uuid: string;
        };
        Returns: undefined;
      };
      get_product_stock_status: {
        Args: {
          product_uuid: string;
        };
        Returns: string;
      };
      update_inventory: {
        Args: {
          p_variant_id: string;
          p_quantity_change: number;
          p_reason: string;
          p_reference_type?: string;
          p_reference_id?: string;
          p_created_by?: string;
        };
        Returns: undefined;
      };
      validate_coupon: {
        Args: {
          p_code: string;
          p_user_id: string;
          p_subtotal: number;
        };
        Returns: {
          is_valid: boolean;
          coupon_id: string | null;
          discount_amount: number;
          error_message: string | null;
        }[];
      };
      get_product_rating: {
        Args: {
          product_uuid: string;
        };
        Returns: {
          average_rating: number;
          review_count: number;
        }[];
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded";
      payment_status: "pending" | "paid" | "failed" | "refunded";
      payment_provider: "stripe" | "paystack";
      user_role: "user" | "admin";
      product_condition: "new" | "like_new" | "good" | "fair";
      weight_unit: "kg" | "lb" | "g" | "oz";
      coupon_type: "percentage" | "fixed" | "free_shipping";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Utility types for Supabase
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
