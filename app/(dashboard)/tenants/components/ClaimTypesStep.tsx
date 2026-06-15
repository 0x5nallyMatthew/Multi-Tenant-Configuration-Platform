import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { TenantConfig, ClaimType } from "@/lib/tenant-schema"

interface ClaimTypesStepProps {
    config: TenantConfig
    onToggleClaimType: (type: ClaimType) => void
    onUpdateDocs: (type: ClaimType, docField: "requiredDocs" | "optionalDocs", value: string) => void
}

export function ClaimTypesStep({ config, onToggleClaimType, onUpdateDocs }: ClaimTypesStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Claim Types & Required Documents
            </h3>

            <div className="space-y-4">
                {(Object.keys(config.claimTypes) as ClaimType[]).map((type) => {
                    const typeSetting = config.claimTypes[type]
                    return (
                        <div
                            key={type}
                            className={`p-5 rounded-2xl border transition-all ${typeSetting.enabled
                                ? "bg-card border-border"
                                : "bg-muted/50 border-border/50 opacity-60"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id={`chk-${type}`}
                                        checked={typeSetting.enabled}
                                        onChange={() => onToggleClaimType(type)}
                                        className="w-4 h-4 text-violet-600 bg-background border-border rounded focus:ring-violet-500 focus:ring-opacity-20 cursor-pointer"
                                    />
                                    <Label
                                        htmlFor={`chk-${type}`}
                                        className="text-sm font-bold text-foreground cursor-pointer select-none"
                                    >
                                        {type}
                                    </Label>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono">ID: {type}</span>
                            </div>

                            {typeSetting.enabled && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                            Required Documents (comma separated)
                                        </Label>
                                        <Input type="text" defaultValue={typeSetting.requiredDocs.join(", ")}
                                            onBlur={(e) => onUpdateDocs(type, "requiredDocs", e.target.value)}
                                            className="bg-background border-border focus-visible:ring-violet-500"
                                            placeholder="e.g. Medical Invoice, ID Card"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                            Optional Documents (comma separated)
                                        </Label>
                                        <Input type="text" defaultValue={typeSetting.optionalDocs.join(", ")}
                                            onBlur={(e) => onUpdateDocs(type, "optionalDocs", e.target.value)}
                                            className="bg-background border-border focus-visible:ring-violet-500"
                                            placeholder="e.g. Prescription Note"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
