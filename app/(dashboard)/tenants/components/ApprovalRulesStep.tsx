import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Sparkles } from "lucide-react"
import { TenantConfig } from "@/lib/tenant-schema"

interface ApprovalRulesStepProps {
    config: TenantConfig
    onUpdateApprovalRule: (field: string, value: number) => void
    onAddTier: () => void
    onRemoveTier: (index: number) => void
    onUpdateTier: (index: number, field: string, value: string) => void
}

export function ApprovalRulesStep({
    config,
    onUpdateApprovalRule,
    onAddTier,
    onRemoveTier,
    onUpdateTier
}: ApprovalRulesStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Claim Approval & Tiers Settings
            </h3>

            <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Automatic Approval Threshold ($)
                </Label>
                <div className="max-w-xs relative">
                    <Input type="number" required
                        min="0"
                        value={config.approvalRules.autoApproveThreshold}
                        onChange={(e) => onUpdateApprovalRule("autoApproveThreshold", Number(e.target.value))}
                        className="bg-background border-border focus-visible:ring-violet-500 font-mono"
                        placeholder="20000"
                    />
                    <span className="absolute inset-y-0 right-4 flex items-center text-xs text-muted-foreground pointer-events-none">
                        USD
                    </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                    Claims with amounts below this threshold will automatically bypass human review and auto-approve. Set to 0 to disable auto-approval completely.
                </p>
            </div>

            {/* Approval Tiers List */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Approval Route Tiers</h4>
                    <button
                        type="button"
                        onClick={onAddTier}
                        className="flex items-center gap-1 px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 rounded-lg text-xs font-semibold transition-all border border-violet-500/20 cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Tier
                    </button>
                </div>

                {config.approvalRules.tiers.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                        No approval routing tiers defined. Non-autoapproved claims will fail routing unless you define at least one tier.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {config.approvalRules.tiers.map((tier, index: number) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-muted/30 border border-border rounded-xl items-end"
                            >
                                <div>
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Role/Committee name
                                    </Label>
                                    <Input type="text" required
                                        value={tier.role}
                                        onChange={(e) => onUpdateTier(index, "role", e.target.value)}
                                        className="bg-background border-border focus-visible:ring-violet-500"
                                        placeholder="e.g. Assessor"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Min Amount ($)
                                    </Label>
                                    <Input type="number" required
                                        min="0"
                                        value={tier.minAmount}
                                        onChange={(e) => onUpdateTier(index, "minAmount", e.target.value)}
                                        className="bg-background border-border focus-visible:ring-violet-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Max Amount ($ or blank for infinite)
                                    </Label>
                                    <Input type="number" min="0"
                                        value={tier.maxAmount || ""}
                                        onChange={(e) => onUpdateTier(index, "maxAmount", e.target.value)}
                                        placeholder="Infinite"
                                        className="bg-background border-border focus-visible:ring-violet-500 font-mono"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveTier(index)}
                                    className="py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive border border-destructive/20 rounded-lg flex items-center justify-center cursor-pointer transition-all text-xs"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
