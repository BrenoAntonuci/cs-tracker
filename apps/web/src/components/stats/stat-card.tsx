interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  highlight?: boolean
}

export function StatCard({ label, value, subtitle, highlight }: StatCardProps) {
  return (
    <div className="bg-cs-card border border-cs-border rounded-xl p-5">
      <p className="text-cs-muted text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${highlight ? 'text-cs-orange' : 'text-white'}`}>
        {value}
      </p>
      {subtitle && <p className="text-cs-muted text-xs mt-1">{subtitle}</p>}
    </div>
  )
}
