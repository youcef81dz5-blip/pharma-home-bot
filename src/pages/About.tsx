import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Pill, 
  Camera, 
  Brain, 
  Shield, 
  Smartphone, 
  Clock, 
  Stethoscope, 
  Archive,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Zap,
  Wallet,
  TrendingDown,
  FileText
} from "lucide-react";

const About = () => {
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const ArrowIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const features = [
    {
      icon: <Camera className="h-8 w-8" />,
      titleKey: "featureAnalysis",
      descKey: "featureAnalysisDesc"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      titleKey: "featureAI",
      descKey: "featureAIDesc"
    },
    {
      icon: <Archive className="h-8 w-8" />,
      titleKey: "featureInventory",
      descKey: "featureInventoryDesc"
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      titleKey: "featureSymptom",
      descKey: "featureSymptomDesc"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      titleKey: "featureExpiry",
      descKey: "featureExpiryDesc"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      titleKey: "featureSecurity",
      descKey: "featureSecurityDesc"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      titleKey: "featureReminders",
      descKey: "featureRemindersDesc"
    },
    {
      icon: <Pill className="h-8 w-8" />,
      titleKey: "featureAlternatives",
      descKey: "featureAlternativesDesc"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      titleKey: "featurePrescriptions",
      descKey: "featurePrescriptionsDesc"
    }
  ];

  const steps = [
    { num: 1, key: "step1" },
    { num: 2, key: "step2" },
    { num: 3, key: "step3" },
    { num: 4, key: "step4" }
  ];

  const advantages = [
    "advantage1",
    "advantage2",
    "advantage3",
    "advantage4",
    "advantage5"
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Header />

      <main className="container pb-20 pt-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowIcon className="h-4 w-4" />
          {t("backToHome")}
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6">
            <Pill className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("aboutTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("aboutDescription")}
          </p>
        </div>

        {/* Money Saving Banner - Main Slogan */}
        <Card className="mb-8 border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent shadow-lg">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Wallet className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-center md:text-start flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-2 flex items-center justify-center md:justify-start gap-2">
                  <TrendingDown className="h-7 w-7" />
                  {t("saveMoneySloganTitle")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("saveMoneySloganDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What is the App */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              {t("whatIsApp")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("whatIsAppDesc")}
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          {t("appFeatures")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(feature.descKey)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it Works */}
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Smartphone className="h-6 w-6 text-primary" />
          {t("howItWorks")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {steps.map((step) => (
            <Card key={step.num} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold rounded-br-xl">
                {step.num}
              </div>
              <CardContent className="pt-16 pb-6">
                <p className="text-muted-foreground">
                  {t(step.key)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <Card className="mb-12 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              {t("whyChooseUs")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {advantages.map((key, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{t(key)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/")}
            className="gap-2"
          >
            {t("startNow")}
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container text-center">
          <p className="text-sm font-medium text-foreground">
            {t("developedBy")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
