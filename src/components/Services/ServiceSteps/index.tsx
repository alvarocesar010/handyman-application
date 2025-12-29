import Image from "next/image";

type StepImage = { src: string; alt: string };

export type ServiceStep = {
  title: string;
  description: string;
  image: StepImage;
};

export default function ServiceSteps({
  title = "How we install it",
  steps,
}: {
  title?: string;
  steps: ServiceStep[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

      <ol className="grid gap-4 sm:grid-cols-2">
        {steps.map((step, idx) => (
          <li
            key={`${step.title}-${idx}`}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={step.image.src}
                alt={step.image.alt}
                fill
                sizes="(max-width:768px) 100vw, 80vw"
                className="fit-cover"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-cyan-800 ring-1 ring-cyan-200">
                  {idx + 1}
                </div>

                <div className="space-y-1">
                  <h3 className="font-medium text-slate-900">{step.title}</h3>
                  <p className="text-sm leading-6 text-slate-700">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
