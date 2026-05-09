import { View, Text, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

interface MyAdoptionPet {
  id: string
  name: string
  type: 'cat' | 'dog'
  breed: string
  age: string
  gender: '公' | '母'
  status: 'available' | 'reserved' | 'adopted'
  requirements: string[]
  description: string
  avatar: string
  color: string
  imageHeight: number
  vaccinated: boolean
  neutered: boolean
  location: string
  publishTime: string
  views: number
  applications: number
}

export default function MyAdoptionsPage() {
  const [pets, setPets] = useState<MyAdoptionPet[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'reserved' | 'adopted'>('all')

  useEffect(() => {
    loadMyAdoptions()
  }, [filterStatus])

  const loadMyAdoptions = async () => {
    setLoading(true)
    
    // 模拟数据 - 我发布的领养信息
    const mockMyPets: MyAdoptionPet[] = [
      {
        id: 'my-adopt-001',
        name: '小橘',
        type: 'cat',
        breed: '橘猫',
        age: '1岁',
        gender: '公',
        status: 'available',
        requirements: ['有养宠经验', '定期回访'],
        description: '性格温顺，已绝育驱虫，特别亲人，喜欢被抚摸',
        avatar: '🐱',
        color: 'bg-orange-100',
        imageHeight: 120,
        vaccinated: true,
        neutered: true,
        location: '北京市朝阳区',
        publishTime: '2天前',
        views: 156,
        applications: 5
      },
      {
        id: 'my-adopt-002',
        name: '雪球',
        type: 'cat',
        breed: '英短蓝白',
        age: '8个月',
        gender: '母',
        status: 'reserved',
        requirements: ['有养猫经验', '不离不弃'],
        description: '颜值超高，性格安静，适合公寓饲养',
        avatar: '🐱',
        color: 'bg-blue-100',
        imageHeight: 120,
        vaccinated: true,
        neutered: false,
        location: '北京市西城区',
        publishTime: '1天前',
        views: 89,
        applications: 3
      },
      {
        id: 'my-adopt-003',
        name: '旺财',
        type: 'dog',
        breed: '中华田园犬',
        age: '2岁',
        gender: '公',
        status: 'adopted',
        requirements: ['有院子', '定期疫苗'],
        description: '聪明听话，已打疫苗，看家护院好帮手',
        avatar: '🐕',
        color: 'bg-yellow-100',
        imageHeight: 120,
        vaccinated: true,
        neutered: false,
        location: '北京市海淀区',
        publishTime: '1周前',
        views: 234,
        applications: 8
      }
    ]

    // 筛选
    let filtered = mockMyPets
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }

    setPets(filtered)
    setLoading(false)
  }

  const handlePetClick = (petId: string) => {
    Taro.navigateTo({ url: `/pages/adoption-detail/index?id=${petId}` })
  }

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/adoption-publish/index' })
  }

  const handleEdit = (petId: string) => {
    Taro.navigateTo({ url: `/pages/adoption-publish/index?editId=${petId}` })
  }

  const handleDelete = async (petId: string) => {
    const result = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条领养信息吗？'
    })

    if (result.confirm) {
      // 模拟删除
      setPets(pets.filter(p => p.id !== petId))
      Taro.showToast({ title: '删除成功', icon: 'success' })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 text-white text-xs">可领养</Badge>
      case 'reserved':
        return <Badge className="bg-blue-500 text-white text-xs">已预约</Badge>
      case 'adopted':
        return <Badge className="bg-gray-400 text-white text-xs">已领养</Badge>
      default:
        return null
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <View 
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => Taro.navigateBack()}
        >
          <Text className="text-lg">←</Text>
        </View>
        <Text className="text-base font-medium text-gray-800">我发布的</Text>
        <View className="w-8 h-8" />
      </View>

      {/* 状态筛选 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex gap-2">
          {[
            { value: 'all', label: '全部' },
            { value: 'available', label: '可领养' },
            { value: 'reserved', label: '已预约' },
            { value: 'adopted', label: '已领养' }
          ].map(item => (
            <View
              key={item.value}
              className={`px-3 py-1 rounded-full text-xs ${
                filterStatus === item.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setFilterStatus(item.value as typeof filterStatus)}
            >
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 列表 */}
      <ScrollView scrollY style={{ height: 'calc(100vh - 110px)' }}>
        <View className="px-4 py-4">
          {loading ? (
            <View className="flex items-center justify-center py-20">
              <Text className="text-gray-400">加载中...</Text>
            </View>
          ) : pets.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-20">
              <Text className="text-4xl mb-3">📝</Text>
              <Text className="text-sm text-gray-500 mb-1">暂无发布的领养信息</Text>
              <Text className="text-xs text-gray-400 mb-4">快去发布一只可爱的宠物吧</Text>
              <Button 
                size="sm" 
                className="bg-orange-500"
                onClick={handlePublish}
              >
                <Text className="text-white text-sm">发布领养</Text>
              </Button>
            </View>
          ) : (
            <View className="space-y-3">
              {pets.map(pet => (
                <Card 
                  key={pet.id} 
                  className="bg-white shadow-sm"
                  onClick={() => handlePetClick(pet.id)}
                >
                  <CardContent className="p-4">
                    <View className="flex gap-3">
                      {/* 宠物头像 */}
                      <View 
                        className={`w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 ${pet.color}`}
                      >
                        <Text className="text-4xl">{pet.avatar}</Text>
                      </View>

                      {/* 宠物信息 */}
                      <View className="flex-1">
                        <View className="flex items-center justify-between mb-1">
                          <View className="flex items-center gap-2">
                            <Text className="text-base font-semibold text-gray-800">{pet.name}</Text>
                            {getStatusBadge(pet.status)}
                          </View>
                        </View>

                        <View className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <Text>{pet.breed}</Text>
                          <Text className="text-gray-300">·</Text>
                          <Text>{pet.gender}</Text>
                          <Text className="text-gray-300">·</Text>
                          <Text>{pet.age}</Text>
                        </View>

                        <View className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                          <View className="flex items-center gap-1">
                            <Text>👁️</Text>
                            <Text>{pet.views} 浏览</Text>
                          </View>
                          <View className="flex items-center gap-1">
                            <Text>💬</Text>
                            <Text>{pet.applications} 申请</Text>
                          </View>
                        </View>

                        <View className="flex items-center justify-between">
                          <Text className="text-xs text-gray-400">{pet.publishTime}</Text>
                          <View className="flex gap-2">
                            <View 
                              className="px-2 py-1 rounded bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation?.()
                                handleEdit(pet.id)
                              }}
                            >
                              <Text className="text-xs text-blue-500">编辑</Text>
                            </View>
                            <View 
                              className="px-2 py-1 rounded bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation?.()
                                handleDelete(pet.id)
                              }}
                            >
                              <Text className="text-xs text-red-500">删除</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* 标签 */}
                    <View className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                      {pet.vaccinated && (
                        <Badge className="bg-green-50 text-green-600 text-xs">已疫苗</Badge>
                      )}
                      {pet.neutered && (
                        <Badge className="bg-blue-50 text-blue-600 text-xs">已绝育</Badge>
                      )}
                      {pet.requirements.slice(0, 2).map((req, idx) => (
                        <Badge key={idx} className="bg-gray-50 text-gray-600 text-xs">{req}</Badge>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部发布按钮 */}
      <View 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <Button 
          className="w-full bg-orange-500 text-white flex items-center justify-center gap-2"
          onClick={handlePublish}
        >
          <Text className="text-lg">✏️</Text>
          <Text className="text-base">发布新领养</Text>
        </Button>
      </View>
    </View>
  )
}
