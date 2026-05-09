import { View, Text } from '@tarojs/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Store {
  id: string
  name: string
  logo_url?: string
  rating: number
  reviews_count: number
  distance: number
  opening_hours: string
  is_open: boolean
  address: string
  description?: string
}

export default function GroomingPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance')

  useEffect(() => {
    loadStores()
  }, [sortBy])

  const loadStores = async () => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/stores',
        method: 'GET',
        data: { sort_by: sortBy }
      })

      if (res.data) {
        setStores(res.data)
      }
    } catch (error) {
      console.error('加载门店列表失败:', error)
      // 使用模拟数据
      setStores([
        {
          id: '1',
          name: '萌宠洗护中心',
          rating: 4.9,
          reviews_count: 256,
          distance: 1.2,
          opening_hours: '09:00-21:00',
          is_open: true,
          address: '朝阳区建国路88号',
          description: '专业宠物洗护，服务热情周到'
        },
        {
          id: '2',
          name: '宠物乐园美容馆',
          rating: 4.8,
          reviews_count: 189,
          distance: 2.5,
          opening_hours: '10:00-20:00',
          is_open: true,
          address: '海淀区中关村大街1号',
          description: '高端宠物美容，环境舒适'
        },
        {
          id: '3',
          name: '爱宠之家',
          rating: 4.7,
          reviews_count: 142,
          distance: 3.8,
          opening_hours: '09:00-22:00',
          is_open: false,
          address: '西城区西单北大街100号',
          description: '宠物洗护、医疗、寄养一站式服务'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleStoreDetail = (storeId: string) => {
    Taro.navigateTo({ url: `/pages/store-detail/index?storeId=${storeId}` })
  }

  const handleSearch = () => {
    // 实际项目中应该调用搜索接口
    Taro.showToast({ title: '搜索功能开发中', icon: 'none' })
  }

  const handleSort = (type: 'distance' | 'rating') => {
    setSortBy(type)
  }

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部搜索和切换 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex items-center gap-2 mb-3">
          <View className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
            <Input
              placeholder="搜索附近门店..."
              value={searchKeyword}
              onInput={(e) => setSearchKeyword(e.detail.value)}
              onConfirm={handleSearch}
              className="bg-transparent text-sm"
            />
          </View>
          <Button size="sm" onClick={handleSearch}>
            搜索
          </Button>
        </View>
        
        <View className="flex items-center gap-2">
          <Button
            size="sm"
            variant={sortBy === 'distance' ? 'default' : 'outline'}
            onClick={() => handleSort('distance')}
            className="flex-1"
          >
            距离优先
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'rating' ? 'default' : 'outline'}
            onClick={() => handleSort('rating')}
            className="flex-1"
          >
            评分优先
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            列表
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
          >
            地图
          </Button>
        </View>
      </View>

      {/* 门店列表 */}
      {viewMode === 'list' ? (
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex items-center justify-center py-12">
              <Text className="text-sm text-gray-500">加载中...</Text>
            </View>
          ) : (
            stores.map((store) => (
              <Card
                key={store.id}
                className="bg-white shadow-sm mb-3"
                onClick={() => handleStoreDetail(store.id)}
              >
                <CardContent className="p-4">
                  <View className="flex items-start gap-3">
                    {/* 门店封面 */}
                    <View className="w-20 h-20 bg-gradient-to-br from-orange-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Text className="text-4xl">🏠</Text>
                    </View>
                    
                    <View className="flex-1 min-w-0">
                      {/* 门店名称和评分 */}
                      <View className="flex items-center justify-between mb-2">
                        <Text className="block text-base font-medium text-gray-800">
                          {store.name}
                        </Text>
                        <View className="flex items-center gap-1">
                          <Text className="text-sm text-orange-500">⭐</Text>
                          <Text className="text-sm font-medium text-gray-700">
                            {store.rating}
                          </Text>
                        </View>
                      </View>
                      
                      {/* 营业信息 */}
                      <View className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Text>{store.reviews_count}条评价</Text>
                        <Text>·</Text>
                        <Text>{formatDistance(store.distance)}</Text>
                        <Text>·</Text>
                        <Badge
                          variant={store.is_open ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {store.is_open ? '营业中' : '已打烊'}
                        </Badge>
                      </View>
                      
                      {/* 地址 */}
                      <Text className="block text-sm text-gray-500 mb-2">
                        📍 {store.address}
                      </Text>
                      
                      {/* 营业时间 */}
                      <View className="flex items-center justify-between">
                        <Text className="text-sm text-gray-500">
                          🕘 {store.opening_hours}
                        </Text>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          预约
                        </Button>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          )}

          {!loading && stores.length === 0 && (
            <View className="flex flex-col items-center justify-center py-12">
              <View className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Text className="text-3xl">🏠</Text>
              </View>
              <Text className="block text-sm text-gray-500">暂无门店</Text>
            </View>
          )}
        </View>
      ) : (
        /* 地图模式 */
        <View className="flex flex-col items-center justify-center py-32">
          <View className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Text className="text-3xl">🗺️</Text>
          </View>
          <Text className="block text-sm text-gray-500">
            地图功能开发中，敬请期待
          </Text>
        </View>
      )}
    </View>
  )
}
