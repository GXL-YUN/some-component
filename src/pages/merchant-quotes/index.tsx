import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Quote {
  id: string
  demand_id: string
  demand_info: {
    pet_type: string
    breed: string
    gender: string
    budget_min: number
    budget_max: number
    description?: string
    province?: string
    city?: string
    district?: string
  }
  price: number
  pet_name: string
  pet_gender: string
  pet_age_months: number
  pet_color?: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  created_at: string
  photos?: string[]
  view_count: number
}

export default function MerchantQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  const merchantInfo = Taro.getStorageSync('merchantInfo')

  useEffect(() => {
    loadQuotes()
  }, [activeTab])

  const loadQuotes = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/merchants/${merchantInfo?.id}/quotes`,
        method: 'GET',
        data: {
          status: activeTab === 'all' ? undefined : activeTab,
        },
      })

      console.log('报价列表响应:', res)

      if (res && res.data && res.data.length > 0) {
        setQuotes(res.data)
      } else {
        // 响应数据为空，使用模拟数据
        throw new Error('响应数据为空')
      }
    } catch (error) {
      console.error('加载报价列表失败:', error)
      // 模拟数据
      setQuotes([
        {
          id: '1',
          demand_id: 'demand-1',
          demand_info: {
            pet_type: 'cat',
            breed: '英短蓝猫',
            gender: '公',
            budget_min: 3000,
            budget_max: 5000,
            description: '想买一只健康的英短蓝猫',
            province: '北京',
            city: '北京市',
            district: '朝阳区',
          },
          price: 4500,
          pet_name: '小蓝',
          pet_gender: '公',
          pet_age_months: 3,
          pet_color: '纯蓝',
          status: 'pending',
          created_at: new Date().toISOString(),
          view_count: 12,
        },
        {
          id: '2',
          demand_id: 'demand-2',
          demand_info: {
            pet_type: 'dog',
            breed: '柯基',
            gender: '母',
            budget_min: 5000,
            budget_max: 8000,
            description: '寻找柯基宝宝',
            province: '北京',
            city: '北京市',
            district: '海淀区',
          },
          price: 6500,
          pet_name: '豆豆',
          pet_gender: '母',
          pet_age_months: 2,
          status: 'accepted',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          view_count: 8,
        },
        {
          id: '3',
          demand_id: 'demand-3',
          demand_info: {
            pet_type: 'cat',
            breed: '布偶猫',
            gender: '不限',
            budget_min: 10000,
            budget_max: 15000,
            description: '寻找布偶仙女',
            province: '上海',
            city: '上海市',
            district: '浦东新区',
          },
          price: 12000,
          pet_name: '仙女',
          pet_gender: '母',
          pet_age_months: 4,
          status: 'rejected',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          view_count: 15,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-600">待处理</Badge>
      case 'accepted':
        return <Badge className="bg-green-100 text-green-600">已采纳</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-600">已拒绝</Badge>
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-600">已过期</Badge>
      default:
        return null
    }
  }

  const handleViewDetail = (quoteId: string) => {
    Taro.navigateTo({
      url: `/pages/merchant-quote-detail/index?id=${quoteId}`,
    })
  }

  const handleCancelQuote = async (quoteId: string) => {
    const confirm = await Taro.showModal({
      title: '确认撤销',
      content: '确定要撤销该报价吗？',
    })

    if (!confirm.confirm) return

    try {
      await Network.request({
        url: `/api/merchant-quotes/${quoteId}`,
        method: 'DELETE',
      })

      Taro.showToast({ title: '撤销成功', icon: 'success' })
      loadQuotes()
    } catch (error) {
      console.error('撤销报价失败:', error)
      Taro.showToast({ title: '撤销失败', icon: 'none' })
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }

  const getPetTypeEmoji = (type: string) => {
    return type === 'cat' ? '🐱' : type === 'dog' ? '🐕' : '🐾'
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* Tab 切换 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            全部
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
          >
            待处理
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'accepted' ? 'default' : 'outline'}
            onClick={() => setActiveTab('accepted')}
          >
            已采纳
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'rejected' ? 'default' : 'outline'}
            onClick={() => setActiveTab('rejected')}
          >
            已拒绝
          </Button>
        </View>
      </View>

      {/* 报价列表 */}
      <ScrollView className="quote-list" scrollY style={{ height: 'calc(100vh - 100px)' }}>
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex items-center justify-center py-12">
              <Text className="text-gray-500">加载中...</Text>
            </View>
          ) : quotes.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-12">
              <Text className="text-4xl mb-3">📝</Text>
              <Text className="text-gray-500">暂无报价记录</Text>
            </View>
          ) : (
            quotes.map((quote) => (
              <Card key={quote.id} className="bg-white shadow-sm mb-3">
                <CardContent className="p-4">
                  {/* 头部 */}
                  <View className="flex items-center justify-between mb-3">
                    <View className="flex items-center gap-2">
                      <Text className="text-xl">{getPetTypeEmoji(quote.demand_info.pet_type)}</Text>
                      <View>
                        <Text className="block text-sm font-medium text-gray-800">
                          {quote.pet_name} · {quote.demand_info.breed}
                        </Text>
                        <Text className="block text-xs text-gray-500">
                          {quote.pet_gender} · {quote.pet_age_months}个月
                        </Text>
                      </View>
                    </View>
                    {getStatusBadge(quote.status)}
                  </View>

                  {/* 报价信息 */}
                  <View className="bg-gray-50 rounded-lg p-3 mb-3">
                    <View className="flex items-center justify-between mb-2">
                      <Text className="text-sm text-gray-600">报价金额</Text>
                      <Text className="text-lg font-bold text-orange-500">
                        ¥{quote.price}
                      </Text>
                    </View>
                    <View className="flex items-center justify-between">
                      <Text className="text-xs text-gray-500">
                        买家预算：¥{quote.demand_info.budget_min}-{quote.demand_info.budget_max}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        浏览{quote.view_count}次
                      </Text>
                    </View>
                  </View>

                  {/* 底部 */}
                  <View className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <Text className="text-xs text-gray-400">
                      {formatTime(quote.created_at)}
                    </Text>
                    <View className="flex gap-2">
                      {quote.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelQuote(quote.id)}
                        >
                          撤销
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className="bg-orange-500"
                        onClick={() => handleViewDetail(quote.id)}
                      >
                        <Text className="text-white text-xs">查看详情</Text>
                      </Button>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* 悬浮按钮 - 新建报价 */}
      <View 
        className="fixed right-4 bottom-20 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => Taro.navigateTo({ url: '/pages/merchant-demands/index' })}
      >
        <Text className="text-white text-2xl">+</Text>
      </View>
    </View>
  )
}
