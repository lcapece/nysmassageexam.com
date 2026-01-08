import { View, Text, Pressable, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

import { cn } from "@/lib/utils";
import { useAuthContext } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   * Bottom is typically handled by Tab Bar.
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the SafeAreaView (content layer).
   */
  safeAreaClassName?: string;
  /**
   * Whether to show the global header with Sign Out button. Defaults to true.
   */
  showHeader?: boolean;
}

/**
 * A container component that properly handles SafeArea and background colors.
 *
 * The outer View extends to full screen (including status bar area) with the background color,
 * while the inner SafeAreaView ensures content is within safe bounds.
 *
 * Usage:
 * ```tsx
 * <ScreenContainer className="p-4">
 *   <Text className="text-2xl font-bold text-foreground">
 *     Welcome
 *   </Text>
 * </ScreenContainer>
 * ```
 */
export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  showHeader = true,
  style,
  ...props
}: ScreenContainerProps) {
  const { user, signOut } = useAuthContext();
  const colors = useColors();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/landing' as any);
  };

  return (
    <View
      className={cn(
        "flex-1",
        "bg-background",
        containerClassName
      )}
      {...props}
    >
      <SafeAreaView
        edges={edges}
        className={cn("flex-1", safeAreaClassName)}
        style={style}
      >
        {/* Global Sign Out Header - Mobile only, when user is logged in */}
        {showHeader && user && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 16,
              zIndex: 100,
            }}
          >
            <Pressable onPress={handleSignOut}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    backgroundColor: pressed ? colors.surfaceHover : colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <MaterialIcons name="logout" size={14} color={colors.muted} />
                  <Text style={{ marginLeft: 4, fontSize: 12, color: colors.muted }}>
                    Sign Out
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        )}
        <View className={cn("flex-1", className)}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
