export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      collision_predictions: {
        Row: {
          ai_analysis: string | null
          created_at: string | null
          id: string
          is_resolved: boolean | null
          minimum_distance: number
          object1_id: string
          object1_name: string
          object1_type: string
          object2_id: string
          object2_name: string
          object2_type: string
          probability: number
          recommended_action: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          time_to_closest_approach: number
          updated_at: string | null
        }
        Insert: {
          ai_analysis?: string | null
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          minimum_distance: number
          object1_id: string
          object1_name: string
          object1_type: string
          object2_id: string
          object2_name: string
          object2_type: string
          probability: number
          recommended_action?: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          time_to_closest_approach: number
          updated_at?: string | null
        }
        Update: {
          ai_analysis?: string | null
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          minimum_distance?: number
          object1_id?: string
          object1_name?: string
          object1_type?: string
          object2_id?: string
          object2_name?: string
          object2_type?: string
          probability?: number
          recommended_action?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          time_to_closest_approach?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      launch_plans: {
        Row: {
          ai_recommendations: string | null
          collision_risk_assessment: string | null
          created_at: string | null
          id: string
          launch_site: string
          launch_window_end: string | null
          launch_window_start: string | null
          mission_name: string
          payload_mass: number | null
          rocket_type: string | null
          satellite_name: string
          status: Database["public"]["Enums"]["launch_status"] | null
          target_altitude: number
          target_inclination: number
          target_orbit: Database["public"]["Enums"]["orbit_type"]
          trajectory_data: Json | null
          updated_at: string | null
        }
        Insert: {
          ai_recommendations?: string | null
          collision_risk_assessment?: string | null
          created_at?: string | null
          id?: string
          launch_site: string
          launch_window_end?: string | null
          launch_window_start?: string | null
          mission_name: string
          payload_mass?: number | null
          rocket_type?: string | null
          satellite_name: string
          status?: Database["public"]["Enums"]["launch_status"] | null
          target_altitude: number
          target_inclination: number
          target_orbit: Database["public"]["Enums"]["orbit_type"]
          trajectory_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          ai_recommendations?: string | null
          collision_risk_assessment?: string | null
          created_at?: string | null
          id?: string
          launch_site?: string
          launch_window_end?: string | null
          launch_window_start?: string | null
          mission_name?: string
          payload_mass?: number | null
          rocket_type?: string | null
          satellite_name?: string
          status?: Database["public"]["Enums"]["launch_status"] | null
          target_altitude?: number
          target_inclination?: number
          target_orbit?: Database["public"]["Enums"]["orbit_type"]
          trajectory_data?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      satellites: {
        Row: {
          altitude: number
          country: string | null
          created_at: string | null
          id: string
          inclination: number
          is_active: boolean | null
          launch_date: string | null
          name: string
          norad_id: string | null
          orbit_type: Database["public"]["Enums"]["orbit_type"]
          position_x: number
          position_y: number
          position_z: number
          risk_level: Database["public"]["Enums"]["risk_level"]
          tle_line1: string | null
          tle_line2: string | null
          updated_at: string | null
          velocity: number
        }
        Insert: {
          altitude: number
          country?: string | null
          created_at?: string | null
          id?: string
          inclination: number
          is_active?: boolean | null
          launch_date?: string | null
          name: string
          norad_id?: string | null
          orbit_type?: Database["public"]["Enums"]["orbit_type"]
          position_x?: number
          position_y?: number
          position_z?: number
          risk_level?: Database["public"]["Enums"]["risk_level"]
          tle_line1?: string | null
          tle_line2?: string | null
          updated_at?: string | null
          velocity: number
        }
        Update: {
          altitude?: number
          country?: string | null
          created_at?: string | null
          id?: string
          inclination?: number
          is_active?: boolean | null
          launch_date?: string | null
          name?: string
          norad_id?: string | null
          orbit_type?: Database["public"]["Enums"]["orbit_type"]
          position_x?: number
          position_y?: number
          position_z?: number
          risk_level?: Database["public"]["Enums"]["risk_level"]
          tle_line1?: string | null
          tle_line2?: string | null
          updated_at?: string | null
          velocity?: number
        }
        Relationships: []
      }
      solar_weather: {
        Row: {
          created_at: string | null
          end_time: string | null
          event_id: string | null
          event_type: string
          id: string
          impact_assessment: string | null
          intensity: string | null
          linked_events: Json | null
          source_location: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          event_type: string
          id?: string
          impact_assessment?: string | null
          intensity?: string | null
          linked_events?: Json | null
          source_location?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          event_type?: string
          id?: string
          impact_assessment?: string | null
          intensity?: string | null
          linked_events?: Json | null
          source_location?: string | null
          start_time?: string | null
        }
        Relationships: []
      }
      space_debris: {
        Row: {
          altitude: number
          created_at: string | null
          id: string
          name: string | null
          origin: string | null
          position_x: number
          position_y: number
          position_z: number
          size: string | null
          velocity: number
        }
        Insert: {
          altitude: number
          created_at?: string | null
          id?: string
          name?: string | null
          origin?: string | null
          position_x?: number
          position_y?: number
          position_z?: number
          size?: string | null
          velocity: number
        }
        Update: {
          altitude?: number
          created_at?: string | null
          id?: string
          name?: string | null
          origin?: string | null
          position_x?: number
          position_y?: number
          position_z?: number
          size?: string | null
          velocity?: number
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at: string | null
          id: string
          is_dismissed: boolean | null
          is_read: boolean | null
          message: string
          related_object_id: string | null
          related_object_type: string | null
          severity: Database["public"]["Enums"]["risk_level"]
          title: string
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          created_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message: string
          related_object_id?: string | null
          related_object_type?: string | null
          severity: Database["public"]["Enums"]["risk_level"]
          title: string
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          created_at?: string | null
          id?: string
          is_dismissed?: boolean | null
          is_read?: boolean | null
          message?: string
          related_object_id?: string | null
          related_object_type?: string | null
          severity?: Database["public"]["Enums"]["risk_level"]
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_type: "collision" | "debris" | "solar" | "launch" | "system"
      launch_status:
        | "planning"
        | "scheduled"
        | "launched"
        | "completed"
        | "aborted"
      orbit_type: "LEO" | "MEO" | "GEO" | "HEO" | "SSO" | "POLAR"
      risk_level: "safe" | "warning" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_type: ["collision", "debris", "solar", "launch", "system"],
      launch_status: [
        "planning",
        "scheduled",
        "launched",
        "completed",
        "aborted",
      ],
      orbit_type: ["LEO", "MEO", "GEO", "HEO", "SSO", "POLAR"],
      risk_level: ["safe", "warning", "critical"],
    },
  },
} as const
