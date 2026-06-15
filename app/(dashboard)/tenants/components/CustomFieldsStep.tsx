import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Sparkles } from "lucide-react"
import { TenantConfig } from "@/lib/tenant-schema"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CustomFieldsStepProps {
    config: TenantConfig
    onAddCustomField: () => void
    onRemoveCustomField: (index: number) => void
    onUpdateCustomField: (index: number, field: string, value: string | boolean | string[]) => void
}

export function CustomFieldsStep({
    config,
    onAddCustomField,
    onRemoveCustomField,
    onUpdateCustomField
}: CustomFieldsStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Dynamic Submission Fields Settings
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
                Define additional data fields required from users when submitting claims. E.g. Employee ID for corporate clients, or Department for government entities.
            </p>

            <div className="space-y-4">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onAddCustomField}
                        className="flex items-center gap-1 px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 rounded-lg text-xs font-semibold transition-all border border-violet-500/20 cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Custom Field
                    </button>
                </div>

                {config.customFields.length === 0 ? (
                    <div className="text-center py-8 text-xs text-muted-foreground bg-muted/50 border border-border/50 rounded-2xl">
                        No custom fields configured. Users will only submit standard claim details.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {config.customFields.map((field, index: number) => (
                            <div
                                key={index}
                                className="p-5 bg-muted/30 border border-border rounded-2xl relative space-y-8 animate-in fade-in slide-in-from-top-1 duration-200"
                            >
                                <button
                                    type="button"
                                    onClick={() => onRemoveCustomField(index)}
                                    className="absolute top-4 right-4 p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive border border-destructive/20 rounded-lg cursor-pointer transition-all"
                                    title="Delete custom field"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-8">
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                            Field Key (lowercase)
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            value={field.key}
                                            onChange={(e) => onUpdateCustomField(index, "key", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                                            className="bg-background border-border focus-visible:ring-violet-500"
                                            placeholder="e.g. department_id"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                            Display Label (English)
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            value={field.label}
                                            onChange={(e) => onUpdateCustomField(index, "label", e.target.value)}
                                            className="bg-background border-border focus-visible:ring-violet-500"
                                            placeholder="e.g. Department"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                            Field Type
                                        </Label>
                                        <Select
                                            value={field.type}
                                            onValueChange={(value) => value && onUpdateCustomField(index, "type", value)}
                                        >
                                            <SelectTrigger className="w-full px-3 py-2 h-auto bg-background border-border rounded-lg text-xs">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text Input</SelectItem>
                                                <SelectItem value="number">Number Input</SelectItem>
                                                <SelectItem value="select">Dropdown Select</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center h-full pt-4">
                                        <Label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => onUpdateCustomField(index, "required", e.target.checked)}
                                                className="w-3.5 h-3.5 text-violet-600 bg-background border-border rounded focus:ring-violet-500 cursor-pointer"
                                            />
                                            <span>Required Field</span>
                                        </Label>
                                    </div>
                                </div>

                                {field.type === "select" && (
                                    <div className="pt-2">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                            Options (comma separated list)
                                        </Label>
                                        <Input
                                            type="text"
                                            required
                                            defaultValue={field.options?.join(", ")}
                                            onBlur={(e) => onUpdateCustomField(index, "options", e.target.value)}
                                            className="bg-background border-border focus-visible:ring-violet-500"
                                            placeholder="e.g. IT, Operations, Marketing"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
