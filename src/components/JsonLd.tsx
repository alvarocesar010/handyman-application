import { SeoJson } from "@/types/seo";

// Extract just the structuredData part of your SeoJson type
type StructuredDataProps = NonNullable<SeoJson["structuredData"]>;

export default function JsonLd({ data }: { data: StructuredDataProps }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
