import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type MetadataConfigProps = {
  pageType: string
  config: any
  onChange: (pageType: string, field: string, value: string) => void
}

export default function MetadataConfig({ pageType, config, onChange }: MetadataConfigProps) {
  const titleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={pageType}>
        <AccordionTrigger className="text-lg font-semibold">{titleCase(pageType)} Page Metadata</AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Metadata</CardTitle>
              <CardDescription>Configure basic metadata for {pageType} pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title Template</Label>
                <Input
                  value={config.title}
                  onChange={(e) => onChange(pageType, "title", e.target.value)}
                  placeholder="Enter title template"
                />
              </div>
              <div className="space-y-2">
                <Label>Description Template</Label>
                <Input
                  value={config.description}
                  onChange={(e) => onChange(pageType, "description", e.target.value)}
                  placeholder="Enter description template"
                />
              </div>
              <div className="space-y-2">
                <Label>Robots</Label>
                <Input
                  value={config.robots}
                  onChange={(e) => onChange(pageType, "robots", e.target.value)}
                  placeholder="Enter robots meta"
                />
              </div>
              {config.ogTitle !== undefined && (
                <div className="space-y-2">
                  <Label>OpenGraph Title Template</Label>
                  <Input
                    value={config.ogTitle}
                    onChange={(e) => onChange(pageType, "ogTitle", e.target.value)}
                    placeholder="Enter OpenGraph title template"
                  />
                </div>
              )}
              {config.ogDescription !== undefined && (
                <div className="space-y-2">
                  <Label>OpenGraph Description Template</Label>
                  <Input
                    value={config.ogDescription}
                    onChange={(e) => onChange(pageType, "ogDescription", e.target.value)}
                    placeholder="Enter OpenGraph description template"
                  />
                </div>
              )}
              {config.twitterCard !== undefined && (
                <div className="space-y-2">
                  <Label>Twitter Card Type</Label>
                  <Input
                    value={config.twitterCard}
                    onChange={(e) => onChange(pageType, "twitterCard", e.target.value)}
                    placeholder="Enter Twitter card type"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

