import { Shield, Scan, FileCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
          حلل دواءك بـ
          <span className="gradient-text"> ذكاء اصطناعي</span>
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          صوّر علبة الدواء أو المكمل الغذائي واحصل على تحليل شامل للمكونات
          والتحذيرات الطبية
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <FeatureCard
          icon={<Scan className="h-6 w-6" />}
          title="تحليل فوري"
          delay={0}
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6" />}
          title="كشف المخاطر"
          delay={0.1}
        />
        <FeatureCard
          icon={<FileCheck className="h-6 w-6" />}
          title="تقرير مفصل"
          delay={0.2}
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  delay: number;
}) {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-card fade-in-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <span className="text-center text-xs font-medium text-foreground sm:text-sm">
        {title}
      </span>
    </div>
  );
}
