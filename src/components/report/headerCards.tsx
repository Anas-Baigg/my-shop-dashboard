import { formatEUR } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function HeaderCards({
  title,
  value,
  icon: Icon,
  sub,
  colorClass,
  valueColor,
}: any) {
  return (
    <Card className={colorClass ? `border-t-4 ${colorClass}` : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor || ""}`}>
          {formatEUR(value)}
        </div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
