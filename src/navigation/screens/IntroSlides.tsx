import React, { useRef, useState } from "react";
import { View, Dimensions, StatusBar, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import AppIntroSlider from "react-native-app-intro-slider";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigators/RootStackNavigator";
import "../../ui/Paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Slide {
  key: string;
  title: string;
  text: string;
  lottieSource: any;
}

const slides: Slide[] = [
  {
    key: "welcome",
    title: "Welcome to FinWise",
    text: "Take control of your financial future with smart insights and intuitive tracking.",
    lottieSource: require("../../assets/lottie/welcome-finance.json"),
  },
  {
    key: "track",
    title: "Track Every Transaction",
    text: "Effortlessly monitor your income, expenses, and savings in real-time.",
    lottieSource: require("../../assets/lottie/track-money.json"),
  },
  {
    key: "insights",
    title: "Smart Financial Insights",
    text: "Get personalized recommendations and visualize your spending patterns.",
    lottieSource: require("../../assets/lottie/insights-chart.json"),
  },
  {
    key: "budget",
    title: "Smart Household Budgets",
    text: "Create and manage budgets for your household expenses. Stay on track with your financial goals.",
    lottieSource: require("../../assets/lottie/budget.json"),
  },
];

type IntroSlidesProps = NativeStackScreenProps<
  RootStackParamList,
  "IntroSlides"
>;

const INTRO_SEEN_KEY = "@finwise_intro_seen";

export default function IntroSlides({ navigation }: IntroSlidesProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sliderRef = useRef<AppIntroSlider>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem(INTRO_SEEN_KEY, "true");
      console.log(navigation);

      navigation.replace("Login");
    } catch (error) {
      console.error("Error saving intro status:", error);
      navigation.replace("Login");
    }
  };

  const goToNextSlide = () => {
    if (activeIndex < slides.length - 1) {
      sliderRef.current?.goToSlide(activeIndex + 1);
    }
  };

  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        edges={["top", "bottom"]}
      >
        {/* Use View to avoid Surface adding elevation tinting; or keep Surface if you like */}
        <View
          style={{
            flex: 1,
            paddingTop: 16,
            paddingBottom: 24,
            paddingHorizontal: 8,
          }}
        >
          {/* Top: animation (flex = 1.1) */}
          <View
            style={{
              flex: 1.1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LottieView
              source={item.lottieSource}
              autoPlay
              loop
              style={{ width: width * 0.8, aspectRatio: 1 }}
            />
          </View>

          {/* Bottom: text (flex = 0.9) */}
          <View
            style={{
              flex: 0.9,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 12,
            }}
          >
            <Text
              variant="headlineMedium"
              style={{
                textAlign: "center",
                marginBottom: 8,
                color: theme.colors.onBackground,
                fontWeight: "700",
                letterSpacing: -0.5,
              }}
            >
              {item.title}
            </Text>
            <Text
              variant="bodyLarge"
              style={{
                textAlign: "center",
                lineHeight: 22,
                color: theme.colors.onSurfaceVariant ?? theme.colors.outline,
                maxWidth: "92%",
              }}
            >
              {item.text}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  const ButtonShell: React.FC<{
    children: React.ReactNode;
    filled?: boolean;
  }> = ({ children, filled }) => (
    <View
      style={{
        minWidth: 44,
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: filled
          ? theme.colors.primary
          : `${theme.colors.primary}1A`, // ~10% alpha
        borderWidth: filled ? 0 : 2,
        borderColor: theme.colors.primary,
      }}
    >
      {children}
    </View>
  );

  const renderNextButton = () => (
    <ButtonShell>
      <Text
        style={{ color: theme.colors.primary, fontSize: 18, fontWeight: "700" }}
      >
        Next
      </Text>
    </ButtonShell>
  );

  const renderDoneButton = () => (
    <ButtonShell filled>
      <Text
        style={{
          color: theme.colors.onPrimary,
          fontSize: 18,
          fontWeight: "700",
        }}
      >
        Done
      </Text>
    </ButtonShell>
  );

  const renderSkipButton = () => (
    <View style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
      <Text
        variant="labelLarge"
        style={{
          color: theme.colors.onSurfaceVariant ?? theme.colors.outline,
          fontWeight: "600",
        }}
      >
        Skip
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />
      <AppIntroSlider
        ref={sliderRef}
        renderItem={renderItem}
        data={slides}
        onDone={handleDone}
        onSkip={handleDone}
        onSlideChange={setActiveIndex}
        showSkipButton
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderSkipButton={renderSkipButton}
        // Ensure the slider itself has your background (prevents white gutters)
        renderPagination={(paginationActiveIndex) => (
          <View
            // custom pagination to keep perfectly in sync & respect safe area
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: insets.bottom + 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* dots */}
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              {slides.map((_, i) => {
                const active = i === paginationActiveIndex;
                return (
                  <View
                    key={i}
                    style={{
                      backgroundColor: active
                        ? theme.colors.primary
                        : `${theme.colors.outline}4D`,
                      width: active ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      marginHorizontal: 4,
                    }}
                  />
                );
              })}
            </View>

            {/* nav row */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {paginationActiveIndex < slides.length - 1 ? (
                <TouchableOpacity onPress={handleDone}>
                  {renderSkipButton()}
                </TouchableOpacity>
              ) : (
                <View style={{ width: 68 }} />
              )}
              {paginationActiveIndex < slides.length - 1 ? (
                <TouchableOpacity onPress={goToNextSlide}>
                  {renderNextButton()}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleDone}>
                  {renderDoneButton()}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        // Keep default gestures / physics
      />
    </View>
  );
}
