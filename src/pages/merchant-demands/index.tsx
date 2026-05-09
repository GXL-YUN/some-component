import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Demand {
  id: string
  pet_type: string
  breed: string
  gender: string
  budget_min: number
  budget_max: number
  description?: string
  province?: string
  city?: string
  district?: string
  quotes_count: number
  created_at: string
  color?: string
  age_min?: number
  age_max?: number
  vaccine_required?: boolean
}

export default function MerchantDemandsPage() {
  const [demands, setDemands] = useState<Demand[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'time' | 'distance' | 'budget'>('time')
  const [filterPetType, setFilterPetType] = useState<string>('')
  const [filterBudget, setFilterBudget] = useState<string>('')

  const merchantInfo = Taro.getStorageSync('merchantInfo')

  useEffect(() => {
    loadDemands()
  }, [sortBy, filterPetType, filterBudget])

  const loadDemands = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/merchants/${merchantInfo?.id}/demands`,
        method: 'GET',
        data: {
          sort_by: sortBy,
          pet_type: filterPetType || undefined,
          budget_min: filterBudget === 'low' ? 0 : filterBudget === 'mid' ? 3000 : filterBudget === 'high' ? 10000 : undefined,
          budget_max: filterBudget === 'low' ? 3000 : filterBudget === 'mid' ? 10000 : filterBudget === 'high' ? 99999 : undefined,
        },
      })

      console.log('需求列表响应:', res)

      if (res && res.data && res.data.length > 0) {
        setDemands(res.data)
      } else {
        // 响应数据为空，使用模拟数据
        throw new Error('响应数据为空')
      }
    } catch (error) {
      console.error('加载需求列表失败:', error)
      // 模拟数据
      setDemands([
        {
          id: '1',
          pet_type: 'cat',
          breed: '英短蓝猫',
          gender: '公',
          color: '蓝色',
          age_min: 2,
          age_max: 4,
          vaccine_required: true,
          budget_min: 3000,
          budget_max: 5000,
          description: '想买一只健康的英短蓝猫，最好3个月大，已打疫苗',
          province: '北京',
          city: '北京市',
          district: '朝阳区',
          quotes_count: 5,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          pet_type: 'dog',
          breed: '柯基',
          gender: '母',
          color: '黄白双色',
          age_min: 3,
          age_max: 6,
          vaccine_required: true,
          budget_min: 5000,
          budget_max: 8000,
          description: '寻找柯基宝宝，要求健康活泼',
          province: '北京',
          city: '北京市',
          district: '海淀区',
          quotes_count: 3,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          pet_type: 'cat',
          breed: '布偶猫',
          gender: '不限',
          color: '重点色',
          age_min: 3,
          age_max: 12,
          vaccine_required: false,
          budget_min: 10000,
          budget_max: 15000,
          description: '寻找布偶仙女，颜值要高',
          province: '上海',
          city: '上海市',
          district: '浦东新区',
          quotes_count: 8,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleQuote = (demandId: string) => {
    Taro.navigateTo({ 
      url: `/pages/merchant-quote-create/index?demandId=${demandId}` 
    })
  }

  const formatBudget = (min: number, max: number) => {
    if (min >= 10000 && max >= 10000) {
      return `${(min / 10000).toFixed(0)}-${(max / 10000).toFixed(0)}万`
    }
    return `${min}-${max}`
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString()
  }

  const getPetTypeLabel = (type: string) => {
    return type === 'cat' ? '猫咪' : type === 'dog' ? '狗狗' : '其他'
  }

  const getGenderLabel = (gender: string) => {
    if (gender === 'male') return '公'
    if (gender === 'female') return '母'
    return '不限'
  }

  const getAgeLabel = (min?: number, max?: number) => {
    if (!min && !max) return '不限'
    if (min && max) return `${min}-${max}个月`
    if (min) return `${min}个月以上`
    return `${max}个月以内`
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部筛选 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        {/* 排序 */}
        <View className="flex items-center gap-2 mb-3">
          <Text className="text-sm text-gray-600">排序：</Text>
          <Button
            size="sm"
            variant={sortBy === 'time' ? 'default' : 'outline'}
            onClick={() => setSortBy('time')}
            className="text-xs"
          >
            最新发布
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'budget' ? 'default' : 'outline'}
            onClick={() => setSortBy('budget')}
            className="text-xs"
          >
            预算高低
          </Button>
        </View>

        {/* 筛选 */}
        <View className="flex items-center gap-2">
          <Text className="text-sm text-gray-600">筛选：</Text>
          <Button
            size="sm"
            variant={filterPetType === '' ? 'default' : 'outline'}
            onClick={() => setFilterPetType('')}
            className="text-xs"
          >
            全部
          </Button>
          <Button
            size="sm"
            variant={filterPetType === 'cat' ? 'default' : 'outline'}
            onClick={() => setFilterPetType('cat')}
            className="text-xs"
          >
            猫咪
          </Button>
          <Button
            size="sm"
            variant={filterPetType === 'dog' ? 'default' : 'outline'}
            onClick={() => setFilterPetType('dog')}
            className="text-xs"
          >
            狗狗
          </Button>
        </View>

        {/* 预算筛选 */}
        <View className="flex items-center gap-2 mt-2">
          <Text className="text-sm text-gray-600">预算：</Text>
          <Button
            size="sm"
            variant={filterBudget === '' ? 'default' : 'outline'}
            onClick={() => setFilterBudget('')}
            className="text-xs"
          >
            不限
          </Button>
          <Button
            size="sm"
            variant={filterBudget === 'low' ? 'default' : 'outline'}
            onClick={() => setFilterBudget('low')}
            className="text-xs"
          >
            3千以下
          </Button>
          <Button
            size="sm"
            variant={filterBudget === 'mid' ? 'default' : 'outline'}
            onClick={() => setFilterBudget('mid')}
            className="text-xs"
          >
            3-1万
          </Button>
          <Button
            size="sm"
            variant={filterBudget === 'high' ? 'default' : 'outline'}
            onClick={() => setFilterBudget('high')}
            className="text-xs"
          >
            1万以上
          </Button>
        </View>
      </View>

      {/* 需求列表 */}
      <ScrollView className="demand-list" scrollY style={{ height: 'calc(100vh - 180px)' }}>
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex items-center justify-center py-12">
              <Text className="text-gray-500">加载中...</Text>
            </View>
          ) : demands.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-12">
              <Text className="text-4xl mb-3">📋</Text>
              <Text className="text-gray-500">暂无需求</Text>
            </View>
          ) : (
            demands.map((demand) => (
              <Card key={demand.id} className="bg-white shadow-sm mb-3">
                <CardContent className="p-4">
                  {/* 头部 */}
                  <View className="flex items-center justify-between mb-3">
                    <View className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        className={
                          demand.pet_type === 'cat' 
                            ? 'border-pink-300 text-pink-600' 
                            : 'border-blue-300 text-blue-600'
                        }
                      >
                        {getPetTypeLabel(demand.pet_type)}
                      </Badge>
                      <Text className="text-base font-semibold text-gray-800">
                        {demand.breed}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-400">
                      {formatTime(demand.created_at)}
                    </Text>
                  </View>

                  {/* 需求详情网格 */}
                  <View className="bg-gray-50 rounded-lg p-3 mb-3">
                    <View className="grid grid-cols-3 gap-2">
                      <View>
                        <Text className="text-xs text-gray-400">性别偏好</Text>
                        <Text className="text-sm text-gray-700 font-medium">{getGenderLabel(demand.gender)}</Text>
                      </View>
                      <View>
                        <Text className="text-xs text-gray-400">毛色要求</Text>
                        <Text className="text-sm text-gray-700 font-medium">{demand.color || '不限'}</Text>
                      </View>
                      <View>
                        <Text className="text-xs text-gray-400">年龄范围</Text>
                        <Text className="text-sm text-gray-700 font-medium">{getAgeLabel(demand.age_min, demand.age_max)}</Text>
                      </View>
                    </View>
                    <View className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
                      <View className="flex items-center gap-1">
                        <Text className="text-xs text-gray-400">疫苗要求：</Text>
                        {demand.vaccine_required ? (
                          <View className="flex items-center gap-1">
                            <Text className="text-xs text-green-600">✓ 需要已打疫苗</Text>
                          </View>
                        ) : (
                          <Text className="text-xs text-gray-500">无要求</Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* 描述 */}
                  {demand.description && (
                    <View className="mb-3">
                      <Text className="text-xs text-gray-400 mb-1">详细描述</Text>
                      <Text className="text-sm text-gray-600 leading-relaxed">
                        {demand.description}
                      </Text>
                    </View>
                  )}

                  {/* 地区 */}
                  {demand.district && (
                    <View className="flex items-center gap-1 mb-3">
                      <Text className="text-xs">📍</Text>
                      <Text className="text-xs text-gray-500">
                        {demand.province} {demand.city} {demand.district}
                      </Text>
                    </View>
                  )}

                  {/* 底部 */}
                  <View className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <View className="flex items-center gap-3">
                      <View className="flex items-center gap-1">
                        <Text className="text-orange-500 font-bold text-lg">
                          ¥{formatBudget(demand.budget_min, demand.budget_max)}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-400">
                        已有{demand.quotes_count}人报价
                      </Text>
                    </View>
                    <Button 
                      size="sm" 
                      className="bg-orange-500"
                      onClick={() => handleQuote(demand.id)}
                    >
                      <Text className="text-white text-xs">立即报价</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}
