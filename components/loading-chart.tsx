import { Card } from "@/components/ui/card"

export function LoadingChart() {
  return (
    <Card className="bg-[#1a1b23] border-gray-800">
      <div className="p-9">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold mb-2">Loading...</h1>
            <div className="h-16 w-48 bg-gray-800 animate-pulse rounded"></div>
            <div className="mt-2 h-8 w-24 bg-gray-800 animate-pulse rounded"></div>
          </div>
          <div className="text-right">
            <div className="h-6 w-32 bg-gray-800 animate-pulse rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-800 animate-pulse rounded"></div>
              <div className="h-6 w-48 bg-gray-800 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
        <div className="h-[500px] bg-gray-800/50 animate-pulse rounded"></div>
      </div>
    </Card>
  )
}