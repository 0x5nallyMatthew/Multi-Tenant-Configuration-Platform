import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { TenantConfig } from "@/lib/tenant-schema"

interface BrandingStepProps {
    name: string
    slug: string
    isEdit?: boolean
    config: TenantConfig
    onNameChange: (value: string) => void
    onSlugChange: (value: string) => void
    onBrandingUpdate: (field: string, value: string) => void
}

export function BrandingStep({
    name,
    slug,
    isEdit,
    config,
    onNameChange,
    onSlugChange,
    onBrandingUpdate
}: BrandingStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Tenant Branding Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Company Name
                    </Label>
                    <Input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                            onNameChange(e.target.value)
                            onBrandingUpdate("companyName", e.target.value)
                        }}
                        className="bg-background border-border focus-visible:ring-violet-500"
                        placeholder="SafeGuard Ltd"
                    />
                </div>

                <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Tenant Slug (ID)
                    </Label>
                    <Input
                        type="text"
                        required
                        disabled={isEdit}
                        value={slug}
                        onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        className="bg-background border-border focus-visible:ring-violet-500"
                        placeholder="safeguard-insurance"
                    />
                </div>

                <div className="md:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Logo URL
                    </Label>
                    <Input
                        type="text"
                        required
                        value={config.branding.logoUrl}
                        onChange={(e) => onBrandingUpdate("logoUrl", e.target.value)}
                        className="bg-background border-border focus-visible:ring-violet-500"
                        placeholder="https://example.com/logo.png"
                    />
                </div>

                <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Primary Color (Hex)
                    </Label>
                    <div className="flex gap-2">
                        <div
                            className="w-11 h-11 rounded-xl border border-border"
                            style={{ backgroundColor: config.branding.primaryColor }}
                        />
                        <Input
                            type="text"
                            required
                            value={config.branding.primaryColor}
                            onChange={(e) => onBrandingUpdate("primaryColor", e.target.value)}
                            className="bg-background border-border focus-visible:ring-violet-500"
                            placeholder="#6d28d9"
                        />
                    </div>
                </div>

                <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Secondary Color (Hex)
                    </Label>
                    <div className="flex gap-2">
                        <div
                            className="w-11 h-11 rounded-xl border border-border"
                            style={{ backgroundColor: config.branding.secondaryColor }}
                        />
                        <Input
                            type="text"
                            required
                            value={config.branding.secondaryColor}
                            onChange={(e) => onBrandingUpdate("secondaryColor", e.target.value)}
                            className="bg-background border-border focus-visible:ring-violet-500"
                            placeholder="#4f46e5"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
