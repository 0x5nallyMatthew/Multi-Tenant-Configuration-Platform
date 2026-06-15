import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import { TenantConfig, ClaimType, NotificationEvent } from "@/lib/tenant-schema"

interface NotificationsStepProps {
    config: TenantConfig
    onUpdateNotification: (event: NotificationEvent, field: string, value: boolean | string | string[]) => void
    onToggleNotificationChannel: (event: NotificationEvent, channel: string) => void
    onUpdateSla: (type: ClaimType, field: string, value: string) => void
}

export function NotificationsStep({
    config,
    onUpdateNotification,
    onToggleNotificationChannel,
    onUpdateSla
}: NotificationsStepProps) {
    const notificationEvents = ["claim_submitted", "approved", "rejected", "payment_sent"] as const
    const notificationChannels = ["email", "sms", "webhook"] as const

    return (
        <div className="space-y-8">
            {/* SLAs configuration */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    Service Level Agreements (SLA)
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(config.sla).map(([type, s]) => {
                        const isEnabled = config.claimTypes[type as ClaimType]?.enabled
                        if (!isEnabled) return null

                        return (
                            <div key={type} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card border border-border rounded-xl items-center">
                                <div className="text-xs font-bold text-foreground">{type}</div>
                                <div>
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Target (Business Days)
                                    </Label>
                                    <Input type="number" required
                                        min="1"
                                        value={s.businessDays}
                                        onChange={(e) => onUpdateSla(type as ClaimType, "businessDays", e.target.value)}
                                        className="bg-background border-border focus-visible:ring-violet-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Escalation Contact Email
                                    </Label>
                                    <Input type="email" required
                                        value={s.escalationContact}
                                        onChange={(e) => onUpdateSla(type as ClaimType, "escalationContact", e.target.value)}
                                        className="bg-background border-border focus-visible:ring-violet-500"
                                        placeholder="manager@safeguard.com"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Notifications configuration */}
            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    Triggered Notifications Settings
                </h3>

                <div className="space-y-4">
                    {notificationEvents.map((event) => {
                        const notify = config.notifications[event]
                        return (
                            <div
                                key={event}
                                className={`p-5 rounded-2xl border transition-all ${notify.enabled
                                    ? "bg-card border-border"
                                    : "bg-muted/50 border-border/50 opacity-60"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id={`notify-chk-${event}`}
                                            checked={notify.enabled}
                                            onChange={() => onUpdateNotification(event, "enabled", !notify.enabled)}
                                            className="w-4 h-4 text-violet-600 bg-background border-border rounded focus:ring-violet-500 focus:ring-opacity-20 cursor-pointer"
                                        />
                                        <Label
                                            htmlFor={`notify-chk-${event}`}
                                            className="text-xs font-bold uppercase tracking-wider text-foreground cursor-pointer select-none"
                                        >
                                            {event.replace("_", " ")}
                                        </Label>
                                    </div>
                                </div>

                                {notify.enabled && (
                                    <div className="space-y-4 mt-3">
                                        <div>
                                            <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                Notification Channels
                                            </span>
                                            <div className="flex gap-4 flex-wrap">
                                                {notificationChannels.map((channel) => (
                                                    <Label key={channel} className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={notify.channels.includes(channel)}
                                                            onChange={() => onToggleNotificationChannel(event, channel)}
                                                            className="w-3.5 h-3.5 text-violet-600 bg-background border-border rounded focus:ring-violet-500 cursor-pointer"
                                                        />
                                                        <span className="capitalize">{channel}</span>
                                                    </Label>
                                                ))}
                                            </div>
                                        </div>

                                        {notify.channels.includes("email") && (
                                            <div>
                                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                                                    Email Template
                                                </Label>
                                                <textarea
                                                    value={notify.emailTemplate || ""}
                                                    onChange={(e) => onUpdateNotification(event, "emailTemplate", e.target.value)}
                                                    rows={3}
                                                    className="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                                    placeholder="Dear customer, your claim has been..."
                                                />
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    Available variables: <code className="text-muted-foreground font-semibold">{`{amount}`}</code>, <code className="text-muted-foreground font-semibold">{`{claimType}`}</code>, <code className="text-muted-foreground font-semibold">{`{date}`}</code>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
