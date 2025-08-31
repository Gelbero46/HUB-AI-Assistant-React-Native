import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { useTheme } from "@react-navigation/native";
import { CallDirection } from "@/constants";
import { useTheme } from "@/context/theme-context";
import { Call } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { PhoneIncoming, PhoneMissed, PhoneOutgoing } from "lucide-react-native";

interface CallCardProps {
  call: Call;
  onPress: () => void;
}

export const CallCard: React.FC<CallCardProps> = ({ call, onPress }) => {
  const { colors, fonts: Fonts, sizes: Sizes } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          padding: Sizes.md,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        iconContainer: {
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          marginRight: Sizes.md,
        },
        content: {
          flex: 1,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Sizes.xs,
        },
        name: {
          fontSize: Sizes.fontMd,
          fontWeight: Fonts.weights.bold,
          color: colors.text,
          flex: 1,
        },
        time: {
          fontSize: Sizes.fontSm,
          fontWeight: Fonts.weights.regular,
          color: colors.notification,
        },
        footer: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        phone: {
          fontSize: Sizes.fontSm,
          fontWeight: Fonts.weights.regular,
          color: colors.notification,
        },
        duration: {
          fontSize: Sizes.fontSm,
          fontWeight: Fonts.weights.medium,
          color: colors.notification,
        },
        summary: {
          fontSize: Sizes.fontSm,
          fontWeight: Fonts.weights.light,
          color: colors.notification,
          marginTop: Sizes.xs,
          lineHeight: 18,
        },
      }),
    [colors]
  );

  const getCallIcon = () => {
    if (call.direction === CallDirection.INCOMING) {
      return call.isAnswered ? (
        <PhoneIncoming size={20} color={colors.primary} />
      ) : (
        <PhoneMissed size={20} color={colors.notification} />
      );
    }
    return <PhoneOutgoing size={20} color={colors.card} />;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>{getCallIcon()}</View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {call.contact.name}
          </Text>
          <Text style={styles.time}>
            {formatDistanceToNow(new Date(call.startTime), { addSuffix: true })}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.phone}>{call.contact.phoneNumber}</Text>
          {call.duration > 0 && (
            <Text style={styles.duration}>{formatDuration(call.duration)}</Text>
          )}
        </View>

        {call.summary && (
          <Text style={styles.summary} numberOfLines={2}>
            {call.summary}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
