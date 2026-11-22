export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string;
          country_code: string;
          created_at: string;
          full_name: string;
          governorate: string;
          id: string;
          is_default: boolean;
          label: string | null;
          line1: string;
          line2: string | null;
          phone: string;
          postal_code: string | null;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          city: string;
          country_code?: string;
          created_at?: string;
          full_name: string;
          governorate: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          line1: string;
          line2?: string | null;
          phone: string;
          postal_code?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          city?: string;
          country_code?: string;
          created_at?: string;
          full_name?: string;
          governorate?: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          line1?: string;
          line2?: string | null;
          phone?: string;
          postal_code?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      banners: {
        Row: {
          created_at: string;
          cta_href: string | null;
          cta_label: string | null;
          ends_at: string | null;
          headline: string | null;
          id: string;
          image_path: string;
          is_active: boolean;
          mobile_image_path: string | null;
          name: string;
          placement: string;
          published_at: string | null;
          sort_order: number;
          starts_at: string | null;
          subheadline: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          cta_href?: string | null;
          cta_label?: string | null;
          ends_at?: string | null;
          headline?: string | null;
          id?: string;
          image_path: string;
          is_active?: boolean;
          mobile_image_path?: string | null;
          name: string;
          placement?: string;
          published_at?: string | null;
          sort_order?: number;
          starts_at?: string | null;
          subheadline?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          cta_href?: string | null;
          cta_label?: string | null;
          ends_at?: string | null;
          headline?: string | null;
          id?: string;
          image_path?: string;
          is_active?: boolean;
          mobile_image_path?: string | null;
          name?: string;
          placement?: string;
          published_at?: string | null;
          sort_order?: number;
          starts_at?: string | null;
          subheadline?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_path: string | null;
          is_published: boolean;
          name: string;
          parent_id: string | null;
          published_at: string | null;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_path?: string | null;
          is_published?: boolean;
          name: string;
          parent_id?: string | null;
          published_at?: string | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_path?: string | null;
          is_published?: boolean;
          name?: string;
          parent_id?: string | null;
          published_at?: string | null;
          slug?: string;
          sort_order?: number;
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
      home_sections: {
        Row: {
          body: NonNullable<Json>;
          config: NonNullable<Json>;
          created_at: string;
          id: string;
          is_published: boolean;
          key: string;
          kind: string;
          published_at: string | null;
          sort_order: number;
          subtitle: string | null;
          title: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          body?: NonNullable<Json>;
          config?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          key: string;
          kind: string;
          published_at?: string | null;
          sort_order?: number;
          subtitle?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          body?: NonNullable<Json>;
          config?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          key?: string;
          kind?: string;
          published_at?: string | null;
          sort_order?: number;
          subtitle?: string | null;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          line_total_egp: number | null;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          selected_specs: NonNullable<Json>;
          sku: string | null;
          unit_price_egp: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          line_total_egp?: never;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          selected_specs?: NonNullable<Json>;
          sku?: string | null;
          unit_price_egp: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          line_total_egp?: never;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          selected_specs?: NonNullable<Json>;
          sku?: string | null;
          unit_price_egp?: number;
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
        ];
      };
      orders: {
        Row: {
          billing_address: Json | null;
          created_at: string;
          currency: string;
          customer_email: string | null;
          customer_phone: string | null;
          id: string;
          order_number: string;
          placed_at: string;
          shipping_address: NonNullable<Json>;
          status: string;
          total_egp: number;
          updated_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          billing_address?: Json | null;
          created_at?: string;
          currency?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          id?: string;
          order_number: string;
          placed_at?: string;
          shipping_address?: NonNullable<Json>;
          status?: string;
          total_egp: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          billing_address?: Json | null;
          created_at?: string;
          currency?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          id?: string;
          order_number?: string;
          placed_at?: string;
          shipping_address?: NonNullable<Json>;
          status?: string;
          total_egp?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          alt_text: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          product_id: string;
          sort_order: number;
          storage_path: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          product_id: string;
          sort_order?: number;
          storage_path: string;
          updated_at?: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          product_id?: string;
          sort_order?: number;
          storage_path?: string;
          updated_at?: string;
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
      products: {
        Row: {
          category_id: string | null;
          compare_at_price: number | null;
          created_at: string;
          description: string | null;
          id: string;
          is_featured: boolean;
          is_published: boolean;
          name: string;
          price_egp: number;
          published_at: string | null;
          sku: string;
          slug: string;
          sort_order: number;
          specs: NonNullable<Json>;
          stock: number;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          category_id?: string | null;
          compare_at_price?: number | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          name: string;
          price_egp: number;
          published_at?: string | null;
          sku: string;
          slug: string;
          sort_order?: number;
          specs?: NonNullable<Json>;
          stock?: number;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          compare_at_price?: number | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          name?: string;
          price_egp?: number;
          published_at?: string | null;
          sku?: string;
          slug?: string;
          sort_order?: number;
          specs?: NonNullable<Json>;
          stock?: number;
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
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          created_at: string;
          id: string;
          is_published: boolean;
          key: string;
          published_at: string | null;
          updated_at: string;
          value: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          key: string;
          published_at?: string | null;
          updated_at?: string;
          value: NonNullable<Json>;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          key?: string;
          published_at?: string | null;
          updated_at?: string;
          value?: NonNullable<Json>;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
