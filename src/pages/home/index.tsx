import { View, Text } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Taro from '@tarojs/taro'
import './index.css'

export default function HomePage() {
  const handleNavigateToDemand = () => {
    Taro.navigateTo({ url: '/pages/demand-detail/index?action=create' })
  }

  const handleNavigateToGrooming = () => {
    Taro.navigateTo({ url: '/pages/grooming/index' })
  }

  const handleAdoptionClick = (adoptionId: string) => {
    Taro.navigateTo({ url: `/pages/adoption-detail/index?id=${adoptionId}` })
  }

  const handleStoreClick = (storeId: string) => {
    Taro.navigateTo({ url: `/pages/store-detail/index?storeId=${storeId}` })
  }

  // 宠物领养数据
  const adoptionPets = [
    {
      id: 'adopt-001',
      name: '小橘',
      type: 'cat',
      breed: '橘猫',
      age: '1岁',
      gender: '公',
      status: 'available',
      requirements: ['有养宠经验', '定期回访', '室内饲养'],
      description: '性格温顺，已绝育驱虫，亲人粘人',
      avatar: '🐱',
      color: 'bg-orange-100'
    },
    {
      id: 'adopt-002',
      name: '旺财',
      type: 'dog',
      breed: '中华田园犬',
      age: '2岁',
      gender: '公',
      status: 'available',
      requirements: ['有院子或大空间', '定期疫苗'],
      description: '聪明听话，已打疫苗，看家护院好帮手',
      avatar: '🐕',
      color: 'bg-yellow-100'
    },
    {
      id: 'adopt-003',
      name: '雪球',
      type: 'cat',
      breed: '英短蓝白',
      age: '8个月',
      gender: '母',
      status: 'reserved',
      requirements: ['有养猫经验', '不离不弃'],
      description: '颜值超高，性格安静，适合公寓饲养',
      avatar: '🐱',
      color: 'bg-blue-100'
    },
    {
      id: 'adopt-004',
      name: '豆豆',
      type: 'dog',
      breed: '泰迪',
      age: '3岁',
      gender: '公',
      status: 'available',
      requirements: ['有耐心', '每天遛狗', '定期美容'],
      description: '活泼可爱，已绝育，适合有孩子的家庭',
      avatar: '🐕',
      color: 'bg-pink-100'
    },
    {
      id: 'adopt-005',
      name: '花花',
      type: 'cat',
      breed: '三花猫',
      age: '1.5岁',
      gender: '母',
      status: 'available',
      requirements: ['室内饲养', '定期驱虫'],
      description: '独立自主，不挑食，适合上班族',
      avatar: '🐱',
      color: 'bg-purple-100'
    }
  ]

  // 推荐门店数据
  const recommendStores = [
    {
      id: 'store-001',
      name: '萌宠洗护中心',
      rating: 4.9,
      distance: '1.2km',
      status: '营业中',
      price: '¥88起',
      avatar: '🏠'
    }
  ]

  // 获取领养状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-600">可领养</Badge>
      case 'reserved':
        return <Badge className="bg-blue-100 text-blue-600">已预约</Badge>
      case 'adopted':
        return <Badge className="bg-gray-100 text-gray-500">已领养</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-500">未知</Badge>
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 px-4 py-4">
      {/* 头部欢迎区域 */}
      <View className="mb-6">
        <Text className="block text-2xl font-bold text-gray-800 mb-2">
          欢迎来到宠觅
        </Text>
        <Text className="block text-sm text-gray-500">
          专业的宠物交易与服务一站式平台
        </Text>
      </View>

      {/* 快捷功能入口 */}
      <View className="grid grid-cols-2 gap-3 mb-6">
        <Card className="bg-white shadow-sm" onClick={handleNavigateToDemand}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <View className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Text className="text-2xl">🐾</Text>
            </View>
            <Text className="block text-base font-medium text-gray-800">
              发布需求
            </Text>
            <Text className="block text-xs text-gray-500 mt-1">
              找到心仪的宠物
            </Text>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm" onClick={handleNavigateToGrooming}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <View className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-2">
              <Text className="text-2xl">✨</Text>
            </View>
            <Text className="block text-base font-medium text-gray-800">
              洗护预约
            </Text>
            <Text className="block text-xs text-gray-500 mt-1">
              专业洗护服务
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* 宠物领养大厅 */}
      <View className="mb-6">
        <View className="flex items-center justify-between mb-3">
          <Text className="block text-lg font-semibold text-gray-800">
            🏠 宠物领养大厅
          </Text>
          <Text 
            className="block text-sm text-orange-500"
            onClick={() => Taro.navigateTo({ url: '/pages/adoption-list/index' })}
          >
            查看更多
          </Text>
        </View>

        {adoptionPets.map((pet) => (
          <Card key={pet.id} className="bg-white shadow-sm mb-3" onClick={() => handleAdoptionClick(pet.id)}>
            <CardContent className="p-4">
              <View className="flex items-start gap-3">
                <View className={`w-16 h-16 ${pet.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Text className="text-3xl">{pet.avatar}</Text>
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex items-center justify-between mb-1">
                    <View className="flex items-center gap-2">
                      <Text className="block text-base font-medium text-gray-800">
                        {pet.name}
                      </Text>
                      <Text className="text-xs text-gray-500">{pet.breed}</Text>
                    </View>
                    {getStatusBadge(pet.status)}
                  </View>
                  <View className="flex items-center gap-3 mb-2">
                    <Text className="text-sm text-gray-600">
                      {pet.type === 'cat' ? '猫咪' : '狗狗'} · {pet.gender === '公' ? '♂' : '♀'} · {pet.age}
                    </Text>
                  </View>
                  <Text className="block text-sm text-gray-500 mb-2 line-clamp-1">
                    {pet.description}
                  </Text>
                  <View className="flex flex-wrap gap-1">
                    {pet.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* 推荐门店 */}
      <View>
        <View className="flex items-center justify-between mb-3">
          <Text className="block text-lg font-semibold text-gray-800">
            推荐门店
          </Text>
          <Text 
            className="block text-sm text-orange-500"
            onClick={handleNavigateToGrooming}
          >
            查看更多
          </Text>
        </View>

        {recommendStores.map((store) => (
          <Card key={store.id} className="bg-white shadow-sm" onClick={() => handleStoreClick(store.id)}>
            <CardContent className="p-4">
              <View className="flex items-start gap-3">
                <View className="w-16 h-16 bg-gradient-to-br from-orange-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Text className="text-3xl">{store.avatar}</Text>
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex items-center gap-2 mb-1">
                    <Text className="block text-base font-medium text-gray-800">
                      {store.name}
                    </Text>
                    <View className="flex items-center gap-1">
                      <Text className="text-sm text-orange-500">⭐</Text>
                      <Text className="text-sm text-gray-600">{store.rating}</Text>
                    </View>
                  </View>
                  <Text className="block text-sm text-gray-500 mb-1">
                    距离{store.distance} · {store.status}
                  </Text>
                  <Text className="block text-xs text-gray-400">
                    精洗套餐 {store.price}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  )
}
