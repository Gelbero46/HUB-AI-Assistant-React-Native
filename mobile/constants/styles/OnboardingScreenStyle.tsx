import { Colors, Fonts, Sizes } from "@/types";
import { StyleSheet } from "react-native";



const OnboardingScreenStyle = ({ Colors, Fonts, Sizes }: 
  { Colors: Colors, Fonts: Fonts, Sizes: Sizes  }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Sizes.lg,
    paddingBottom: Sizes.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Sizes.xl,
  },
  title: {
    fontSize: Sizes.fontXl,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.text,
    marginBottom: Sizes.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Sizes.fontMd,
    fontFamily: Fonts.fontFamily,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  stepContent: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: Sizes.fontMd,
    fontFamily: Fonts.fontFamily,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Sizes.lg,
    lineHeight: 22,
  },
  featuresList: {
    alignSelf: 'stretch',
  },
  feature: {
    fontSize: Sizes.fontMd,
    fontWeight: Fonts.weights.regular,
    color: Colors.text,
    marginBottom: Sizes.md,
    paddingLeft: Sizes.md,
  },
  formContent: {
    width: '100%',
  },
  completionContent: {
    alignItems: 'center',
  },
  completionText: {
    fontSize: Sizes.fontMd,
    fontWeight: Fonts.weights.regular,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Sizes.lg,
    lineHeight: 22,
  },
  completionSubtext: {
    fontSize: Sizes.fontMd,
    fontWeight: Fonts.weights.medium,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Sizes.lg,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: Sizes.xl,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    marginHorizontal: Sizes.xs,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
    marginRight: Sizes.md,
  },
  nextButton: {
    flex: 1,
  },
});

export default OnboardingScreenStyle;