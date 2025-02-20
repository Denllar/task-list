import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function LabelDemo({disabled, value}: {disabled: boolean, value: string}) {
  return (
    <div>
      <div className={cn("flex items-center space-x-2", disabled && "opacity-50")}>
        <Checkbox checked={value ? false : true} id="terms" disabled={disabled} />
        <Label htmlFor="terms">В течении месяца</Label>
      </div>
    </div>

  )
}
