/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import { Card } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from 'lucide-react'
import { CountdownTimer } from '@/components/countdown-timer'

// Apply dark theme
const darkTheme = {
  background: '#1a1b23',
  textColor: '#ffffff',
  gridColor: 'rgba(255, 255, 255, 0.07)',
  lineColor: '#abff00'
}

// Custom marker template
const markerTemplate = (type: string, time?: string) => `
  <div style="display: flex; flex-direction: column; align-items: center;">
    <span style="color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 4px;">
      ${type}${time ? `<br/><span style="color: rgba(255,255,255,0.4); font-size: 11px;">${time}</span>` : ''}
    </span>
    <svg width="12" height="6" viewBox="0 0 12 6" style="display: block;">
      <path d="M6 6L0 0H12L6 6Z" fill="rgba(255, 255, 255, 0.4)" />
    </svg>
  </div>
`
const CryptoChart: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(3464.85)
  const [priceChange, setPriceChange] = useState(2.08)
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const basePrice = useRef(3462.77)
  const lastPrices = useRef<number[]>([])
  const roundStartTime = useRef(Date.now())
  const roundDuration = 60000 // Exactly 1 minute in milliseconds
  const endDuration = 55000

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      backgroundColor: darkTheme.background,
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      animation: {
        duration: 750
      },
      spacing: [10, 0, 0, 0]
    },
    title: {
      text: 'ETHUSD'
    },
    xAxis: {
      type: 'datetime',
      overscroll: 500000,
      range: 4 * 200000,
      lineColor: darkTheme.gridColor,
      gridLineColor: darkTheme.gridColor,
      gridLineWidth: 1,
      labels: {
        style: {
          color: 'rgba(255,255,255,0.6)',
          fontSize: '10px'
        },
        format: '{value:%H:%M:%S}'
      },
      tickLength: 0,
      minPadding: 0,
      maxPadding: 0,
      plotLines: [{
        id: 'current-line',
        color: 'rgba(255, 255, 255, 0.2)',
        width: 1,
        dashStyle: 'Dash',
        value: roundStartTime.current,
        label: {
          useHTML: true,
          text: markerTemplate('Current', formatTime(roundStartTime.current)),
          align: 'center',
          rotation: 0,
          y: -20
        }
      },
      {
        id: 'end-line',
        color: 'rgba(255, 255, 255, 0.2)',
        width: 1,
        dashStyle: 'Dash',
        value: roundStartTime.current + endDuration,
        label: {
          useHTML: true,
          text: markerTemplate('End', formatTime(roundStartTime.current + endDuration)),
          align: 'center',
          rotation: 0,
          y: -20
        }
      }]
    },
    yAxis: {
      title: {
        text: ''
      },
      gridLineColor: darkTheme.gridColor,
      gridLineWidth: 1,
      labels: {
        style: {
          color: 'rgba(255,255,255,0.6)',
          fontSize: '10px'
        },
        align: 'right',
        x: -8,
        format: '{value:.2f}'
      },
      plotLines: [{
        id: 'base-line',
        value: basePrice.current,
        color: 'rgba(255, 255, 255, 0.2)',
        width: 1,
        zIndex: 1,
        dashStyle: 'Dash',
        label: {
          useHTML: true,
          text: basePrice.current.toFixed(2),
          align: 'right',
          style: {
            color: '#ffffff',
            fontSize: '11px'
          },
          x: -10
        }
      }]
    },
    series: [{
      type: 'line',
      name: 'Price',
      data: [],
      color: darkTheme.lineColor,
      lineWidth: 2,
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false
          }
        }
      },
      states: {
        hover: {
          lineWidth: 2
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(this: any) {
          const point = this as Highcharts.Point; // Type assertion
          if (point === this.series.points[this.series.points.length - 1]) {
            const isAboveBase = this.y > basePrice.current;
            return `<div style="
              position: relative;
              display: inline-block;
              background: ${isAboveBase ? '#00ff95' : '#ff3b3b'}; 
              color: #ffffff; 
              padding: 3px 6px; 
              border-radius: 3px;
              font-size: 11px;
              font-weight: 500;
              font-family: 'Inter', sans-serif;
              margin-left: 5px;
            ">${this.y?.toFixed(2)}</div>`
          }
          return null;
        },
        style: {
          textOutline: 'none'
        },
        crop: false,
        overflow: "justify",
      }
    }],
    tooltip: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    rangeSelector: {
      enabled: false
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    }
  })

  useEffect(() => {
    const initialData = () => {
      const data = []
      const now = roundStartTime.current
      const startTime = now - roundDuration
      
      for (let i = 0; i <= 60; i++) {
        const price = basePrice.current + (Math.random() - 0.5) * 2
        data.push([startTime + (i * 1000), price])
        lastPrices.current.push(price)
      }
      return data
    }

    setChartOptions((prevOptions: any) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        height: 500,
      },
      series: [{
        ...prevOptions.series[0],
        data: initialData()
      }] as any
    }))

    const interval = setInterval(() => {
      const chart = chartRef.current?.chart
      if (!chart) return

      const currentTime = Date.now()
      const timeIntoRound = currentTime - roundStartTime.current

      const lastPrice = lastPrices.current[lastPrices.current.length - 1]
      const maxChange = 0.1
      const newPrice = lastPrice + (Math.random() - 0.5) * maxChange

      setCurrentPrice(newPrice)
      setPriceChange(((newPrice - basePrice.current) / basePrice.current) * 100)

      if (timeIntoRound >= endDuration) {
        roundStartTime.current = currentTime
        basePrice.current = newPrice

        chart.xAxis[0].removePlotLine('current-line')
        chart.xAxis[0].addPlotLine({
          id: 'current-line',
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1,
          dashStyle: 'Dash',
          value: roundStartTime.current,
          label: {
            useHTML: true,
            text: markerTemplate('Current', formatTime(roundStartTime.current)),
            align: 'center',
            rotation: 0,
            y: -20
          }
        })

        chart.yAxis[0].removePlotLine('base-line')
        chart.yAxis[0].addPlotLine({
          id: 'base-line',
          value: basePrice.current,
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1,
          zIndex: 1,
          dashStyle: 'Dash',
          label: {
            useHTML: true,
            text: basePrice.current.toFixed(2),
            align: 'right',
            style: {
              color: '#ffffff',
              fontSize: '11px'
            },
            x: -10
          }
        })

        chart.xAxis[0].removePlotLine('end-line')
        chart.xAxis[0].addPlotLine({
          id: 'end-line',
          color: 'rgba(255, 255, 255, 0.2)',
          width: 1,
          dashStyle: 'Dash',
          value: roundStartTime.current + endDuration,
          label: {
            useHTML: true,
            text: markerTemplate('End', formatTime(roundStartTime.current + endDuration)),
            align: 'center',
            rotation: 0,
            y: -20
          }
        })
      }

      const series = chart.series[0]
      const point = {
        x: currentTime,
        y: newPrice,
        marker: {
          enabled: true,
          radius: 4,
          fillColor: newPrice > basePrice.current ? '#00ff95' : '#ff3b3b',
          states: {
            hover: {
              enabled: false
            }
          }
        }
      }
      
      if (series.data.length > 0) {
        const lastPoint = series.data[series.data.length - 1]
        lastPoint.update({
          marker: {
            enabled: false
          }
        }, false)
      }

      series.addPoint(point, true, series.data.length > 60)

      lastPrices.current.push(newPrice)
      if (lastPrices.current.length > 60) {
        lastPrices.current.shift()
      }

      chart.xAxis[0].setExtremes(
        currentTime - roundDuration,
        roundStartTime.current + roundDuration
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1a1b23] p-4">
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <CountdownTimer />
        </div>
        <Card className="bg-[#1a1b23] border-gray-800">
          <div className="p-9">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-white text-2xl font-bold mb-2">MOON or DOOM</h1>
                <div className="text-[#00ff95] text-6xl font-mono tracking-wider">
                  ${currentPrice.toFixed(2)}
                </div>
                <div className={`flex items-center mt-2 px-3 py-1 rounded-md inline-block
                  ${priceChange >= 0 ? 'bg-[#1e2c26] text-[#00ff95]' : 'bg-[#2c1e1e] text-[#ff0000]'}`}>
                  {priceChange >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-white mb-2">Current Round</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-end gap-2 text-[#00ff95]">
                    <span>0x</span>
                    <span>Payout</span>
                    <span>0</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-red-500">
                    <span>0x</span>
                    <span>Payout</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[500px]">
              <HighchartsReact
                ref={chartRef}
                highcharts={Highcharts}
                options={chartOptions}
                constructorType={'stockChart'}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CryptoChart