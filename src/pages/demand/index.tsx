import { View, Text, ScrollView } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

// 需求类型
interface Demand {
  id: string
  pet_type: string
  breed: string
  gender: string
  budget_min: number
  budget_max: number
  status: string
  quotes_count: number
  created_at: string
  color?: string
  age_min?: number
  age_max?: number
  vaccine_required?: boolean
  description?: string
}

// 单个报价
interface QuoteItem {
  id: string
  merchant_name: string
  merchant_avatar?: string
  price: number
  merchant_rating: number
  distance?: number
  description?: string
  created_at: string
}

// 热门需求（包含多个商家报价）
interface HotDemand {
  id: string
  pet_type: string
  breed: string
  gender: string
  budget_min: number
  budget_max: number
  color?: string
  description?: string
  quotes_count: number
  created_at: string
  quotes: QuoteItem[]  // 多个商家报价
}

export default function DemandPage() {
  // 主Tab：我的报价 / 平台热门报价
  const [mainTab, setMainTab] = useState('my')
  // 我的报价子Tab
  const [statusTab, setStatusTab] = useState('all')
  const [demands, setDemands] = useState<Demand[]>([])
  const [hotDemands, setHotDemands] = useState<HotDemand[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mainTab === 'my') {
      loadDemands()
    } else {
      loadHotDemands()
    }
  }, [mainTab, statusTab])

  // 加载我的需求列表
  const loadDemands = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { user_id: 'test-user-001' }
      if (statusTab !== 'all') {
        params.status = statusTab
      }

      const res = await Network.request({
        url: '/api/demands',
        method: 'GET',
        data: params
      })

      console.log('需求列表响应:', res)
      
      const data = res.data?.data || res.data
      
      // 检查是否有有效数据
      if (data && Array.isArray(data) && data.length > 0) {
        setDemands(data)
        return
      }
      
      // 没有有效数据，使用模拟数据
      throw new Error('暂无需求数据')
    } catch (error) {
      console.error('加载需求列表失败:', error)
      // 使用模拟数据，根据当前 Tab 过滤
      const allMockDemands = [
        {
          id: '1',
          pet_type: 'cat',
          breed: '英短蓝猫',
          gender: 'male',
          budget_min: 3000,
          budget_max: 5000,
          status: 'pending',
          quotes_count: 5,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          pet_type: 'dog',
          breed: '柯基犬',
          gender: 'female',
          budget_min: 5000,
          budget_max: 8000,
          status: 'quoted',
          quotes_count: 12,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          pet_type: 'cat',
          breed: '布偶猫',
          gender: 'female',
          budget_min: 8000,
          budget_max: 12000,
          status: 'completed',
          quotes_count: 8,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]
      // 根据状态 Tab 过滤模拟数据
      const filteredDemands = statusTab === 'all' 
        ? allMockDemands 
        : allMockDemands.filter(d => d.status === statusTab)
      setDemands(filteredDemands)
    } finally {
      setLoading(false)
    }
  }

  // 加载平台热门需求（报价数 >= 10）
  const loadHotDemands = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/demands/hot',
        method: 'GET',
        data: { min_quotes: 10 }
      })

      console.log('热门需求响应:', res)
      
      const data = res.data?.data || res.data
      
      // 检查是否有有效数据
      if (data && Array.isArray(data) && data.length > 0) {
        setHotDemands(data)
        return
      }
      
      // 没有有效数据，使用模拟数据
      throw new Error('暂无热门需求数据')
    } catch (error) {
      console.error('加载热门需求失败:', error)
      // 使用模拟数据 - 热门需求（报价数 >= 10）
      setHotDemands([
        {
          id: 'hot-1',
          pet_type: 'cat',
          breed: '英短蓝猫',
          gender: 'male',
          budget_min: 3000,
          budget_max: 5000,
          color: '蓝色',
          description: '求购一只健康的英短蓝猫，要求疫苗齐全，性格温顺',
          quotes_count: 15,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          quotes: [
            { id: 'q1', merchant_name: '萌宠家园', price: 3500, merchant_rating: 4.9, distance: 2.5, description: '健康纯种，已打疫苗', created_at: new Date().toISOString() },
            { id: 'q2', merchant_name: '爱心宠物店', price: 3200, merchant_rating: 4.7, distance: 3.2, description: '活泼可爱，包健康', created_at: new Date().toISOString() },
            { id: 'q3', merchant_name: '猫咪之家', price: 3800, merchant_rating: 4.8, distance: 1.8, description: '血统纯正，可看父母', created_at: new Date().toISOString() },
          ]
        },
        {
          id: 'hot-2',
          pet_type: 'dog',
          breed: '柯基犬',
          gender: 'female',
          budget_min: 5000,
          budget_max: 8000,
          color: '黄白双色',
          description: '想买一只小短腿柯基，母犬优先，要有正规疫苗本',
          quotes_count: 12,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          quotes: [
            { id: 'q4', merchant_name: '狗狗乐园', price: 6500, merchant_rating: 4.8, distance: 4.1, description: '纯种柯基，已驱虫', created_at: new Date().toISOString() },
            { id: 'q5', merchant_name: '萌宠世界', price: 5800, merchant_rating: 4.6, distance: 2.0, description: '可爱小短腿，性格活泼', created_at: new Date().toISOString() },
            { id: 'q6', merchant_name: '宠物之家', price: 7200, merchant_rating: 5.0, distance: 5.5, description: '赛级血统，品相佳', created_at: new Date().toISOString() },
          ]
        },
        {
          id: 'hot-3',
          pet_type: 'cat',
          breed: '布偶猫',
          gender: 'female',
          budget_min: 8000,
          budget_max: 12000,
          color: '海豹双色',
          description: '寻找一只颜值高的布偶猫，要求性格粘人，眼睛要蓝',
          quotes_count: 18,
          created_at: new Date(Date.now() - 10800000).toISOString(),
          quotes: [
            { id: 'q7', merchant_name: '布偶猫舍', price: 11000, merchant_rating: 5.0, distance: 3.5, description: '纯种布偶，颜值爆表', created_at: new Date().toISOString() },
            { id: 'q8', merchant_name: '猫咪乐园', price: 9500, merchant_rating: 4.9, distance: 2.8, description: '性格温顺，已打疫苗', created_at: new Date().toISOString() },
            { id: 'q9', merchant_name: '宠物精品店', price: 12800, merchant_rating: 4.7, distance: 6.0, description: '赛级品相，包健康', created_at: new Date().toISOString() },
          ]
        },
        {
          id: 'hot-4',
          pet_type: 'dog',
          breed: '金毛',
          gender: 'male',
          budget_min: 4000,
          budget_max: 6000,
          color: '金黄色',
          description: '求购金毛幼犬，要求聪明听话，适合家庭饲养',
          quotes_count: 11,
          created_at: new Date(Date.now() - 14400000).toISOString(),
          quotes: [
            { id: 'q10', merchant_name: '金毛之家', price: 5000, merchant_rating: 4.8, distance: 3.0, description: '聪明温顺，家庭首选', created_at: new Date().toISOString() },
            { id: 'q11', merchant_name: '萌宠世界', price: 4500, merchant_rating: 4.6, distance: 4.5, description: '健康活泼，已驱虫疫苗', created_at: new Date().toISOString() },
            { id: 'q12', merchant_name: '宠物乐园', price: 5500, merchant_rating: 4.9, distance: 2.2, description: '血统纯正，可办理证书', created_at: new Date().toISOString() },
          ]
        },
        {
          id: 'hot-5',
          pet_type: 'cat',
          breed: '美短虎斑',
          gender: 'male',
          budget_min: 2500,
          budget_max: 4000,
          color: '银虎斑',
          description: '求购美短虎斑，要求活泼好动，身体健康',
          quotes_count: 14,
          created_at: new Date(Date.now() - 18000000).toISOString(),
          quotes: [
            { id: 'q13', merchant_name: '美短猫舍', price: 3200, merchant_rating: 4.8, distance: 1.5, description: '活泼好动，身体健康', created_at: new Date().toISOString() },
            { id: 'q14', merchant_name: '猫咪之家', price: 2800, merchant_rating: 4.7, distance: 3.8, description: '经典虎斑纹，品相好', created_at: new Date().toISOString() },
            { id: 'q15', merchant_name: '宠物精品店', price: 3600, merchant_rating: 4.9, distance: 5.0, description: '血统纯正，已绝育可选', created_at: new Date().toISOString() },
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDemand = () => {
    Taro.navigateTo({ url: '/pages/demand-detail/index?action=create' })
  }

  const handleCardClick = async (id: string, status: string) => {
    if (status === 'pending') {
      // 待报价状态：进入需求详情页查看模式
      Taro.navigateTo({ url: `/pages/demand-detail/index?action=view&id=${id}` })
    } else if (status === 'completed') {
      // 已成交状态：获取订单信息并跳转到订单详情页
      try {
        const res = await Network.request({
          url: `/api/orders`,
          method: 'GET',
          data: { demand_id: id }
        })
        const data = res.data?.data || res.data
        if (data && data.length > 0) {
          // 跳转到第一个订单的详情页
          Taro.navigateTo({ url: `/pages/order-detail/index?orderId=${data[0].id}` })
        } else {
          Taro.showToast({ title: '暂无订单信息', icon: 'none' })
        }
      } catch (error) {
        console.error('获取订单失败:', error)
        Taro.showToast({ title: '获取订单失败', icon: 'error' })
      }
    } else {
      // 报价中等状态：进入报价列表页
      Taro.navigateTo({ url: `/pages/quote-list/index?demandId=${id}` })
    }
  }

  const handleEditDemand = (id: string) => {
    Taro.navigateTo({ url: `/pages/demand-detail/index?action=edit&id=${id}` })
  }

  const handleViewQuotes = (demandId: string) => {
    Taro.navigateTo({ url: `/pages/quote-list/index?demandId=${demandId}` })
  }

  const handleDeleteDemand = async (id: string) => {
    const result = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条需求吗？'
    })

    if (result.confirm) {
      try {
        await Network.request({
          url: `/api/demands/${id}`,
          method: 'DELETE'
        })
        Taro.showToast({ title: '删除成功', icon: 'success' })
        loadDemands()
      } catch (error) {
        console.error('删除失败:', error)
        Taro.showToast({ title: '删除失败', icon: 'error' })
      }
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await Network.request({
        url: `/api/demands/${id}`,
        method: 'PUT',
        data: { status }
      })
      Taro.showToast({ title: '操作成功', icon: 'success' })
      loadDemands()
    } catch (error) {
      console.error('更新状态失败:', error)
      Taro.showToast({ title: '操作失败', icon: 'error' })
    }
  }

  const handleQuoteClick = (demandId: string, quoteId: string) => {
    Taro.navigateTo({ url: `/pages/quote-detail/index?demandId=${demandId}&quoteId=${quoteId}` })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: '待报价' },
      quoted: { variant: 'default', label: '报价中' },
      completed: { variant: 'outline', label: '已成交' },
      expired: { variant: 'outline', label: '已过期' }
    }
    return statusMap[status] || { variant: 'secondary', label: '未知' }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else {
      return `${Math.floor(diff / 86400000)}天前`
    }
  }

  const getPetEmoji = (petType?: string) => {
    if (petType === 'cat') return '🐱'
    if (petType === 'dog') return '🐕'
    return '🐾'
  }

  const getBgColor = (petType?: string) => {
    if (petType === 'cat') return 'bg-gradient-to-br from-pink-50 to-pink-100'
    if (petType === 'dog') return 'bg-gradient-to-br from-orange-50 to-orange-100'
    return 'bg-gradient-to-br from-teal-50 to-teal-100'
  }

  // 渲染热门需求卡片（含多商家报价）
  const renderHotDemandCard = (demand: HotDemand) => {
    return (
      <Card 
        key={demand.id} 
        className="bg-white shadow-sm mb-4 overflow-hidden"
        onClick={() => handleCardClick(demand.id, 'quoted')}
      >
        <CardContent className="p-0">
          {/* 需求头部 */}
          <View className={`${getBgColor(demand.pet_type)} p-4`}>
            <View className="flex items-start gap-3">
              {/* 宠物图标 */}
              <View className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Text className="text-3xl">{getPetEmoji(demand.pet_type)}</Text>
              </View>
              
              {/* 需求信息 */}
              <View className="flex-1">
                <View className="flex items-center gap-2 mb-1">
                  <Text className="text-base font-semibold text-gray-800">
                    {demand.breed}
                  </Text>
                  <View className="px-2 py-1 rounded-full bg-orange-500">
                    <Text className="text-xs text-white font-medium">🔥 热门</Text>
                  </View>
                </View>
                
                <View className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Text>{demand.gender === 'male' ? '♂ 公' : '♀ 母'}</Text>
                  {demand.color && (
                    <>
                      <Text>·</Text>
                      <Text>{demand.color}</Text>
                    </>
                  )}
                </View>
                
                <View className="flex items-center gap-2">
                  <Text className="text-sm font-medium text-orange-600">
                    预算 ¥{demand.budget_min.toLocaleString()}-{demand.budget_max.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              {/* 报价数 */}
              <View className="flex flex-col items-end">
                <Text className="text-2xl font-bold text-orange-500">{demand.quotes_count}</Text>
                <Text className="text-xs text-gray-500">个报价</Text>
              </View>
            </View>
            
            {/* 需求描述 */}
            {demand.description && (
              <View className="mt-3 pt-3 border-t border-white border-opacity-50">
                <Text className="text-sm text-gray-600 line-clamp-2">
                  {demand.description}
                </Text>
              </View>
            )}
          </View>
          
          {/* 商家报价列表 */}
          <View className="px-4 py-3">
            <View className="flex items-center justify-between mb-3">
              <Text className="text-sm font-medium text-gray-700">商家报价</Text>
              <Text className="text-xs text-gray-400">{formatTime(demand.created_at)}</Text>
            </View>
            
            {/* 报价卡片列表 */}
            <View className="space-y-2">
              {demand.quotes.slice(0, 3).map((quote, index) => (
                <View
                  key={quote.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  onClick={() => handleQuoteClick(demand.id, quote.id)}
                >
                  {/* 排名 */}
                  <View 
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-amber-600' : 'bg-gray-200'
                    }`}
                  >
                    <Text className="text-xs font-bold text-white">{index + 1}</Text>
                  </View>
                  
                  {/* 商家信息 */}
                  <View className="flex-1 min-w-0">
                    <View className="flex items-center gap-2">
                      <Text className="text-sm font-medium text-gray-800 truncate">
                        {quote.merchant_name}
                      </Text>
                      <View className="flex items-center gap-0.5">
                        <Text className="text-xs text-orange-500">⭐</Text>
                        <Text className="text-xs text-gray-600">{quote.merchant_rating}</Text>
                      </View>
                    </View>
                    <Text className="text-xs text-gray-500 truncate mt-1">
                      {quote.description}
                    </Text>
                  </View>
                  
                  {/* 价格 */}
                  <View className="flex flex-col items-end">
                    <Text className="text-base font-bold text-orange-500">
                      ¥{quote.price.toLocaleString()}
                    </Text>
                    {quote.distance && (
                      <Text className="text-xs text-gray-400">{quote.distance}km</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
            
            {/* 查看更多 */}
            {demand.quotes_count > 3 && (
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3"
                onClick={() => handleViewQuotes(demand.id)}
              >
                <Text className="text-sm">查看全部 {demand.quotes_count} 个报价</Text>
              </Button>
            )}
          </View>
        </CardContent>
      </Card>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 主Tab切换 */}
      <View className="bg-white border-b border-gray-100">
        <Tabs value={mainTab} onValueChange={setMainTab}>
          <TabsList className="w-full">
            <TabsTrigger value="my" className="flex-1">
              我的报价
            </TabsTrigger>
            <TabsTrigger value="hot" className="flex-1">
              平台热门报价
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      {/* 我的报价内容 */}
      {mainTab === 'my' && (
        <>
          {/* 顶部操作栏 */}
          <View className="bg-white px-4 py-4 border-b border-gray-100">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleCreateDemand}
            >
              <Text className="text-white font-medium">发布买宠需求</Text>
            </Button>
          </View>

          {/* 筛选标签 */}
          <View className="bg-white px-4 py-3">
            <Tabs value={statusTab} onValueChange={setStatusTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  全部
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  待报价
                </TabsTrigger>
                <TabsTrigger value="quoted" className="flex-1">
                  报价中
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                  已成交
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </View>

          {/* 需求列表 */}
          <ScrollView 
            scrollY 
            style={{ height: 'calc(100vh - 180px)' }}
          >
            <View className="px-4 py-4 pb-20">
              {loading ? (
                <View className="flex items-center justify-center py-12">
                  <Text className="text-sm text-gray-500">加载中...</Text>
                </View>
              ) : (
                demands.map((demand) => {
                  const badge = getStatusBadge(demand.status)
                  return (
                    <Card 
                      key={demand.id} 
                      className="bg-white shadow-sm mb-3"
                      onClick={() => handleCardClick(demand.id, demand.status)}
                    >
                      <CardContent className="p-4">
                        <View className="flex items-start gap-3">
                          <View
                            className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              demand.pet_type === 'cat' ? 'bg-pink-100' : 'bg-blue-100'
                            }`}
                          >
                            <Text className="text-3xl">
                              {demand.pet_type === 'cat' ? '🐱' : '🐕'}
                            </Text>
                          </View>
                          <View className="flex-1 min-w-0">
                            <View className="flex items-center justify-between mb-2">
                              <View className="flex items-center gap-2">
                                <Text className="block text-base font-medium text-gray-800">
                                  {demand.breed}
                                </Text>
                                <Badge variant={badge.variant} className="text-xs">
                                  {badge.label}
                                </Badge>
                              </View>
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <View className="px-2 py-1">
                                    <Text className="text-gray-400">•••</Text>
                                  </View>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditDemand(demand.id)}>
                                    编辑
                                  </DropdownMenuItem>
                                  {demand.status === 'quoted' && (
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(demand.id, 'completed')}>
                                      标记成交
                                    </DropdownMenuItem>
                                  )}
                                  {demand.status !== 'expired' && demand.status !== 'completed' && (
                                    <DropdownMenuItem onClick={() => handleUpdateStatus(demand.id, 'expired')}>
                                      下架
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleDeleteDemand(demand.id)}>
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </View>
                            
                            <View className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <Text>{demand.gender === 'male' ? '♂ 公' : '♀ 母'}</Text>
                              {demand.color && (
                                <>
                                  <Text>·</Text>
                                  <Text>{demand.color}</Text>
                                </>
                              )}
                              <Text>·</Text>
                              <Text>预算 {demand.budget_min}-{demand.budget_max}元</Text>
                            </View>
                            
                            <View className="flex items-center justify-between">
                              <Text className="block text-xs text-gray-400">
                                {formatTime(demand.created_at)} · 已收到{demand.quotes_count}个报价
                              </Text>
                              {demand.status !== 'completed' && demand.status !== 'expired' && demand.quotes_count > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewQuotes(demand.id)}
                                >
                                  查看报价
                                </Button>
                              )}
                            </View>
                          </View>
                        </View>
                      </CardContent>
                    </Card>
                  )
                })
              )}

              {!loading && demands.length === 0 && (
                <View className="flex flex-col items-center justify-center py-12">
                  <View className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Text className="text-3xl">📝</Text>
                  </View>
                  <Text className="block text-sm text-gray-500 mb-3">暂无需求</Text>
                  <Button onClick={handleCreateDemand}>发布需求</Button>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}

      {/* 平台热门报价内容 */}
      {mainTab === 'hot' && (
        <ScrollView 
          scrollY 
          style={{ height: 'calc(100vh - 60px)' }}
        >
          {/* 提示信息 */}
          <View className="px-4 py-3 bg-orange-50 border-b border-orange-100">
            <Text className="text-xs text-orange-600 text-center">
              🔥 展示报价数 ≥ 10 的热门需求，发现优质商家报价
            </Text>
          </View>
          
          {loading ? (
            <View className="flex items-center justify-center py-20">
              <Text className="text-gray-400">加载中...</Text>
            </View>
          ) : hotDemands.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-20">
              <Text className="text-4xl mb-3">🐾</Text>
              <Text className="text-gray-400">暂无热门报价</Text>
            </View>
          ) : (
            <View className="px-4 py-4 pb-20">
              {hotDemands.map(demand => renderHotDemandCard(demand))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  )
}
